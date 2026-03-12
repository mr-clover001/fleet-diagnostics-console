import { Component, OnInit, OnDestroy } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ReactiveFormsModule, FormBuilder, FormGroup } from '@angular/forms';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { MatSelectModule } from '@angular/material/select';
import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';
import { Store } from '@ngrx/store';
import { Subject } from 'rxjs';
import { debounceTime, distinctUntilChanged, takeUntil } from 'rxjs/operators';
import { FiltersActions } from '../../../store/filters/filters.actions';

@Component({
  selector: 'app-filter-panel',
  standalone: true,
  imports: [
    CommonModule,
    ReactiveFormsModule,
    MatFormFieldModule,
    MatInputModule,
    MatSelectModule,
    MatButtonModule,
    MatIconModule,
  ],
  templateUrl: './filter-panel.component.html',
  styleUrls: ['./filter-panel.component.scss'],
})
export class FilterPanelComponent implements OnInit, OnDestroy {
  form!: FormGroup;
  readonly levels = ['', 'ERROR', 'WARN', 'INFO'];
  private destroy$ = new Subject<void>();

  constructor(
    private fb: Store,
    private store: Store,
    private formBuilder: FormBuilder,
  ) {}

  ngOnInit(): void {
    this.form = this.formBuilder.group({
      vehicleId: [''],
      code: [''],
      level: [''],
      from: [''],
      to: [''],
    });

    // Auto-dispatch on any form value change with debounce
    this.form.valueChanges
      .pipe(
        debounceTime(400),
        distinctUntilChanged((a, b) => JSON.stringify(a) === JSON.stringify(b)),
        takeUntil(this.destroy$),
      )
      .subscribe((values) => {
        // Strip empty strings before dispatching
        const filters = Object.fromEntries(
          Object.entries(values).filter(([, v]) => v !== '' && v !== null),
        );
        this.store.dispatch(FiltersActions.setFilters({ filters }));
      });
  }

  reset(): void {
    this.form.reset({ vehicleId: '', code: '', level: '', from: '', to: '' });
    this.store.dispatch(FiltersActions.resetFilters());
  }

  ngOnDestroy(): void {
    this.destroy$.next();
    this.destroy$.complete();
  }
}
