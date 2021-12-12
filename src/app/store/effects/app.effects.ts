import { Injectable } from '@angular/core';
import { MatSnackBar } from '@angular/material/snack-bar';
import { Actions, createEffect, ofType } from '@ngrx/effects';
import { Store } from '@ngrx/store';
import { catchError, concatMap, map } from 'rxjs/operators';
import { StatService } from 'src/app/shared/services/stat.service';
import {
  CoronaApiActions,
  CountriesListPageActions,
  GeneralPageActions,
} from '../actions';

@Injectable({ providedIn: 'root' })
export class AppEffects {
  loadTimeline$ = createEffect(() =>
    this.actions$.pipe(
      ofType(GeneralPageActions.loadPage),
      concatMap(() =>
        this.statService
          .getGlobal()
          .pipe(
            map((response) =>
              CoronaApiActions.getTimelineSuccess({ data: response }),
            ),
          ),
      ),
      catchError((error, caught) => {
        this.store.dispatch(
          CoronaApiActions.getTimelineFail({ message: error.error }),
        );
        this._snackbar.open(error.error, 'Dismiss');
        return caught;
      }),
    ),
  );

  loadCountriesList$ = createEffect(() =>
    this.actions$.pipe(
      ofType(CountriesListPageActions.loadPage),
      concatMap(() =>
        this.statService.getCountryCodes().pipe(
          map((response) =>
            CoronaApiActions.getCountryNamesSuccess({
              nameCodeList: response,
            }),
          ),
        ),
      ),
    ),
  );

  // loadCountryData$ = createEffect(
  //   () => this.actions$.pipe(ofType(CountryPageActions.loadPage)),
  //   withLatestFrom(
  //     this.store.pipe(select(RouterSelectors.selectRouteParams)),
  //   concatMap(() => )
  // );

  constructor(
    private actions$: Actions,
    private statService: StatService,
    private store: Store,
    private _snackbar: MatSnackBar,
  ) {}
}
