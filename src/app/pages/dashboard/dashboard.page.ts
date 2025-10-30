import { Component } from '@angular/core';
import { ChartConfiguration, ChartData } from 'chart.js';

@Component({
  selector: 'app-dashboard',
  templateUrl: './dashboard.page.html',
  styleUrls: ['./dashboard.page.scss'],
  standalone: false,
})
export class DashboardPage {
  viewMode = 'list';

  destaques = [
    { label: 'a', disc: 1, percent: 75, color: '#34C759' },
    { label: 'b', disc: 2, percent: 90, color: '#FF3B30' },
    { label: 'c', disc: 3, percent: 50, color: '#5AC8FA' },
    { label: 'd', disc: 4, percent: 100, color: '#007AFF' },
  ];

  public doughnutChartData: ChartData<'doughnut'> = {
    datasets: [
      {
        data: [320, 6000],
        backgroundColor: ['#F04141', '#19A4D3'],
        hoverBackgroundColor: ['#F04141', '#19A4D3'],
        borderColor: 'transparent',
        borderRadius: 8,
        spacing: 8,
      },
    ],
  };

  public doughnutChartOptions: ChartConfiguration<'doughnut'>['options'] = {
    responsive: true,
    cutout: '75%',
    plugins: {
      legend: { display: false },
    },
  };

  constructor() {}
}
