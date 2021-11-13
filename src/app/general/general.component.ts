import { Component, OnInit } from '@angular/core';
import { EChartsOption } from 'echarts';
import { LatestGlobalData } from '../shared/models/timeline-data.model';
import { StatService } from '../shared/stat.service';
import { StatCardData, StatCardColors } from './stat-card/stat-card.model';

@Component({
  selector: 'app-general',
  templateUrl: './general.component.html',
  styleUrls: ['./general.component.scss'],
})
export class GeneralComponent implements OnInit {
  data: LatestGlobalData = {
    active: 0,
    confirmed: 0,
    date: '',
    new_confirmed: 0,
    deaths: 0,
    new_deaths: 0,
    new_recovered: 0,
    recovered: 0,
    updated_at: '',
  };

  chartData: LatestGlobalData[] = [];
  daysOnChart = [1, 2, 3, 4, 5, 6, 7];

  // iterable list of data for each card (in case I need to add more cards)
  cardsList: {
    data: StatCardData;
    colors: StatCardColors;
    iconUrl: string;
  }[] = [];

  chartOption: EChartsOption = {
    xAxis: {
      type: 'category',
      data: [...this.daysOnChart.slice(0, -1).reverse(), 'today'], // to exclude last day
    },
    yAxis: {
      type: 'value',
    },
    series: [
      {
        data: this.lineChart('new_confirmed'),
        type: 'line',
      },
      {
        data: this.lineChart('new_deaths'),
        type: 'line',
      },
      {
        data: this.lineChart('new_recovered'),
        type: 'line',
      },
    ],
  };

  constructor(private statService: StatService) {}

  ngOnInit(): void {
    this.statService.getLatestGlobal().subscribe((data) => {
      this.data = data[0];
      this.cardsList = this.generateCardData(this.data);
      this.chartData = this.getChartData(this.daysOnChart.length, data);
      console.log(this.chartData);
    });
  }

  // Returns an array of chartData's elements property values throughout entire timeline, to be displayed as a line on chart
  lineChart(property: 'new_confirmed' | 'new_deaths' | 'new_recovered') {
    let lineChartArr = [];
    for (let data of this.chartData) {
      console.log(data);
      lineChartArr.push(data[property]);
    }
    console.log(lineChartArr);
    return lineChartArr; // an array of single data property values from all given timeline
  }

  // Return created data for cards based on provided data
  generateCardData(data: LatestGlobalData): {
    data: StatCardData;
    colors: StatCardColors;
    iconUrl: string;
  }[] {
    return [
      {
        data: new StatCardData('Active', [
          { name: 'total', value: data.active },
          { name: 'new today', value: data.new_confirmed },
        ]),
        colors: new StatCardColors('#a0aec0', '#4a5568'),
        iconUrl: '../../assets/icons/hospital-solid.svg',
      },
      {
        data: new StatCardData('Deaths', [
          { name: 'total', value: data.deaths },
          { name: 'new today', value: data.new_deaths },
        ]),
        colors: new StatCardColors('#f56565', '#c53030'),
        iconUrl: '../../assets/icons/book-dead-solid.svg',
      },
      {
        data: new StatCardData('Recovered', [
          { name: 'total', value: this.data.recovered },
          { name: 'new today', value: this.data.new_recovered },
        ]),
        colors: new StatCardColors('#48bb78', '#276749'),
        iconUrl: '../../assets/icons/heart-solid.svg',
      },
    ];
  }

  getChartData(days: number, data: LatestGlobalData[]) {
    let daysOfData = [];
    for (let i = 0; i < days; i++) {
      daysOfData.push(data[i]);
    }
    return daysOfData;
  }
}
