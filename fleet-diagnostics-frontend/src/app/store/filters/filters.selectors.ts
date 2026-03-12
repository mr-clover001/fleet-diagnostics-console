import { createFeatureSelector, createSelector } from '@ngrx/store';
import { FiltersState } from './filters.reducer';

export const selectFiltersState =
  createFeatureSelector<FiltersState>('filters');

export const selectCurrentFilters = createSelector(
  selectFiltersState,
  (state) => state.current,
);
