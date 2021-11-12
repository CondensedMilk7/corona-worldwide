import { Component, OnInit } from '@angular/core';
import { LatestGlobalData } from '../shared/models/timeline-data.model';
import { StatService } from '../shared/stat.service';
import { StatCard, StatCardColors } from './stat-card/stat-card.model';

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

  // TODO: consider making StatCard a class and instanciate it.
  deathsCard: StatCard = {
    title: 'Deaths',
    stats: [
      { name: 'total', value: this.data.deaths },
      { name: 'today', value: this.data.new_deaths },
    ],
  };

  activeCard: StatCard = {
    title: 'Active',
    stats: [{ name: 'total', value: this.data.deaths }],
  };

  constructor(private statService: StatService) {}

  ngOnInit(): void {
    this.statService.getLatestGlobal().subscribe((data) => {
      this.data = data;
      console.log(this.data);
    });
  }
}
