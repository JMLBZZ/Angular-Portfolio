import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { TranslateModule, TranslateService } from '@ngx-translate/core';
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

import { ToastService } from '../../shared/services/toast.service';
import { ContactApiService } from '../../core/api/contact-api.service';

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

  form = this.fb.group({
    name: this.fb.control('', [Validators.required, Validators.minLength(2)]),
    email: this.fb.control('', [Validators.required, Validators.email]),
    subject: this.fb.control('', [Validators.required, Validators.minLength(3)]),
    message: this.fb.control('', [Validators.required, Validators.minLength(10)]),
    // honeyspot control
    website: this.fb.control(''),
  });

  constructor(
    private fb: FormBuilder,
    private contactApi: ContactApiService,
    private toastService: ToastService,
    private translate: TranslateService
  ) {}

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

  async copyEmail(): Promise<void> {
    try {
      await navigator.clipboard.writeText(this.email);

      this.toastService.success(
        this.translate.instant('contact.form.alert.emailCopied')
      );

      this.emailCopied = true;
      setTimeout(() => {
        this.emailCopied = false;
      }, 1600);
    } catch {
      this.toastService.error(
        this.translate.instant('contact.form.alert.copyError')
      );
    }
  }

  onSubmit(): void {
    this.hasSubmitted = true;

    if (this.form.invalid) {
      this.form.markAllAsTouched();
      return;
    }

    this.isSubmitting = true;

    const payload = {
      name: this.nameCtrl.value ?? '',
      email: this.emailCtrl.value ?? '',
      subject: this.subjectCtrl.value ?? '',
      message: this.messageCtrl.value ?? '',
      website: this.form.get('website')?.value ?? '',
    };

    this.contactApi.send(payload).subscribe({
      next: (res) => {
        this.isSubmitting = false;

        if (res?.success) {
          this.toastService.success(
            this.translate.instant('contact.form.alert.success')
          );

          this.hasSubmitted = false;

          this.form.reset({
            name: '',
            email: '',
            subject: '',
            message: '',
            website: '',
          });

          return;
        }

        const errorCode = res?.error?.code ?? 'UNKNOWN_ERROR';
        this.showErrorToastByCode(errorCode);
      },

      error: (err) => {
        this.isSubmitting = false;

        const errorCode = err?.error?.error?.code ?? 'UNKNOWN_ERROR';
        this.showErrorToastByCode(errorCode);
      },
    });
  }

  private showErrorToastByCode(code: string): void {
    switch (code) {
      case 'RATE_LIMIT':
        this.toastService.warning(
          this.translate.instant('contact.form.alert.rateLimit')
        );
        break;

      case 'SPAM_DETECTED':
        this.toastService.error(
          this.translate.instant('contact.form.alert.spam')
        );
        break;

      case 'SMTP_ERROR':
        this.toastService.error(
          this.translate.instant('contact.form.alert.smtpError')
        );
        break;

      case 'VALIDATION_ERROR':
        this.toastService.error(
          this.translate.instant('contact.form.alert.validationError')
        );
        break;

      default:
        this.toastService.error(
          this.translate.instant('contact.form.alert.error')
        );
        break;
    }
  }
}