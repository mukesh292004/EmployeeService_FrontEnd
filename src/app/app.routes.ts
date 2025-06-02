import { Routes } from '@angular/router';
import { LoginComponent } from './login/login.component';
import { RegistrationComponent } from './registration/registration.component';
import { EmployeesComponent } from './employees/employees.component';
import { LandingPageComponent } from './landing-page/landing-page.component'; 
import { EmployeeAttendanceComponent } from './employee-attendance/employee-attendance.component';

export const routes: Routes = [
    {path:"",component:LandingPageComponent},
    {path:"login",component:LoginComponent},
    {path:"register",component:RegistrationComponent},
    {path:"employees",component:EmployeesComponent}, 
    {path:"attendance",component:EmployeeAttendanceComponent},

];
