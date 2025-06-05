import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { UserService } from '../userservice.service';
import { NgChartsModule } from 'ng2-charts';
import { ChartData, ChartOptions } from 'chart.js';
import { NgApexchartsModule } from 'ng-apexcharts';
import { ApexAxisChartSeries, ApexChart, ApexXAxis, ApexStroke, ApexDataLabels, ApexTooltip, ApexMarkers } from 'ng-apexcharts';

@Component({
  selector: 'app-employee-attendance',
  standalone: true,
  imports: [CommonModule, NgChartsModule, NgApexchartsModule],
  templateUrl: './employee-attendance.component.html',
  styleUrls: ['./employee-attendance.component.css']
})
export class EmployeeAttendanceComponent implements OnInit {
  userId: number;
  todayDate: string = new Date().toDateString();
  clockInTime: string = '00:00:00';
  clockOutTime: string = '00:00:00';
  clockedIn: boolean = false;
  workHours: number = 0; // Current working hours
  totalWorkingHours: number = 10; // Total working hours (e.g., 10 hours)
  workHoursPercentage: number = 50; // Percentage for circular progress
  breakHours: number = 0;
  overtimeHours: number = 0;
  attendanceHistory: any[] = [];
  monthlyReport: any = {};
  weeklyHours: number = 0;
  completed: boolean = false;
  public weekDays: string[] = ['Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday'];
  public weekChartData: number[] = [0, 0, 0, 0, 0];
  public weekBarChartData: ChartData<'bar'> = {
    labels: this.weekDays,
    datasets: [
      {
        data: this.weekChartData,
        label: 'Work Hours',
        backgroundColor: '#007bff'
      }
    ]
  };

  public weekLineChartData: ChartData<'line'> = { labels: [], datasets: [] };
  public weekLineChartOptions: ChartOptions<'line'> = {
    responsive: true,
    plugins: {
      legend: { display: false } // Hide legend for line chart legend means the label for the line
    },
    elements: {
      line: {
        borderWidth: 3,
        borderColor: '#00ff00',
        backgroundColor: 'rgba(0,255,0,0.1)',
      },
      point: {
        backgroundColor: '#00ff00',
        borderColor: '#00ff00',
        radius: 6,
        borderWidth: 2,
        hoverRadius: 8,
        hoverBorderWidth: 3
      }
    },
    scales: { // Configure scales for line chart  ex x and y axes
      x: {
        grid: { display: false },
        ticks: { color: '#00ff00' }
      },
      y: {
        beginAtZero: true,
        max: 10,
        grid: { color: 'rgba(0,255,0,0.2)' },
        ticks: { color: '#00ff00' }
      }
    }
  };

  public apexSeries: ApexAxisChartSeries = [];
  public apexChartOptions: any = {};

  // currentMonth: string = 'May 2025';
  currentMonth: string = new Date().toLocaleString('default', { month: 'long', year: 'numeric' });
  currentYear: number = new Date().getFullYear();
  monthAvg: number = this.monthlyReport.averageWorkingHours || 0;
  yearAvg: string = '09h 42m';
  weeklyAverages: { week: number; averageHours: number; barHeight: string }[] = [];
  ngOnInit(): void {
    const maxWeeklyHours = 50;
    this.weeklyAverages = (this.monthlyReport.weeklyReports || []).map(report => {
      const percentage = (report.averageHours / maxWeeklyHours) * 100;
      return {
        week: report.weekNumber,
        averageHours: report.averageHours,
        barHeight: `${Math.min(percentage, 100)}%`
      };
    });
  
    this.userId = Number(sessionStorage.getItem('userId'));
    this.fetchAttendanceHistory();
    this.fetchMonthlyReport();
    this.calculateWeeklyHours();
    this.updateMonthlyView();
    this.calculateWorkHoursPercentage();
  }

