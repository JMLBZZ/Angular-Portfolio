import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { TranslateModule } from '@ngx-translate/core';
import { ReactiveFormsModule, FormBuilder, Validators, AbstractControl } from '@angular/forms';
import { RevealOnScrollDirective } from '../../shared/directives/reveal-on-scroll.directive';

type AlertType = 'success' | 'error';

@Component({
  selector: 'app-contact-section',
  standalone: true,
  imports: [CommonModule, TranslateModule, ReactiveFormsModule, RevealOnScrollDirective],
  templateUrl: './contact-section.component.html',
})
export class ContactSectionComponent {
  email = 'contact@alexandredumont.dev';
  phone = '+33 6 12 34 56 78';
  location = 'Paris, France';

  linkedinUrl = 'https://www.linkedin.com/';
  githubUrl = 'https://github.com/';

  isSubmitting = false;
  emailCopied = false;

  hasSubmitted = false;

  /** Alerte UI (faire une version backend plus tard) */
  alert: { type: AlertType; messageKey: string } | null = null;

  form = this.fb.group({
    name: ['', [Validators.required, Validators.minLength(2)]],
    email: ['', [Validators.required, Validators.email]],
    subject: ['', [Validators.required, Validators.minLength(3)]],
    message: ['', [Validators.required, Validators.minLength(10)]],
  });

  constructor(private fb: FormBuilder) {}

  control(name: 'name' | 'email' | 'subject' | 'message'): AbstractControl {
    return this.form.get(name)!;
  }

  showError(name: 'name' | 'email' | 'subject' | 'message'): boolean {
    const c = this.control(name);
    return c.invalid && (c.touched || this.hasSubmitted);
  }

  errorKey(name: 'name' | 'email' | 'subject' | 'message'): string {
    const c = this.control(name);
    if (!c.errors) return '';

    if (c.errors['required']) return `contact.form.errors.${name}`;
    if (name === 'email' && c.errors['email']) return 'contact.form.errors.email';
    if (c.errors['minlength']) return `contact.form.errors.${name}`;

    return `contact.form.errors.${name}`;
  }

  private showAlert(type: AlertType, messageKey: string) {
    this.alert = { type, messageKey };
    setTimeout(() => {
      if (this.alert?.messageKey === messageKey) this.alert = null;
    }, 3500);
  }

  dismissAlert() {
    this.alert = null;
  }

  async copyEmail(): Promise<void> {
    try {
      await navigator.clipboard.writeText(this.email);
      this.emailCopied = true;
      setTimeout(() => (this.emailCopied = false), 1600);
    } catch {
      // ignore
    }
  }

  onSubmit(): void {
    this.alert = null;
    this.hasSubmitted = true;

    if (this.form.invalid) {
      this.form.markAllAsTouched();
      return;
    }

    this.isSubmitting = true;

    setTimeout(() => {
      this.isSubmitting = false;

      const simulateError = false; // <- mettre "true" pour tester le message d’erreur

      if (simulateError) {
        this.showAlert('error', 'contact.form.alert.error');
        return;
      }

      this.showAlert('success', 'contact.form.alert.success');
      this.hasSubmitted = false;
      this.form.reset();
    }, 900);
  }
}