import { Component, Input, OnInit } from '@angular/core';
import { StatCard, StatCardColors } from './stat-card.model';

@Component({
  selector: 'app-stat-card',
  templateUrl: './stat-card.component.html',
  styleUrls: ['./stat-card.component.scss'],
})
export class StatCardComponent implements OnInit {
  @Input() data: StatCard = { title: '', stats: [{ name: '', value: 0 }] };
  @Input() colors: StatCardColors = { primary: '', accent: '' };
  @Input() iconUrl: string = '';

  constructor() {}

  ngOnInit(): void {}
}
