import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { TranslateModule } from '@ngx-translate/core';
import {
  ReactiveFormsModule,
  FormBuilder,
  Validators,
  AbstractControl,
  FormControl,
} from '@angular/forms';
import { RevealOnScrollDirective } from '../../shared/directives/reveal-on-scroll.directive';
import { IconButtonComponent } from '../../shared/components/icon-button/icon-button.component';
import { TextFieldComponent } from '../../shared/components/text-field/text-field.component';
import { TextAreaComponent } from '../../shared/components/text-area/text-area.component';
import { PrimaryButtonComponent } from '../../shared/components/primary-button/primary-button.component';
import { SecondaryButtonComponent } from '../../shared/components/secondary-button/secondary-button.component';

type AlertType = 'success' | 'error';

@Component({
  selector: 'app-contact-section',
  standalone: true,
  imports: [
    CommonModule,
    TranslateModule,
    ReactiveFormsModule,
    RevealOnScrollDirective,
    IconButtonComponent,
    TextFieldComponent,
    TextAreaComponent,
    PrimaryButtonComponent,
    SecondaryButtonComponent,
  ],
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

  alert: { type: AlertType; messageKey: string } | null = null;

  form = this.fb.group({
    name: this.fb.control('', [Validators.required, Validators.minLength(2)]),
    email: this.fb.control('', [Validators.required, Validators.email]),
    subject: this.fb.control('', [Validators.required, Validators.minLength(3)]),
    message: this.fb.control('', [Validators.required, Validators.minLength(10)]),
  });

  constructor(private fb: FormBuilder) {}

  // ✅ helpers typés FormControl pour le composant
  get nameCtrl(): FormControl<string> {
    return this.form.get('name') as FormControl<string>;
  }
  get emailCtrl(): FormControl<string> {
    return this.form.get('email') as FormControl<string>;
  }
  get subjectCtrl(): FormControl<string> {
    return this.form.get('subject') as FormControl<string>;
  }
  get messageCtrl(): FormControl<string> {
    return this.form.get('message') as FormControl<string>;
  }

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

      const simulateError = false;

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