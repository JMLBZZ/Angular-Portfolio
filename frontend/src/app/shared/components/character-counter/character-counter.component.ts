import { CommonModule } from '@angular/common';
import { Component, Input } from '@angular/core';
import { AbstractControl } from '@angular/forms';

@Component({
  selector: 'app-character-counter',
  standalone: true,
  imports: [CommonModule],
  template: `
    <div
      class="flex items-center gap-3 text-xs"
      [class.justify-start]="align === 'left'"
      [class.justify-end]="align === 'right'"
      [class.justify-between]="align === 'between'"
      [ngClass]="counterColorClass"
      aria-live="polite"
    >
      <span class="font-medium tabular-nums">
        {{ currentLength }} / {{ maxLength }}
      </span>
    </div>
  `,
})
export class CharacterCounterComponent {
  @Input() control: AbstractControl | null = null;
  @Input() value: string | null | undefined = '';
  @Input() maxLength = 0;

  /**
   * Quand il reste peu de caractères, le compteur passe en couleur d'avertissement.
   * Exemple : maxLength 4000, warningThreshold 250 => avertissement à partir de 3750.
   */
  @Input() warningThreshold = 250;

  /**
   * "left" : compteur aligné à gauche
   * "right" : compteur aligné à droite
   * "between" : utile si on veut plus tard ajouter une aide à gauche et le compteur à droite
   */
  @Input() align: 'left' | 'right' | 'between' = 'left';

  get currentLength(): number {
    const source = this.control ? this.control.value : this.value;

    return String(source ?? '').length;
  }

  get remainingLength(): number {
    return Math.max(this.maxLength - this.currentLength, 0);
  }

  get isOverLimit(): boolean {
    return this.currentLength > this.maxLength || !!this.control?.hasError('maxlength');
  }

  get isWarning(): boolean {
    return !this.isOverLimit && this.maxLength > 0 && this.remainingLength <= this.warningThreshold;
  }

  get counterColorClass(): string {
    if (this.isOverLimit) {
      return 'text-red-500';
    }

    if (this.isWarning) {
      return 'text-amber-600 dark:text-amber-400';
    }

    return 'text-foreground/60';
  }
}