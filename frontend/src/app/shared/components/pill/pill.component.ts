import { CommonModule } from '@angular/common';
import { Component, Input } from '@angular/core';

type PillVariant = 'default' | 'subtle' | 'primary';

@Component({
  selector: 'app-pill',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './pill.component.html',
})
export class PillComponent {
  @Input() variant: PillVariant = 'default';
  @Input() size: 'sm' | 'md' = 'md';
  @Input() className = ''; //classe supplémentaires au cas où

  get baseClasses(): string {
    const sizeClass =
      this.size === 'sm' ? 'px-3 py-1 text-xs' : 'px-3.5 py-1.5 text-xs';

    const variantClass =
      this.variant === 'primary'
        ? 'border-primary/30 bg-primary/10 text-primary'
        : this.variant === 'subtle'
          ? 'border-border/70 bg-card/40 text-foreground/70'
          : 'border-border bg-card/60 text-foreground/70';

    return [
      'inline-flex',
      'items-center',
      'rounded-full',
      'border',
      'backdrop-blur',
      'transition',
      'hover:translate-y-[-1px]',
      'hover:opacity-95',
      sizeClass,
      variantClass,
      this.className,
    ].join(' ');
  }
}