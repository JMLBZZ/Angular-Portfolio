import { CommonModule } from '@angular/common';
import { Component, EventEmitter, Input, Output } from '@angular/core';

@Component({
  selector: 'app-icon-button',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './icon-button.component.html',
})
export class IconButtonComponent {
  @Input() iconClass = 'bi bi-question-circle';
  @Input() ariaLabel = 'Icon button';

  /** Si href existe => rendu <a> */
  @Input() href?: string;
  @Input() target: '_blank' | '_self' = '_blank';
  @Input() rel = 'noopener noreferrer';

  /** Taille du bouton */
  @Input() sizeClass = 'h-11 w-11';

  /** Taille icône */
  @Input() iconSizeClass = 'text-[18px]';

  /** Couleur supplémentaire */
  @Input() iconExtraClass = '';

  /** Permet de forcer état actif (ex: dark mode) */
  @Input() active = false;

  /** Désactivation */
  @Input() disabled = false;

  @Output() pressed = new EventEmitter<void>();

  onClick(): void {
    if (this.disabled) return;
    this.pressed.emit();
  }

  get computedRel(): string | null {
    if (!this.href) return null;
    if (this.target === '_blank') return 'noopener noreferrer';
    return this.rel || null;
  }

  get classes(): string {
    return [
      this.sizeClass,
      'rounded-full',
      'border',
      'border-border/70',
      'bg-card/40',
      'backdrop-blur',
      'inline-flex',
      'items-center',
      'justify-center',
      'transition',
      'focus-visible:outline-none',
      'focus-visible:ring-2',
      'focus-visible:ring-primary/40',
      this.active
        ? 'text-primary border-primary/40'
        : 'text-foreground/70 hover:text-primary hover:translate-y-[-1px] hover:opacity-95',
      this.disabled ? 'opacity-50 pointer-events-none' : '',
    ].join(' ');
  }
}