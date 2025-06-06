import { Routes } from '@angular/router';
import { LoginComponent } from './login/login.component';
import { RegistrationComponent } from './registration/registration.component';
import { EmployeesComponent } from './employees/employees.component';
import { LandingPageComponent } from './landing-page/landing-page.component'; 
import { EmployeeAttendanceComponent } from './employee-attendance/employee-attendance.component';
import { ManagerLeaveComponentComponent } from './manager-leave/manager-leave.component';
import { EmployeeLeaveComponentComponent } from './employee-leave/employee-leave.component';
import { EmployeeShiftComponent } from './shift/shift.component';
import { ManagerShiftComponent } from './shiftmanagement/shiftmanagement.component';
import { ManagerlandingpageComponent } from './managerlandingpage/managerlandingpage.component';
import { AuthGuard } from './auth.guard';
import { AttendancemanagementComponent } from './attendancemanagement/attendancemanagement.component';

export const routes: Routes = [
    { path: "", canActivate: [AuthGuard], component: LandingPageComponent }, // Default path with AuthGuard
    { path: "login", component: LoginComponent },
    { path: "register", component: RegistrationComponent },
    { path: "employees", canActivate: [AuthGuard], component: EmployeesComponent }, 
    { path: "attendance", canActivate: [AuthGuard], component: EmployeeAttendanceComponent },
    { path: "leave", canActivate: [AuthGuard], component: EmployeeLeaveComponentComponent },
    { path: "leavemanagement", canActivate: [AuthGuard], component: ManagerLeaveComponentComponent, data: { roles: ['Manager'] } },
    { path: "shift", canActivate: [AuthGuard], component: EmployeeShiftComponent, data: { roles: ['Employee'] } },
    { path: "shiftmanagement", canActivate: [AuthGuard], component: ManagerShiftComponent, data: { roles: ['Manager'] } },
    { path: "dashboard", canActivate: [AuthGuard], component: ManagerlandingpageComponent, data: { roles: ['Manager'] } },
    //AttendancemanagementComponent
    {path : "attendancemanagement", canActivate: [AuthGuard], component: AttendancemanagementComponent, data: { roles: ['Manager'] } },
];