import { createSelector, createFeatureSelector } from '@ngrx/store';
import { AppState } from '../states';
import { DatePipe } from '@angular/common';

export const appSelector = createFeatureSelector<AppState>('app');

export const getTimelineAtDate = createSelector(appSelector, (state) => {
  if (state.selectedDate === 'all') {
    return state.timeline;
  } else {
    const year = state.selectedDate.split('-')[0];
    const month = state.selectedDate.split('-')[1];
    const monthAndYearTarget = year + '-' + month;
    const selectedDateData = state.timeline?.filter((item) => {
      const itemDate = item.date;
      return itemDate.includes(monthAndYearTarget);
    });
    return selectedDateData;
  }
});

export const getTimeline = createSelector(
  appSelector,
  (state) => state.timeline
);

export const getIsLoading = createSelector(
  appSelector,
  (state) => state.isLoading
);
