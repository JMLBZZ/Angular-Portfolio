import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormControl, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { ActivatedRoute, Router, RouterLink } from '@angular/router';

import { TextFieldComponent } from '../../shared/components/text-field/text-field.component';
import { TextAreaComponent } from '../../shared/components/text-area/text-area.component';
import { PrimaryButtonComponent } from '../../shared/components/primary-button/primary-button.component';
import { AdminProjectsApiService } from '../../core/api/admin-projects-api.service';
import { AdminProject, AdminProjectPayload } from '../../core/auth/auth.models';
import { extractApiErrorMessage } from '../../core/api/api-error.utils';

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
  ],
  templateUrl: './admin-project-form.component.html',
})
export class AdminProjectFormComponent implements OnInit {
  isEditMode = false;
  projectId: string | null = null;

  isLoading = false;
  isSubmitting = false;
  errorMessage = '';

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
    slug: new FormControl('', { nonNullable: true, validators: [Validators.required] }),
    title: new FormControl('', { nonNullable: true, validators: [Validators.required] }),
    category: new FormControl('fullstack', { nonNullable: true, validators: [Validators.required] }),
    type: new FormControl('personal', { nonNullable: true, validators: [Validators.required] }),

    image: new FormControl('', { nonNullable: true }),
    cover: new FormControl('', { nonNullable: true }),
    imagesInput: new FormControl('', { nonNullable: true }),

    descriptionFr: new FormControl('', { nonNullable: true, validators: [Validators.required] }),
    descriptionEn: new FormControl('', { nonNullable: true, validators: [Validators.required] }),

    longDescriptionFr: new FormControl('', { nonNullable: true }),
    longDescriptionEn: new FormControl('', { nonNullable: true }),

    stackInput: new FormControl('', { nonNullable: true, validators: [Validators.required] }),
    tagsInput: new FormControl('', { nonNullable: true, validators: [Validators.required] }),

    roleFr: new FormControl('', { nonNullable: true }),
    roleEn: new FormControl('', { nonNullable: true }),
    problemFr: new FormControl('', { nonNullable: true }),
    problemEn: new FormControl('', { nonNullable: true }),
    solutionFr: new FormControl('', { nonNullable: true }),
    solutionEn: new FormControl('', { nonNullable: true }),

    demoUrl: new FormControl('', { nonNullable: true }),
    githubUrl: new FormControl('', { nonNullable: true }),

    featured: new FormControl(false, { nonNullable: true }),
    showGithub: new FormControl(false, { nonNullable: true }),
    published: new FormControl(true, { nonNullable: true }),
    displayOrder: new FormControl(0, { nonNullable: true, validators: [Validators.min(0)] }),
  });

  constructor(
    private route: ActivatedRoute,
    private router: Router,
    private adminProjectsApi: AdminProjectsApiService
  ) {}

  ngOnInit(): void {
    this.projectId = this.route.snapshot.paramMap.get('id');
    this.isEditMode = !!this.projectId;

    if (this.projectId) {
      this.loadProject(this.projectId);
    }
  }

  loadProject(id: string): void {
    this.isLoading = true;
    this.errorMessage = '';

    this.adminProjectsApi.getById(id).subscribe({
      next: (project) => {
        this.patchForm(project);
        this.isLoading = false;
      },
      error: (error) => {
        this.errorMessage = extractApiErrorMessage(
          error,
          'Impossible de charger le projet à modifier.'
        );
        this.isLoading = false;
      },
    });
  }

  submit(): void {
    if (this.form.invalid) {
      this.form.markAllAsTouched();
      return;
    }

    this.isSubmitting = true;
    this.errorMessage = '';

    const payload = this.buildPayload();

    const request$ = this.isEditMode && this.projectId
      ? this.adminProjectsApi.update(this.projectId, payload)
      : this.adminProjectsApi.create(payload);

    request$.subscribe({
      next: () => {
        this.isSubmitting = false;
        this.router.navigate(['/admin/dashboard']);
      },
      error: (error) => {
        this.isSubmitting = false;
        this.errorMessage = extractApiErrorMessage(
          error,
          'L’enregistrement du projet a échoué.'
        );
      },
    });
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
      slug: raw.slug.trim(),
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

      longDescription: this.toLocalizedOptional(raw.longDescriptionFr, raw.longDescriptionEn),
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

  private toLocalizedOptional(fr: string, en: string): { fr: string; en: string } | null {
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
      .filter(Boolean);
  }

  private cleanString(value: string): string | undefined {
    const cleaned = value.trim();
    return cleaned ? cleaned : undefined;
  }

  get pageTitle(): string {
    return this.isEditMode ? 'Modifier un projet' : 'Créer un projet';
  }

  get submitLabel(): string {
    return this.isEditMode ? 'Enregistrer les modifications' : 'Créer le projet';
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
}