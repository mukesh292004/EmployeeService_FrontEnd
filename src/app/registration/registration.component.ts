import { CommonModule } from '@angular/common';
import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { Router } from '@angular/router';
import { UserService } from '../userservice.service'; // Adjust the path as necessary


@Component({
  selector: 'registration',
  standalone: true,
  imports: [ReactiveFormsModule, CommonModule],
  templateUrl: './registration.component.html',
  styleUrls: ['./registration.component.css']
})
export class RegistrationComponent implements OnInit {
  registrationForm: FormGroup;

  constructor(private fb: FormBuilder, private router: Router,private userService: UserService) {}

  ngOnInit(): void {
    this.registrationForm = this.fb.group({
      employeeId: [null, [Validators.required, Validators.min(1)]],
      name: ['', [Validators.required, Validators.minLength(3)]],
      email: ['', [Validators.required, Validators.email]],
      password: ['', [Validators.required, Validators.minLength(6)]],
      role: ['', Validators.required]
    });
  }

  onSubmit(): void {
    if (this.registrationForm.valid) {
      const formData = {
        employeeId: this.registrationForm.value.employeeId,
        name: this.registrationForm.value.name,
        email: this.registrationForm.value.email,
        password: this.registrationForm.value.password,
        role: this.registrationForm.value.role
      };
  
      // Call the UserService to send the registration data
      this.userService.registerUser(formData).subscribe({
        next: (response) => {
          console.log('Registration successful!', response);
          alert('Registration successful!');
          // Navigate to login or another page
          this.router.navigate(['/login']);
        },
        error: (error) => {
          console.error('Registration failed!', error);
          alert('Registration failed! Please try again.');
        }
      });
    } else {
      this.registrationForm.markAllAsTouched();
    }
  }

  onReset(): void {
    this.registrationForm.reset();
  }
}
