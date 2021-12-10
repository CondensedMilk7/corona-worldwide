import { Component, Input, OnChanges, OnInit } from '@angular/core';
import { EChartsOption } from 'echarts';
import { TimelineData } from '../shared/models/timeline-data.model';
import { UtilService } from '../shared/services/util.service';

@Component({
  selector: 'app-chart',
  templateUrl: './chart.component.html',
  styleUrls: ['./chart.component.scss'],
})
export class ChartComponent implements OnInit, OnChanges {
  @Input() data: TimelineData[] = [];

  @Input() isLoading = false;
  chartTheme = '';

  chartOption: EChartsOption = {};

  constructor(private utilService: UtilService) {}

  ngOnChanges() {
    this.chartOption = this.generateChartOptions();
  }

  ngOnInit(): void {
    this.chartOption = this.generateChartOptions();
  }

  generateChartOptions(): EChartsOption {
    return {
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
          color: '#a0aec0',
        },
        {
          name: 'Deaths',
          data: this.utilService.caseArrayTimeline('deaths', this.data),
          type: 'line',
          areaStyle: {},
          smooth: true,
          color: '#f56565',
        },
        {
          name: 'Recovered',
          data: this.utilService.caseArrayTimeline('recovered', this.data),
          type: 'line',
          // areaStyle: {}, // Without this it looks exactly like the dashboard of api page
          smooth: true,
          color: '#48bb78',
        },
      ],
    };
  }
}
