import { createFeatureSelector, createSelector } from '@ngrx/store';
import { AggregationsState } from './aggregations.state';

export const selectAggregationsState =
  createFeatureSelector<AggregationsState>('aggregations');

export const selectByVehicle = createSelector(
  selectAggregationsState,
  (s) => s.byVehicle,
);
export const selectByCode = createSelector(
  selectAggregationsState,
  (s) => s.byCode,
);
export const selectCriticalVehicles = createSelector(
  selectAggregationsState,
  (s) => s.criticalVehicles,
);
export const selectAggregationsLoading = createSelector(
  selectAggregationsState,
  (s) => s.loading,
);
