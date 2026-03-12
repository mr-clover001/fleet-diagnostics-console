import { Component, Input } from '@angular/core';
import { CommonModule } from '@angular/common';
import { MatIconModule } from '@angular/material/icon';

@Component({
  selector: 'app-error-banner',
  standalone: true,
  imports: [CommonModule, MatIconModule],
  template: `
    <div class="error-banner" *ngIf="message">
      <mat-icon>error_outline</mat-icon>
      <span>{{ message }}</span>
    </div>
  `,
  styles: [
    `
      .error-banner {
        display: flex;
        align-items: center;
        gap: 8px;
        padding: 12px 16px;
        background: #fde8e8;
        border-left: 4px solid #c0392b;
        color: #c0392b;
        border-radius: 4px;
        margin: 16px 0;
      }
    `,
  ],
})
export class ErrorBannerComponent {
  @Input() message: string | null = null;
}
