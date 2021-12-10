import { Component, OnDestroy, OnInit } from '@angular/core';

import { TimelineData } from '../shared/models/timeline-data.model';
import { UtilService } from '../shared/services/util.service';
import { MatSnackBar } from '@angular/material/snack-bar';
import { ThemeService } from '../shared/services/theme.service';
import { Subscription } from 'rxjs';
import { select, Store } from '@ngrx/store';
import { GeneralPageActions } from '../store/actions';
import { AppSelectors } from '../store/selectors';

@Component({
  selector: 'app-general',
  templateUrl: './general.component.html',
  styleUrls: ['./general.component.scss'],
})
export class GeneralComponent implements OnInit, OnDestroy {
  isLoading$ = this.store.select(AppSelectors.getIsLoading);
  isError = false;

  data: TimelineData[] = [];

  timeline$ = this.store.pipe(select(AppSelectors.getTimelineAtDate));

  dateOptions: { monthAndYear: string; date: string }[];

  chartTheme = '';
  chartThemeSub = new Subscription();

  constructor(
    private utilService: UtilService,
    private _snackBar: MatSnackBar, // For error messages, rework with ngrx needed
    private themeService: ThemeService,
    private store: Store
  ) {}

  ngOnInit(): void {
    this.store.dispatch(GeneralPageActions.loadPage());
    this.store.pipe(select(AppSelectors.getTimeline)).subscribe((data) => {
      if (!data) {
        return;
      }
      this.data = data;
      this.dateOptions = this.utilService.generateDateOptions(data);
    });

    ///////////////////////////////////////////////////////////////////////////////////////////
    // TODO: NGRX THAT BITCH
    // Set chart theme
    const isDark = localStorage.getItem('isDark');
    if (isDark === 'true') this.chartTheme = 'dark';

    // Listen for them change
    this.chartThemeSub = this.themeService.darkTheme.subscribe((isDark) => {
      if (isDark) {
        this.chartTheme = 'dark';
      } else {  
        this.chartTheme = '';
      }
    });

    ////////////////////////////////////////////////////////////////////////////////////////////
  }

  onDatePicked(date: string) {
    this.store.dispatch(GeneralPageActions.selectDate({ date }));
  }

  ngOnDestroy() {
    this.chartThemeSub.unsubscribe();
  }
}
