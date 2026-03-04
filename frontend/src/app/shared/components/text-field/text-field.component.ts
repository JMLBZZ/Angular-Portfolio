import { CommonModule } from '@angular/common';
import { Component, Input } from '@angular/core';
import { FormControl, ReactiveFormsModule } from '@angular/forms';

@Component({
  selector: 'app-text-field',
  standalone: true,
  imports: [CommonModule, ReactiveFormsModule],
  templateUrl: './text-field.component.html',
})
export class TextFieldComponent {
  @Input() label = '';
  @Input() placeholder = '';
  @Input() type: 'text' | 'email' | 'password' = 'text';

  /** FormControl */
  @Input() control!: FormControl;

  /** Message d'erreur */
  @Input() errorText = '';
  @Input() showError = false;
  @Input() disabled = false;
  @Input() id = '';

  get inputClasses(): string {
    return [
      'w-full h-11 rounded-full border px-4 text-sm outline-none transition',
      'bg-card/40 backdrop-blur',
      'placeholder:text-foreground/50',
      'focus-visible:ring-2 focus-visible:ring-primary/40',
      this.showError ? 'border-red-500' : 'border-border/70',
      this.disabled ? 'opacity-60 pointer-events-none' : '',
    ].join(' ');
  }
}