import { Component, OnDestroy, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormControl, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { ActivatedRoute, Router, RouterLink } from '@angular/router';
import { Subscription } from 'rxjs';

import { TextFieldComponent } from '../../shared/components/text-field/text-field.component';
import { TextAreaComponent } from '../../shared/components/text-area/text-area.component';
import { PrimaryButtonComponent } from '../../shared/components/primary-button/primary-button.component';
import { AdminProjectsApiService } from '../../core/api/admin-projects-api.service';
import { AdminProject, AdminProjectPayload } from '../../core/auth/auth.models';
import { extractApiErrorMessage } from '../../core/api/api-error.utils';
import { PendingChangesComponent } from '../../core/auth/pending-changes.guard';
import { ToastService } from '../../shared/services/toast.service';
import {
  commaSeparatedListValidator,
  commaSeparatedUrlListValidator,
  optionalUrlValidator,
  slugValidator,
} from '../../shared/validators/project-form.validators';
import { FallbackImageDirective } from '../../shared/directives/fallback-image.directive';

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
  ],
  templateUrl: './admin-project-form.component.html',
})
export class AdminProjectFormComponent
  implements OnInit, OnDestroy, PendingChangesComponent
{
  isEditMode = false;
  projectId: string | null = null;

  isLoading = false;
  isSubmitting = false;
  errorMessage = '';

  /**
   * Permet de ne plus écraser automatiquement le slug si l'utilisateur l'a modifié à la main.
   */
  private slugManuallyEdited = false;

  /**
   * Utilisé pour nettoyer les subscriptions.
   */
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
    displayOrder: new FormControl(0, {
      nonNullable: true,
      validators: [Validators.min(0), Validators.max(9999)],
    }),
  });

  constructor(
    private route: ActivatedRoute,
    private router: Router,
    private adminProjectsApi: AdminProjectsApiService,
    private toastService: ToastService
  ) {}

  ngOnInit(): void {
    this.projectId = this.route.snapshot.paramMap.get('id');
    this.isEditMode = !!this.projectId;

    this.setupSlugAutofill();

    if (this.projectId) {
      this.loadProject(this.projectId);
    } else {
      this.form.markAsPristine();
    }
  }

  ngOnDestroy(): void {
    this.subscriptions.unsubscribe();
  }

  loadProject(id: string): void {
    this.isLoading = true;
    this.errorMessage = '';

    this.adminProjectsApi.getById(id).subscribe({
      next: (project) => {
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
        this.isLoading = false;
      },
    });
  }

  submit(): void {
    if (this.form.invalid) {
      this.form.markAllAsTouched();
      this.toastService.warning('Veuillez corriger les champs du formulaire.');
      return;
    }

    this.isSubmitting = true;
    this.errorMessage = '';

    const payload = this.buildPayload();

    const request$ =
      this.isEditMode && this.projectId
        ? this.adminProjectsApi.update(this.projectId, payload)
        : this.adminProjectsApi.create(payload);

    request$.subscribe({
      next: () => {
        this.isSubmitting = false;
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
        this.errorMessage = extractApiErrorMessage(
          error,
          'L’enregistrement du projet a échoué.'
        );
        this.toastService.error(this.errorMessage);
      },
    });
  }

  canDeactivate(): boolean {
    if (this.isSubmitting || !this.form.dirty) {
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
      displayOrder: project.displayOrder ?? 0,
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
      displayOrder: Number(raw.displayOrder ?? 0),
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
        return array.findIndex((current) => current.toLowerCase() === item.toLowerCase()) === index;
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

  get galleryPreviewUrls(): string[] {
    return this.toArray(this.imagesInputControl.value);
  }

  get hasImagePreview(): boolean {
    return !!this.imageControl.value.trim() && this.imageControl.valid;
  }

  get hasCoverPreview(): boolean {
    return !!this.coverControl.value.trim() && this.coverControl.valid;
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

  get displayOrderControl(): FormControl<number> {
    return this.form.controls.displayOrder;
  }

  getSlugErrorMessage(): string {
    const control = this.slugControl;

    if (control.hasError('required')) {
      return 'Le slug est obligatoire.';
    }

    if (control.hasError('slugFormat')) {
      return 'Le slug doit contenir uniquement des lettres minuscules, chiffres et tirets.';
    }

    return '';
  }

  getUrlErrorMessage(control: FormControl<string>): string {
    if (control.hasError('invalidUrl')) {
      return 'Veuillez saisir une URL valide commençant par http:// ou https://';
    }

    return '';
  }

  getListErrorMessage(control: FormControl<string>, label: string): string {
    if (control.hasError('minItems')) {
      return `Le champ ${label} doit contenir au moins un élément.`;
    }

    if (control.hasError('duplicatedItems')) {
      return `Le champ ${label} contient des doublons.`;
    }

    if (control.hasError('invalidUrlList')) {
      return `Chaque URL du champ ${label} doit être valide.`;
    }

    return '';
  }

  getMaxLengthErrorMessage(control: FormControl<string>, label: string): string {
    const error = control.getError('maxlength');

    if (!error) {
      return '';
    }

    return `${label} dépasse la longueur maximale autorisée (${error.requiredLength} caractères).`;
  }

  getDisplayOrderErrorMessage(): string {
    const control = this.displayOrderControl;

    if (control.hasError('min')) {
      return 'L’ordre d’affichage ne peut pas être négatif.';
    }

    if (control.hasError('max')) {
      return 'L’ordre d’affichage ne peut pas dépasser 9999.';
    }

    return '';
  }
}