import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { catchError, map, Observable, throwError } from 'rxjs';
@Injectable({
  providedIn: 'root'
})
export class UserService{

  constructor(private httpClient: HttpClient) { }
  path= "http://localhost:9090/auth/new";

  public registerUser(user: user): Observable<user> {
    console.log("UserService: Registering user", user);
    return this.httpClient.post<user>(this.path, user);
  }
  public loginUser(login: login): Observable<any> {
    console.log("UserService: Logging in user", login);
    return this.httpClient.post("http://localhost:9090/auth/authenticate", login, {
      responseType: 'text' 
    }).pipe(
      map(response => {
        console.log("Login successful", response);
        sessionStorage.setItem('authToken', response);
        return { token: response }; 
      }),
      catchError(error => {
        console.error("Login failed", error);
        return throwError(() => new Error('Login failed'));
      })
    );
  }

}
export class login{
  username: string;
  password: string;
}
export class user{
  employeeId: number;
  name: string;
  email: string;
  password: string;
  role: string;
}
