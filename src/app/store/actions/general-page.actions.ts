import { createAction, props } from '@ngrx/store';

export const loadPage = createAction('[General Page] Load Page');
export const selectDate = createAction(
  '[General Page] Select Date',
  props<{ date: string }>(),
);
