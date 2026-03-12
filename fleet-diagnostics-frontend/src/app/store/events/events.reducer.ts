import { createReducer, on } from '@ngrx/store';
import { EventsActions } from './events.actions';
import { initialEventsState } from './events.state';

export const eventsReducer = createReducer(
  initialEventsState,

  on(EventsActions.loadEvents, (state) => ({
    ...state,
    loading: true,
    error: null,
  })),

  on(EventsActions.loadEventsSuccess, (state, { result }) => ({
    ...state,
    loading: false,
    result,
  })),

  on(EventsActions.loadEventsFailure, (state, { error }) => ({
    ...state,
    loading: false,
    error,
  })),
);
