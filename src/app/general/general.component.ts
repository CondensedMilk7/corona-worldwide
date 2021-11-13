import { Component, OnInit } from '@angular/core';
import { LatestGlobalData } from '../shared/models/timeline-data.model';
import { StatService } from '../shared/stat.service';
import { StatCardData, StatCardColors } from './stat-card/stat-card.model';

@Component({
  selector: 'app-general',
  templateUrl: './general.component.html',
  styleUrls: ['./general.component.scss'],
})
export class GeneralComponent implements OnInit {
  data: LatestGlobalData = {
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

  // TODO: consider making StatCardData a class and instanciate it.

  // iterable list of data for each card (in case I need to add more cards)
  cardsList: {
    data: StatCardData;
    colors: StatCardColors;
    iconUrl: string;
  }[] = [];

  constructor(private statService: StatService) {}

  ngOnInit(): void {
    this.statService.getLatestGlobal().subscribe((data) => {
      this.data = data;
      console.log(this.data);
      this.cardsList = [
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
    });
  }
}
