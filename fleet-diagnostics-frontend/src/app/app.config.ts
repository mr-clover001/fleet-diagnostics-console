import { ApplicationConfig, isDevMode } from '@angular/core';
import { provideRouter } from '@angular/router';
import {
  provideHttpClient,
  withInterceptors,
  withFetch,
} from '@angular/common/http';
import { provideAnimations } from '@angular/platform-browser/animations';
import { provideStore } from '@ngrx/store';
import { provideEffects } from '@ngrx/effects';
import { provideStoreDevtools } from '@ngrx/store-devtools';
import { provideCharts, withDefaultRegisterables } from 'ng2-charts';

import { routes } from './app.routes';
import { errorInterceptor } from './core/interceptors/error.interceptor';
import { eventsReducer } from './store/events/events.reducer';
import { filtersReducer } from './store/filters/filters.reducer';
import { aggregationsReducer } from './store/aggregations/aggregations.reducer';
import { EventsEffects } from './store/events/events.effects';
import { AggregationsEffects } from './store/aggregations/aggregations.effects';

export const appConfig: ApplicationConfig = {
  providers: [
    provideRouter(routes),
    provideAnimations(),

    provideHttpClient(withFetch(), withInterceptors([errorInterceptor])),

    provideStore({
      events: eventsReducer,
      filters: filtersReducer,
      aggregations: aggregationsReducer,
    }),
    provideEffects([EventsEffects, AggregationsEffects]),
    provideStoreDevtools({
      maxAge: 25,
      logOnly: !isDevMode(),
      autoPause: true,
    }),
    provideCharts(withDefaultRegisterables()),
  ],
};
