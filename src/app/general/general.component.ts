import { Component, OnInit } from '@angular/core';
import { EChartsOption } from 'echarts';
import { TimelineData } from '../shared/models/timeline-data.model';
import { StatService } from '../shared/stat.service';
import { StatCardData, StatCardColors } from '../shared/models/stat-card.model';
import { DatePipe } from '@angular/common';

@Component({
  selector: 'app-general',
  templateUrl: './general.component.html',
  styleUrls: ['./general.component.scss'],
})
export class GeneralComponent implements OnInit {
  isLoading = true;
  isError = false;

  data: TimelineData[] = [];

  // iterable list of data for each card (in case I need to add more cards)
  cardsList: {
    data: StatCardData;
    colors: StatCardColors;
    iconUrl: string;
  }[] = [];

  chartOption: EChartsOption = {};

  constructor(private statService: StatService, private datePipe: DatePipe) {}

  ngOnInit(): void {
    this.statService.getGlobal().subscribe((data) => {
      this.data = data;
      this.isLoading = false;
      this.cardsList = this.generateCardData();
      this.generateChartOptions();
    });
  }
  // creates options for chart
  generateChartOptions() {
    this.chartOption = {
      xAxis: {
        type: 'category',
        data: this._timelineOnChart(), // to exclude last day
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
          data: this._caseArrayTimeline('confirmed'),
          type: 'line',
          stack: 'x',
          areaStyle: {},
          smooth: true,
          color: this.cardsList[0].colors.primary,
        },
        {
          name: 'Deaths',
          data: this._caseArrayTimeline('deaths'),
          type: 'line',
          areaStyle: {},
          smooth: true,
          color: this.cardsList[1].colors.primary,
        },
        {
          name: 'Recovered',
          data: this._caseArrayTimeline('recovered'),
          type: 'line',
          areaStyle: {},
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

  private _caseArrayTimeline(property: string) {
    const caseArray = [];
    for (let item of this.data) {
      caseArray.unshift(item[property]); // Reversed, from oldest to newest needed
    }
    return caseArray;
  }

  // Generate array of date strings to display on chart's X axis
  private _timelineOnChart(): string[] {
    const timelineArr = [];
    for (let item of this.data) {
      timelineArr.unshift(this.datePipe.transform(item.updated_at)); // Reversed so that it's from oldest to newest
    }
    return timelineArr;
  }
}
