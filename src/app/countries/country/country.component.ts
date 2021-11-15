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
            value: this.countryData.timeline[0].new_confirmed,
          },
        ]),
        colors: new StatCardColors('#a0aec0', '#4a5568'),
        iconUrl: '../../assets/icons/hospital-solid.svg',
      },
      {
        data: new StatCardData('Deaths', [
          { name: 'total', value: this.countryData.latest_data.deaths },
          { name: 'new today', value: this.countryData.timeline[0].new_deaths },
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
        ]),
        colors: new StatCardColors('#48bb78', '#276749'),
        iconUrl: '../../assets/icons/heart-solid.svg',
      },
    ];
  }
}
