import { Component } from '@angular/core';
import { FormsModule, NgForm } from '@angular/forms';
import { Router } from '@angular/router';
import { UserService,login} from '../userservice.service'; // Adjust path as needed

@Component({
  selector: 'login',
  imports: [FormsModule],
  templateUrl: './login.component.html',
  styleUrl: './login.component.css'
})
export class LoginComponent {
  username: string = '';
  password: string = '';
  rememberMe: boolean = false;
  loginFailed: boolean = false;

  constructor(private router: Router, private userService: UserService) {}

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
        }

        this.router.navigate(['/employees']);
      },
      error: (error) => {
        console.error("Login failed", error);
        this.loginFailed = true;
      }
    });
  }
}