  dailyRecords = [
    { date: '25 May', day: 'Sun', time: '--h --m', clockIn: '--:--', clockOut: '--:--', status: 'holiday' },
    { date: '26 May', day: 'Mon', time: '10h 07m', clockIn: '08:28 AM', clockOut: '06:36 PM', status: 'present' },
    { date: '27 May', day: 'Tue', time: '10h 01m', clockIn: '08:27 AM', clockOut: '06:29 PM', status: 'present' },
    { date: '28 May', day: 'Wed', time: '09h 59m', clockIn: '08:29 AM', clockOut: '06:29 PM', status: 'present' },
    { date: '29 May', day: 'Thu', time: '10h 03m', clockIn: '08:23 AM', clockOut: '06:27 PM', status: 'present' },
    { date: '30 May', day: 'Fri', time: '09h 58m', clockIn: '08:49 AM', clockOut: '06:48 PM', status: 'present' },
    { date: '31 May', day: 'Sat', time: '--h --m', clockIn: '--:--', clockOut: '--:--', status: 'holiday' }
  ];

  constructor(private userService: UserService) {}

  fetchAttendanceHistory(): void {
    this.userService.getAttendanceHistory(this.userId).subscribe({ //subscribe means to listen to the observable returned by getAttendanceHistory
      // observable is a stream of data that can be subscribed to  it is like a promise but can emit multiple values over time
      next: (data) => {
        this.attendanceHistory = data;
        this.updateTodayStatus();
        this.calculateWeeklyHours();
        this.updateApexChartData();
        this.generateMonthlyReport();
      },
      error: (error) => {
        console.error('Failed to fetch attendance history:', error);
      },
    });
  }

  updateTodayStatus(): void {
    const todayISO = new Date().toISOString().slice(0, 10);
    const todayRecord = this.attendanceHistory.find(r => r.date === todayISO);

    if (todayRecord) {
      this.clockInTime = todayRecord.clockIn ? new Date(todayRecord.clockIn).toLocaleTimeString() : '00:00:00';
      this.clockOutTime = todayRecord.clockOut ? new Date(todayRecord.clockOut).toLocaleTimeString() : '00:00:00';
      this.clockedIn = !!todayRecord.clockIn && !todayRecord.clockOut;
      this.workHours = todayRecord.workHours || 0;
      this.completed = !!todayRecord.clockIn && !!todayRecord.clockOut;
    } else {
      this.clockInTime = '00:00:00';
      this.clockOutTime = '00:00:00';
      this.clockedIn = false;
      this.workHours = 0;
      this.completed = false;
    }
    this.calculateWorkHoursPercentage();
  }

  toggleClockIn(): void {
    if (!this.clockedIn) {
      this.userService.clockIn(this.userId).subscribe({
        next: () => this.fetchAttendanceHistory(),
        error: () => alert('Failed to clock in!')
      });
    } else {
      this.userService.clockOut(this.userId).subscribe({
        next: () => this.fetchAttendanceHistory(),
        error: () => alert('Failed to clock out!')
      });
    }
  }

  fetchMonthlyReport(): void {
    const currentMonth = new Date().getMonth() + 1;
    this.userService.getMonthlyReport(this.userId, currentMonth).subscribe({
      next: (data) => {
        this.monthlyReport = data;
      },
      error: (error) => {
        console.error('Failed to fetch monthly report:', error);
      }
    });
  }

  calculateWorkHoursPercentage(): void {
    if (this.totalWorkingHours > 0) {
      this.workHoursPercentage = (this.workHours / this.totalWorkingHours) * 100;
    } else {
      this.workHoursPercentage = 0; // Default to 0 if total working hours is invalid
    }
  }

