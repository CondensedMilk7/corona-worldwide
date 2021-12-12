import { Component, Input, OnChanges, OnInit } from '@angular/core';
import { CountryData } from '../shared/models/country-data.model';
import { StatCardColors, StatCardData } from '../shared/models/stat-card.model';
import { TimelineData } from '../shared/models/timeline-data.model';
import { UtilService } from '../shared/services/util.service';

@Component({
  selector: 'app-stat-cards',
  templateUrl: './stat-cards.component.html',
  styleUrls: ['./stat-cards.component.scss'],
})
export class StatCardsComponent implements OnInit, OnChanges {
  @Input() data: TimelineData[];
  @Input() countryData: CountryData;
  // iterable list of data for each card (in case I need to add more cards)
  cardsList: {
    data: StatCardData;
    colors: StatCardColors;
    iconUrl: string;
  }[] = [];

  isLoading = false;

  constructor(private utilService: UtilService) {}

  ngOnInit(): void {
    this.cardsList = this.generateCardData();
  }

  ngOnChanges() {
    this.cardsList = this.generateCardData();
  }

  // Return created data for cards based on provided data
  generateCardData(): {
    data: StatCardData;
    colors: StatCardColors;
    iconUrl: string;
  }[] {
    if (this.data) {
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
  } else {
    // If there's country data instead of timeline data, it should be displayed differently
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
              this.countryData.timeline[0].new_confirmed,
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
              this.countryData.today.deaths,
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
                this.countryData.latest_data.calculated.recovery_rate,
              ) + '%',
          },
        ]),
        colors: new StatCardColors('#48bb78', '#276749'),
        iconUrl: '../../assets/icons/heart-solid.svg',
      },
    ];
  }
}
}
