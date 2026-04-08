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
  @Input() showError: boolean | null = null;
  @Input() disabled = false;
  @Input() rows = 6;
  @Input() id = '';

  get computedId(): string | null {
    return this.id || null;
  }

  get errorId(): string | null {
    return this.id ? `${this.id}-error` : null;
  }

  get shouldShowError(): boolean {
    if (this.showError !== null) {
      return this.showError;
    }

    return !!this.control && this.control.invalid && this.control.touched;
  }

  get computedErrorText(): string {
    if (this.errorText.trim()) {
      return this.errorText;
    }

    return this.getDefaultErrorMessage();
  }

  get describedBy(): string | null {
    return this.shouldShowError && this.computedErrorText && this.errorId ? this.errorId : null;
  }

  get textareaClasses(): string {
    return [
      'w-full min-h-[160px] rounded-3xl border px-4 py-3 text-sm outline-none transition resize-none',
      'bg-card/40 backdrop-blur',
      'placeholder:text-foreground/50',
      'focus-visible:ring-2 focus-visible:ring-primary/40',
      this.shouldShowError ? 'border-red-500' : 'border-border/70',
      this.disabled ? 'opacity-60 pointer-events-none' : '',
    ].join(' ');
  }

  private getDefaultErrorMessage(): string {
    if (!this.control?.errors) {
      return '';
    }

    if (this.control.hasError('apiError')) {
      return this.control.getError('apiError');
    }

    if (this.control.hasError('required')) {
      return 'Ce champ est obligatoire.';
    }

    if (this.control.hasError('maxlength')) {
      const error = this.control.getError('maxlength');
      return `La longueur maximale autorisée est de ${error.requiredLength} caractères.`;
    }

    if (this.control.hasError('minlength')) {
      const error = this.control.getError('minlength');
      return `La longueur minimale attendue est de ${error.requiredLength} caractères.`;
    }

    return 'La valeur saisie est invalide.';
  }
}