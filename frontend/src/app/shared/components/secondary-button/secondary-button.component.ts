import { CommonModule } from '@angular/common';
import { Component, EventEmitter, Input, Output } from '@angular/core';

type FullWidthMode = 'always' | 'never' | 'mobile';

@Component({
  selector: 'app-secondary-button',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './secondary-button.component.html',
})
export class SecondaryButtonComponent {
  @Input() label = '';
  @Input() href?: string;
  @Input() target: '_blank' | '_self' = '_blank';
  @Input() rel = 'noopener noreferrer';
  @Input() ariaLabel = '';
  @Input() iconClass?: string;

  /** largeur */
  @Input() fullWidthMode: FullWidthMode = 'never';

  @Input() disabled = false;
  @Input() className = '';

  @Output() pressed = new EventEmitter<void>();

  onClick(): void {
    if (this.disabled) return;
    this.pressed.emit();
  }

  get widthClass(): string {
    if (this.fullWidthMode === 'always') return 'w-full';
    if (this.fullWidthMode === 'mobile') return 'w-full sm:w-auto';
    return 'w-auto';
  }

  get computedAriaLabel(): string | null {
    return this.ariaLabel || this.label || null;
  }

  get computedRel(): string | null {
    if (!this.href) return null;
    if (this.target === '_blank') return 'noopener noreferrer';
    return this.rel || null;
  }
}