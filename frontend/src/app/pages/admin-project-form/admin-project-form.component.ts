import { Component, OnDestroy, OnInit, ElementRef, HostListener } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormControl, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { ActivatedRoute, Router, RouterLink } from '@angular/router';
import { Subscription, from, concatMap, finalize, toArray } from 'rxjs';
import { CdkDragDrop, DragDropModule, moveItemInArray } from '@angular/cdk/drag-drop';
import {
  ArrowLeftIcon,
  EyeIcon,
  FileTextIcon,
  GithubIcon,
  GripVerticalIcon,
  ImageIcon,
  ImagesIcon,
  InfoIcon,
  LanguagesIcon,
  LinkIcon,
  SaveIcon,
  Settings2Icon,
  StarIcon,
  UploadCloudIcon,
  XIcon,
  LucideAngularModule,
} from 'lucide-angular';


import { TextFieldComponent } from '../../shared/components/text-field/text-field.component';
import { TextAreaComponent } from '../../shared/components/text-area/text-area.component';
import { PrimaryButtonComponent } from '../../shared/components/primary-button/primary-button.component';
import { AdminProjectsApiService } from '../../core/api/admin-projects-api.service';
import { AdminProject, AdminProjectPayload } from '../../core/auth/auth.models';
import {
  extractApiErrorMessage,
  getApiFieldError,
  hasApiErrorCode,
} from '../../core/api/api-error.utils';
import { PendingChangesComponent } from '../../core/auth/pending-changes.guard';
import {
  applyApiErrorsToForm,
  clearApiErrorsFromForm,
} from '../../core/forms/apply-api-errors.util';
import { ToastService } from '../../shared/services/toast.service';
import {
  commaSeparatedListValidator,
  commaSeparatedUrlListValidator,
  optionalUrlValidator,
  slugValidator,
} from '../../shared/validators/project-form.validators';
import { FallbackImageDirective } from '../../shared/directives/fallback-image.directive';
import { AdminProjectImagesApiService } from '../../core/api/admin-project-images-api.service';
import { resolveMediaUrl } from '../../core/api/media-url.utils';
import { TranslationApiService } from '../../core/api/translation-api.service';

