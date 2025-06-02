import { Component, OnInit } from '@angular/core';r/core/testing';
import { CommonModule } from '@angular/common';
import { EmployeeAttendanceComponent } from './employee-attendance.component';
@Component({
  selector: 'app-employee-attendance',, () => {
  standalone: true,ployeeAttendanceComponent;
  imports: [CommonModule],xture<EmployeeAttendanceComponent>;
  templateUrl: './employee-attendance.component.html',
  styleUrls: ['./employee-attendance.component.css']
})  await TestBed.configureTestingModule({
export class EmployeeAttendanceComponent implements OnInit {
  currentWeek = [
    { day: 'Monday', date: '2025-05-26', clockIn: null, clockOut: null, workHours: null },
    { day: 'Tuesday', date: '2025-05-27', clockIn: null, clockOut: null, workHours: null },
    { day: 'Wednesday', date: '2025-05-28', clockIn: null, clockOut: null, workHours: null },
    { day: 'Thursday', date: '2025-05-29', clockIn: null, clockOut: null, workHours: null },
    { day: 'Friday', date: '2025-05-30', clockIn: null, clockOut: null, workHours: null },
  ];;

  monthlySummary = {, () => {
    employeeId: 15,
    presentDays: 0,
    absentDays: 0,
    averageWorkingHours: 0.0,averageWorkingHours: 0.0,    minWorkingHours: 0.0,    maxWorkingHours: 0.0  };  weeklyHistory = [    { week: 1, totalHours: 35 },    { week: 2, totalHours: 40 },    { week: 3, totalHours: 30 },    { week: 4, totalHours: 45 }  ];  maxWeeklyHours = 50; // Maximum hours in a week  ngOnInit(): void {    this.fetchMonthlySummary();  }  fetchMonthlySummary(): void {    // Simulate fetching data from backend    this.monthlySummary = {      employeeId: 15,      presentDays: 20,      absentDays: 0,      averageWorkingHours: 8.0,      minWorkingHours: 6.0,      maxWorkingHours: 10.0    };  }  markClockIn(day: any): void {    const currentTime = new Date().toISOString();    day.clockIn = currentTime;    console.log('Clock In:', day);  }  markClockOut(day: any): void {    const currentTime = new Date().toISOString();    day.clockOut = currentTime;    const clockInTime = new Date(day.clockIn);    const clockOutTime = new Date(currentTime);    const workHours = ((clockOutTime.getTime() - clockInTime.getTime()) / (1000 * 60 * 60)).toFixed(2);
    minWorkingHours: 0.0,    day.workHours = `${workHours} hours`;
    maxWorkingHours: 0.0
  };    console.log('Clock Out:', day);

  weeklyHistory = [
    { week: 1, totalHours: 35 },    { week: 2, totalHours: 40 },    { week: 3, totalHours: 30 },    { week: 4, totalHours: 45 }  ];  maxWeeklyHours = 50; // Maximum hours in a week  ngOnInit(): void {    this.fetchMonthlySummary();  }  fetchMonthlySummary(): void {    // Simulate fetching data from backend    this.monthlySummary = {      employeeId: 15,      presentDays: 20,      absentDays: 0,      averageWorkingHours: 8.0,      minWorkingHours: 6.0,      maxWorkingHours: 10.0    };  }  markClockIn(day: any): void {    const currentTime = new Date().toISOString();    day.clockIn = currentTime;    console.log('Clock In:', day);  }  markClockOut(day: any): void {    const currentTime = new Date().toISOString();    day.clockOut = currentTime;    const clockInTime = new Date(day.clockIn);    const clockOutTime = new Date(currentTime);    const workHours = ((clockOutTime.getTime() - clockInTime.getTime()) / (1000 * 60 * 60)).toFixed(2);
    day.workHours = `${workHours} hours`;

    console.log('Clock Out:', day);
  }
}
