import { CommonModule } from '@angular/common';
import { Component, EventEmitter, Input, Output } from '@angular/core';
import { LucideAngularModule, SaveIcon } from 'lucide-angular';

@Component({
  selector: 'app-admin-floating-actions',
  standalone: true,
  imports: [
    CommonModule,
    LucideAngularModule,
  ],
  template: `
    <div 
      class="sticky bottom-4 z-20 rounded-3xl p-4 shadow-soft backdrop-blur-xl transition-colors" 
      [ngClass]="!highlight ? 'border-border/70' : ''"
      [ngClass]="!highlight ? 'bg-background/90' : ''"
      [class.border]="true"
      [ngClass]="highlight ? 'border-amber-500/90' : ''"
      [ngClass]="highlight ? 'bg-amber-500/10' : ''"
    >
      <div class="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">

        <p
          class="text-sm transition-colors"
          [class.opacity-70]="!highlight"
          [class.font-semibold]="highlight"
          [class.text-amber-600]="highlight"
        >
          {{ highlight
            ? 'Pensez à enregistrer avant de quitter la page.'
            : 'Aucune modification en attente.'
          }}
        </p>

        <div class="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-end">

          <button
            type="button"
            class="inline-flex h-11 items-center justify-center rounded-full border border-border/70 px-6 text-sm font-semibold transition hover:bg-card disabled:pointer-events-none disabled:opacity-50 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary/40"
            [disabled]="cancelDisabled"
            (click)="cancelClicked.emit()"
          >
            {{ cancelLabel }}
          </button>

          <ng-content select="[floating-extra-actions]"></ng-content>

          <button
            [type]="saveType"
            class="inline-flex h-11 items-center justify-center rounded-full bg-primary px-6 text-sm font-semibold text-primary-foreground shadow-soft transition hover:opacity-90 disabled:pointer-events-none disabled:opacity-50 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary/40"
            [disabled]="saveDisabled"
            (click)="saveClicked.emit()"
          >
            <span *ngIf="!saveLoading">
              {{ saveLabel }}
            </span>

            <span *ngIf="saveLoading">
              {{ savingLabel }}
            </span>
          </button>

        </div>
      </div>
    </div>
  `,
})
export class AdminFloatingActionsComponent {
  readonly SaveIcon = SaveIcon;

  @Input() highlight = false;

  @Input() cancelLabel = 'Annuler';
  @Input() cancelDisabled = false;

  @Input() saveLabel = 'Enregistrer';
  @Input() savingLabel = 'Enregistrement...';
  @Input() saveLoading = false;
  @Input() saveDisabled = false;
  @Input() saveType: 'button' | 'submit' = 'submit';

  @Output() cancelClicked = new EventEmitter<void>();
  @Output() saveClicked = new EventEmitter<void>();
}