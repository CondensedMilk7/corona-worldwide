import { Component, OnInit } from '@angular/core';
import { EChartsOption } from 'echarts';
import { TimelineData } from '../shared/models/timeline-data.model';
import { StatService } from '../shared/stat.service';
import { StatCardData, StatCardColors } from './stat-card/stat-card.model';

@Component({
  selector: 'app-general',
  templateUrl: './general.component.html',
  styleUrls: ['./general.component.scss'],
})
export class GeneralComponent implements OnInit {
  isLoading = true;
  isError = false;

  data: TimelineData = {
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

  chartData: TimelineData[] = [];
  totalDays = 10;
  daysOnChart = this.listDays(this.totalDays);

  // iterable list of data for each card (in case I need to add more cards)
  cardsList: {
    data: StatCardData;
    colors: StatCardColors;
    iconUrl: string;
  }[] = [];

  chartOption: EChartsOption = {};

  constructor(private statService: StatService) {}

  ngOnInit(): void {
    this.isLoading = true;
    this.statService.getLatestGlobal().subscribe(
      (data) => {
        this.data = data[0];
        this.cardsList = this.generateCardData(this.data);
        this.chartData = this.getChartData(this.totalDays, data);
        this.generateChartOptions();

        this.isLoading = false;
        this.isError = false;
      },
      (error) => {
        this.isError = true;
        console.log(error);
      }
    );
  }

  // returns an array of numbers from 1 up to specified argument
  // needed to list out days on chart
  listDays(days: number) {
    const daysList = [];
    for (let i = 1; i < days + 1; i++) {
      daysList.push(i);
    }
    return daysList;
  }

  // creates options for chart
  generateChartOptions() {
    this.chartOption = {
      xAxis: {
        type: 'category',
        data: [...this.daysOnChart.slice(0, -1).reverse(), 'today'], // to exclude last day
      },
      yAxis: {
        type: 'value',
      },
      legend: {
        orient: 'horizontal',
        top: 'bottom',
        data: ['New Confirmed', 'Deaths', 'Recovered'],
        icon: 'rect',
      },
      series: [
        {
          name: 'New Confirmed',
          data: this.chartSeriesArr('new_confirmed'),
          type: 'line',
          stack: 'x',
          areaStyle: {},
          smooth: true,
          color: this.cardsList[0].colors.primary,
        },
        {
          name: 'Deaths',
          data: this.chartSeriesArr('new_deaths'),
          type: 'line',
          areaStyle: {},
          smooth: true,
          color: this.cardsList[1].colors.primary,
        },
        {
          name: 'Recovered',
          data: this.chartSeriesArr('new_recovered'),
          type: 'line',
          areaStyle: {},
          smooth: true,
          color: this.cardsList[2].colors.primary,
        },
      ],
    };
  }

  // Returns an array of chartData's elements property values throughout entire timeline, to be displayed as a line on chart
  chartSeriesArr(property: 'new_confirmed' | 'new_deaths' | 'new_recovered') {
    let lineChartArr = [];
    for (let data of this.chartData) {
      lineChartArr.push(data[property]);
    }
    // an array of single data property values from all given timeline
    // Reversed because the newest is first by default
    return lineChartArr.reverse();
  }

  // Return created data for cards based on provided data
  generateCardData(data: TimelineData): {
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
          { name: 'total', value: data.recovered },
          { name: 'new today', value: data.new_recovered },
        ]),
        colors: new StatCardColors('#48bb78', '#276749'),
        iconUrl: '../../assets/icons/heart-solid.svg',
      },
    ];
  }

  // extract timeline from data for given amount of days
  getChartData(days: number, data: TimelineData[]) {
    let daysOfData = [];
    for (let i = 0; i < days; i++) {
      daysOfData.push(data[i]);
    }
    return daysOfData;
  }
}
