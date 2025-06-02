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

  public registerUser(user: user) {
    console.log("UserService: Registering user", user);
    return this.httpClient.post(this.path, user);
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
        sessionStorage.setItem('userRole', decodedToken.roles);
        sessionStorage.setItem('userId', decodedToken.empid);

        return { token: response, role: decodedToken.role, id: decodedToken.id };
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
    console.log(`UserService: Clocking in employee with ID ${employeeId}`);
    return this.httpClient.post<any>(`http://localhost:9090/attendance/clockin/${employeeId}`, {}).pipe(
      map(response => {
        console.log("Clock-in successful", response);
        return response;
      }),
      catchError(error => {
        console.error("Failed to clock in", error);
        return throwError(() => new Error('Failed to clock in'));
      })
    );
  }

  public clockOut(employeeId: number): Observable<any> {
    console.log(`UserService: Clocking out employee with ID ${employeeId}`);
    return this.httpClient.post<any>(`http://localhost:9090/attendance/clockout/${employeeId}`, {}).pipe(
      map(response => {
        console.log("Clock-out successful", response);
        return response;
      }),
      catchError(error => {
        console.error("Failed to clock out", error);
        return throwError(() => new Error('Failed to clock out'));
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