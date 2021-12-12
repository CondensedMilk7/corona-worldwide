import { createAction, props } from '@ngrx/store';
import { CountryData } from 'src/app/shared/models/country-data.model';

export const loadPage = createAction('[Country Page] Load Page');

export const selectCountry = createAction(
  '[Country Page] Select Country',
  props<{ countryData: CountryData }>(),
);

export const selectDate = createAction(
  '[Country Page] Select Date',
  props<{ date: any }>(),
);
