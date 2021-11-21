import { Component, OnDestroy, OnInit } from '@angular/core';
import { FormControl } from '@angular/forms';
import { ActivatedRoute, Router } from '@angular/router';
import { Observable, Subscription } from 'rxjs';
import { switchMap, startWith, map } from 'rxjs/operators';
import {
  StatCardColors,
  StatCardData,
} from 'src/app/shared/models/stat-card.model';
import { CountryData } from 'src/app/shared/models/country-data.model';
import { TimelineData } from 'src/app/shared/models/timeline-data.model';
import { StatService } from 'src/app/shared/services/stat.service';
import { EChartsOption } from 'echarts';
import { DatePipe } from '@angular/common';
import { UtilService } from 'src/app/shared/services/util.service';
import { MatSnackBar } from '@angular/material/snack-bar';
import { ThemeService } from 'src/app/shared/services/theme.service';

@Component({
  selector: 'app-country',
  templateUrl: './country.component.html',
  styleUrls: ['./country.component.scss'],
})
export class CountryComponent implements OnInit, OnDestroy {
  isLoading = true;
  isError = false;
  // Listing this all out to prevent errors in console: cannot read countryData.name in the template!
  countryData: CountryData = {
    name: '',
    coordinates: {
      latitude: 0,
      longitude: 0,
    },
    code: '',
    population: 0,
    updated_at: '',
    today: {
      deaths: 0,
      confirmed: 0,
    },
    latest_data: {
      calculated: {
        death_rate: 0,
        recovery_rate: 0,
        recovered_vs_death_ratio: null,
        cases_per_million_population: 0,
      },
      deaths: 0,
      confirmed: 0,
      recovered: 0,
      critical: 0,
    },
    timeline: [],
  };

  timelineData: TimelineData[]; // extracted from country data for the sake of readability

  countryList: { name: string; code: string }[];
  countryControl = new FormControl();
  filteredOptions: Observable<{ name: string; code: string }[]>;

  statCards: {
    data: StatCardData;
    colors: StatCardColors;
    iconUrl: string;
  }[];

  lineChartOption: EChartsOption;
  barChartOption: EChartsOption;
  customLineChartOption: EChartsOption;
  customBarChartOption: EChartsOption;
  chartTheme = '';
  chartThemeSub = new Subscription();

  constructor(
    private route: ActivatedRoute,
    private statService: StatService,
    private router: Router,
    private datePipe: DatePipe,
    private utilService: UtilService,
    private _snackBar: MatSnackBar,
    private themeService: ThemeService
  ) {}

  ngOnInit(): void {
    this.isLoading = true;
    this.route.params
      .pipe(
        switchMap((params) => {
          const code = params.code;
          return this.statService.getCountryData(code);
        })
      )
      .subscribe(
        (countryData) => {
          this.countryData = countryData;
          this.timelineData = countryData.timeline;
          this.statCards = this.generateCardData();
          this.countryControl.setValue(this.countryData.name); // Set the value for country picker
          this.generateChartOptions();
          this.isLoading = false;
        },
        (error) => {
          this.isLoading = false;
          this.isError = true;
          console.log(error);
          this._snackBar.open(
            'An error has occured!: ' + error.message,
            'Dismiss'
          );
        }
      );
    // Get the list of countries with codes to renavigate to different country
    this.statService.getCountryCodes().subscribe((data) => {
      this.countryList = data;

      // TODO: switchMap or something, this looks like bad practice
      this.filteredOptions = this.countryControl.valueChanges.pipe(
        startWith(''),
        map((value) => this._filter(value))
      );
    });

    // Set chart theme
    const isDark = localStorage.getItem('isDark');
    if (isDark === 'true') this.chartTheme = 'dark';

    // Listen for theme change
    this.chartThemeSub = this.themeService.darkTheme.subscribe((isDark) => {
      if (isDark) {
        this.chartTheme = 'dark';
      } else {
        this.chartTheme = '';
      }
    });
  }

  onDatePicked(date: string) {
    if (date === 'all') {
      this.customLineChartOption = this.lineChartOption;
      this.customBarChartOption = this.barChartOption;
    } else {
      const months = this._getLast3Months();
      const data = this.countryData.timeline.filter((item) => {
        const itemDate = this.datePipe.transform(item.updated_at);
        const dateSplit = itemDate.split(' ');
        const monthAndYear = dateSplit[0] + ' ' + dateSplit[2];
        return (
          monthAndYear.includes(months[0]) ||
          monthAndYear.includes(months[1]) ||
          monthAndYear.includes(months[2])
        );
      });
      this.customLineChartOption = {
        xAxis: {
          data: this.utilService.timelineOnChart(data),
        },
        series: [
          { data: this.utilService.caseArrayTimeline('confirmed', data) },
          { data: this.utilService.caseArrayTimeline('deaths', data) },
          { data: this.utilService.caseArrayTimeline('recovered', data) },
        ],
      };
      this.customBarChartOption = {
        xAxis: {
          data: this.utilService.timelineOnChart(data),
        },
        series: [
          { data: this.utilService.caseArrayTimeline('new_confirmed', data) },
          { data: this.utilService.caseArrayTimeline('new_deaths', data) },
          { data: this.utilService.caseArrayTimeline('new_recovered', data) },
        ],
      };
    }
  }

