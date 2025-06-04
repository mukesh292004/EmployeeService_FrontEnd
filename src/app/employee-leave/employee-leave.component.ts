import { Component, OnInit } from '@angular/core';
import { UserService } from '../userservice.service';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { NgModule } from '@angular/core';

@Component({
  selector: 'app-employee-leave-component',
  imports: [CommonModule, FormsModule],
  templateUrl: './employee-leave.component.html',
  styleUrls: ['./employee-leave.component.css']
})
export class EmployeeLeaveComponentComponent implements OnInit {
  leaveBalances: any[] = [];
  totalLeaveBalance: number = 0; // Property for total leave balance
  leaveHistory: any[] = [];
  filteredLeaveHistory: any[] = [];
  paginatedLeaveHistory: any[] = [];
  currentPage: number = 1;
  itemsPerPage: number = 5;
  totalPages: number = 0;
  totalPagesArray: number[] = [];
  pendingRequestsCount: number = 0; // Property for pending requests count
  approvedRequestsCount: number = 0; // Property for approved requests count
  rejectedRequestsCount: number = 0; // Property for rejected requests count
  leaveRequest: any = {
    employeeId: null,
    leaveType: '',
    startDate: '',
    endDate: ''
  };
  searchFilters: any = {
    leaveType: '',
    status: '',
    startDate: ''
  };
  userId: number | null = sessionStorage.getItem('userId') ? parseInt(sessionStorage.getItem('userId')!, 10) : null;
  errorMessage: string | null = null;

  constructor(private leaveService: UserService) {}

  ngOnInit(): void {
    console.log('ngOnInit executed'); // Debugging log
    const employeeId = sessionStorage.getItem('userId');
    if (employeeId) {
      this.leaveRequest.employeeId = parseInt(employeeId, 10);
      console.log('Employee ID:', this.leaveRequest.employeeId); // Debugging log
      this.fetchLeaveBalance(this.leaveRequest.employeeId);
      this.fetchLeaveHistory(this.leaveRequest.employeeId);
    } else {
      console.error('Employee ID not found in localStorage'); // Debugging log
    }
  }

  fetchLeaveBalance(employeeId: number): void {
    console.log("Fetching leave balance for employee ID:", employeeId);
    this.leaveService.fetchLeaveBalance(employeeId).subscribe((data) => {
      this.leaveBalances = data.map((item: any) => ({
        type: item.leaveType,
        remaining: item.balance
      }));
      this.totalLeaveBalance = this.leaveBalances.reduce((sum, balance) => sum + balance.remaining, 0); // Calculate total balance
    });
  }

  fetchLeaveHistory(employeeId: number): void {
    console.log("Fetching leave history for employee ID:", employeeId);
    this.leaveService.getLeaveHistoryByEmployeeId(employeeId).subscribe((data) => {
      this.leaveHistory = data;
      this.filteredLeaveHistory = [...this.leaveHistory]; // Initialize filtered history
      this.pendingRequestsCount = this.leaveHistory.filter(leave => leave.status === 'Pending').length;
      this.approvedRequestsCount = this.leaveHistory.filter(leave => leave.status === 'Approved').length;
      this.rejectedRequestsCount = this.leaveHistory.filter(leave => leave.status === 'Rejected').length;
      this.updatePagination();
    });
  }

  applyFilters(): void {
    this.filteredLeaveHistory = this.leaveHistory.filter((leave) => {
      const matchesLeaveType = this.searchFilters.leaveType
        ? leave.leaveType === this.searchFilters.leaveType
        : true;
      const matchesStatus = this.searchFilters.status
        ? leave.status === this.searchFilters.status
        : true;
      const matchesStartDate = this.searchFilters.startDate
        ? new Date(leave.startDate).toISOString().split('T')[0] === this.searchFilters.startDate
        : true;

      return matchesLeaveType && matchesStatus && matchesStartDate;
    });
    this.updatePagination();
  }

  applyForLeave(): void {
    const today = new Date().toISOString().split('T')[0];
    if (this.leaveRequest.startDate <= today || this.leaveRequest.endDate <= today) {
      this.errorMessage = 'Dates must be in the future.';
      return;
    }
    if (this.leaveRequest.startDate > this.leaveRequest.endDate) {
      this.errorMessage = 'End date must be greater than start date.';
      return;
    }
    const balance = this.leaveBalances.find((b) => b.type === this.leaveRequest.leaveType);
    if (!balance) {
      this.errorMessage = 'Invalid leave type.';
      return;
    }
    const days = this.calculateDays(this.leaveRequest.startDate, this.leaveRequest.endDate);
    if (days > balance.remaining) {
      this.errorMessage = 'Insufficient leave balance.';
      return;
    }
  
    this.leaveService.applyLeave(this.leaveRequest).subscribe(
      (response) => {
        if (typeof response === 'string') {
          console.log('Server response:', response);
          this.errorMessage = null;
          this.fetchLeaveHistory(this.leaveRequest.employeeId!);
          this.fetchLeaveBalance(this.leaveRequest.employeeId!); // Refresh leave balance
  
          // Show success toast notification
          this.showToast('Leave applied successfully!', 'Success');
        }
      },
      (error) => {
        console.error('Error applying for leave:', error);
        this.errorMessage = 'Failed to submit leave request. Please try again later.';
  
        // Show error toast notification
        this.showToast('Failed to apply for leave.', 'Error');
      }
    );
  }
  
  // Method to show toast notifications
  showToast(message: string, title: string): void {
    const toastContainer = document.getElementById('toastPlacement');
    if (toastContainer) {
      const toast = document.createElement('div');
      toast.className = 'toast show';
      toast.setAttribute('role', 'alert');
      toast.setAttribute('aria-live', 'assertive');
      toast.setAttribute('aria-atomic', 'true');
  
      toast.innerHTML = `
        <div class="toast-header">
          <strong class="me-auto">${title}</strong>
          <button type="button" class="btn-close" data-bs-dismiss="toast" aria-label="Close"></button>
        </div>
        <div class="toast-body">
          ${message}
        </div>
      `;
  
      toastContainer.appendChild(toast);
  
      // Automatically remove the toast after 5 seconds
      setTimeout(() => {
        toast.remove();
      }, 5000);
    }
  }

  calculateDays(startDate: string, endDate: string): number {
    const start = new Date(startDate);
    const end = new Date(endDate);
    return Math.ceil((end.getTime() - start.getTime()) / (1000 * 60 * 60 * 24)) + 1;
  }

  deleteLeave(leaveId: number): void {
    this.leaveService.deleteLeave(leaveId).subscribe(() => {
      this.fetchLeaveHistory(this.leaveRequest.employeeId!);
    });
  }

  updatePagination(): void {
    this.totalPages = Math.ceil(this.filteredLeaveHistory.length / this.itemsPerPage);
    this.totalPagesArray = Array.from({ length: this.totalPages }, (_, i) => i + 1);
    this.paginatedLeaveHistory = this.filteredLeaveHistory.slice(
      (this.currentPage - 1) * this.itemsPerPage,
      this.currentPage * this.itemsPerPage
    );
  }

  changePage(page: number): void {
    if (page < 1 || page > this.totalPages) return;
    this.currentPage = page;
    this.updatePagination();
  }
}