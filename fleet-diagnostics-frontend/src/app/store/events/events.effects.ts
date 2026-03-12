import { Injectable, inject } from '@angular/core';
import { Actions, createEffect, ofType } from '@ngrx/effects';
import { Store } from '@ngrx/store';
import {
  switchMap,
  map,
  catchError,
  debounceTime,
  withLatestFrom,
} from 'rxjs/operators';
import { of } from 'rxjs';
import { EventsActions } from './events.actions';
import { FiltersActions } from '../filters/filters.actions';
import { selectCurrentFilters } from '../filters/filters.selectors';
import { EventsApiService } from '../../core/services/events-api.service';

@Injectable()
export class EventsEffects {
  private readonly actions$ = inject(Actions);
  private readonly store = inject(Store);
  private readonly eventsApi = inject(EventsApiService);

  loadEvents$ = createEffect(() =>
    this.actions$.pipe(
      ofType(
        EventsActions.loadEvents,
        FiltersActions.setFilters,
        FiltersActions.resetFilters,
        FiltersActions.setPage,
      ),
      debounceTime(300),
      withLatestFrom(this.store.select(selectCurrentFilters)),
      switchMap(([, filters]) =>
        this.eventsApi.getEvents(filters).pipe(
          map((result) => EventsActions.loadEventsSuccess({ result })),
          catchError((err) =>
            of(EventsActions.loadEventsFailure({ error: err.message })),
          ),
        ),
      ),
    ),
  );
}