  // creates options for chart
  generateChartOptions() {
    // Line chart
    this.lineChartOption = {
      xAxis: {
        type: 'category',
        data: this.utilService.timelineOnChart(this.timelineData), // dates from timeline data
      },
      yAxis: {
        type: 'value',
      },
      legend: {
        orient: 'horizontal',
        top: 'bottom',
        data: ['Confirmed', 'Deaths', 'Recovered'],
        icon: 'rect',
      },
      series: [
        {
          name: 'Confirmed',
          data: this.utilService.caseArrayTimeline(
            'confirmed',
            this.timelineData
          ),
          type: 'line',
          stack: 'x',
          areaStyle: {},
          smooth: true,
          color: this.statCards[0].colors.primary,
        },
        {
          name: 'Deaths',
          data: this.utilService.caseArrayTimeline('deaths', this.timelineData),
          type: 'line',
          areaStyle: {},
          smooth: true,
          color: this.statCards[1].colors.primary,
        },
        {
          name: 'Recovered',
          data: this.utilService.caseArrayTimeline(
            'recovered',
            this.timelineData
          ),
          type: 'line',
          areaStyle: {},
          smooth: true,
          color: this.statCards[2].colors.primary,
        },
      ],
    };

    this.barChartOption = {
      xAxis: {
        data: this.utilService.timelineOnChart(this.timelineData),
      },
      yAxis: {},
      series: [
        {
          name: 'Confirmed',
          data: this.utilService.caseArrayTimeline(
            'new_confirmed',
            this.timelineData
          ),
          type: 'bar',
          color: this.statCards[0].colors.primary,
        },
        {
          name: 'Deaths',
          data: this.utilService.caseArrayTimeline(
            'new_deaths',
            this.timelineData
          ),
          type: 'bar',
          color: this.statCards[1].colors.primary,
        },
        {
          name: 'Recovered',
          data: this.utilService.caseArrayTimeline(
            'new_recovered',
            this.timelineData
          ),
          type: 'bar',
          color: this.statCards[2].colors.primary,
        },
      ],
      legend: {
        orient: 'horizontal',
        top: 'bottom',
        data: ['Confirmed', 'Deaths', 'Recovered'],
        icon: 'rect',
      },
    };
  }

  private _getLast3Months() {
    const monthNames = [
      'January',
      'February',
      'March',
      'April',
      'May',
      'June',
      'July',
      'August',
      'September',
      'October',
      'November',
      'December',
    ];

    const today = new Date();
    const last3Months = [];

    for (let i = 0; i < 3; i++) {
      let dateTransformed =
        monthNames[today.getMonth() - i].substring(0, 3) + // So that it matches the datePipe format
        ' ' +
        today.getFullYear();
      last3Months.push(dateTransformed);
    }
    return last3Months;
  }

  onChangeCountry(country: { name: string; code: string }) {
    this.router.navigate([`/countries/${country.code}/${country.name}`]);
  }

  // filter out country selector options based on input value
  private _filter(value: string): { name: string; code: string }[] {
    const filterValue = value.toLowerCase();

    return this.countryList.filter((option) =>
      option.name.toLowerCase().includes(filterValue)
    );
  }

  generateCardData(): {
    data: StatCardData;
    colors: StatCardColors;
    iconUrl: string;
  }[] {
    return [
      {
        data: new StatCardData('Active', [
          { name: 'total', value: this.countryData.timeline[0].active },
          {
            name: 'new today',
            // value: this.countryData.timeline[0].new_confirmed,
            // value: this.countryData.today.confirmed,
            value: this.utilService.avoidZero(
              this.countryData.today.confirmed,
              this.countryData.timeline[0].new_confirmed
            ),
          },
          {
            name: 'per million',
            value:
              this.countryData.latest_data.calculated
                .cases_per_million_population /
                10000 +
              '%', // Why the hell does it not give percentage by default, like it says in the docs and like it is in other calculated fields?
            // I hate this API
          },
        ]),
        colors: new StatCardColors('#a0aec0', '#4a5568'),
        iconUrl: '../../assets/icons/hospital-solid.svg',
      },
      {
        data: new StatCardData('Deaths', [
          { name: 'total', value: this.countryData.latest_data.deaths },
          {
            name: 'new today',
            // value: this.countryData.timeline[0].new_deaths
            // value: this.countryData.today.deaths,
            value: this.utilService.avoidZero(
              this.countryData.timeline[0].new_deaths,
              this.countryData.today.deaths
            ),
          },
          {
            name: 'rate',
            value:
              Math.round(this.countryData.latest_data.calculated.death_rate) +
              '%',
          },
        ]),
        colors: new StatCardColors('#f56565', '#c53030'),
        iconUrl: '../../assets/icons/book-dead-solid.svg',
      },
      {
        data: new StatCardData('Recovered', [
          { name: 'total', value: this.countryData.latest_data.recovered },
          {
            name: 'new today',
            value: this.countryData.timeline[0].new_recovered,
          },
          {
            name: 'rate',
            value:
              Math.round(
                this.countryData.latest_data.calculated.recovery_rate
              ) + '%',
          },
        ]),
        colors: new StatCardColors('#48bb78', '#276749'),
        iconUrl: '../../assets/icons/heart-solid.svg',
      },
    ];
  }

  ngOnDestroy() {
    this.chartThemeSub.unsubscribe();
  }
}
