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
    this.fetchShiftsByDate(this.selectedDate);
     this.fetchUnassignedEmployees();
  }

  fetchUnassignedEmployees(): void {
    console.log('Fetching unassigned employees...');
    console.log('Assigned Shifts:', this.assignedShifts); // Log assigned shifts
  
    this.shiftService.getEmployees().subscribe({
      next: (employees) => {
        console.log('All Employees:', employees); // Log all employees
  
        // Extract employee IDs from assigned shifts for the selected date
        const assignedEmployeeIds = this.assignedShifts
          .filter(shift => shift.shiftDate === this.selectedDate) // Filter by the selected date
          .map(shift => shift.employeeId); // Get employee IDs
  
        console.log('Assigned Employee IDs:', assignedEmployeeIds); // Log assigned employee IDs
  
        // Filter out employees whose IDs are in the assignedEmployeeIds list
        this.unassignedEmployees = employees.filter(employee => !assignedEmployeeIds.includes(employee.id));
  
        // Update the unassigned count
        this.unassignedCount = this.unassignedEmployees.length;
  
        // Log the filtered unassigned employees
        console.log('Filtered Unassigned Employees:', this.unassignedEmployees);
      },
      error: (err) => {
        console.error('Failed to fetch unassigned employees:', err);
      }
    });
  }

  fetchShiftsByDate(date: string): void {
    this.shiftService.findAllShifts().subscribe({
      next: (shifts) => {
        console.log('All Shifts:', shifts); // Log all shifts fetched from the service

        // Filter shifts for the selected date
        this.assignedShifts = shifts.filter(shift => shift.shiftDate === date);
        console.log('Assigned Shifts for Date:', this.assignedShifts); // Log assigned shifts for the selected date

        // Extract swap requests
        this.swapRequests = this.assignedShifts.filter(shift => shift.swapRequested);
        console.log('Swap Requests:', this.swapRequests); // Log swap requests

        // Extract potential swaps based on the conditions:
        // 1. `swapRequested` is true.
        // 2. `shiftDate` is the same.
        // 3. `name` (shift type) is not the same.
        // 4. `employeeId` is not the same.
        this.potentialSwaps = this.assignedShifts.filter(candidate =>
          candidate.swapRequested &&
          this.swapRequests.some(request =>
            request.shiftDate === candidate.shiftDate &&
            request.name !== candidate.name &&
            request.employeeId !== candidate.employeeId
          )
        );
        console.log('Potential Swaps:', this.potentialSwaps); // Log potential swaps

        // Update day and night shift counts
        this.dayShiftCount = this.assignedShifts.filter(shift => shift.name === 'Day Shift').length;
        this.nightShiftCount = this.assignedShifts.filter(shift => shift.name === 'Night Shift').length;

        console.log('Day Shift Count:', this.dayShiftCount); // Log day shift count
        console.log('Night Shift Count:', this.nightShiftCount); // Log night shift count
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