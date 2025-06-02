import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { EmployeesComponent } from './employees/employees.component';
import { LoginComponent } from './login/login.component';
import { RoleGuard } from './auth/role.guard';
import { LandingComponent } from './landing/landing.component';
import { NotAuthorizedComponent } from './auth/not-authorized.component'; 
import { EmployeeAttendanceComponent } from './employee-attendance/employee-attendance.component';
// import { ShiftManagementComponent } from './shift-management/shift-management.component';
// import { LeaveRequestsComponent } from './leave-requests/leave-requests.component';

const routes: Routes = [
  { path: 'login', component: LoginComponent },
  { 
    path: 'employees', 
    component: EmployeesComponent, 
    canActivate: [RoleGuard], 
    data: { roles: ['Manager'] } 
  },
  { path: 'landing', component: LandingComponent }, 
  { path: 'attendance', component: EmployeeAttendanceComponent }, // Add route for attendance
//   { path: 'shift-management', component: ShiftManagementComponent }, // Add route for shift management
//   { path: 'leave-requests', component: LeaveRequestsComponent }, // Add route for leave requests
  { path: 'not-authorized', component: NotAuthorizedComponent },
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule]
})
export class AppRoutingModule {}
