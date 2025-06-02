import { Component } from '@angular/core';
import { Router, RouterLink, RouterOutlet } from '@angular/router';

@Component({
  selector: 'app-root',
  standalone: true,
  imports: [RouterOutlet, RouterLink],
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.css']
})
export class AppComponent {
  orgname: String = "Cognizant";
  countryName: String = "India";
  loginstatus: boolean = false;

  constructor(private router: Router) {}

  logout() {
    alert("Logout Successfully");
    this.loginstatus = false; // Set login status to false
    sessionStorage.clear(); // Clear session storage
    this.router.navigate(['/login']); // Navigate to login page
  }
}
