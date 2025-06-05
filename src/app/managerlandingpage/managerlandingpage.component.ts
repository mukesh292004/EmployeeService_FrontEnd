import { Component } from '@angular/core';
import { Router } from '@angular/router';

@Component({
  selector: 'app-managerlandingpage',
  imports: [],
  templateUrl: './managerlandingpage.component.html',
  styleUrl: './managerlandingpage.component.css'
})
export class ManagerlandingpageComponent {
  constructor(private router: Router) {}

  navigateTo(route: string): void {
    this.router.navigate([`/${route}`]);

}}