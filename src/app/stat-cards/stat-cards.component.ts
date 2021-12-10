import { Component, Input, OnChanges, OnInit } from '@angular/core';
import { StatCardColors, StatCardData } from '../shared/models/stat-card.model';
import { TimelineData } from '../shared/models/timeline-data.model';

@Component({
  selector: 'app-stat-cards',
  templateUrl: './stat-cards.component.html',
  styleUrls: ['./stat-cards.component.scss'],
})
export class StatCardsComponent implements OnInit, OnChanges {
  @Input() data: TimelineData[];
  // iterable list of data for each card (in case I need to add more cards)
  cardsList: {
    data: StatCardData;
    colors: StatCardColors;
    iconUrl: string;
  }[] = [];

  isLoading = false;

  constructor() {}

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
}
