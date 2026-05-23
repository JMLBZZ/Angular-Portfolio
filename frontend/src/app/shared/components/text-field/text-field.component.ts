import { CommonModule } from '@angular/common';
import { Component, Input } from '@angular/core';
import { FormControl, ReactiveFormsModule, Validators } from '@angular/forms';

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
  @Input() showError: boolean | null = null;
  @Input() disabled = false;
  @Input() id = '';
  @Input() hideLabelVisually = false;
  @Input() hideRequiredStar = false;

  get computedId(): string | null {
    return this.id || null;
  }

  get errorId(): string | null {
    return this.id ? `${this.id}-error` : null;
  }

  get isRequired(): boolean {
    return !!this.control?.hasValidator(Validators.required);
  }

  get shouldShowRequiredStar(): boolean {
    return this.isRequired && !this.hideRequiredStar;
  }

  get labelClasses(): string {
    return this.hideLabelVisually
      ? 'sr-only'
      : 'text-sm font-semibold';
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

  get isActuallyDisabled(): boolean {
    return !!this.control?.disabled || this.disabled;
  }

  get inputClasses(): string {
    return [
      'w-full h-11 rounded-full border px-4 text-sm outline-none transition',
      'bg-card/40 backdrop-blur',
      'placeholder:text-foreground/50',
      'focus-visible:ring-2 focus-visible:ring-primary/40',
      this.shouldShowError ? 'border-red-500' : 'border-border/70',
      this.isActuallyDisabled ? 'opacity-60 pointer-events-none' : '',
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

    if (this.control.hasError('requiredTrue')) {
      return 'Ce champ doit être activé.';
    }

    if (this.control.hasError('email')) {
      return 'Veuillez saisir une adresse email valide.';
    }

    if (this.control.hasError('invalidUrl')) {
      return 'Veuillez saisir une URL valide commençant par http:// ou https://, ou un chemin /uploads/....';
    }

    if (this.control.hasError('pattern')) {
      return 'Le format saisi est invalide.';
    }

    if (this.control.hasError('min')) {
      const error = this.control.getError('min');
      return `La valeur minimale autorisée est ${error.min}.`;
    }

    if (this.control.hasError('max')) {
      const error = this.control.getError('max');
      return `La valeur maximale autorisée est ${error.max}.`;
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