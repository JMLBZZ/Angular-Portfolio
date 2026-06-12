import { Component, ElementRef, OnDestroy, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import {
  FormControl,
  FormGroup,
  ReactiveFormsModule,
  Validators,
} from '@angular/forms';
import { RouterLink } from '@angular/router';
import { Subscription } from 'rxjs';
import {
  BookOpenTextIcon,
  EyeIcon,
  FileTextIcon,
  LanguagesIcon,
  SaveIcon,
  ScaleIcon,
  ShieldCheckIcon,
  LucideAngularModule,
} from 'lucide-angular';

import { AdminLegalContentApiService } from '../../core/api/admin-legal-content-api.service';
import { TranslationApiService } from '../../core/api/translation-api.service';
import { extractApiErrorMessage } from '../../core/api/api-error.utils';
import {
  applyApiErrorsToForm,
  clearApiErrorsFromForm,
} from '../../core/forms/apply-api-errors.util';
import { PendingChangesComponent } from '../../core/auth/pending-changes.guard';
import { AdminFloatingActionsComponent } from '../../shared/components/admin-floating-actions/admin-floating-actions.component';
import {
  handleInvalidAdminForm,
  scrollToSelector,
  setupAdminFormErrorCleanup,
} from '../../shared/utils/admin-form.utils';
import { ToastService } from '../../shared/services/toast.service';
import { TextFieldComponent } from '../../shared/components/text-field/text-field.component';
import { PrimaryButtonComponent } from '../../shared/components/primary-button/primary-button.component';
import { RichTextEditorComponent } from '../../shared/components/rich-text-editor/rich-text-editor.component';
import { LegalContent } from '../../shared/models/legal.model';

@Component({
  selector: 'app-admin-legal',
  standalone: true,
  imports: [
    CommonModule,
    ReactiveFormsModule,
    RouterLink,
    TextFieldComponent,
    PrimaryButtonComponent,
    RichTextEditorComponent,
    LucideAngularModule,
    AdminFloatingActionsComponent,
  ],
  templateUrl: './admin-legal.component.html',
})
export class AdminLegalComponent implements OnInit, OnDestroy, PendingChangesComponent {
  readonly BookOpenTextIcon = BookOpenTextIcon;
  readonly EyeIcon = EyeIcon;
  readonly FileTextIcon = FileTextIcon;
  readonly LanguagesIcon = LanguagesIcon;
  readonly SaveIcon = SaveIcon;
  readonly ScaleIcon = ScaleIcon;
  readonly ShieldCheckIcon = ShieldCheckIcon;

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
    contentFr: new FormControl('', {
      nonNullable: true,
      validators: [Validators.required, Validators.maxLength(20000)],
    }),
    contentEn: new FormControl('', {
      nonNullable: true,
      validators: [Validators.required, Validators.maxLength(20000)],
    }),
  });

  constructor(
    private adminLegalApi: AdminLegalContentApiService,
    private translationApi: TranslationApiService,
    private toastService: ToastService,
    private elementRef: ElementRef<HTMLElement>
  ) {}

  ngOnInit(): void {
    this.loadLegalContent();

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

  cancelChanges(): void {
    if (!this.form.dirty || this.isSubmitting || this.isTranslating) {
      return;
    }

    const confirmed = window.confirm(
      'Vous avez des modifications non enregistrées. Voulez-vous vraiment les annuler ?'
    );

    if (!confirmed) {
      return;
    }

    this.loadLegalContent();
    this.toastService.info('Modifications annulées.');
  }

  loadLegalContent(): void {
    this.isLoading = true;
    this.errorMessage = '';
    clearApiErrorsFromForm(this.form);

    this.adminLegalApi.get().subscribe({
      next: (legalContent) => {
        this.isLoading = false;
        clearApiErrorsFromForm(this.form);
        this.patchForm(legalContent);
        this.form.markAsPristine();
      },
      error: (error) => {
        this.isLoading = false;
        this.errorMessage = extractApiErrorMessage(
          error,
          'Impossible de charger la page légale.'
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

    const fieldsToTranslate = {
      titleEn: this.form.controls.titleFr.value,
      contentEn: this.form.controls.contentFr.value,
    };

    if (!fieldsToTranslate.titleEn.trim() && !fieldsToTranslate.contentEn.trim()) {
      this.toastService.warning(
        'Renseigne au moins un champ français avant de lancer la traduction.'
      );
      return;
    }

    this.isTranslating = true;

    this.translationApi.translateFrToEn(fieldsToTranslate).subscribe({
      next: (translatedFields) => {
        if (translatedFields['titleEn']) {
          this.form.controls.titleEn.setValue(translatedFields['titleEn']);
        }

        if (translatedFields['contentEn']) {
          this.form.controls.contentEn.setValue(translatedFields['contentEn']);
        }

        this.form.markAsDirty();
        this.isTranslating = false;
        this.toastService.success('Traduction terminée.');
      },
      error: (error) => {
        this.isTranslating = false;
        this.errorMessage = extractApiErrorMessage(
          error,
          'La traduction automatique a échoué.'
        );
        this.toastService.error(this.errorMessage);
        this.scrollToGlobalError();
      },
    });
  }

  save(): void {
    if (this.isSubmitting || this.isTranslating) {
      return;
    }

    clearApiErrorsFromForm(this.form);

    if (this.form.invalid) {
      handleInvalidAdminForm({
        form: this.form,
        container: this.elementRef.nativeElement,
        toastService: this.toastService,
      });
      return;
    }

    this.isSubmitting = true;
    this.errorMessage = '';

    this.adminLegalApi.update(this.buildPayload()).subscribe({
      next: (savedContent) => {
        this.isSubmitting = false;
        clearApiErrorsFromForm(this.form);
        this.patchForm(savedContent);
        this.form.markAsPristine();
        this.toastService.success('Page légale enregistrée.');
      },
      error: (error) => {
        this.isSubmitting = false;
        applyApiErrorsToForm(this.form, error);
        this.errorMessage = extractApiErrorMessage(
          error,
          'Impossible d’enregistrer la page légale.'
        );
        this.toastService.error(this.errorMessage);
        this.scrollToGlobalError();
      },
    });
  }

  private patchForm(legalContent: LegalContent): void {
    this.form.patchValue({
      titleFr: legalContent.title.fr,
      titleEn: legalContent.title.en,
      contentFr: legalContent.content.fr,
      contentEn: legalContent.content.en,
    });
  }

  private buildPayload(): LegalContent {
    return {
      title: {
        fr: this.form.controls.titleFr.value.trim(),
        en: this.form.controls.titleEn.value.trim(),
      },
      content: {
        fr: this.form.controls.contentFr.value.trim(),
        en: this.form.controls.contentEn.value.trim(),
      },
    };
  }

  private scrollToGlobalError(): void {
    scrollToSelector(this.elementRef.nativeElement, '#admin-legal-global-error');
  }
}