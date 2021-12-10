import { createAction, props } from '@ngrx/store';
import { CountryNameCode } from 'src/app/shared/models/country-name-code';

export const loadPage = createAction('[Country Page] Load Page');

export const selectCountry = createAction(
  '[Country Page] Select Country',
  props<{ nameAndCode: CountryNameCode }>()
);

export const selectDate = createAction(
  '[Country Page] Select Date',
  props<{ date: any }>()
);