  calculateWeeklyHours(): void {
    const now = new Date();
    const startOfWeek = new Date(now);
    startOfWeek.setDate(now.getDate() - now.getDay() + 1);// it sets the date to the first day of the week (Monday) by calculating the difference between the current day and Monday
    startOfWeek.setHours(0, 0, 0, 0);

    const endOfWeek = new Date(startOfWeek);
    endOfWeek.setDate(startOfWeek.getDate() + 4);
    endOfWeek.setHours(23, 59, 59, 999); //
    // what is promise and observable in angular
    // promise is a single value that can be resolved or rejected once, while observable is a stream of values that can emit multiple values over time
    // both are used to handle asynchronous operations in Angular, but observables are more powerful and flexible as they can be cancelled, retried, and transformed using operators

    this.weeklyHours = this.attendanceHistory
      .filter(r => {
        const d = new Date(r.date);
        return d >= startOfWeek && d <= endOfWeek;
      })
      .reduce((sum, r) => sum + (r.workHours || 0), 0);
  }

  updateWeekChartData(): void {
    this.weekChartData = [0, 0, 0, 0, 0];
    const today = new Date();
    const monday = new Date(today);
    monday.setDate(today.getDate() - today.getDay() + 1);

    for (let i = 0; i < 5; i++) { // Loop through the week days (Monday to Friday)
      if (i > 4) break; // Only process Monday to Friday

      const day = new Date(monday);
      day.setDate(monday.getDate() + i);
      const dayISO = day.toISOString().slice(0, 10);
      const record = this.attendanceHistory.find(r => r.date === dayISO);
      this.weekChartData[i] = record && record.workHours ? record.workHours : 0;
    }

    this.weekBarChartData = { //this is the data for the bar chart
      labels: this.weekDays, // Labels for the bar chart
      datasets: [
        {
          data: [...this.weekChartData], // ... is used to spread the array into the data property
          label: 'Work Hours',
          backgroundColor: '#007bff'
        }
      ]
    };

    this.weekLineChartData = { //this is the data for the line chart
      labels: this.weekDays,
      datasets: [
        {
          data: [...this.weekChartData],
          label: 'Work Hours',
          fill: false,
          borderColor: '#fff',
          backgroundColor: '#fff',
          pointBackgroundColor: '#fff',
          pointBorderColor: '#fff',
          tension: 0.4
        }
      ]
    };
  }

  updateWeekLineChartData(): void {
    const today = new Date();
    const monday = new Date(today);
    monday.setDate(today.getDate() - today.getDay() + 1);

    const labels: string[] = [];
    const data: number[] = [];

    for (let i = 0; i < 5; i++) {
      const day = new Date(monday);
      day.setDate(monday.getDate() + i);
      if (day > today) break;

      labels.push(this.weekDays[i]);
      const dayISO = day.toISOString().slice(0, 10);
      const record = this.attendanceHistory.find(r => r.date === dayISO);
      data.push(record && record.workHours ? record.workHours : null);
    }

    this.weekLineChartData = {
      labels,
      datasets: [
        {
          data,
          label: 'Work Hours',
          fill: false,
          borderColor: '#00ff00',
          backgroundColor: 'rgba(0,255,0,0.2)',
          pointBackgroundColor: '#00ff00',
          pointBorderColor: '#00ff00',
          tension: 0.4
        }
      ]
    };
  }

  updateApexChartData(): void {
    const weekDays = ['Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday'];
    const today = new Date();
    const monday = new Date(today);
    monday.setDate(today.getDate() - today.getDay() + 1);

    const categories: string[] = [];
    const data: number[] = [];

    for (let i = 0; i < 5; i++) {
      const day = new Date(monday);
      day.setDate(monday.getDate() + i);
      categories.push(weekDays[i]);
      const dayISO = day.toISOString().slice(0, 10);
      const record = this.attendanceHistory.find(r => r.date === dayISO);
      data.push(record && record.workHours ? record.workHours : 0);
    }

    this.apexSeries = [
      {
        name: 'Work Hours',
        data: data
      }
    ];

    this.apexChartOptions = {
      chart: {
        type: 'bar',
        height: 300,
        toolbar: { show: false }
      },
      plotOptions: {
        bar: {
          borderRadius: 4,
          horizontal: false,
          columnWidth: '40%'
        }
      },
      stroke: {
        curve: 'smooth',
        width: 4,
        colors: ['#00ff00']
      },
      xaxis: {
        categories: categories,
        labels: { style: { colors: '#00ff00' } }
      },
      yaxis: {
        min: 0,
        max: 10,
        labels: { style: { colors: '#00ff00' } }
      },
      dataLabels: {
        enabled: false
      },
      markers: {
        size: 6,
        colors: ['#00ff00'],
        strokeColors: '#fff',
        strokeWidth: 2
      },
      tooltip: {
        theme: 'dark'
      },
      grid: {
        borderColor: 'rgba(0,255,0,0.2)'
      }
    };
  }

