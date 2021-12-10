import { Injectable } from '@angular/core';
import { Actions, createEffect, ofType } from '@ngrx/effects';
import { Store } from '@ngrx/store';
import { catchError, concatMap, map } from 'rxjs/operators';
import { StatService } from 'src/app/shared/services/stat.service';
import { CoronaApiActions, GeneralPageActions } from '../actions';

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
              CoronaApiActions.getTimelineSuccess({ data: response })
            )
          )
      ),
      catchError((error, caught) => {
        this.store.dispatch(
          CoronaApiActions.getTimelineFail({ message: error.error })
        );
        return caught;
      })
    )
  );

  constructor(
    private actions$: Actions,
    private statService: StatService,
    private store: Store
  ) {}
}
