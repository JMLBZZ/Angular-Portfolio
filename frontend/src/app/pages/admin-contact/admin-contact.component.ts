import { Component, ElementRef, OnDestroy, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormControl, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { RouterLink } from '@angular/router';
import { Subscription } from 'rxjs';
import {
  AtSignIcon,
  GithubIcon,
  LanguagesIcon,
  LinkedinIcon,
  MailIcon,
  MapPinIcon,
  MessageSquareTextIcon,
  PhoneIcon,
  SaveIcon,
  LucideAngularModule,
} from 'lucide-angular';

import { TextFieldComponent } from '../../shared/components/text-field/text-field.component';
import { PrimaryButtonComponent } from '../../shared/components/primary-button/primary-button.component';
import { ToastService } from '../../shared/services/toast.service';
import { AdminContactApiService } from '../../core/api/admin-contact-api.service';
import { Contact } from '../../shared/models/contact.model';
import { extractApiErrorMessage } from '../../core/api/api-error.utils';
import { applyApiErrorsToForm, clearApiErrorsFromForm } from '../../core/forms/apply-api-errors.util';
import { optionalUrlValidator } from '../../shared/validators/project-form.validators';
import {
  handleInvalidAdminForm,
  scrollToSelector,
  setupAdminFormErrorCleanup,
} from '../../shared/utils/admin-form.utils';
import { TranslationApiService } from '../../core/api/translation-api.service';
import { PendingChangesComponent } from '../../core/auth/pending-changes.guard';

@Component({
  selector: 'app-admin-contact',
  standalone: true,
  imports: [
    CommonModule,
    ReactiveFormsModule,
    RouterLink,
    TextFieldComponent,
    PrimaryButtonComponent,
    LucideAngularModule,
  ],
  templateUrl: './admin-contact.component.html',
})
export class AdminContactComponent implements OnInit, OnDestroy, PendingChangesComponent {
  readonly AtSignIcon = AtSignIcon;
  readonly GithubIcon = GithubIcon;
  readonly LanguagesIcon = LanguagesIcon;
  readonly LinkedinIcon = LinkedinIcon;
  readonly MailIcon = MailIcon;
  readonly MapPinIcon = MapPinIcon;
  readonly MessageSquareTextIcon = MessageSquareTextIcon;
  readonly PhoneIcon = PhoneIcon;
  readonly SaveIcon = SaveIcon;

  isLoading = false;
  isSubmitting = false;
  isTranslating = false;
  errorMessage = '';

  private subscriptions = new Subscription();

  readonly form = new FormGroup({
    titleFr: new FormControl('', {
      nonNullable: true,
      validators: [Validators.required, Validators.maxLength(255)],
    }),
    titleEn: new FormControl('', {
      nonNullable: true,
      validators: [Validators.required, Validators.maxLength(255)],
    }),
    subtitleFr: new FormControl('', {
      nonNullable: true,
      validators: [Validators.required, Validators.maxLength(255)],
    }),
    subtitleEn: new FormControl('', {
      nonNullable: true,
      validators: [Validators.required, Validators.maxLength(255)],
    }),
    email: new FormControl('', {
      nonNullable: true,
      validators: [Validators.required, Validators.email, Validators.maxLength(160)],
    }),
    phone: new FormControl('', {
      nonNullable: true,
      validators: [Validators.maxLength(80)],
    }),
    location: new FormControl('', {
      nonNullable: true,
      validators: [Validators.maxLength(160)],
    }),
    linkedinUrl: new FormControl('', {
      nonNullable: true,
      validators: [optionalUrlValidator(), Validators.maxLength(255)],
    }),
    githubUrl: new FormControl('', {
      nonNullable: true,
      validators: [optionalUrlValidator(), Validators.maxLength(255)],
    }),
  });

  constructor(
    private adminContactApi: AdminContactApiService,
    private translationApi: TranslationApiService,
    private toastService: ToastService,
    private elementRef: ElementRef<HTMLElement>
  ) {}

  ngOnInit(): void {
    this.loadContact();

    this.subscriptions.add(
      setupAdminFormErrorCleanup(this.form, () => {
        if (this.errorMessage) {
          this.errorMessage = '';
        }
      })
    );
  }

  ngOnDestroy(): void {
    this.subscriptions.unsubscribe();
  }
  canDeactivate(): boolean {
    if (!this.form.dirty || this.isSubmitting) {
      return true;
    }

    return window.confirm(
      'Vous avez des modifications non enregistrées. Voulez-vous vraiment quitter cette page ?'
    );
  }

  loadContact(): void {
    this.isLoading = true;
    this.errorMessage = '';
    clearApiErrorsFromForm(this.form);

    this.adminContactApi.get().subscribe({
      next: (contact) => {
        this.isLoading = false;
        clearApiErrorsFromForm(this.form);
        this.form.setValue({
          titleFr: contact.title.fr,
          titleEn: contact.title.en,
          subtitleFr: contact.subtitle.fr,
          subtitleEn: contact.subtitle.en,
          email: contact.email ?? '',
          phone: contact.phone ?? '',
          location: contact.location ?? '',
          linkedinUrl: contact.linkedinUrl ?? '',
          githubUrl: contact.githubUrl ?? '',
        });
        this.form.markAsPristine();
      },
      error: (error) => {
        this.isLoading = false;
        this.errorMessage = extractApiErrorMessage(
          error,
          'Impossible de charger les données du contact.'
        );
        this.toastService.error(this.errorMessage);
        this.scrollToGlobalError();
      },
    });
  }

  translateAllToEnglish(): void {
    if (this.isSubmitting || this.isTranslating) {
      return;
    }

    const fieldsToTranslate = this.buildTranslationFields();

    if (Object.keys(fieldsToTranslate).length === 0) {
      this.toastService.warning(
        'Renseigne au moins un champ français avant de lancer la traduction.'
      );
      return;
    }

    this.isTranslating = true;

    this.translationApi.translateFrToEn(fieldsToTranslate).subscribe({
      next: (translatedFields) => {
        let translatedCount = 0;

        translatedCount += this.applyTranslatedValue(
          this.form.controls.titleEn,
          translatedFields['titleEn']
        );

        translatedCount += this.applyTranslatedValue(
          this.form.controls.subtitleEn,
          translatedFields['subtitleEn']
        );

        if (translatedCount === 0) {
          this.toastService.warning(
            'Aucune traduction exploitable n’a été renvoyée par le serveur.'
          );
          this.isTranslating = false;
          return;
        }

        this.toastService.success('Les champs anglais ont été mis à jour.');
        this.isTranslating = false;
      },
      error: (error) => {
        const message = extractApiErrorMessage(
          error,
          'La traduction automatique a échoué.'
        );

        this.toastService.error(message);
        this.isTranslating = false;
      },
    });
  }

  save(): void {
    this.errorMessage = '';
    clearApiErrorsFromForm(this.form);

    if (this.form.invalid) {
      handleInvalidAdminForm({
        form: this.form,
        container: this.elementRef.nativeElement,
        toastService: this.toastService,
        message: 'Veuillez corriger les champs du formulaire.',
        scopeSelector: '#admin-contact-form',
      });
      return;
    }

    this.isSubmitting = true;

    const payload: Contact = {
      title: {
        fr: this.form.controls.titleFr.value,
        en: this.form.controls.titleEn.value,
      },
      subtitle: {
        fr: this.form.controls.subtitleFr.value,
        en: this.form.controls.subtitleEn.value,
      },
      email: this.form.controls.email.value,
      phone: this.form.controls.phone.value,
      location: this.form.controls.location.value,
      linkedinUrl: this.form.controls.linkedinUrl.value,
      githubUrl: this.form.controls.githubUrl.value,
    };

    this.adminContactApi.update(payload).subscribe({
      next: (contact) => {
        this.isSubmitting = false;
        this.errorMessage = '';

        clearApiErrorsFromForm(this.form);
        this.form.setValue({
          titleFr: contact.title.fr,
          titleEn: contact.title.en,
          subtitleFr: contact.subtitle.fr,
          subtitleEn: contact.subtitle.en,
          email: contact.email ?? '',
          phone: contact.phone ?? '',
          location: contact.location ?? '',
          linkedinUrl: contact.linkedinUrl ?? '',
          githubUrl: contact.githubUrl ?? '',
        });
        this.form.markAsPristine();

        this.toastService.success('Contact enregistré avec succès.');
      },
      error: (error) => {
        this.isSubmitting = false;
        applyApiErrorsToForm(this.form, error);
        this.errorMessage = extractApiErrorMessage(
          error,
          'Impossible d’enregistrer le contact.'
        );
        this.toastService.error(this.errorMessage);
        this.scrollToGlobalError();
      },
    });
  }

  private buildTranslationFields(): Record<string, string> {
    const fields: Record<string, string> = {};

    this.addTranslationField(fields, 'titleFr', this.form.controls.titleFr.value);
    this.addTranslationField(fields, 'subtitleFr', this.form.controls.subtitleFr.value);

    return fields;
  }

  private addTranslationField(
    fields: Record<string, string>,
    key: string,
    value: string
  ): void {
    const cleanedValue = value.trim();

    if (!cleanedValue) {
      return;
    }

    fields[key] = cleanedValue;
  }

  private applyTranslatedValue(
    control: FormControl<string>,
    translatedValue: unknown
  ): number {
    if (typeof translatedValue !== 'string') {
      return 0;
    }

    control.setValue(translatedValue);
    control.markAsDirty();
    control.markAsTouched();
    control.updateValueAndValidity();

    return 1;
  }

  private scrollToGlobalError(): void {
    scrollToSelector(
      this.elementRef.nativeElement,
      '#admin-contact-global-error'
    );
  }
}