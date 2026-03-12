import { createReducer, on } from '@ngrx/store';
import { AggregationsActions } from './aggregations.actions';
import { initialAggregationsState } from './aggregations.state';

export const aggregationsReducer = createReducer(
  initialAggregationsState,

  on(AggregationsActions.loadAll, (state) => ({
    ...state,
    loading: true,
    error: null,
  })),

  on(
    AggregationsActions.loadAllSuccess,
    (state, { byVehicle, byCode, criticalVehicles }) => ({
      ...state,
      loading: false,
      byVehicle,
      byCode,
      criticalVehicles,
    }),
  ),

  on(AggregationsActions.loadAllFailure, (state, { error }) => ({
    ...state,
    loading: false,
    error,
  })),
);
