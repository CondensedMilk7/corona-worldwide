import { createAction, props } from '@ngrx/store';

export const switchDarkMode = createAction('[App] Switch dark mode', props<{darkMode: boolean }>());
