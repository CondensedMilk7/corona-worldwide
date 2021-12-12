import { createReducer, on } from '@ngrx/store';
import {
  CoronaApiActions,
  GeneralPageActions,
} from '../actions/index';
import { AppState } from '../states/';

const initialState: AppState = {
  isLoading: false,
  timeline: null,
  countryList: [],
  currentCountry: null,
  selectedDate: 'all',
  selectedCountryDate: 'all',
  error: null,
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
  })),
  on(CoronaApiActions.getCountryNamesSuccess, (state, {nameCodeList}) => ({...state, countryList: nameCodeList}))
);
