import { createFeatureSelector, createSelector } from '@ngrx/store';
import { EventsState } from './events.state';

export const selectEventsState = createFeatureSelector<EventsState>('events');

export const selectEventsResult = createSelector(
  selectEventsState,
  (s) => s.result,
);
export const selectEvents = createSelector(
  selectEventsState,
  (s) => s.result?.data ?? [],
);
export const selectEventsTotal = createSelector(
  selectEventsState,
  (s) => s.result?.total ?? 0,
);
export const selectEventsTotalPages = createSelector(
  selectEventsState,
  (s) => s.result?.totalPages ?? 0,
);
export const selectEventsLoading = createSelector(
  selectEventsState,
  (s) => s.loading,
);
export const selectEventsError = createSelector(
  selectEventsState,
  (s) => s.error,
);
