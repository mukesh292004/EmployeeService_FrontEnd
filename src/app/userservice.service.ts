import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { jwtDecode } from 'jwt-decode';
import { catchError, map, Observable, throwError } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class UserService {

  constructor(private httpClient: HttpClient) { }
  path = "http://localhost:9090/auth/new";

  public registerUser(user: user): Observable<string> {
    console.log("UserService: Registering user", user);
    return this.httpClient.post(this.path, user, { responseType: 'text' }).pipe(
      map(response => {
        console.log("Registration response:", response);
        return response; // Return the plain text response
      }),
      catchError(error => {
        console.error("Failed to register user:", error);
        return throwError(() => new Error(error.error.text || 'Failed to register user'));
      })
    );
  }

  public loginUser(login: login): Observable<any> {
    console.log("UserService: Logging in user", login);
    return this.httpClient.post("http://localhost:9090/auth/authenticate", login, {
      responseType: 'text'
    }).pipe(
      map(response => {
        console.log("Login successful", response);
        sessionStorage.setItem('authToken', response);

        // Decode the JWT token to extract user role and user ID
        const decodedToken: any = jwtDecode(response);
        console.log("Decoded Token:", decodedToken);

        sessionStorage.setItem('userRole', decodedToken.roles);
        sessionStorage.setItem('userId', decodedToken.empid);
        sessionStorage.setItem('userName', decodedToken.sub);

        return { token: response, role: decodedToken.roles, id: decodedToken.empid };
      }),
      catchError(error => {
        console.error("Login failed", error);
        return throwError(() => new Error('Login failed'));
      })
    );
  }

  public getEmployees(): Observable<Employee[]> {
    console.log("UserService: Fetching employees");
    return this.httpClient.get<Employee[]>("http://localhost:9090/employees").pipe(
      map(response => {
        console.log("Employees fetched successfully", response);
        return response;
      }),
      catchError(error => {
        console.error("Failed to fetch employees", error);
        return throwError(() => new Error('Failed to fetch employees'));
      })
    );
  }

  public updateEmployee(id: number, employee: UpdateEmployeePayload): Observable<UpdateEmployeePayload> {
    console.log(`UserService: Updating employee with ID ${id}`, employee);
    return this.httpClient.put<UpdateEmployeePayload>(`http://localhost:9090/employees/${id}`, employee).pipe(
      map(response => {
        console.log("Employee updated successfully", response);
        return response;
      }),
      catchError(error => {
        console.error("Failed to update employee", error);
        return throwError(() => new Error('Failed to update employee'));
      })
    );
  }

  public deleteEmployee(id: number): Observable<string> {
    console.log(`UserService: Deleting employee with ID ${id}`);
    return this.httpClient.delete<string>(`http://localhost:9090/employees/${id}`, { responseType: 'text' as 'json' }).pipe(
      map(response => {
        console.log("Employee deleted successfully", response);
        return response; // Return the response text
      }),
      catchError(error => {
        console.error("Failed to delete employee", error);
        return throwError(() => new Error('Failed to delete employee'));
      })
    );
  }

  public saveEmployee(employee: UpdateEmployeePayload): Observable<UpdateEmployeePayload> {
    console.log("UserService: Saving new employee", employee);
    return this.httpClient.post<UpdateEmployeePayload>("http://localhost:9090/employees", employee).pipe(
      map(response => {
        console.log("New employee saved successfully", response);
        return response;
      }),
      catchError(error => {
        console.error("Failed to save new employee", error);
        return throwError(() => new Error('Failed to save new employee'));
      })
    );
  }

  public clockIn(employeeId: number): Observable<any> {
    console.log(`UserService: Clock in for employee ${employeeId}`);
    return this.httpClient.post<any>(`http://localhost:9090/attendance/clockin/${employeeId}`, {}).pipe(
      map(response => {
        console.log("Clock-in successful", response);
        return response;
      }),
      catchError(error => {
        console.error("Clock-in failed", error);
        return throwError(() => new Error('Clock-in failed'));
      })
    );
  }

  public clockOut(employeeId: number): Observable<any> {
    console.log(`UserService: Clock out for employee ${employeeId}`);
    return this.httpClient.post<any>(`http://localhost:9090/attendance/clockout/${employeeId}`, {}).pipe(
      map(response => {
        console.log("Clock-out successful", response);
        return response;
      }),
      catchError(error => {
        console.error("Clock-out failed", error);
        return throwError(() => new Error('Clock-out failed'));
      })
    );
  }

  public getAttendanceHistory(employeeId: number): Observable<any[]> {
    console.log(`UserService: Fetching attendance history for employee with ID ${employeeId}`);
    return this.httpClient.get<any[]>(`http://localhost:9090/attendance/history/${employeeId}`).pipe(
      map(response => {
        console.log("Attendance history fetched successfully", response);
        return response;
      }),
      catchError(error => {
        console.error("Failed to fetch attendance history", error);
        return throwError(() => new Error('Failed to fetch attendance history'));
      })
    );
  }

  public getMonthlyReport(employeeId: number, month: number): Observable<any> {
    console.log(`UserService: Fetching monthly report for employee with ID ${employeeId} for month ${month}`);
    return this.httpClient.get<any>(`http://localhost:9090/attendance/getmonthlyreport/${employeeId}/${month}`).pipe(
      map(response => {
        console.log("Monthly report fetched successfully", response);
        return response;
      }),
      catchError(error => {
        console.error("Failed to fetch monthly report", error);
        return throwError(() => new Error('Failed to fetch monthly report'));
      })
    );
  }
// LEAVE SERVICES::::
//http://localhost:9090/leave/apply  post 
// it requires {
//     "employeeId": 3,
//     "leaveType": "casual",
//     "startDate": "2025-05-27",
//     "endDate": "2025-05-20",
//     "status": "Pending"
// } to send to backend take id from the session storage
public applyLeave(leave: any): Observable<any> {
  console.log("UserService: Applying leave", leave);
  return this.httpClient.post("http://localhost:9090/leave/apply", leave, { responseType: 'text' }).pipe(
    map(response => {
      console.log("Leave applied successfully", response);
      return response;
    }),
    catchError(error => {
      console.error("Failed to apply leave", error);
      return throwError(() => new Error('Failed to apply leave'));
    })
  );
}


  //http://localhost:9090/leave/apply 
  // payload to send is {{
  //   "employeeId": 3,
  //   "leaveType": "casual",
  //   "startDate": "2025-05-27",
  //   "endDate": "2025-05-20",
  //   "status": "Pending"
  // // }}
  
  
// http://localhost:9090/leave/resetAll
 public resetAllLeaves(): Observable<string> {
  console.log("UserService: Resetting all leaves");
  return this.httpClient.post<string>("http://localhost:9090/leave/resetAll", {}).pipe(
    map(response => {
      console.log("All leaves reset successfully", response);
      return response;
    }),
    catchError(error => {
      console.error("Failed to reset all leaves", error);
      return throwError(() => new Error('Failed to reset all leaves'));
    })
  );}
  //http://localhost:9090/leave/delete/3
  public deleteLeave(leaveId: number): Observable<string> {
    console.log(`UserService: Deleting leave with ID ${leaveId}`);
    return this.httpClient.delete<string>(`http://localhost:9090/leave/delete/${leaveId}`, { responseType: 'text' as 'json' }).pipe(
      map(response => {
        console.log("Leave deleted successfully", response);
        return response; // Return the response text
      }),
      catchError(error => {
        console.error("Failed to delete leave", error);
        return throwError(() => new Error('Failed to delete leave'));
      })
    );}


    // http://localhost:9090/leave/approve/3
  public approveLeave(leaveId: number): Observable<string> {
    console.log(`UserService: Approving leave with ID ${leaveId}`);
    return this.httpClient.post<string>(`http://localhost:9090/leave/approve/${leaveId}`, {}, { responseType: 'text' as 'json' }).pipe(
      map(response => {
        console.log("Leave approved successfully", response);
        return response; // Return the response text
      }),
      catchError(error => {
        console.error("Failed to approve leave", error);
        return throwError(() => new Error('Failed to approve leave'));
      })
    );
  };

    // http://localhost:9090/leave/reject/2
  public rejectLeave(leaveId: number): Observable<string> {
    console.log(`UserService: Rejecting leave with ID ${leaveId}`);
    return this.httpClient.post<string>(`http://localhost:9090/leave/reject/${leaveId}`, {}, { responseType: 'text' as 'json' }).pipe(
      map(response => {
        console.log("Leave rejected successfully", response);
        return response; // Return the response text
      }),
      catchError(error => {
        console.error("Failed to reject leave", error);
        return throwError(() => new Error('Failed to reject leave'));
      })
    );
  };
  //http://localhost:9090/leave/history/Pending
  public getLeaveHistory(status: string): Observable<any[]> {
    console.log(`UserService: Fetching leave history with status ${status}`);
    return this.httpClient.get<any[]>(`http://localhost:9090/leave/history/${status}`).pipe(
      map(response => {
        console.log("Leave history fetched successfully", response);
        return response;
      }),
      catchError(error => {
        console.error("Failed to fetch leave history", error);
        return throwError(() => new Error('Failed to fetch leave history'));
      })
    );
  }
  

  public fetchLeaveBalance(employeeId: number): Observable<any[]> {
    console.log(`UserService: Fetching leave balance for employee with ID ${employeeId}`);
    return this.httpClient.get<any[]>(`http://localhost:9090/leave/balance/${employeeId}`).pipe(
      map(response => {
        console.log("Leave balance fetched successfully", response);
        return response;
      }),
      catchError(error => {
        console.error("Failed to fetch leave balance", error);
        return throwError(() => new Error('Failed to fetch leave balance'));
      })
    );
  }

  public getLeaveHistoryByEmployeeId(employeeId: number): Observable<any[]> {
    console.log(`UserService: Fetching leave history for employee with ID ${employeeId}`);
    return this.httpClient.get<any[]>(`http://localhost:9090/leave/leaveRequests/${employeeId}`).pipe(
      map(response => {
        console.log("Leave history fetched successfully", response);
        return response;
      }),
      catchError(error => {
        console.error("Failed to fetch leave history", error);
        return throwError(() => new Error('Failed to fetch leave history'));
      })
    );
  }

  // http://localhost:9090/leave/history
  public getAllLeaves(): Observable<any[]> {
    console.log("UserService: Fetching all leaves");
    return this.httpClient.get<any[]>("http://localhost:9090/leave/history").pipe(
      map(response => {
        console.log("All leaves fetched successfully", response);
        return response;
      }),
      catchError(error => {
        console.error("Failed to fetch all leaves", error);
        return throwError(() => new Error('Failed to fetch all leaves'));
      })
    );
  }

  
  // Approve a shift swap between two employees
  public approveSwap(requestId1: number, requestId2: number): Observable<string> {
    return this.httpClient.post(`http://localhost:9090/shifts/approveSwap/${requestId1}/${requestId2}`, {}, { responseType: 'text' }).pipe(
      map(response => {
        console.log('Swap approved successfully:', response);
        return response; // Return the plain text response
      }),
      catchError(error => {
        console.error('Failed to approve swap:', error);
        return throwError(() => new Error(error.error.text || 'Failed to approve swap'));
      })
    );
  }

  // Reject a shift swap request
  public rejectSwap(shiftId: number): Observable<string> {
    return this.httpClient.post<string>(`http://localhost:9090/shifts/rejectSwap/${shiftId}`, {}).pipe(
      map(response => {
        console.log('Swap rejected successfully', response);
        return response;
      }),
      catchError(error => {
        console.error('Failed to reject swap', error);
        return throwError(() => new Error('Failed to reject swap'));
      })
    );
  }

  // Save a new shift
  public saveShift(shift: any): Observable<string> {
    return this.httpClient.post(`http://localhost:9090/shifts/save`, shift, { responseType: 'text' }).pipe(
      map(response => {
        console.log('Shift saved successfully:', response);
        return response;
      }),
      catchError(error => {
        console.error('Failed to save shift:', error);
        return throwError(() => new Error('Failed to save shift'));
      })
    );
  }

  // Delete a shift by ID
  public deleteShift(shiftId: number): Observable<string> {
    return this.httpClient.delete<string>(`http://localhost:9090/shifts/delete/${shiftId}`).pipe(
      map(response => {
        console.log('Shift deleted successfully', response);
        return response;
      }),
      catchError(error => {
        console.error('Failed to delete shift', error);
        return throwError(() => new Error('Failed to delete shift'));
      })
    );
  }

  // Fetch all shifts
  public findAllShifts(): Observable<any[]> {
    return this.httpClient.get<any[]>(`http://localhost:9090/shifts/findall`).pipe(
      map(response => {
        console.log('All shifts fetched successfully', response);
        return response;
      }),
      catchError(error => {
        console.error('Failed to fetch all shifts', error);
        return throwError(() => new Error('Failed to fetch all shifts'));
      })
    );
  }

  // Fetch a shift by ID
  public findShiftById(shiftId: number): Observable<any> {
    return this.httpClient.get<any>(`http://localhost:9090/shifts/findById/${shiftId}`).pipe(
      map(response => {
        console.log('Shift fetched successfully', response);
        return response;
      }),
      catchError(error => {
        console.error('Failed to fetch shift', error);
        return throwError(() => new Error('Failed to fetch shift'));
      })
    );
  }

  // Request a shift swap
  public requestSwap(shiftId: number): Observable<string> {
    return this.httpClient.post(`http://localhost:9090/shifts/requestSwap/${shiftId}`, {}, { responseType: 'text' }).pipe(
      map(response => {
        console.log('Swap request submitted successfully:', response);
        return response; // Return the plain text response
      }),
      catchError(error => {
        console.error('Failed to request swap:', error);
        return throwError(() => new Error('Failed to request swap'));
      })
    );
  }

  // Fetch shifts by date
  public getShiftsByDate(date: string): Observable<any[]> {
    return this.httpClient.get<any[]>(`http://localhost:9090/shifts/byDate/${date}`).pipe(
      map(response => {
        console.log('Shifts fetched successfully', response);
        return response;
      }),
      catchError(error => {
        console.error('Failed to fetch shifts by date', error);
        return throwError(() => new Error('Failed to fetch shifts by date'));
      })
    );
  }
}

export class UpdateEmployeePayload {
  name: string;
  email: string;
  role: string;
  department: string;
  contact: string;
}

export class Employee {
  id: number;
  name: string;
  email: string;
  role: string;
  department: string;
  contact: string;
}

export class login {
  username: string;
  password: string;
}

export class user {
  employeeId: number;
  name: string;
  email: string;
  password: string;
  role: string;
}