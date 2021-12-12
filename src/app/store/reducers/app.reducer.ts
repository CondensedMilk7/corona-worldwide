import { createReducer, on } from '@ngrx/store';
import {
  AppActions,
  CoronaApiActions,
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
  selectedCountryDate: 'all',
  error: null,
  countryData: null,
  darkMode: false
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
  on(CoronaApiActions.getCountryNamesSuccess, (state, { nameCodeList }) => ({
    ...state,
    countryList: nameCodeList,
  })),
  on(CountryPageActions.selectCountry, (state, { countryData }) => ({
    ...state,
    countryData: countryData,
  })),
  on(AppActions.switchDarkMode, (state, { darkMode }) => ({...state, darkMode: darkMode}))
);
