import { createActionGroup, emptyProps, props } from '@ngrx/store';
import { EventFilters } from '../../core/models/event.model';

export const FiltersActions = createActionGroup({
  source: 'Filters',
  events: {
    'Set Filters': props<{ filters: EventFilters }>(),
    'Reset Filters': emptyProps(),
    'Set Page': props<{ page: number }>(),
  },
});
