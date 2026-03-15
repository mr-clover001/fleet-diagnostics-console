import { Component } from '@angular/core';
import { MatProgressSpinnerModule } from '@angular/material/progress-spinner';

// Instead of creating seperate Html and CSS files, we can use inline template and styles for this simple component. This keeps the component self-contained and easier to manage.
@Component({
  selector: 'app-loading-spinner',
  standalone: true,
  imports: [MatProgressSpinnerModule],
  template: `
    <div class="spinner-wrap">
      <mat-spinner diameter="40" />
      <p>Loading...</p>
    </div>
  `,
  styles: [
    `
      .spinner-wrap {
        display: flex;
        flex-direction: column;
        align-items: center;
        padding: 40px;
        gap: 12px;
        color: #666;
      }
    `,
  ],
})
export class LoadingSpinnerComponent {}
