import {
  DiagnosticEvent,
  PaginatedResult,
} from '../../core/models/event.model';

export interface EventsState {
  result: PaginatedResult<DiagnosticEvent> | null;
  loading: boolean;
  error: string | null;
}

export const initialEventsState: EventsState = {
  result: null,
  loading: false,
  error: null,
};
