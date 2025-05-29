import { CurrencyPipe, DatePipe, UpperCasePipe } from '@angular/common';
import { Component } from '@angular/core';

@Component({
  selector: 'app-employees',
  imports: [UpperCasePipe,DatePipe,CurrencyPipe],
  standalone: true,
  templateUrl: './employees.component.html',
  styleUrls: ['./employees.component.css']
})
export class EmployeesComponent {
  orgName = "Cognizant";
  employees: Employee[];

  constructor() {
    this.employees = [
      new Employee(1, "suresh", 9000, "Developer",new Date("2025/05/22")),
      new Employee(2, "naresh", 14000, "Hr",new Date("2025/05/22")),
      new Employee(3, "ramesh", 21000, "Admin",new Date("2025/05/22")),
      new Employee(4, "rajesh", 26500, "TL",new Date("2025/05/22"))
    ];
  }

  deleteEmployee(emp: Employee) {
    console.log("Employee info", emp.eid);
    const confirmDelete = confirm("Are you sure you want to delete this employee?");
    if (confirmDelete) {
      const index = this.employees.indexOf(emp);
      if (index !== -1) {
        this.employees.splice(index, 1);
        alert("Employee Deleted");
      }
    }
  }
  

  editEmployee(emp: Employee) {
    emp.ename = prompt("Enter new name", emp.ename) || emp.ename;
    emp.esal = parseFloat(prompt("Enter new salary", emp.esal.toString()) || emp.esal.toString());
    emp.edesg = prompt("Enter new designation", emp.edesg) || emp.edesg;
    this.employees = [...this.employees]; 
    alert("Employee Edited");
  }
}

class Employee {
  constructor(
    public eid: number,
    public ename: string,
    public esal: number,
    public edesg: string,
    public doj: Date
  ) {}
}
