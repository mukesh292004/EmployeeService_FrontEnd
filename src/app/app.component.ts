import { Component } from '@angular/core';
import { Router, RouterLink, RouterOutlet } from '@angular/router';
import { LoginComponent } from './login/login.component';
import { RegistrationComponent } from './registration/registration.component';
import { LandingPageComponent } from './landing-page/landing-page.component';

@Component({
  selector: 'app-root',
  imports: [RouterOutlet,RouterLink, LoginComponent,RegistrationComponent,LandingPageComponent],
  templateUrl: './app.component.html',
  styleUrl: './app.component.css'
})
export class AppComponent {
  title(title: any) {
    throw new Error('Method not implemented.');
  }
  orgname:String = "cognizant" 
  countryName:String = "India";
  loginstatus:boolean = false;

   constructor(private router:Router) {}
  logout(){
    alert("Logout Successfully");
    this.loginstatus = true;
    this.router.navigate(['/login']);
  }
  login(){
    
    this.loginstatus = false;

  }

}
   