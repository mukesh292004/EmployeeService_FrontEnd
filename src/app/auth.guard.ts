import { Injectable } from '@angular/core';
import { CanActivate, ActivatedRouteSnapshot, RouterStateSnapshot, Router } from '@angular/router';

@Injectable({
  providedIn: 'root'
})
export class AuthGuard implements CanActivate {
  constructor(private router: Router) {}

  canActivate(route: ActivatedRouteSnapshot, state: RouterStateSnapshot): boolean {
    const authToken = sessionStorage.getItem('authToken');
    const userRole = sessionStorage.getItem('userRole'); // Fetch the user's role from sessionStorage

    if (!authToken) {
      // If the user is not logged in, redirect to the login page
      this.router.navigate(['/login']);
      return false;
    }

    // Check if the route has role restrictions
    const allowedRoles = route.data['roles'];
    if (allowedRoles && !allowedRoles.includes(userRole)) {
      // If the user's role is not allowed, redirect to the root dashboard
      this.router.navigate(['/']);
      return false;
    }

    return true; // Allow access if no restrictions or role matches
  }
}
