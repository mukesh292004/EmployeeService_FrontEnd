import { Component, OnInit } from '@angular/core';
import { Router, NavigationEnd } from '@angular/router';
import { CommonModule } from '@angular/common';
import { RouterModule } from '@angular/router';

@Component({
  selector: 'app-root',
  standalone: true,
  imports: [CommonModule, RouterModule],
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.css']
})
export class AppComponent implements OnInit {
  isLoggedIn: boolean = false;
  userName: string = '';

  constructor(private router: Router) {}

  ngOnInit(): void {
    // Update login status on initialization
    this.updateLoginStatus();

    // Listen for route changes to dynamically update the navbar
    this.router.events.subscribe((event) => {
      if (event instanceof NavigationEnd) {
        this.updateLoginStatus();
      }
    });
  }

  updateLoginStatus(): void {
    const authToken = sessionStorage.getItem('authToken');
    this.isLoggedIn = !!authToken;

    // Fetch the user's name from sessionStorage
    this.userName = sessionStorage.getItem('userName') || 'User';
  }

  logout(): void {
    // Clear session storage and navigate to login page
    sessionStorage.clear();
    this.isLoggedIn = false;
    this.userName = '';
    this.router.navigate(['/login']);
  }
}
