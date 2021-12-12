import { Component, Input } from '@angular/core';
import {
  StatCardData,
  StatCardColors,
} from '../../shared/models/stat-card.model';

@Component({
  selector: 'app-stat-card',
  templateUrl: './stat-card.component.html',
  styleUrls: ['./stat-card.component.scss'],
})
export class StatCardComponent {
  @Input() data = new StatCardData('', [{ name: '', value: 0 }]);
  @Input() colors = new StatCardColors('', '');
  @Input() iconUrl = '';
  @Input() loading = false;

  constructor() {}
}
