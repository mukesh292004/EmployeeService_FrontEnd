import { Component, OnInit, CUSTOM_ELEMENTS_SCHEMA } from '@angular/core';
import { CommonModule, DatePipe } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { UserService } from '../userservice.service'; // Correct import for UserService
import { NgModule } from '@angular/core';

@Component({
  selector: 'employee-shift',
  imports: [DatePipe, CommonModule, FormsModule],
  templateUrl: './shift.component.html',
  styleUrls: ['./shift.component.css'],
  schemas: [CUSTOM_ELEMENTS_SCHEMA] // Added CUSTOM_ELEMENTS_SCHEMA to support 'apx-chart'
})
export class EmployeeShiftComponent implements OnInit {
  shifts: any[] = [];
  filteredShifts: any[] = [];
  userId: number = 0;
  swapRequests: number = 0;
  completedShifts: number = 0;
  todayDate: string = '';
  todayShift: any = {};
  completed: boolean = false;
  apexSeries: any[] = [];
  apexChartOptions: any = {};
  searchDate: string = '';
  errorMessage: string | null = null;

  constructor(private shiftService: UserService) {}

  ngOnInit(): void {
    this.userId = parseInt(sessionStorage.getItem('userId') || '0', 10);
    this.todayDate = new Date().toLocaleDateString();
    if (this.userId) {
      this.fetchEmployeeShifts(this.userId);
    }
  }

  // Fetch shifts for the logged-in employee
  fetchEmployeeShifts(employeeId: number): void {
    this.shiftService.findAllShifts().subscribe({
      next: (data) => {
        console.log('Fetched shifts:', data); // Log the fetched data
        this.shifts = data.filter(shift => shift.employeeId === employeeId);
        this.filteredShifts = [...this.shifts];
        this.swapRequests = this.shifts.filter(shift => shift.swapRequested).length;
        this.completedShifts = this.shifts.filter(shift => shift.status === 'Completed').length;
        this.todayShift = this.shifts.find(shift => shift.date === this.todayDate) || {};
      },
      error: (error) => {
        console.error('Error fetching employee shifts:', error);
        this.errorMessage = 'Failed to fetch shifts. Please try again later.';
      }
    });
  }

  // Apply search filter by date
  applySearch(): void {
    if (this.searchDate) {
      this.filteredShifts = this.shifts.filter(shift => shift.shiftDate === this.searchDate);
    } else {
      this.filteredShifts = [...this.shifts];
    }
    console.log('Filtered shifts:', this.filteredShifts); // Log filtered shifts for debugging
  }

  // Request a shift swap
  requestSwap(shiftId: number): void {
    this.shiftService.requestSwap(shiftId).subscribe({
      next: () => {
        alert('Shift swap request submitted successfully.');
        this.fetchEmployeeShifts(this.userId); // Refresh shifts
      },
      error: (error) => {
        console.error('Error requesting shift swap:', error);
        alert('Failed to request shift swap. Please try again later.');
      }
    });
  }

  // Mark today's shift as complete
  markShiftComplete(): void {
    if (this.todayShift && this.todayShift.id) {
      this.shiftService.requestSwap(this.todayShift.id).subscribe({
        next: () => {
          this.completed = true;
          alert('Shift marked as complete.');
          this.fetchEmployeeShifts(this.userId);
        },
        error: (error) => {
          console.error('Error marking shift as complete:', error);
          alert('Failed to mark shift as complete.');
        }
      });
    }
  }
}