import { Component } from '@angular/core';
import { Router } from '@angular/router';
import { FormsModule } from '@angular/forms';
import { CommonModule } from '@angular/common';
import { UserService} from '../userservice.service';

// Import UserService
// ngmodule imports
import { NgModule } from '@angular/core';

@Component({
  selector: 'app-login',
  imports: [
    CommonModule,
    FormsModule
  ],
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.css'],
})
export class LoginComponent {
  loginFailed: boolean = false;
  username: string = '';
  password: string = '';
  rememberMe: boolean = false;

  constructor(private router: Router, private userService: UserService) {} // Inject UserService

  validate(form: any): void {
    console.log('Form Valid:', form.valid);
    console.log('Username:', this.username);
    console.log('Password:', this.password);
    console.log('Remember Me:', this.rememberMe);

    if (form.valid) {
      this.login(this.username, this.password);
    } else {
      this.loginFailed = true;
      console.log('Form is invalid');
    }
  }

  login(username: string, password: string): void {
    console.log('Attempting login with:', username, password);

    this.userService.loginUser({ username, password }).subscribe(
      (response) => {
        console.log('Login response:', response);

        // Fetch the role from sessionStorage
        const userRole = sessionStorage.getItem('userRole');
        console.log('Fetched role from sessionStorage:', userRole);

        // Navigate based on the role
        if (userRole === 'Manager') {
          console.log('Navigating to Manager dashboard');
          this.router.navigate(['/dashboard']);
        } else if (userRole === 'Employee') {
          console.log('Navigating to Employee home');
          this.router.navigate(['/']);
        } else {
          console.error('Invalid role, redirecting to login');
          this.router.navigate(['/login']);
        }

        this.loginFailed = false;
      },
      (error) => {
        console.error('Login error:', error);
        this.loginFailed = true;
      }
    );
  }
}
