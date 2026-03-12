import { createReducer, on } from '@ngrx/store';
import { EventFilters } from '../../core/models/event.model';
import { FiltersActions } from './filters.actions';

export interface FiltersState {
  current: EventFilters;
}

export const initialFiltersState: FiltersState = {
  current: { page: 1, limit: 20 },
};

export const filtersReducer = createReducer(
  initialFiltersState,

  on(FiltersActions.setFilters, (state, { filters }) => ({
    ...state,
    current: { ...filters, page: 1 }, // Reset to page 1 on new filter
  })),

  on(FiltersActions.resetFilters, () => initialFiltersState),

  on(FiltersActions.setPage, (state, { page }) => ({
    ...state,
    current: { ...state.current, page },
  })),
);
