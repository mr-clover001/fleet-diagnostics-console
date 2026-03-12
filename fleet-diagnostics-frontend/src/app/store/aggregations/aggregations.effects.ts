import { Injectable, inject } from '@angular/core';
import { Actions, createEffect, ofType } from '@ngrx/effects';
import { forkJoin } from 'rxjs';
import { switchMap, map, catchError } from 'rxjs/operators';
import { of } from 'rxjs';
import { AggregationsActions } from './aggregations.actions';
import { AggregationsApiService } from '../../core/services/aggregations-api.service';

@Injectable()
export class AggregationsEffects {
  private readonly actions$ = inject(Actions);
  private readonly aggregationsApi = inject(AggregationsApiService);

  loadAll$ = createEffect(() =>
    this.actions$.pipe(
      ofType(AggregationsActions.loadAll),
      switchMap(() =>
        forkJoin({
          byVehicle: this.aggregationsApi.getByVehicle(),
          byCode: this.aggregationsApi.getByCode(),
          criticalVehicles: this.aggregationsApi.getCriticalVehicles(),
        }).pipe(
          map(({ byVehicle, byCode, criticalVehicles }) =>
            AggregationsActions.loadAllSuccess({
              byVehicle,
              byCode,
              criticalVehicles,
            }),
          ),
          catchError((err) =>
            of(AggregationsActions.loadAllFailure({ error: err.message })),
          ),
        ),
      ),
    ),
  );
}
