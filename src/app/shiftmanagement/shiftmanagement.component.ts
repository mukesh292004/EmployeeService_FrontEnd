import { Component, OnInit } from '@angular/core';
import { UserService } from '../userservice.service';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';

@Component({
  selector: 'manager-shift',
  imports: [CommonModule, FormsModule],
  templateUrl: './shiftmanagement.component.html',
  styleUrls: ['./shiftmanagement.component.css']
})
export class ManagerShiftComponent implements OnInit {
  selectedDate: string = new Date().toISOString().split('T')[0]; // Default to today's date
  minDate: string = new Date().toISOString().split('T')[0]; // Block past dates
  assignedShifts: any[] = [];
  unassignedEmployees: any[] = [];
  swapRequests: any[] = []; // Store swap requests
  potentialSwaps: any[] = []; // Store potential swap candidates
  selectedSwapEmployeeId: number | null = null; // Track the selected employee for swap
  unassignedCount: number = 0;
  dayShiftCount: number = 0;
  nightShiftCount: number = 0;

  constructor(private shiftService: UserService) {}

  ngOnInit(): void {
    this.fetchUnassignedEmployees();
    this.fetchShiftsByDate(this.selectedDate);
  }

  fetchUnassignedEmployees(): void {
    this.shiftService.getEmployees().subscribe({
      next: (employees) => {
        this.unassignedEmployees = employees;
        this.unassignedCount = employees.length; // Update unassigned count
      },
      error: (err) => {
        console.error('Failed to fetch unassigned employees:', err);
      }
    });
  }

  fetchShiftsByDate(date: string): void {
    this.shiftService.findAllShifts().subscribe({
      next: (shifts) => {
        this.assignedShifts = shifts.filter(shift => shift.shiftDate === date);
        this.swapRequests = this.assignedShifts.filter(shift => shift.swapRequested); // Extract swap requests
        this.potentialSwaps = this.assignedShifts.filter(shift => !shift.swapRequested); // Extract potential swap candidates
        this.dayShiftCount = this.assignedShifts.filter(shift => shift.name === 'Day Shift').length;
        this.nightShiftCount = this.assignedShifts.filter(shift => shift.name === 'Night Shift').length;
      },
      error: (err) => {
        console.error('Failed to fetch shifts by date:', err);
      }
    });
  }

  assignShift(employeeId: number, shiftType: string): void {
    const shiftData = {
      employeeId: employeeId,
      name: shiftType === 'Day' ? 'Day Shift' : 'Night Shift',
      shiftDate: this.selectedDate,
      shiftTime: shiftType === 'Day' ? '08:00-18:00' : '18:00-06:00',
      swapRequested: false
    };

    this.shiftService.saveShift(shiftData).subscribe({
      next: () => {
        alert(`Shift assigned successfully: ${shiftType}`);
        this.fetchShiftsByDate(this.selectedDate); // Refresh shifts
      },
      error: (err) => {
        console.error('Error assigning shift:', err);
      }
    });
  }

  approveSwap(requestId: number, swapWithEmployeeId: number): void {
    this.shiftService.approveSwap(requestId, swapWithEmployeeId).subscribe({
      next: () => {
        alert('Swap request approved successfully');
        this.fetchShiftsByDate(this.selectedDate); // Refresh shifts
      },
      error: (err) => {
        console.error('Failed to approve swap request:', err);
      }
    });
  }

  selectSwapEmployee(employeeId: number): void {
    this.selectedSwapEmployeeId = employeeId; // Track the selected employee for swap
  }
}