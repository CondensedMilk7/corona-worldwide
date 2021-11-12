import { Component, OnInit } from '@angular/core';
import { StatCard, StatCardColors } from './stat-card/stat-card.model';

@Component({
  selector: 'app-general',
  templateUrl: './general.component.html',
  styleUrls: ['./general.component.scss'],
})
export class GeneralComponent implements OnInit {
  death: StatCard = {
    title: 'Deaths',
    stats: [
      { name: 'total', value: 100 },
      { name: 'today', value: 24 },
    ],
  };
  deathIcon = '../../assets/icons/book-dead-solid.svg';
  colors: StatCardColors = { primary: '#f56565', accent: '#c53030' };

  constructor() {}

  ngOnInit(): void {}
}
