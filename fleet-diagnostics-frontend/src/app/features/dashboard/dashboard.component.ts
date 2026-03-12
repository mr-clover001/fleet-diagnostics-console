import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { MatTabsModule } from '@angular/material/tabs';
import { MatToolbarModule } from '@angular/material/toolbar';
import { MatIconModule } from '@angular/material/icon';
import { FilterPanelComponent } from '../../shared/components/filter-panel/filter-panel.component';
import { EventsTableComponent } from '../events-table/events-table.component';
import { AggregationsComponent } from '../aggregations/aggregations.component';

@Component({
  selector: 'app-dashboard',
  standalone: true,
  imports: [
    CommonModule,
    MatTabsModule,
    MatToolbarModule,
    MatIconModule,
    FilterPanelComponent,
    EventsTableComponent,
    AggregationsComponent,
  ],
  templateUrl: './dashboard.component.html',
  styleUrls: ['./dashboard.component.scss'],
})
export class DashboardComponent {}
