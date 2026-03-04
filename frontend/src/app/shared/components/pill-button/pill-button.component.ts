import { CommonModule } from '@angular/common';
import { Component, EventEmitter, Input, Output } from '@angular/core';

type PillButtonVariant = 'default' | 'primary' | 'ghost';
type PillButtonSize = 'sm' | 'md';

@Component({
  selector: 'app-pill-button',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './pill-button.component.html',
})
export class PillButtonComponent {
  /** Si href est défini => rendu en <a>, sinon <button> */
  @Input() href?: string;
  @Input() target: '_blank' | '_self' = '_blank';
  @Input() rel = 'noopener';

  /** Etat */
  @Input() disabled = false;
  @Input() active = false;

  /** Style */
  @Input() variant: PillButtonVariant = 'default';
  @Input() size: PillButtonSize = 'md';

  /** Pleine largeur*/
  @Input() fullWidth = false;
  @Input() iconClass?: string;
  @Input() download?: string | boolean;
  @Input() ariaLabel = '';
  @Input() className = '';

  @Output() pressed = new EventEmitter<void>();

  onClick() {
    if (this.disabled) return;
    this.pressed.emit();
  }

  get classes(): string {
    const sizeClass =
      this.size === 'sm'
        ? 'px-5 py-2.5 text-sm'
        : 'px-6 py-3 text-sm';

    const base =
      'inline-flex items-center justify-center gap-2 rounded-full border backdrop-blur ' +
      'font-semibold transition shadow-soft ' +
      'focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary/40 ' +
      'hover:translate-y-[-1px] hover:opacity-95';

    const widthClass = this.fullWidth ? 'w-full' : '';

    // Variants
    let variantClass = '';
    if (this.variant === 'primary') {
      variantClass = 'bg-primary text-primary-foreground border-primary/40';
    } else if (this.variant === 'ghost') {
      variantClass = 'bg-transparent text-foreground/70 border-border/40 hover:text-primary';
    } else {
      variantClass = 'bg-card/40 text-foreground/70 border-border/70 hover:text-primary';
    }

    // Active state (pour filtres)
    const activeClass =
      this.active && this.variant !== 'primary'
        ? 'text-primary border-primary/40 bg-primary/10'
        : '';

    const disabledClass = this.disabled ? 'opacity-60 pointer-events-none' : '';

    return [base, sizeClass, widthClass, variantClass, activeClass, disabledClass, this.className]
      .filter(Boolean)
      .join(' ');
  }
}