@Component({
  selector: 'app-admin-project-form',
  standalone: true,
  imports: [
    CommonModule,
    ReactiveFormsModule,
    RouterLink,
    TextFieldComponent,
    TextAreaComponent,
    PrimaryButtonComponent,
    FallbackImageDirective,
    DragDropModule,
    LucideAngularModule,
  ],
  templateUrl: './admin-project-form.component.html',
})
export class AdminProjectFormComponent
  implements OnInit, OnDestroy, PendingChangesComponent
{
  readonly ArrowLeftIcon = ArrowLeftIcon;
  readonly EyeIcon = EyeIcon;
  readonly FileTextIcon = FileTextIcon;
  readonly GithubIcon = GithubIcon;
  readonly GripVerticalIcon = GripVerticalIcon;
  readonly ImageIcon = ImageIcon;
  readonly ImagesIcon = ImagesIcon;
  readonly InfoIcon = InfoIcon;
  readonly LanguagesIcon = LanguagesIcon;
  readonly LinkIcon = LinkIcon;
  readonly SaveIcon = SaveIcon;
  readonly Settings2Icon = Settings2Icon;
  readonly StarIcon = StarIcon;
  readonly UploadCloudIcon = UploadCloudIcon;
  readonly XIcon = XIcon;

  isEditMode = false;
  projectId: string | null = null;

  isLoading = false;
  isSubmitting = false;
  isTranslating = false;
  errorMessage = '';

  isUploadingImage = false;
  isUploadingCover = false;
  isUploadingGallery = false;
  uploadErrorMessage = '';

  readonly acceptedImageTypes = 'image/png,image/jpeg,image/jpg,image/webp';

  private slugManuallyEdited = false;
  private subscriptions = new Subscription();

  readonly categoryOptions = [
    { value: 'front', label: 'Front' },
    { value: 'back', label: 'Back' },
    { value: 'fullstack', label: 'Fullstack' },
    { value: 'uiux', label: 'UI/UX' },
    { value: 'pao', label: 'PAO' },
    { value: 'other', label: 'Autre' },
  ];

  readonly typeOptions = [
    { value: 'professional', label: 'Professionnel' },
    { value: 'personal', label: 'Personnel' },
    { value: 'school', label: 'Scolaire' },
  ];

  readonly form = new FormGroup({
    slug: new FormControl('', {
      nonNullable: true,
      validators: [Validators.required, slugValidator()],
    }),
    title: new FormControl('', {
      nonNullable: true,
      validators: [Validators.required, Validators.maxLength(120)],
    }),
    category: new FormControl('fullstack', {
      nonNullable: true,
      validators: [Validators.required],
    }),
    type: new FormControl('personal', {
      nonNullable: true,
      validators: [Validators.required],
    }),

    image: new FormControl('', {
      nonNullable: true,
      validators: [optionalUrlValidator()],
    }),
    cover: new FormControl('', {
      nonNullable: true,
      validators: [optionalUrlValidator()],
    }),
    imagesInput: new FormControl('', {
      nonNullable: true,
      validators: [commaSeparatedUrlListValidator()],
    }),

    descriptionFr: new FormControl('', {
      nonNullable: true,
      validators: [Validators.required, Validators.maxLength(300)],
    }),
    descriptionEn: new FormControl('', {
      nonNullable: true,
      validators: [Validators.required, Validators.maxLength(300)],
    }),

    longDescriptionFr: new FormControl('', {
      nonNullable: true,
      validators: [Validators.maxLength(3000)],
    }),
    longDescriptionEn: new FormControl('', {
      nonNullable: true,
      validators: [Validators.maxLength(3000)],
    }),

    stackInput: new FormControl('', {
      nonNullable: true,
      validators: [commaSeparatedListValidator({ minItems: 1, unique: true })],
    }),
    tagsInput: new FormControl('', {
      nonNullable: true,
      validators: [commaSeparatedListValidator({ minItems: 1, unique: true })],
    }),

    roleFr: new FormControl('', {
      nonNullable: true,
      validators: [Validators.maxLength(1200)],
    }),
    roleEn: new FormControl('', {
      nonNullable: true,
      validators: [Validators.maxLength(1200)],
    }),
    problemFr: new FormControl('', {
      nonNullable: true,
      validators: [Validators.maxLength(1200)],
    }),
    problemEn: new FormControl('', {
      nonNullable: true,
      validators: [Validators.maxLength(1200)],
    }),
    solutionFr: new FormControl('', {
      nonNullable: true,
      validators: [Validators.maxLength(1200)],
    }),
    solutionEn: new FormControl('', {
      nonNullable: true,
      validators: [Validators.maxLength(1200)],
    }),

    demoUrl: new FormControl('', {
      nonNullable: true,
      validators: [optionalUrlValidator()],
    }),
    githubUrl: new FormControl('', {
      nonNullable: true,
      validators: [optionalUrlValidator()],
    }),

    featured: new FormControl(false, { nonNullable: true }),
    showGithub: new FormControl(false, { nonNullable: true }),
    published: new FormControl(true, { nonNullable: true }),
  });

  constructor(
    private route: ActivatedRoute,
    private router: Router,
    private adminProjectsApi: AdminProjectsApiService,
    private adminProjectImagesApi: AdminProjectImagesApiService,
    private translationApi: TranslationApiService,
    private toastService: ToastService,
    private elementRef: ElementRef<HTMLElement>
  ) {}

  ngOnInit(): void {
    this.projectId = this.route.snapshot.paramMap.get('id');
    this.isEditMode = !!this.projectId;

    this.setupSlugAutofill();
    this.setupSlugConflictCleanup();
    this.setupGlobalErrorCleanup();

    if (this.projectId) {
      this.loadProject(this.projectId);
    } else {
      this.form.markAsPristine();
    }
  }

  ngOnDestroy(): void {
    this.subscriptions.unsubscribe();
  }

  @HostListener('window:beforeunload', ['$event'])
  handleBeforeUnload(event: BeforeUnloadEvent): void {
    if (!this.hasUnsavedChanges) {
      return;
    }

    event.preventDefault();
    event.returnValue = '';
  }

  loadProject(id: string): void {
    this.isLoading = true;
    this.errorMessage = '';
    clearApiErrorsFromForm(this.form);

    this.adminProjectsApi.getById(id).subscribe({
      next: (project) => {
        clearApiErrorsFromForm(this.form);
        this.patchForm(project);
        this.slugManuallyEdited = true;
        this.form.markAsPristine();
        this.isLoading = false;
      },
      error: (error) => {
        this.errorMessage = extractApiErrorMessage(
          error,
          'Impossible de charger le projet à modifier.'
        );
        this.toastService.error(this.errorMessage);
        this.scrollToGlobalError();
        this.isLoading = false;
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
        const translationPatch = this.buildTranslationPatch(translatedFields);

        if (Object.keys(translationPatch).length === 0) {
          this.toastService.warning(
            'Aucune traduction exploitable n’a été renvoyée par le serveur.'
          );
          this.isTranslating = false;
          return;
        }

        this.form.patchValue(translationPatch);

        this.markTranslatedEnglishFieldsAsDirtyAndTouched(translationPatch);

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

  submit(): void {
    this.clearSlugAlreadyUsedError();
    this.errorMessage = '';
    clearApiErrorsFromForm(this.form);

    if (this.form.invalid) {
      this.form.markAllAsTouched();
      this.toastService.warning('Veuillez corriger les champs du formulaire.');
      this.focusFirstInvalidField();
      return;
    }

    this.isSubmitting = true;

    const payload = this.buildPayload();

    const request$ =
      this.isEditMode && this.projectId
        ? this.adminProjectsApi.update(this.projectId, payload)
        : this.adminProjectsApi.create(payload);

    request$.subscribe({
      next: () => {
        this.isSubmitting = false;
        this.errorMessage = '';
        clearApiErrorsFromForm(this.form);
        this.form.markAsPristine();

        this.toastService.success(
          this.isEditMode
            ? 'Projet modifié avec succès.'
            : 'Projet créé avec succès.'
        );

        this.router.navigate(['/admin/dashboard']);
      },
      error: (error) => {
        this.isSubmitting = false;
        applyApiErrorsToForm(this.form, error);

        if (hasApiErrorCode(error, 'SLUG_ALREADY_USED')) {
          const slugMessage =
            getApiFieldError(error, 'slug') ||
            'Ce slug est déjà utilisé par un autre projet.';

          this.setSlugAlreadyUsedError(slugMessage);
          this.errorMessage = slugMessage;
          this.toastService.error(slugMessage);
          this.focusSlugField();
          return;
        }

        this.errorMessage = extractApiErrorMessage(
          error,
          'L’enregistrement du projet a échoué.'
        );

        this.toastService.error(this.errorMessage);
        this.scrollToGlobalError();
      },
    });
  }

  onImageFileSelected(event: Event): void {
    const input = event.target as HTMLInputElement;
    const file = input.files?.[0];

    if (!file) {
      return;
    }

    this.uploadErrorMessage = '';
    this.isUploadingImage = true;

    this.adminProjectImagesApi
      .upload(file)
      .pipe(
        finalize(() => {
          this.isUploadingImage = false;
          input.value = '';
        })
      )
      .subscribe({
        next: (url) => {
          this.imageControl.setValue(url);
          this.imageControl.markAsDirty();
          this.imageControl.markAsTouched();
          this.toastService.success('Image principale uploadée avec succès.');
        },
        error: (error) => {
          this.uploadErrorMessage = extractApiErrorMessage(
            error,
            'L’upload de l’image principale a échoué.'
          );
          this.toastService.error(this.uploadErrorMessage);
        },
      });
  }

  onCoverFileSelected(event: Event): void {
    const input = event.target as HTMLInputElement;
    const file = input.files?.[0];

    if (!file) {
      return;
    }

    this.uploadErrorMessage = '';
    this.isUploadingCover = true;

    this.adminProjectImagesApi
      .upload(file)
      .pipe(
        finalize(() => {
          this.isUploadingCover = false;
          input.value = '';
        })
      )
      .subscribe({
        next: (url) => {
          this.coverControl.setValue(url);
          this.coverControl.markAsDirty();
          this.coverControl.markAsTouched();
          this.toastService.success('Cover uploadée avec succès.');
        },
        error: (error) => {
          this.uploadErrorMessage = extractApiErrorMessage(
            error,
            'L’upload de la cover a échoué.'
          );
          this.toastService.error(this.uploadErrorMessage);
        },
      });
  }

  onGalleryFilesSelected(event: Event): void {
    const input = event.target as HTMLInputElement;
    const files = input.files;

    if (!files || files.length === 0) {
      return;
    }

    this.uploadErrorMessage = '';
    this.isUploadingGallery = true;

    from(Array.from(files))
      .pipe(
        concatMap((file) => this.adminProjectImagesApi.upload(file)),
        toArray(),
        finalize(() => {
          this.isUploadingGallery = false;
          input.value = '';
        })
      )
      .subscribe({
        next: (uploadedUrls) => {
          const currentUrls = this.toArray(this.imagesInputControl.value);
          const mergedUrls = [...currentUrls, ...uploadedUrls].filter(
            (item, index, array) =>
              array.findIndex(
                (current) => current.toLowerCase() === item.toLowerCase()
              ) === index
          );

          this.imagesInputControl.setValue(mergedUrls.join(', '));
          this.imagesInputControl.markAsDirty();
          this.imagesInputControl.markAsTouched();

          this.toastService.success(
            uploadedUrls.length > 1
              ? 'Images de galerie uploadées avec succès.'
              : 'Image de galerie uploadée avec succès.'
          );
        },
        error: (error) => {
          this.uploadErrorMessage = extractApiErrorMessage(
            error,
            'L’upload des images de galerie a échoué.'
          );
          this.toastService.error(this.uploadErrorMessage);
        },
      });
  }

  onGalleryDrop(event: CdkDragDrop<string[]>): void {
    const items = this.toArray(this.imagesInputControl.value);

    moveItemInArray(items, event.previousIndex, event.currentIndex);

    this.imagesInputControl.setValue(items.join(', '));
    this.imagesInputControl.markAsDirty();
    this.imagesInputControl.markAsTouched();
  }

  removeMainImage(): void {
    this.imageControl.setValue('');
    this.imageControl.markAsDirty();
    this.imageControl.markAsTouched();
  }

  removeCoverImage(): void {
    this.coverControl.setValue('');
    this.coverControl.markAsDirty();
    this.coverControl.markAsTouched();
  }

  removeGalleryImage(index: number): void {
    const items = this.toArray(this.imagesInputControl.value);
    items.splice(index, 1);

    this.imagesInputControl.setValue(items.join(', '));
    this.imagesInputControl.markAsDirty();
    this.imagesInputControl.markAsTouched();
  }

  canDeactivate(): boolean {
    if (!this.hasUnsavedChanges) {
      return true;
    }

    return window.confirm(
      'Vous avez des modifications non enregistrées. Voulez-vous vraiment quitter cette page ?'
    );
  }

  private setupSlugAutofill(): void {
    const slugSubscription = this.slugControl.valueChanges.subscribe((value) => {
      const titleSlug = this.slugify(this.titleControl.value);

      if (value && value !== titleSlug) {
        this.slugManuallyEdited = true;
      }
    });

    const titleSubscription = this.titleControl.valueChanges.subscribe((title) => {
      if (this.slugManuallyEdited) {
        return;
      }

      const generatedSlug = this.slugify(title);

      this.slugControl.setValue(generatedSlug, {
        emitEvent: false,
      });
    });

    this.subscriptions.add(slugSubscription);
    this.subscriptions.add(titleSubscription);
  }

  private setupSlugConflictCleanup(): void {
    const slugConflictCleanupSubscription = this.slugControl.valueChanges.subscribe(() => {
      this.clearSlugAlreadyUsedError();
    });

    this.subscriptions.add(slugConflictCleanupSubscription);
  }

  private setupGlobalErrorCleanup(): void {
    const globalErrorCleanupSubscription = this.form.valueChanges.subscribe(() => {
      if (this.errorMessage) {
        this.errorMessage = '';
      }
    });

    this.subscriptions.add(globalErrorCleanupSubscription);
  }

  private buildTranslationFields(): Record<string, string> {
    const raw = this.form.getRawValue();

    return this.filterNonEmptyFields({
      descriptionFr: raw.descriptionFr,
      longDescriptionFr: raw.longDescriptionFr,
      roleFr: raw.roleFr,
      problemFr: raw.problemFr,
      solutionFr: raw.solutionFr,
    });
  }

  private filterNonEmptyFields(fields: Record<string, string>): Record<string, string> {
    return Object.entries(fields).reduce<Record<string, string>>((acc, [key, value]) => {
      const cleanedValue = value.trim();

      if (!cleanedValue) {
        return acc;
      }

      acc[key] = cleanedValue;
      return acc;
    }, {});
  }

  private buildTranslationPatch(
    translatedFields: Record<string, string>
  ): Partial<{
    descriptionEn: string;
    longDescriptionEn: string;
    roleEn: string;
    problemEn: string;
    solutionEn: string;
  }> {
    const patch: Partial<{
      descriptionEn: string;
      longDescriptionEn: string;
      roleEn: string;
      problemEn: string;
      solutionEn: string;
    }> = {};

    if (typeof translatedFields['descriptionEn'] === 'string') {
      patch.descriptionEn = translatedFields['descriptionEn'];
    }

    if (typeof translatedFields['longDescriptionEn'] === 'string') {
      patch.longDescriptionEn = translatedFields['longDescriptionEn'];
    }

    if (typeof translatedFields['roleEn'] === 'string') {
      patch.roleEn = translatedFields['roleEn'];
    }

    if (typeof translatedFields['problemEn'] === 'string') {
      patch.problemEn = translatedFields['problemEn'];
    }

    if (typeof translatedFields['solutionEn'] === 'string') {
      patch.solutionEn = translatedFields['solutionEn'];
    }

    return patch;
  }

  private markTranslatedEnglishFieldsAsDirtyAndTouched(
    translatedFields: Partial<{
      descriptionEn: string;
      longDescriptionEn: string;
      roleEn: string;
      problemEn: string;
      solutionEn: string;
    }>
  ): void {
    if (typeof translatedFields.descriptionEn === 'string') {
      this.descriptionEnControl.markAsDirty();
      this.descriptionEnControl.markAsTouched();
      this.descriptionEnControl.updateValueAndValidity();
    }

    if (typeof translatedFields.longDescriptionEn === 'string') {
      this.longDescriptionEnControl.markAsDirty();
      this.longDescriptionEnControl.markAsTouched();
      this.longDescriptionEnControl.updateValueAndValidity();
    }

    if (typeof translatedFields.roleEn === 'string') {
      this.roleEnControl.markAsDirty();
      this.roleEnControl.markAsTouched();
      this.roleEnControl.updateValueAndValidity();
    }

    if (typeof translatedFields.problemEn === 'string') {
      this.problemEnControl.markAsDirty();
      this.problemEnControl.markAsTouched();
      this.problemEnControl.updateValueAndValidity();
    }

    if (typeof translatedFields.solutionEn === 'string') {
      this.solutionEnControl.markAsDirty();
      this.solutionEnControl.markAsTouched();
      this.solutionEnControl.updateValueAndValidity();
    }
  }

  private patchForm(project: AdminProject): void {
    this.form.patchValue({
      slug: project.slug ?? '',
      title: project.title ?? '',
      category: project.category ?? 'fullstack',
      type: project.type ?? 'personal',

      image: project.image ?? '',
      cover: project.cover ?? '',
      imagesInput: (project.images ?? []).join(', '),

      descriptionFr: project.description?.fr ?? '',
      descriptionEn: project.description?.en ?? '',

      longDescriptionFr: project.longDescription?.fr ?? '',
      longDescriptionEn: project.longDescription?.en ?? '',

      stackInput: (project.stack ?? []).join(', '),
      tagsInput: (project.tags ?? []).join(', '),

      roleFr: project.role?.fr ?? '',
      roleEn: project.role?.en ?? '',
      problemFr: project.problem?.fr ?? '',
      problemEn: project.problem?.en ?? '',
      solutionFr: project.solution?.fr ?? '',
      solutionEn: project.solution?.en ?? '',

      demoUrl: project.demoUrl ?? '',
      githubUrl: project.githubUrl ?? '',

      featured: !!project.featured,
      showGithub: !!project.showGithub,
      published: project.published ?? true,
    });
  }

  private buildPayload(): AdminProjectPayload {
    const raw = this.form.getRawValue();

    return {
      slug: this.slugify(raw.slug),
      title: raw.title.trim(),
      category: raw.category,
      type: raw.type,

      image: this.cleanString(raw.image),
      cover: this.cleanString(raw.cover),
      images: this.toArray(raw.imagesInput),

      description: {
        fr: raw.descriptionFr.trim(),
        en: raw.descriptionEn.trim(),
      },

      longDescription: this.toLocalizedOptional(
        raw.longDescriptionFr,
        raw.longDescriptionEn
      ),
      stack: this.toArray(raw.stackInput),
      featured: raw.featured,

      role: this.toLocalizedOptional(raw.roleFr, raw.roleEn),
      problem: this.toLocalizedOptional(raw.problemFr, raw.problemEn),
      solution: this.toLocalizedOptional(raw.solutionFr, raw.solutionEn),

      demoUrl: this.cleanString(raw.demoUrl),
      tags: this.toArray(raw.tagsInput),

      githubUrl: this.cleanString(raw.githubUrl),
      showGithub: raw.showGithub,
      published: raw.published,
    };
  }

  private toLocalizedOptional(
    fr: string,
    en: string
  ): { fr: string; en: string } | null {
    const cleanFr = fr.trim();
    const cleanEn = en.trim();

    if (!cleanFr && !cleanEn) {
      return null;
    }

    return {
      fr: cleanFr,
      en: cleanEn,
    };
  }

  private toArray(value: string): string[] {
    return value
      .split(',')
      .map((item) => item.trim())
      .filter(Boolean)
      .filter((item, index, array) => {
        return (
          array.findIndex(
            (current) => current.toLowerCase() === item.toLowerCase()
          ) === index
        );
      });
  }

  private cleanString(value: string): string | undefined {
    const cleaned = value.trim();
    return cleaned ? cleaned : undefined;
  }

  private slugify(value: string): string {
    return value
      .normalize('NFD')
      .replace(/[\u0300-\u036f]/g, '')
      .toLowerCase()
      .trim()
      .replace(/[^a-z0-9\s-]/g, '')
      .replace(/\s+/g, '-')
      .replace(/-+/g, '-');
  }

  private resolvePreviewUrl(value: string): string | undefined {
    return resolveMediaUrl(value);
  }

  private focusFirstInvalidField(): void {
    setTimeout(() => {
      const firstInvalidField = this.elementRef.nativeElement.querySelector(
        'input.ng-invalid, textarea.ng-invalid, select.ng-invalid'
      ) as HTMLElement | null;

      if (!firstInvalidField) {
        return;
      }

      firstInvalidField.scrollIntoView({
        behavior: 'smooth',
        block: 'center',
      });

      firstInvalidField.focus();
    });
  }

  private focusSlugField(): void {
    setTimeout(() => {
      const slugField = this.elementRef.nativeElement.querySelector(
        '#project-slug'
      ) as HTMLElement | null;

      if (!slugField) {
        this.focusFirstInvalidField();
        return;
      }

      slugField.scrollIntoView({
        behavior: 'smooth',
        block: 'center',
      });

      slugField.focus();
    });
  }

  private scrollToGlobalError(): void {
    setTimeout(() => {
      const errorBlock = this.elementRef.nativeElement.querySelector(
        '#admin-project-form-global-error'
      ) as HTMLElement | null;

      if (!errorBlock) {
        return;
      }

      errorBlock.scrollIntoView({
        behavior: 'smooth',
        block: 'center',
      });

      errorBlock.focus();
    });
  }

  private setSlugAlreadyUsedError(message: string): void {
    const currentErrors = this.slugControl.errors ?? {};

    this.slugControl.setErrors({
      ...currentErrors,
      slugAlreadyUsed: message,
    });

    this.slugControl.markAsTouched();
  }

  private clearSlugAlreadyUsedError(): void {
    const currentErrors = this.slugControl.errors;

    if (!currentErrors || !currentErrors['slugAlreadyUsed']) {
      return;
    }

    const { slugAlreadyUsed, ...remainingErrors } = currentErrors;

    this.slugControl.setErrors(
      Object.keys(remainingErrors).length > 0 ? remainingErrors : null
    );
  }

  get hasUnsavedChanges(): boolean {
    return !this.isSubmitting && this.form.dirty;
  }

  get galleryPreviewUrls(): string[] {
    return this.toArray(this.imagesInputControl.value);
  }

  get galleryResolvedPreviewUrls(): string[] {
    return this.galleryPreviewUrls
      .map((url) => this.resolvePreviewUrl(url))
      .filter((url): url is string => !!url);
  }

  get mainImagePreviewUrl(): string | undefined {
    return this.resolvePreviewUrl(this.imageControl.value);
  }

  get coverPreviewUrl(): string | undefined {
    return this.resolvePreviewUrl(this.coverControl.value);
  }

  get hasImagePreview(): boolean {
    return !!this.mainImagePreviewUrl && this.imageControl.valid;
  }

  get hasCoverPreview(): boolean {
    return !!this.coverPreviewUrl && this.coverControl.valid;
  }

  get pageTitle(): string {
    return this.isEditMode ? 'Modifier un projet' : 'Créer un projet';
  }

  get submitLabel(): string {
    return this.isEditMode
      ? 'Enregistrer les modifications'
      : 'Créer le projet';
  }

  get titleLength(): number {
    return this.titleControl.value.length;
  }

  get descriptionFrLength(): number {
    return this.descriptionFrControl.value.length;
  }

  get descriptionEnLength(): number {
    return this.descriptionEnControl.value.length;
  }

  get slugControl(): FormControl<string> {
    return this.form.controls.slug;
  }

  get titleControl(): FormControl<string> {
    return this.form.controls.title;
  }

  get imageControl(): FormControl<string> {
    return this.form.controls.image;
  }

  get coverControl(): FormControl<string> {
    return this.form.controls.cover;
  }

  get imagesInputControl(): FormControl<string> {
    return this.form.controls.imagesInput;
  }

  get descriptionFrControl(): FormControl<string> {
    return this.form.controls.descriptionFr;
  }

  get descriptionEnControl(): FormControl<string> {
    return this.form.controls.descriptionEn;
  }

  get longDescriptionFrControl(): FormControl<string> {
    return this.form.controls.longDescriptionFr;
  }

  get longDescriptionEnControl(): FormControl<string> {
    return this.form.controls.longDescriptionEn;
  }

  get stackInputControl(): FormControl<string> {
    return this.form.controls.stackInput;
  }

  get tagsInputControl(): FormControl<string> {
    return this.form.controls.tagsInput;
  }

  get roleFrControl(): FormControl<string> {
    return this.form.controls.roleFr;
  }

  get roleEnControl(): FormControl<string> {
    return this.form.controls.roleEn;
  }

  get problemFrControl(): FormControl<string> {
    return this.form.controls.problemFr;
  }

  get problemEnControl(): FormControl<string> {
    return this.form.controls.problemEn;
  }

  get solutionFrControl(): FormControl<string> {
    return this.form.controls.solutionFr;
  }

  get solutionEnControl(): FormControl<string> {
    return this.form.controls.solutionEn;
  }

  get demoUrlControl(): FormControl<string> {
    return this.form.controls.demoUrl;
  }

  get githubUrlControl(): FormControl<string> {
    return this.form.controls.githubUrl;
  }

  trackByImageUrl(index: number, imageUrl: string): string {
    return `${index}-${imageUrl}`;
  }

  getSlugErrorMessage(): string {
    const control = this.slugControl;

    if (control.hasError('required')) {
      return 'Le slug est obligatoire.';
    }

    if (control.hasError('slugFormat')) {
      return 'Le slug doit contenir uniquement des lettres minuscules, chiffres et tirets.';
    }

    if (control.hasError('slugAlreadyUsed')) {
      return String(control.getError('slugAlreadyUsed'));
    }

    if (control.hasError('apiError')) {
      return String(control.getError('apiError'));
    }

    return '';
  }

  getUrlErrorMessage(control: FormControl<string>): string {
    if (control.hasError('apiError')) {
      return String(control.getError('apiError'));
    }

    if (control.hasError('invalidUrl')) {
      return 'Veuillez saisir une URL valide commençant par http:// ou https://, ou un chemin /uploads/...';
    }

    return '';
  }

  getListErrorMessage(control: FormControl<string>, label: string): string {
    if (control.hasError('apiError')) {
      return String(control.getError('apiError'));
    }

    if (control.hasError('minItems')) {
      return `Le champ ${label} doit contenir au moins un élément.`;
    }

    if (control.hasError('duplicatedItems')) {
      return `Le champ ${label} contient des doublons.`;
    }

    if (control.hasError('invalidUrlList')) {
      return `Chaque valeur du champ ${label} doit être une URL valide ou un chemin /uploads/...`;
    }

    return '';
  }

  getMaxLengthErrorMessage(control: FormControl<string>, label: string): string {
    if (control.hasError('apiError')) {
      return String(control.getError('apiError'));
    }

    const error = control.getError('maxlength');

    if (!error) {
      return '';
    }

    return `${label} dépasse la longueur maximale autorisée (${error.requiredLength} caractères).`;
  }
}