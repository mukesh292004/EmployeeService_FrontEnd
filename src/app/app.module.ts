import { NgModule } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';
import { FormsModule } from '@angular/forms';
import { RouterModule } from '@angular/router'; // Import RouterModule
import { AppRoutingModule } from './app-routing.module';
import { AppComponent } from './app.component';
import { LoginComponent } from './login/login.component';

@NgModule({
  declarations: [
    AppComponent,
    LoginComponent // Ensure LoginComponent is declared here
  ],
  imports: [
    BrowserModule,
    FormsModule,
    RouterModule, // Add RouterModule here
    AppRoutingModule // Ensure AppRoutingModule is added here
  ],
  providers: [],
  bootstrap: [AppComponent]
})
export class AppModule { }