import { Component, OnInit } from '@angular/core';
import { FormControl } from '@angular/forms';
import { ActivatedRoute, Router } from '@angular/router';
import { Observable } from 'rxjs';
import { switchMap, startWith, map } from 'rxjs/operators';
import {
  StatCardColors,
  StatCardData,
} from 'src/app/shared/models/stat-card.model';
import { CountryData } from 'src/app/shared/models/country-data.model';
import { TimelineData } from 'src/app/shared/models/timeline-data.model';
import { StatService } from 'src/app/shared/stat.service';
import { EChartsOption } from 'echarts';
import { DatePipe } from '@angular/common';

@Component({
  selector: 'app-country',
  templateUrl: './country.component.html',
  styleUrls: ['./country.component.scss'],
})
export class CountryComponent implements OnInit {
  isLoading = true;
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

  constructor(
    private route: ActivatedRoute,
    private statService: StatService,
    private router: Router,
    private datePipe: DatePipe
  ) {}

  ngOnInit(): void {
    this.route.params
      .pipe(
        switchMap((params) => {
          this.isLoading = true;
          const code = params.code;
          return this.statService.getCountryData(code);
        })
      )
      .subscribe((countryData) => {
        this.countryData = countryData;
        this.timelineData = countryData.timeline;
        this.isLoading = false;
        this.statCards = this.generateCardData();
        this.countryControl.setValue(this.countryData.name); // Set the value for country picker
        this.generateChartOptions();
      });
    // Get the list of countries with codes to renavigate to different country
    this.statService.getCountryCodes().subscribe((data) => {
      this.countryList = data;

      // TODO: switchMap or something, this looks like bad practice
      this.filteredOptions = this.countryControl.valueChanges.pipe(
        startWith(''),
        map((value) => this._filter(value))
      );
    });
  }

  // creates options for chart
  generateChartOptions() {
    // Line chart
    this.lineChartOption = {
      xAxis: {
        type: 'category',
        data: this._timelineOnChart(), // dates from timeline data
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
          data: this._caseArrayTimeline('confirmed'),
          type: 'line',
          stack: 'x',
          areaStyle: {},
          smooth: true,
          color: this.statCards[0].colors.primary,
        },
        {
          name: 'Deaths',
          data: this._caseArrayTimeline('deaths'),
          type: 'line',
          areaStyle: {},
          smooth: true,
          color: this.statCards[1].colors.primary,
        },
        {
          name: 'Recovered',
          data: this._caseArrayTimeline('recovered'),
          type: 'line',
          areaStyle: {},
          smooth: true,
          color: this.statCards[2].colors.primary,
        },
      ],
    };

    this.barChartOption = {
      xAxis: {
        data: this._timelineOnChart(),
      },
      yAxis: {},
      series: [
        {
          name: 'Confirmed',
          data: this._caseArrayTimeline('new_confirmed'),
          type: 'bar',
          color: this.statCards[0].colors.primary,
        },
        {
          name: 'Deaths',
          data: this._caseArrayTimeline('new_deaths'),
          type: 'bar',
          color: this.statCards[1].colors.primary,
        },
        {
          name: 'Recovered',
          data: this._caseArrayTimeline('new_recovered'),
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
  // TODO: Make all this reusable. It is repeated in general component
  // generate an array from values of specified property on timeline data
  private _caseArrayTimeline(property: string) {
    const caseArray = [];
    for (let item of this.timelineData) {
      caseArray.unshift(item[property]); // Reversed, from oldest to newest needed
    }
    return caseArray;
  }

  // Generate array of date strings to display on chart's X axis
  private _timelineOnChart(): string[] {
    const timelineArr = [];
    for (let item of this.timelineData) {
      timelineArr.unshift(this.datePipe.transform(item.updated_at)); // Reversed so that it's from oldest to newest
    }
    return timelineArr;
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
            value: this._avoidZero(
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
            value: this._avoidZero(
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

  // This is what I have to do to work around this STUPID, DUMBFOUNDED, ABSOULUTELIY ATROCIUS, INCONSSISTENT API
  // Takes in numbers and returns whichever is not zero. IF THEY ARE ALL GOD DAMN ZERO THEN IT RETURNS ZERO.
  private _avoidZero(...args: number[]) {
    let nonZeroVal = 0;
    for (let value of args) {
      if (value !== 0) nonZeroVal = value;
    }
    return nonZeroVal;
  }
}
