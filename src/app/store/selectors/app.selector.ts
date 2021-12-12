import { createSelector, createFeatureSelector } from '@ngrx/store';
import { AppState } from '../states';
import { selectRouteParams } from './router.selector';

export const appSelector = createFeatureSelector<AppState>('app');

export const getTimelineAtDate = createSelector(
  appSelector,
  selectRouteParams,
  (state, { date }) => {
    if (!date) {
      return null;
    }
    if (date === 'all') {
      return state.timeline;
    } else {
      const year = date.split('-')[0];
      const month = date.split('-')[1];
      const yearAndMonthTarget = month + '-' + year;
      const selectedDateData = state.timeline?.filter((item) => {
        const itemDate = item.date;
        return itemDate.includes(yearAndMonthTarget);
      });
      return selectedDateData;
    }
  }
);

export const getTimeline = createSelector(
  appSelector,
  (state) => state.timeline
);

export const getIsLoading = createSelector(
  appSelector,
  (state) => state.isLoading
);

export const getCountriesList = createSelector(
  appSelector,
  (state) => state.countryList
);
