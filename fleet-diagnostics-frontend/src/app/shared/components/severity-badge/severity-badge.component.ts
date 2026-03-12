import { Component, Input } from '@angular/core';
import { CommonModule } from '@angular/common';
import { EventLevel } from '../../../core/models/event.model';

@Component({
  selector: 'app-severity-badge',
  standalone: true,
  imports: [CommonModule],
  template: `
    <span class="badge" [ngClass]="badgeClass">
      {{ level }}
    </span>
  `,
  styles: [
    `
      .badge {
        padding: 2px 10px;
        border-radius: 12px;
        font-size: 11px;
        font-weight: 700;
        letter-spacing: 0.5px;
        text-transform: uppercase;
      }
      .error {
        background: #fde8e8;
        color: #c0392b;
      }
      .warn {
        background: #fef3cd;
        color: #d68910;
      }
      .info {
        background: #d1ecf1;
        color: #0c6e8a;
      }
    `,
  ],
})
export class SeverityBadgeComponent {
  @Input() level!: EventLevel;

  // ✅ Computed getter — always returns a safe string
  get badgeClass(): string {
    return this.level ? this.level.toLowerCase() : '';
  }
}
