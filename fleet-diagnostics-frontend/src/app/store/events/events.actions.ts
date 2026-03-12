import { createActionGroup, emptyProps, props } from '@ngrx/store';
import {
  DiagnosticEvent,
  PaginatedResult,
} from '../../core/models/event.model';

export const EventsActions = createActionGroup({
  source: 'Events',
  events: {
    'Load Events': emptyProps(),
    'Load Events Success': props<{
      result: PaginatedResult<DiagnosticEvent>;
    }>(),
    'Load Events Failure': props<{ error: string }>(),
  },
});
