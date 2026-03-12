import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Store } from '@ngrx/store';
import { combineLatest, Observable } from 'rxjs';
import { map, shareReplay } from 'rxjs/operators';
import { MatTableModule } from '@angular/material/table';
import { MatPaginatorModule, PageEvent } from '@angular/material/paginator';
import { MatSortModule } from '@angular/material/sort';
import { EventsActions } from '../../store/events/events.actions';
import { FiltersActions } from '../../store/filters/filters.actions';
import {
  selectEvents,
  selectEventsTotal,
  selectEventsLoading,
  selectEventsError,
} from '../../store/events/events.selectors';
import { selectCurrentFilters } from '../../store/filters/filters.selectors';
import { DiagnosticEvent } from '../../core/models/event.model';
import { SeverityBadgeComponent } from '../../shared/components/severity-badge/severity-badge.component';
import { LoadingSpinnerComponent } from '../../shared/components/loading-spinner/loading-spinner.component';
import { ErrorBannerComponent } from '../../shared/components/error-banner/error-banner.component';

@Component({
  selector: 'app-events-table',
  standalone: true,
  imports: [
    CommonModule,
    MatTableModule,
    MatPaginatorModule,
    MatSortModule,
    SeverityBadgeComponent,
    LoadingSpinnerComponent,
    ErrorBannerComponent,
  ],
  templateUrl: './events-table.component.html',
  styleUrls: ['./events-table.component.scss'],
})
export class EventsTableComponent implements OnInit {
  readonly columns = ['timestamp', 'vehicleId', 'level', 'code', 'message'];

  // initialize in ngOnInit after store is ready
  vm$!: Observable<{
    events: DiagnosticEvent[];
    total: number;
    loading: boolean;
    error: string | null;
    filters: any;
  }>;

  constructor(private store: Store) {}

  ngOnInit(): void {
    this.vm$ = combineLatest({
      events: this.store.select(selectEvents),
      total: this.store.select(selectEventsTotal),
      loading: this.store.select(selectEventsLoading),
      error: this.store.select(selectEventsError),
      filters: this.store.select(selectCurrentFilters),
    }).pipe(shareReplay(1));

    this.store.dispatch(EventsActions.loadEvents());
  }

  onPageChange(event: PageEvent): void {
    this.store.dispatch(FiltersActions.setPage({ page: event.pageIndex + 1 }));
  }

  trackById(_: number, event: DiagnosticEvent): number {
    return event.id;
  }
}
