import { createReducer, on } from '@ngrx/store';
import {
  CoronaApiActions,
  CountriesListPageActions,
  CountryPageActions,
  GeneralPageActions,
} from '../actions/index';
import { AppState } from '../states/';

const initialState: AppState = {
  isLoading: false,
  timeline: null,
  countryList: [],
  currentCountry: null,
  selectedDate: 'all',
  errorMessage: '',
};

export const appReducer = createReducer(
  initialState,

  on(GeneralPageActions.loadPage, (state) => ({ ...state, isLoading: true })),
  on(GeneralPageActions.selectDate, (state, { date }) => ({
    ...state,
    selectedDate: date,
  })),
  on(CoronaApiActions.getTimelineSuccess, (state, { data }) => ({
    ...state,
    timeline: data,
    isLoading: false,
  })),
  on(CoronaApiActions.getTimelineFail, (state, { message }) => ({
    ...state,
    errorMessage: message,
  }))
);