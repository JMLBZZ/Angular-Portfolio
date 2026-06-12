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
    <div class="sticky bottom-4 z-20 rounded-3xl border border-border/70 bg-background/90 p-4 shadow-soft backdrop-blur">
      <div class="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
        <p class="text-sm opacity-70">
          {{ message }}
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
            <span *ngIf="!saveLoading" class="inline-flex items-center gap-2">
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

  @Input() message = 'Pensez à enregistrer avant de quitter la page.';

  @Input() cancelLabel = 'Annuler';
  @Input() cancelDisabled = false;

  @Input() saveLabel = 'Enregistrer';
  @Input() savingLabel = 'Enregistrement...';
  @Input() saveLoading = false;
  @Input() saveDisabled = false;
  @Input() saveType: 'button' | 'submit' = 'submit';
  @Input() showSaveIcon = true;

  @Output() cancelClicked = new EventEmitter<void>();
  @Output() saveClicked = new EventEmitter<void>();
}