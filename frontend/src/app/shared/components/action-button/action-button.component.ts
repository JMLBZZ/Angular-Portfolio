import { CommonModule } from '@angular/common';
import { Component, EventEmitter, Input, Output } from '@angular/core';

type ActionButtonVariant = 'solid' | 'outline';

@Component({
  selector: 'app-action-button',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './action-button.component.html',
})
export class ActionButtonComponent {
  @Input() href?: string;
  @Input() target: '_blank' | '_self' = '_blank';
  @Input() rel = 'noopener noreferrer';
  @Input() label = '';
  @Input() ariaLabel = '';
  @Input() iconClass?: string;

  /** Variants */
  @Input() variant: ActionButtonVariant = 'outline';

  @Input() disabled = false;
  @Input() className = '';

  @Output() pressed = new EventEmitter<void>();

  onClick(event: MouseEvent): void {
    event.stopPropagation();

    if (this.disabled) return;

    this.pressed.emit();
  }

  get computedAriaLabel(): string | null {
    return this.ariaLabel || this.label || null;
  }

  get computedRel(): string | null {
    if (!this.href) return null;
    if (this.target === '_blank') return 'noopener noreferrer';
    return this.rel || null;
  }

  get classes(): string {
    const base =
      'inline-flex items-center justify-center gap-2 rounded-2xl px-4 py-2 text-sm font-semibold ' +
      'transition hover:translate-y-[-1px] active:translate-y-0 ' +
      'focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary/40';

    const solid =
      'bg-primary text-primary-foreground shadow-soft hover:opacity-95 active:opacity-90';

    const outline =
      'border border-border/70 bg-card/40 backdrop-blur text-foreground/80 ' +
      'hover:text-primary hover:opacity-95';

    const disabledClass = this.disabled ? 'opacity-60 pointer-events-none' : '';

    return [base, this.variant === 'solid' ? solid : outline, disabledClass, this.className]
      .join(' ')
      .trim();
  }
}