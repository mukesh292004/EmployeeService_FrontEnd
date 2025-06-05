import { CommonModule } from '@angular/common'; // Import CommonModule
import { FormsModule } from '@angular/forms';
import { UpperCasePipe } from '@angular/common';
import { Component, OnInit } from '@angular/core';
import { UserService, Employee, UpdateEmployeePayload } from '../userservice.service';

@Component({
  selector: 'app-employees',
  standalone: true,
  imports: [CommonModule, FormsModule, UpperCasePipe], // Removed DatePipe
  templateUrl: './employees.component.html',
  styleUrls: ['./employees.component.css']
})
export class EmployeesComponent implements OnInit {
  orgName = "Cognizant";
  employees: Employee[] = []; // Full list of employees
  visibleEmployees: Employee[] = []; // Subset of employees for the slider
  sliderStartIndex = 0; // Start index for the slider
  sliderItemsCount = 4; // Number of items visible at a time
  isModalOpen = false;
  selectedEmployee: Employee | null = null;
  isAddModalOpen = false; 
  newEmployee: Partial<Employee> = {}; 
  currentPage = 1;
  itemsPerPage = 5;
  paginatedEmployees: Employee[] = [];
  totalPages = 0; // Add this property

  constructor(private userService: UserService) {}

  ngOnInit(): void {
    this.loadEmployees();
  }

  loadEmployees(): void {
    this.userService.getEmployees().subscribe({
      next: (data) => {
        this.employees = data;
        this.updateVisibleEmployees();
        this.updatePagination();
        console.log("Employees loaded", this.employees);
      },
      error: (err) => {
        console.error("Error loading employees", err);
        alert("Failed to load employees. Please try again later.");
      }
    });
  }

  updatePagination(): void {
    const startIndex = (this.currentPage - 1) * this.itemsPerPage;
    const endIndex = startIndex + this.itemsPerPage;
    this.paginatedEmployees = this.employees.slice(startIndex, endIndex);
    this.totalPages = Math.ceil(this.employees.length / this.itemsPerPage); // Calculate total pages
  }

  updateVisibleEmployees(): void {
    this.visibleEmployees = this.employees.slice(this.sliderStartIndex, this.sliderStartIndex + this.sliderItemsCount);
  }

  nextPage(): void {
    if (this.currentPage < this.totalPages) {
      this.currentPage++;
      this.updatePagination();
    }
  }

  previousPage(): void {
    if (this.currentPage > 1) {
      this.currentPage--;
      this.updatePagination();
    }
  }

  nextEmployee(): void {
    if (this.sliderStartIndex + this.sliderItemsCount < this.employees.length) {
      this.sliderStartIndex++;
      this.updateVisibleEmployees();
    }
  }

  previousEmployee(): void {
    if (this.sliderStartIndex > 0) {
      this.sliderStartIndex--;
      this.updateVisibleEmployees();
    }
  }

  deleteEmployee(emp: Employee): void {
    const confirmDelete = confirm(`Are you sure you want to delete employee ${emp.name}?`);
    if (confirmDelete) {
      this.userService.deleteEmployee(emp.id).subscribe({
        next: () => {
          const index = this.employees.indexOf(emp);
          if (index !== -1) {
            this.employees.splice(index, 1); 
          }
          this.loadEmployees(); 
          alert("Employee deleted successfully!");
        },
        error: (err) => {
          console.error("Failed to delete employee", err);
          alert("Failed to delete employee. Please try again later.");
        }
      });
    }
  }

  openEditModal(emp: Employee): void {
    this.selectedEmployee = { ...emp }; 
    this.isModalOpen = true;
  }

  openAddModal(): void {
    this.newEmployee = {
      name: '',
      email: '',
      role: '',
      department: '',
      contact: ''
    };
    this.isAddModalOpen = true;
  }

  closeAddModal(): void {
    this.isAddModalOpen = false;
    this.newEmployee = {};
  }

  addEmployee(): void {
    if (this.newEmployee.name?.trim() && this.newEmployee.email?.trim() && this.newEmployee.role?.trim() && 
        this.newEmployee.department?.trim() && this.newEmployee.contact?.trim()) {
      const payload: UpdateEmployeePayload = {
        name: this.newEmployee.name.trim(),
        email: this.newEmployee.email.trim(),
        role: this.newEmployee.role.trim(),
        department: this.newEmployee.department.trim(),
        contact: this.newEmployee.contact.trim()
      };

      this.userService.saveEmployee(payload).subscribe({
        next: () => {
          alert("New employee added successfully!");
          this.closeAddModal();
          this.loadEmployees(); // Reload the employees list after successful save
        },
        error: (err) => {
          console.error("Failed to add new employee", err);
          alert("Failed to add new employee. Please try again later.");
        }
      });
    } else {
      alert("All fields are required. Please fill in all fields before saving.");
    }
  }

  closeModal(): void {
    this.isModalOpen = false;
    this.selectedEmployee = null;
  }
 
  updateEmployee(): void {
    if (this.selectedEmployee) {
      // Create an UpdateEmployeePayload object excluding the id
      const updatePayload = {
        name: this.selectedEmployee.name,
        email: this.selectedEmployee.email,
        role: this.selectedEmployee.role,
        department: this.selectedEmployee.department,
        contact: this.selectedEmployee.contact
      };
  
      this.userService.updateEmployee(this.selectedEmployee.id, updatePayload).subscribe({
        next: (updatedEmployee) => {
          const index = this.employees.findIndex(e => e.id === this.selectedEmployee!.id);
          if (index !== -1) {
            this.employees[index] = { ...this.selectedEmployee, ...updatedEmployee }; // Update local list
          }
          alert("Employee details updated successfully!");
          this.closeModal();
        },
        error: (err) => {
          console.error("Failed to update employee", err);
          alert("Failed to update employee. Please try again later.");
        }
      });
    }
  }

  trackById(index: number, employee: Employee): number {
    return employee.id;
  }

  getCardColor(employee: Employee): string {
    const colors = ['bg-gradient-primary', 'bg-gradient-success', 'bg-gradient-info', 'bg-gradient-warning', 'bg-gradient-danger'];
    const index = this.employees.indexOf(employee) % colors.length;
    return colors[index];
  }
}