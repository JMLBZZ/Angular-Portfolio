import { CommonModule } from '@angular/common';
import { Component, Input } from '@angular/core';
import { FormControl, ReactiveFormsModule } from '@angular/forms';

@Component({
  selector: 'app-text-area',
  standalone: true,
  imports: [CommonModule, ReactiveFormsModule],
  templateUrl: './text-area.component.html',
})
export class TextAreaComponent {
  @Input() label = '';
  @Input() placeholder = '';
  @Input() control!: FormControl;
  @Input() errorText = '';
  @Input() showError = false;
  @Input() disabled = false;
  @Input() rows = 6;
  @Input() id = '';

  get textareaClasses(): string {
    return [
      'w-full min-h-[160px] rounded-3xl border px-4 py-3 text-sm outline-none transition resize-none',
      'bg-card/40 backdrop-blur',
      'placeholder:text-foreground/50',
      'focus-visible:ring-2 focus-visible:ring-primary/40',
      this.showError ? 'border-red-500' : 'border-border/70',
      this.disabled ? 'opacity-60 pointer-events-none' : '',
    ].join(' ');
  }
}