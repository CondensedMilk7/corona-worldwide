import { createAction, props } from '@ngrx/store';
import { CountryData } from '../../shared/models/country-data.model';
import { CountryNameCode } from '../../shared/models/country-name-code';
import { TimelineData } from '../../shared/models/timeline-data.model';

export const getTimelineSuccess = createAction(
  '[Corona API] Get Global Timeline Data Successfuly',
  props<{ data: TimelineData[] }>(),
);
export const getTimelineFail = createAction(
  '[Corona API] Get Global Timeline Data Failed',
  props<{ message: string }>(),
);

export const getCountryNamesSuccess = createAction(
  '[Corona API] Get Country Names Successfully',
  props<{ nameCodeList: CountryNameCode[] }>(),
);

export const getCountryNamesFail = createAction(
  '[Corona API] Get Country Names Failed',
  props<{ message: string }>(),
);

export const getCountryDataSuccess = createAction(
  '[Corona API] Get Country Data Successfully',
  props<{ data: CountryData }>(),
);

export const getCountryDataFail = createAction(
  '[Corona API] Get Country Data Failed',
  props<{ message: string }>(),
);
