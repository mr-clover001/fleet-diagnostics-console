import {
  EventsByVehicle,
  EventsByCode,
  CriticalVehicle,
} from '../../core/models/aggregation.model';

export interface AggregationsState {
  byVehicle: EventsByVehicle[];
  byCode: EventsByCode[];
  criticalVehicles: CriticalVehicle[];
  loading: boolean;
  error: string | null;
}

export const initialAggregationsState: AggregationsState = {
  byVehicle: [],
  byCode: [],
  criticalVehicles: [],
  loading: false,
  error: null,
};
