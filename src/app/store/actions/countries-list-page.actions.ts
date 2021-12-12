import { createAction, props } from '@ngrx/store';
import { CountryNameCode } from 'src/app/shared/models/country-name-code';

export const loadPage = createAction('[Countries List Page] Load Page');

export const selectCountry = createAction(
  '[Countries List Page] Select Country',
  props<{ nameAndCode: CountryNameCode }>(),
);
