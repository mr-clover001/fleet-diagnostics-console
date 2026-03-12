import { createActionGroup, emptyProps, props } from '@ngrx/store';
import {
  EventsByVehicle,
  EventsByCode,
  CriticalVehicle,
} from '../../core/models/aggregation.model';

export const AggregationsActions = createActionGroup({
  source: 'Aggregations',
  events: {
    'Load All': emptyProps(),
    'Load All Success': props<{
      byVehicle: EventsByVehicle[];
      byCode: EventsByCode[];
      criticalVehicles: CriticalVehicle[];
    }>(),
    'Load All Failure': props<{ error: string }>(),
  },
});
