import { CommonModule } from '@angular/common';
import { Component, EventEmitter, Input, Output } from '@angular/core';

type PrimaryButtonSize = 'sm' | 'md' | 'lg';
type FullWidthMode = 'always' | 'never' | 'mobile';
type ButtonType = 'button' | 'submit' | 'reset';

@Component({
  selector: 'app-primary-button',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './primary-button.component.html',
})
export class PrimaryButtonComponent {
  @Input() ariaLabel = '';

  @Input() disabled = false;
  @Input() loading = false;

  @Input() iconClass?: string;

  @Input() size: PrimaryButtonSize = 'md';

  /**
   * "always" = w-full partout
   * "never"  = auto partout
   * "mobile" = w-full en mobile, auto à partir de sm:
   */
  @Input() fullWidthMode: FullWidthMode = 'mobile';

  @Input() className = '';

  /**
   * Type natif du bouton HTML :
   * - button : bouton classique
   * - submit : soumet un formulaire
   * - reset  : reset un formulaire
   */
  @Input() type: ButtonType = 'button';

  /** Réglage animation */
  @Input() transitionMs = 180;

  @Output() pressed = new EventEmitter<void>();

  onClick(): void {
    if (this.disabled || this.loading) return;
    this.pressed.emit();
  }

  get classes(): string {
    const widthClass =
      this.fullWidthMode === 'always'
        ? 'w-full'
        : this.fullWidthMode === 'never'
        ? 'w-auto'
        : 'w-full sm:w-auto';

    const sizeClass =
      this.size === 'sm'
        ? 'h-10 px-5 text-sm'
        : this.size === 'lg'
        ? 'h-12 px-7 text-sm'
        : 'h-11 px-6 text-sm';

    const base =
      'inline-flex items-center justify-center gap-2 rounded-full ' +
      'bg-primary text-primary-foreground ' +
      'font-semibold shadow-soft ' +
      'focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary/40';

    const motion =
      'hover:translate-y-[-1px] hover:opacity-95 active:translate-y-0 active:opacity-90 ' +
      'disabled:opacity-60 disabled:pointer-events-none';

    return [widthClass, sizeClass, base, motion, this.className].join(' ');
  }

  get style() {
    return {
      transition: `transform ${this.transitionMs}ms ease, opacity ${this.transitionMs}ms ease`,
    };
  }
}