  generateMonthlyReport(): void {
    const currentMonth = new Date().getMonth();
    const currentYear = new Date().getFullYear();

    this.monthlyReport = {
      weeks: [
        { week: 1, days: [] },
        { week: 2, days: [] },
        { week: 3, days: [] },
        { week: 4, days: [] },
      ],
    };

    this.attendanceHistory.forEach((record) => {
      const recordDate = new Date(record.date);
      if (recordDate.getMonth() === currentMonth && recordDate.getFullYear() === currentYear) {
        const weekNumber = Math.ceil((recordDate.getDate() - 1) / 7);
        const week = this.monthlyReport.weeks[weekNumber - 1];
        week.days.push({
          date: record.date,
          clockIn: record.clockIn ? new Date(record.clockIn).toLocaleTimeString() : '--:--',
          clockOut: record.clockOut ? new Date(record.clockOut).toLocaleTimeString() : '--:--',
          workHours: record.workHours ? `${record.workHours} hrs` : '--',
        });
      }
    });
  }

  updateMonthlyView() {
    this.userService.getMonthlyReport(this.userId, new Date().getMonth() + 1).subscribe({
      next: (data) => {
        if (data) {
          this.yearAvg = data.yearlyAverage || this.yearAvg;
         
          if (data.dailyRecords) {
            this.dailyRecords = data.dailyRecords.map(record => ({
              date: new Date(record.date).toLocaleString('en-US', { day: '2-digit', month: 'short' }),
              day: new Date(record.date).toLocaleString('en-US', { weekday: 'short' }),
              time: record.workHours ? `${Math.floor(record.workHours)}h ${Math.round((record.workHours % 1) * 60)}m` : '--h --m',
              clockIn: record.clockIn ? new Date(record.clockIn).toLocaleString('en-US', { hour: '2-digit', minute: '2-digit', hour12: true }) : '--:--',
              clockOut: record.clockOut ? new Date(record.clockOut).toLocaleString('en-US', { hour: '2-digit', minute: '2-digit', hour12: true }) : '--:--',
              status: record.status || 'present'
            }));
          }
        }
      },
      error: (error) => {
        console.error('Failed to fetch monthly report:', error);
      }
    });
  }
  // this function calculates the height of the bar in the bar chart based on the time worked
  // it takes a time string in the format 'Xh Ym' and returns a percentage height for the bar
  // calculateBarHeight(time: string): string {
  //   if (time === '--h --m') return '0%';

  //   const hours = parseInt(time.split('h')[0]);
  //   const minutes = parseInt(time.split('h')[1].split('m')[0]);

  //   const totalHours = hours + (minutes / 60);

  //   const percentage = (totalHours / 10) * 100;

  //   return `${Math.min(percentage, 100)}%`;
  // }

  refreshData(): void {
    this.fetchAttendanceHistory();
    this.fetchMonthlyReport();
    this.calculateWeeklyHours();
    this.updateWeekChartData();
    this.updateWeekLineChartData();
    this.updateApexChartData();
    this.updateMonthlyView();
  }

  // Example method to update work hours dynamically
  updateWorkHours(hours: number): void {
    this.workHours = hours;
    this.calculateWorkHoursPercentage();
  }
}