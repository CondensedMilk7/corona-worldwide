import { Component, Input, OnInit } from '@angular/core';
import { StatCardData, StatCardColors } from '../../shared/models/stat-card.model';

@Component({
  selector: 'app-stat-card',
  templateUrl: './stat-card.component.html',
  styleUrls: ['./stat-card.component.scss'],
})
export class StatCardComponent implements OnInit {
  @Input() data = new StatCardData('', [{ name: '', value: 0 }]);
  @Input() colors = new StatCardColors('', '');
  @Input() iconUrl: string = '';

  constructor() {}

  ngOnInit(): void {}
}
