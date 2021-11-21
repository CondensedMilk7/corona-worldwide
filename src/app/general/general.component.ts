import { Component, OnInit } from '@angular/core';
import { EChartsOption } from 'echarts';
import { TimelineData } from '../shared/models/timeline-data.model';
import { StatService } from '../shared/services/stat.service';
import { StatCardData, StatCardColors } from '../shared/models/stat-card.model';
import { DatePipe } from '@angular/common';
import { UtilService } from '../shared/services/util.service';
import { MatSnackBar } from '@angular/material/snack-bar';

@Component({
  selector: 'app-general',
  templateUrl: './general.component.html',
  styleUrls: ['./general.component.scss'],
})
export class GeneralComponent implements OnInit {
  isLoading = true;
  isError = false;

  data: TimelineData[] = [];
  updatedAt = '';

  // iterable list of data for each card (in case I need to add more cards)
  cardsList: {
    data: StatCardData;
    colors: StatCardColors;
    iconUrl: string;
  }[] = [];

  chartOption: EChartsOption = {};
  dateOptions: Set<string>;
  selectedDateData: TimelineData[];
  customChartOption: EChartsOption = {};

  constructor(
    private statService: StatService,
    private datePipe: DatePipe,
    private utilService: UtilService,
    private _snackBar: MatSnackBar
  ) {}

  ngOnInit(): void {
    this.statService.getGlobal().subscribe(
      (data) => {
        this.data = data;
        this.updatedAt = this.data[0].updated_at;
        this.isLoading = false;
        this.cardsList = this.generateCardData();
        this.generateChartOptions();
        this.generateDateOptions();
      },
      (error) => {
        this.isError = true;
        console.log(error);
        this.openSnackBar('An error has occured: ' + error.message, 'Dismiss');
      }
    );
  }

  openSnackBar(message: string, action?: string) {
    this._snackBar.open(message, action);
  }

  onDatePicked(date: string) {
    if (date === 'all') {
      this.customChartOption = this.chartOption;
    } else {
      const month = date.split(' ')[0];
      const year = date.split(' ')[1];
      const selectedDateData = this.data.filter((item) => {
        const itemDate = this.datePipe.transform(item.updated_at);
        return itemDate.includes(month) && itemDate.includes(year);
      });
      this.selectedDateData = selectedDateData;

      this.customChartOption = {
        xAxis: {
          data: this.utilService.timelineOnChart(this.selectedDateData),
        },
        legend: {
          data: ['Confirmed', 'Deaths', 'Recovered'],
        },
        series: [
          {
            name: 'Confirmed',
            data: this.utilService.caseArrayTimeline(
              'new_confirmed',
              this.selectedDateData
            ),
          },
          {
            name: 'Deaths',
            data: this.utilService.caseArrayTimeline(
              'new_deaths',
              this.selectedDateData
            ),
          },
          {
            name: 'Recovered',
            data: this.utilService.caseArrayTimeline(
              'new_recovered',
              this.selectedDateData
            ),
          },
        ],
      };
    }
  }

  // creates options for chart
  generateChartOptions() {
    this.chartOption = {
      xAxis: {
        type: 'category',
        data: this.utilService.timelineOnChart(this.data),
      },
      yAxis: {
        type: 'value',
      },
      legend: {
        orient: 'horizontal',
        top: 'bottom',
        data: ['Active', 'Deaths', 'Recovered'],
        icon: 'rect',
      },
      series: [
        {
          name: 'Active',
          data: this.utilService.caseArrayTimeline('active', this.data),
          type: 'line',
          stack: 'x',
          areaStyle: {},
          smooth: true,
          color: this.cardsList[0].colors.primary,
        },
        {
          name: 'Deaths',
          data: this.utilService.caseArrayTimeline('deaths', this.data),
          type: 'line',
          areaStyle: {},
          smooth: true,
          color: this.cardsList[1].colors.primary,
        },
        {
          name: 'Recovered',
          data: this.utilService.caseArrayTimeline('recovered', this.data),
          type: 'line',
          // areaStyle: {}, // Without this it looks exactly like the dashboard of api page
          smooth: true,
          color: this.cardsList[2].colors.primary,
        },
      ],
    };
  }

  // Return created data for cards based on provided data
  generateCardData(): {
    data: StatCardData;
    colors: StatCardColors;
    iconUrl: string;
  }[] {
    return [
      {
        data: new StatCardData('Active', [
          { name: 'total', value: this.data[0].active },
          { name: 'new today', value: this.data[0].new_confirmed },
        ]),
        colors: new StatCardColors('#a0aec0', '#4a5568'),
        iconUrl: '../../assets/icons/hospital-solid.svg',
      },
      {
        data: new StatCardData('Deaths', [
          { name: 'total', value: this.data[0].deaths },
          { name: 'new today', value: this.data[0].new_deaths },
        ]),
        colors: new StatCardColors('#f56565', '#c53030'),
        iconUrl: '../../assets/icons/book-dead-solid.svg',
      },
      {
        data: new StatCardData('Recovered', [
          { name: 'total', value: this.data[0].recovered },
          { name: 'new today', value: this.data[0].new_recovered },
        ]),
        colors: new StatCardColors('#48bb78', '#276749'),
        iconUrl: '../../assets/icons/heart-solid.svg',
      },
    ];
  }

  // Generates list of dates that can be picked on the chart to display data for that date
  // A single date consists of a month and year, ex. "Nov 2021".
  generateDateOptions() {
    const dateList = new Set<string>();
    for (let item of this.data) {
      const date = this.datePipe.transform(item.updated_at).split(' ');
      const monthAndYear = date[0] + ' ' + date[2];
      dateList.add(monthAndYear);
    }
    this.dateOptions = dateList;
  }
}
