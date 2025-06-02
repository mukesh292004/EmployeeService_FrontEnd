import { Component } from '@angular/core';
import { NgForm } from '@angular/forms';
import { Router } from '@angular/router';
import { UserService, login } from './userservice.service';

@Component({
  selector: 'app-login',
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.css']
})
export class LoginComponent {
  loginFailed = false;
  rememberMe = false;

  constructor(private userService: UserService, private router: Router) {}

  validate(form: NgForm) {
    const loginData: login = {
      username: form.value.username,
      password: form.value.password
    };

    this.userService.loginUser(loginData).subscribe({
      next: (response) => {
        console.log("Login successful!", response);
        this.loginFailed = false;

        // Optionally store token or user info
        if (this.rememberMe) {
          localStorage.setItem('token', response.token);
          localStorage.setItem('userRole', response.roles);
          localStorage.setItem('userId', response.empid);
        }

        this.router.navigate(['/attendance']); // Navigate to the attendance page
      },
      error: (error) => {
        console.error("Login failed", error);
        this.loginFailed = true;
      }
    });
  }
}