import { Injectable } from '@angular/core';
import { CanActivate, Router } from '@angular/router';

@Injectable({
  providedIn: 'root'
})
export class RoleGuard implements CanActivate {
  constructor(private router: Router) {}

  canActivate(route: any): boolean {
    const userRole = sessionStorage.getItem('userRole');
    const allowedRoles = route.data['roles'] as string[];

    if (userRole && allowedRoles.includes(userRole)) {
      return true; // Allow access
    }

    // Redirect to a "not authorized" page or login
    this.router.navigate(['/not-authorized']);
    return false; // Deny access
  }
}
