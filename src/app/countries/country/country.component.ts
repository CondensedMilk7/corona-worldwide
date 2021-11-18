import { Component, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { switchMap } from 'rxjs/operators';
import {
  StatCardColors,
  StatCardData,
} from 'src/app/general/stat-card/stat-card.model';
import { CountryData } from 'src/app/shared/models/country-data.model';
import { TimelineData } from 'src/app/shared/models/timeline-data.model';
import { StatService } from 'src/app/shared/stat.service';

@Component({
  selector: 'app-country',
  templateUrl: './country.component.html',
  styleUrls: ['./country.component.scss'],
})
export class CountryComponent implements OnInit {
  isLoading = true;
  countryData: CountryData;

  statCards: {
    data: StatCardData;
    colors: StatCardColors;
    iconUrl: string;
  }[];

  constructor(
    private route: ActivatedRoute,
    private statService: StatService
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
      .subscribe((countryData) => {
        this.countryData = countryData;
        this.isLoading = false;
        console.log(this.countryData);
        this.statCards = this.generateCardData();
      });
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
            value: this.avoidZero(
              this.countryData.today.confirmed,
              this.countryData.timeline[0].new_confirmed
            ),
          },
          {
            name: 'case per million',
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
            value: this.avoidZero(
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
  avoidZero(...args: number[]) {
    let nonZeroVal = 0;
    for (let value of args) {
      if (value !== 0) nonZeroVal = value;
    }
    return nonZeroVal;
  }
}
