import { Component, OnInit, PLATFORM_ID, inject } from '@angular/core';
import { CommonModule, isPlatformBrowser } from '@angular/common';
import { Store } from '@ngrx/store';
import { combineLatest, Observable } from 'rxjs';
import { map, shareReplay } from 'rxjs/operators';
import { MatCardModule } from '@angular/material/card';
import { MatChipsModule } from '@angular/material/chips';
import { MatIconModule } from '@angular/material/icon';
import { BaseChartDirective } from 'ng2-charts';
import { ChartData, ChartOptions } from 'chart.js';

import { AggregationsActions } from '../../store/aggregations/aggregations.actions';
import {
  selectByVehicle,
  selectByCode,
  selectCriticalVehicles,
  selectAggregationsLoading,
} from '../../store/aggregations/aggregations.selectors';
import { LoadingSpinnerComponent } from '../../shared/components/loading-spinner/loading-spinner.component';
import {
  EventsByVehicle,
  EventsByCode,
  CriticalVehicle,
} from '../../core/models/aggregation.model';

// ViewModel type
interface AggregationsVM {
  byVehicle: EventsByVehicle[];
  byCode: EventsByCode[];
  criticalVehicles: CriticalVehicle[];
  loading: boolean;
  barChartData: ChartData<'bar'>;
  totalErrors: number;
  totalEvents: number;
}

@Component({
  selector: 'app-aggregations',
  standalone: true,
  imports: [
    CommonModule,
    MatCardModule,
    MatChipsModule,
    MatIconModule,
    BaseChartDirective,
    LoadingSpinnerComponent,
  ],
  templateUrl: './aggregations.component.html',
  styleUrls: ['./aggregations.component.scss'],
})
export class AggregationsComponent implements OnInit {
  private platformId = inject(PLATFORM_ID);
  isBrowser = isPlatformBrowser(this.platformId);

  vm$!: Observable<AggregationsVM>;

  barChartOptions: ChartOptions<'bar'> = {
    responsive: true,
    plugins: {
      legend: { display: false },
      title: { display: true, text: 'Top Error Codes' },
    },
  };

  constructor(private store: Store) {}

  ngOnInit(): void {
    this.vm$ = combineLatest({
      byVehicle: this.store.select(selectByVehicle),
      byCode: this.store.select(selectByCode),
      criticalVehicles: this.store.select(selectCriticalVehicles),
      loading: this.store.select(selectAggregationsLoading),
    }).pipe(
      map((data) => ({
        ...data,
        barChartData: {
          labels: data.byCode.slice(0, 10).map((c) => c.code),
          datasets: [
            {
              label: 'Occurrences',
              data: data.byCode.slice(0, 10).map((c) => c.count),
              backgroundColor: data.byCode
                .slice(0, 10)
                .map((c) =>
                  c.level === 'ERROR'
                    ? '#e74c3c'
                    : c.level === 'WARN'
                      ? '#f39c12'
                      : '#3498db',
                ),
            },
          ],
        } as ChartData<'bar'>,
        totalErrors: data.byVehicle.reduce((s, v) => s + v.errorCount, 0),
        totalEvents: data.byVehicle.reduce((s, v) => s + v.totalEvents, 0),
      })),
      shareReplay(1),
    );

    this.store.dispatch(AggregationsActions.loadAll());
  }
}
