import { Component, ElementRef, OnDestroy, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { AbstractControl } from '@angular/forms';
import {
  FormArray,
  FormControl,
  FormGroup,
  ReactiveFormsModule,
  Validators,
} from '@angular/forms';
import { RouterLink } from '@angular/router';
import {
  BookOpenIcon,
  BriefcaseBusinessIcon,
  HeartHandshakeIcon,
  ImageIcon,
  InfoIcon,
  LanguagesIcon,
  PlusIcon,
  RotateCcwIcon,
  SaveIcon,
  SparklesIcon,
  UploadCloudIcon,
  UserRoundIcon,
  LucideAngularModule,
} from 'lucide-angular';


import { TextFieldComponent } from '../../shared/components/text-field/text-field.component';
import { TextAreaComponent } from '../../shared/components/text-area/text-area.component';
import { PrimaryButtonComponent } from '../../shared/components/primary-button/primary-button.component';
import { ToastService } from '../../shared/services/toast.service';
import { AdminAboutApiService } from '../../core/api/admin-about-api.service';
import { resolveMediaUrl } from '../../core/api/media-url.utils';
import { AboutContent } from '../../shared/models/about.model';
import { extractApiErrorMessage } from '../../core/api/api-error.utils';
import { applyApiErrorsToForm, clearApiErrorsFromForm } from '../../core/forms/apply-api-errors.util';
import { PendingChangesComponent } from '../../core/auth/pending-changes.guard';
import { Subscription } from 'rxjs';
import {
  handleInvalidAdminForm,
  scrollToSelector,
  setupAdminFormErrorCleanup,
} from '../../shared/utils/admin-form.utils';
import { TranslationApiService } from '../../core/api/translation-api.service';

@Component({
  selector: 'app-admin-about',
  standalone: true,
  imports: [
    CommonModule,
    ReactiveFormsModule,
    RouterLink,
    TextFieldComponent,
    TextAreaComponent,
    PrimaryButtonComponent,
    LucideAngularModule,
  ],
  templateUrl: './admin-about.component.html',
})
export class AdminAboutComponent implements OnInit, OnDestroy, PendingChangesComponent {
  readonly BookOpenIcon = BookOpenIcon;
  readonly BriefcaseBusinessIcon = BriefcaseBusinessIcon;
  readonly HeartHandshakeIcon = HeartHandshakeIcon;
  readonly ImageIcon = ImageIcon;
  readonly InfoIcon = InfoIcon;
  readonly LanguagesIcon = LanguagesIcon;
  readonly PlusIcon = PlusIcon;
  readonly RotateCcwIcon = RotateCcwIcon;
  readonly SaveIcon = SaveIcon;
  readonly SparklesIcon = SparklesIcon;
  readonly UploadCloudIcon = UploadCloudIcon;
  readonly UserRoundIcon = UserRoundIcon;

  readonly fallbackAvatarUrl = '/assets/about/avatar.png';
  readonly maxProfileImageSize = 5 * 1024 * 1024;

  isLoading = false;
  isSubmitting = false;
  isTranslating = false;
  isUploadingProfileImage = false;
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
    profileName: new FormControl('', {
      nonNullable: true,
      validators: [Validators.required, Validators.maxLength(120)],
    }),
    profileImageUrl: new FormControl('', {
      nonNullable: true,
      validators: [Validators.maxLength(1000)],
    }),
    profileRoleFr: new FormControl('', {
      nonNullable: true,
      validators: [Validators.required, Validators.maxLength(120)],
    }),
    profileRoleEn: new FormControl('', {
      nonNullable: true,
      validators: [Validators.required, Validators.maxLength(120)],
    }),
    bioFr: new FormControl('', {
      nonNullable: true,
      validators: [Validators.required, Validators.maxLength(2000)],
    }),
    bioEn: new FormControl('', {
      nonNullable: true,
      validators: [Validators.required, Validators.maxLength(2000)],
    }),
    locationFr: new FormControl('', {
      nonNullable: true,
      validators: [Validators.required, Validators.maxLength(120)],
    }),
    locationEn: new FormControl('', {
      nonNullable: true,
      validators: [Validators.required, Validators.maxLength(120)],
    }),
    timelineTitleFr: new FormControl('', {
      nonNullable: true,
      validators: [Validators.required, Validators.maxLength(255)],
    }),
    timelineTitleEn: new FormControl('', {
      nonNullable: true,
      validators: [Validators.required, Validators.maxLength(255)],
    }),
    skillsTitleFr: new FormControl('', {
      nonNullable: true,
      validators: [Validators.required, Validators.maxLength(255)],
    }),
    skillsTitleEn: new FormControl('', {
      nonNullable: true,
      validators: [Validators.required, Validators.maxLength(255)],
    }),
    softSkillsTitleFr: new FormControl('', {
      nonNullable: true,
      validators: [Validators.required, Validators.maxLength(255)],
    }),
    softSkillsTitleEn: new FormControl('', {
      nonNullable: true,
      validators: [Validators.required, Validators.maxLength(255)],
    }),
    timelineItems: new FormArray<FormGroup>([]),
    skillGroups: new FormArray<FormGroup>([]),
    softSkills: new FormArray<FormGroup>([]),
  });

  constructor(
    private adminAboutApi: AdminAboutApiService,
    private translationApi: TranslationApiService,
    private toastService: ToastService,
    private elementRef: ElementRef<HTMLElement>
  ) {}

  ngOnInit(): void {
    this.loadAbout();

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

  get timelineItems(): FormArray<FormGroup> {
    return this.form.controls.timelineItems;
  }

  get skillGroups(): FormArray<FormGroup> {
    return this.form.controls.skillGroups;
  }

  get softSkills(): FormArray<FormGroup> {
    return this.form.controls.softSkills;
  }

  get hasTimelineItems(): boolean {
    return this.timelineItems.length > 0;
  }

  get hasSkillGroups(): boolean {
    return this.skillGroups.length > 0;
  }

  get hasSoftSkills(): boolean {
    return this.softSkills.length > 0;
  }

  get profileImagePreviewUrl(): string {
    return resolveMediaUrl(this.form.controls.profileImageUrl.value) ?? this.fallbackAvatarUrl;
  }

  get hasCustomProfileImage(): boolean {
    return !!this.form.controls.profileImageUrl.value.trim();
  }

  loadAbout(): void {
    this.isLoading = true;
    this.errorMessage = '';
    clearApiErrorsFromForm(this.form);

    this.adminAboutApi.get().subscribe({
      next: (about) => {
        this.isLoading = false;
        clearApiErrorsFromForm(this.form);
        this.patchForm(about);
        this.form.markAsPristine();
      },
      error: (error) => {
        this.isLoading = false;
        this.errorMessage = extractApiErrorMessage(
          error,
          'Impossible de charger les données de la section About.'
        );
        this.toastService.error(this.errorMessage);
        this.scrollToGlobalError();
      },
    });
  }

  translateAllToEnglish(): void {
    if (this.isSubmitting || this.isTranslating || this.isUploadingProfileImage) {
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
        const translatedCount = this.applyTranslatedFields(translatedFields);

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

  addTimelineItem(): void {
    this.timelineItems.push(this.createTimelineItemGroup());
    this.form.markAsDirty();
  }

  removeTimelineItem(index: number): void {
    this.timelineItems.removeAt(index);
    this.form.markAsDirty();
  }

  moveTimelineItemUp(index: number): void {
    this.moveFormArrayItem(this.timelineItems, index, index - 1);
  }

  moveTimelineItemDown(index: number): void {
    this.moveFormArrayItem(this.timelineItems, index, index + 1);
  }

  addSkillGroup(): void {
    this.skillGroups.push(this.createSkillGroup());
    this.form.markAsDirty();
  }

  removeSkillGroup(index: number): void {
    this.skillGroups.removeAt(index);
    this.form.markAsDirty();
  }

  moveSkillGroupUp(index: number): void {
    this.moveFormArrayItem(this.skillGroups, index, index - 1);
  }

  moveSkillGroupDown(index: number): void {
    this.moveFormArrayItem(this.skillGroups, index, index + 1);
  }

  getSkillItems(groupIndex: number): FormArray<FormGroup> {
    return this.getSkillItemsFromGroup(this.skillGroups.at(groupIndex) as FormGroup);
  }

  hasSkillItems(groupIndex: number): boolean {
    return this.getSkillItems(groupIndex).length > 0;
  }

  addSkillItem(groupIndex: number): void {
    this.getSkillItems(groupIndex).push(this.createSkillItemGroup());
    this.form.markAsDirty();
  }

  removeSkillItem(groupIndex: number, itemIndex: number): void {
    this.getSkillItems(groupIndex).removeAt(itemIndex);
    this.form.markAsDirty();
  }

  moveSkillItemUp(groupIndex: number, itemIndex: number): void {
    this.moveFormArrayItem(this.getSkillItems(groupIndex), itemIndex, itemIndex - 1);
  }

  moveSkillItemDown(groupIndex: number, itemIndex: number): void {
    this.moveFormArrayItem(this.getSkillItems(groupIndex), itemIndex, itemIndex + 1);
  }

  addSoftSkill(): void {
    this.softSkills.push(this.createSoftSkillGroup());
    this.form.markAsDirty();
  }

  removeSoftSkill(index: number): void {
    this.softSkills.removeAt(index);
    this.form.markAsDirty();
  }

  moveSoftSkillUp(index: number): void {
    this.moveFormArrayItem(this.softSkills, index, index - 1);
  }

  moveSoftSkillDown(index: number): void {
    this.moveFormArrayItem(this.softSkills, index, index + 1);
  }

  canMoveUp(index: number): boolean {
    return index > 0;
  }

  canMoveDown(index: number, length: number): boolean {
    return index < length - 1;
  }

  onProfileImageSelected(event: Event): void {
    const input = event.target as HTMLInputElement;
    const file = input.files?.[0] ?? null;

    this.errorMessage = '';

    if (!file) {
      return;
    }

    if (!file.type.startsWith('image/')) {
      this.errorMessage = 'Seules les images sont autorisées.';
      this.toastService.error(this.errorMessage);
      this.scrollToGlobalError();
      input.value = '';
      return;
    }

    if (file.size > this.maxProfileImageSize) {
      this.errorMessage = 'Le fichier dépasse la taille maximale autorisée de 5 MB.';
      this.toastService.error(this.errorMessage);
      this.scrollToGlobalError();
      input.value = '';
      return;
    }

    this.isUploadingProfileImage = true;

    this.adminAboutApi.uploadProfileImage(file).subscribe({
      next: (url) => {
        this.form.controls.profileImageUrl.setValue(url);
        this.form.controls.profileImageUrl.markAsDirty();
        this.form.controls.profileImageUrl.markAsTouched();
        this.form.markAsDirty();
        this.isUploadingProfileImage = false;
        this.toastService.success('Photo de profil uploadée. Pense à enregistrer la section About.');
        input.value = '';
      },
      error: (error) => {
        this.isUploadingProfileImage = false;
        this.errorMessage = extractApiErrorMessage(
          error,
          'Impossible d’uploader la photo de profil.'
        );
        this.toastService.error(this.errorMessage);
        this.scrollToGlobalError();
        input.value = '';
      },
    });
  }

  resetProfileImage(fileInput?: HTMLInputElement): void {
    this.form.controls.profileImageUrl.setValue('');
    this.form.controls.profileImageUrl.markAsDirty();
    this.form.controls.profileImageUrl.markAsTouched();
    this.form.markAsDirty();

    if (fileInput) {
      fileInput.value = '';
    }
  }

  onProfilePreviewError(event: Event): void {
    const img = event.target as HTMLImageElement;

    if (img.src.includes(this.fallbackAvatarUrl)) {
      return;
    }

    img.src = this.fallbackAvatarUrl;
  }

  save(): void {
    this.errorMessage = '';

    if (this.isUploadingProfileImage) {
      this.toastService.warning('Attends la fin de l’upload de la photo avant d’enregistrer.');
      return;
    }

    clearApiErrorsFromForm(this.form);

    if (this.form.invalid) {
      handleInvalidAdminForm({
        form: this.form,
        container: this.elementRef.nativeElement,
        toastService: this.toastService,
        message: 'Veuillez corriger les champs du formulaire.',
        scopeSelector: '#admin-about-form',
      });
      return;
    }

    this.isSubmitting = true;

    const payload: AboutContent = {
      title: {
        fr: this.form.controls.titleFr.value,
        en: this.form.controls.titleEn.value,
      },
      subtitle: {
        fr: this.form.controls.subtitleFr.value,
        en: this.form.controls.subtitleEn.value,
      },
      profileName: this.form.controls.profileName.value,
      profileImageUrl: this.form.controls.profileImageUrl.value,
      profileRole: {
        fr: this.form.controls.profileRoleFr.value,
        en: this.form.controls.profileRoleEn.value,
      },
      bio: {
        fr: this.form.controls.bioFr.value,
        en: this.form.controls.bioEn.value,
      },
      location: {
        fr: this.form.controls.locationFr.value,
        en: this.form.controls.locationEn.value,
      },
      timelineTitle: {
        fr: this.form.controls.timelineTitleFr.value,
        en: this.form.controls.timelineTitleEn.value,
      },
      skillsTitle: {
        fr: this.form.controls.skillsTitleFr.value,
        en: this.form.controls.skillsTitleEn.value,
      },
      softSkillsTitle: {
        fr: this.form.controls.softSkillsTitleFr.value,
        en: this.form.controls.softSkillsTitleEn.value,
      },
      timelineItems: this.timelineItems.controls.map((group) => ({
        date: {
          fr: group.get('dateFr')?.value ?? '',
          en: group.get('dateEn')?.value ?? '',
        },
        company: {
          fr: group.get('companyFr')?.value ?? '',
          en: group.get('companyEn')?.value ?? '',
        },
        title: {
          fr: group.get('titleFr')?.value ?? '',
          en: group.get('titleEn')?.value ?? '',
        },
        description: {
          fr: group.get('descriptionFr')?.value ?? '',
          en: group.get('descriptionEn')?.value ?? '',
        },
        icon: group.get('icon')?.value ?? 'work',
      })),
      skillGroups: this.skillGroups.controls.map((group) => ({
        title: {
          fr: group.get('titleFr')?.value ?? '',
          en: group.get('titleEn')?.value ?? '',
        },
        items: this.getSkillItemsFromGroup(group).controls.map((item) => ({
          name: item.get('name')?.value ?? '',
          value: Number(item.get('value')?.value ?? 0),
        })),
      })),
      softSkills: this.softSkills.controls.map((group) => ({
        fr: group.get('fr')?.value ?? '',
        en: group.get('en')?.value ?? '',
      })),
    };

    this.adminAboutApi.update(payload).subscribe({
      next: (about) => {
        this.isSubmitting = false;
        clearApiErrorsFromForm(this.form);
        this.patchForm(about);
        this.form.markAsPristine();
        this.toastService.success('Section About enregistrée avec succès.');
      },
      error: (error) => {
        this.isSubmitting = false;
        applyApiErrorsToForm(this.form, error);
        this.errorMessage = extractApiErrorMessage(
          error,
          'Impossible d’enregistrer la section About.'
        );
        this.toastService.error(this.errorMessage);
        this.scrollToGlobalError();
      },
    });
  }

  showControlError(control: AbstractControl | null): boolean {
    return !!control && control.invalid && control.touched;
  }

  getControlErrorMessage(control: AbstractControl | null): string {
    if (!control?.errors) {
      return '';
    }

    const apiError = control.getError('apiError');

    if (typeof apiError === 'string' && apiError.trim()) {
      return apiError.trim();
    }

    if (control.hasError('required')) {
      return 'Ce champ est obligatoire.';
    }

    if (control.hasError('maxlength')) {
      const error = control.getError('maxlength');
      return `La longueur maximale autorisée est de ${error.requiredLength} caractères.`;
    }

    if (control.hasError('minlength')) {
      const error = control.getError('minlength');
      return `La longueur minimale attendue est de ${error.requiredLength} caractères.`;
    }

    if (control.hasError('min')) {
      const error = control.getError('min');
      return `La valeur minimale autorisée est ${error.min}.`;
    }

    if (control.hasError('max')) {
      const error = control.getError('max');
      return `La valeur maximale autorisée est ${error.max}.`;
    }

    if (control.hasError('pattern')) {
      return 'Le format saisi est invalide.';
    }

    return 'La valeur saisie est invalide.';
  }

  private buildTranslationFields(): Record<string, string> {
    const fields: Record<string, string> = {};

    this.addTranslationField(fields, 'titleFr', this.form.controls.titleFr.value);
    this.addTranslationField(fields, 'subtitleFr', this.form.controls.subtitleFr.value);
    this.addTranslationField(fields, 'profileRoleFr', this.form.controls.profileRoleFr.value);
    this.addTranslationField(fields, 'bioFr', this.form.controls.bioFr.value);
    this.addTranslationField(fields, 'locationFr', this.form.controls.locationFr.value);
    this.addTranslationField(fields, 'timelineTitleFr', this.form.controls.timelineTitleFr.value);
    this.addTranslationField(fields, 'skillsTitleFr', this.form.controls.skillsTitleFr.value);
    this.addTranslationField(fields, 'softSkillsTitleFr', this.form.controls.softSkillsTitleFr.value);

    this.timelineItems.controls.forEach((group, index) => {
      this.addTranslationField(
        fields,
        `timelineItems_${index}_dateFr`,
        group.get('dateFr')?.value ?? ''
      );
      this.addTranslationField(
        fields,
        `timelineItems_${index}_companyFr`,
        group.get('companyFr')?.value ?? ''
      );
      this.addTranslationField(
        fields,
        `timelineItems_${index}_titleFr`,
        group.get('titleFr')?.value ?? ''
      );
      this.addTranslationField(
        fields,
        `timelineItems_${index}_descriptionFr`,
        group.get('descriptionFr')?.value ?? ''
      );
    });

    this.skillGroups.controls.forEach((group, index) => {
      this.addTranslationField(
        fields,
        `skillGroups_${index}_titleFr`,
        group.get('titleFr')?.value ?? ''
      );
    });

    this.softSkills.controls.forEach((group, index) => {
      this.addTranslationField(
        fields,
        `softSkills_${index}Fr`,
        group.get('fr')?.value ?? ''
      );
    });

    return fields;
  }

  private applyTranslatedFields(translatedFields: Record<string, string>): number {
    let appliedCount = 0;

    appliedCount += this.applyTranslatedValue(
      this.form.controls.titleEn,
      translatedFields['titleEn']
    );
    appliedCount += this.applyTranslatedValue(
      this.form.controls.subtitleEn,
      translatedFields['subtitleEn']
    );
    appliedCount += this.applyTranslatedValue(
      this.form.controls.profileRoleEn,
      translatedFields['profileRoleEn']
    );
    appliedCount += this.applyTranslatedValue(
      this.form.controls.bioEn,
      translatedFields['bioEn']
    );
    appliedCount += this.applyTranslatedValue(
      this.form.controls.locationEn,
      translatedFields['locationEn']
    );
    appliedCount += this.applyTranslatedValue(
      this.form.controls.timelineTitleEn,
      translatedFields['timelineTitleEn']
    );
    appliedCount += this.applyTranslatedValue(
      this.form.controls.skillsTitleEn,
      translatedFields['skillsTitleEn']
    );
    appliedCount += this.applyTranslatedValue(
      this.form.controls.softSkillsTitleEn,
      translatedFields['softSkillsTitleEn']
    );

    this.timelineItems.controls.forEach((group, index) => {
      appliedCount += this.applyTranslatedValue(
        group.get('dateEn'),
        translatedFields[`timelineItems_${index}_dateEn`]
      );
      appliedCount += this.applyTranslatedValue(
        group.get('companyEn'),
        translatedFields[`timelineItems_${index}_companyEn`]
      );
      appliedCount += this.applyTranslatedValue(
        group.get('titleEn'),
        translatedFields[`timelineItems_${index}_titleEn`]
      );
      appliedCount += this.applyTranslatedValue(
        group.get('descriptionEn'),
        translatedFields[`timelineItems_${index}_descriptionEn`]
      );
    });

    this.skillGroups.controls.forEach((group, index) => {
      appliedCount += this.applyTranslatedValue(
        group.get('titleEn'),
        translatedFields[`skillGroups_${index}_titleEn`]
      );
    });

    this.softSkills.controls.forEach((group, index) => {
      appliedCount += this.applyTranslatedValue(
        group.get('en'),
        translatedFields[`softSkills_${index}En`]
      );
    });

    return appliedCount;
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
    control: AbstractControl | null,
    translatedValue: unknown
  ): number {
    if (!control || typeof translatedValue !== 'string') {
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
      '#admin-about-global-error'
    );
  }

  private patchForm(about: AboutContent): void {
    this.form.patchValue({
      titleFr: about.title.fr,
      titleEn: about.title.en,
      subtitleFr: about.subtitle.fr,
      subtitleEn: about.subtitle.en,
      profileName: about.profileName,
      profileImageUrl: about.profileImageUrl ?? '',
      profileRoleFr: about.profileRole.fr,
      profileRoleEn: about.profileRole.en,
      bioFr: about.bio.fr,
      bioEn: about.bio.en,
      locationFr: about.location.fr,
      locationEn: about.location.en,
      timelineTitleFr: about.timelineTitle.fr,
      timelineTitleEn: about.timelineTitle.en,
      skillsTitleFr: about.skillsTitle.fr,
      skillsTitleEn: about.skillsTitle.en,
      softSkillsTitleFr: about.softSkillsTitle.fr,
      softSkillsTitleEn: about.softSkillsTitle.en,
    });

    this.timelineItems.clear();
    (about.timelineItems ?? []).forEach((item) => {
      this.timelineItems.push(this.createTimelineItemGroup({
        dateFr: item.date?.fr ?? '',
        dateEn: item.date?.en ?? '',
        companyFr: item.company?.fr ?? '',
        companyEn: item.company?.en ?? '',
        titleFr: item.title?.fr ?? '',
        titleEn: item.title?.en ?? '',
        descriptionFr: item.description?.fr ?? '',
        descriptionEn: item.description?.en ?? '',
        icon: item.icon ?? 'work',
      }));
    });

    this.skillGroups.clear();
    (about.skillGroups ?? []).forEach((group) => {
      this.skillGroups.push(this.createSkillGroup({
        titleFr: group.title?.fr ?? '',
        titleEn: group.title?.en ?? '',
        items: (group.items ?? []).map((item) => ({
          name: item.name ?? '',
          value: item.value ?? 0,
        })),
      }));
    });

    this.softSkills.clear();
    (about.softSkills ?? []).forEach((skill) => {
      this.softSkills.push(this.createSoftSkillGroup({
        fr: skill.fr ?? '',
        en: skill.en ?? '',
      }));
    });
  }

  private createTimelineItemGroup(value?: {
    dateFr?: string;
    dateEn?: string;
    companyFr?: string;
    companyEn?: string;
    titleFr?: string;
    titleEn?: string;
    descriptionFr?: string;
    descriptionEn?: string;
    icon?: string;
  }): FormGroup {
    return new FormGroup({
      dateFr: new FormControl(value?.dateFr ?? '', {
        nonNullable: true,
        validators: [Validators.required, Validators.maxLength(80)],
      }),
      dateEn: new FormControl(value?.dateEn ?? '', {
        nonNullable: true,
        validators: [Validators.required, Validators.maxLength(80)],
      }),
      companyFr: new FormControl(value?.companyFr ?? '', {
        nonNullable: true,
        validators: [Validators.required, Validators.maxLength(120)],
      }),
      companyEn: new FormControl(value?.companyEn ?? '', {
        nonNullable: true,
        validators: [Validators.required, Validators.maxLength(120)],
      }),
      titleFr: new FormControl(value?.titleFr ?? '', {
        nonNullable: true,
        validators: [Validators.required, Validators.maxLength(120)],
      }),
      titleEn: new FormControl(value?.titleEn ?? '', {
        nonNullable: true,
        validators: [Validators.required, Validators.maxLength(120)],
      }),
      descriptionFr: new FormControl(value?.descriptionFr ?? '', {
        nonNullable: true,
        validators: [Validators.required, Validators.maxLength(1000)],
      }),
      descriptionEn: new FormControl(value?.descriptionEn ?? '', {
        nonNullable: true,
        validators: [Validators.required, Validators.maxLength(1000)],
      }),
      icon: new FormControl(value?.icon ?? 'work', {
        nonNullable: true,
        validators: [Validators.required],
      }),
    });
  }

  private createSkillGroup(value?: {
    titleFr?: string;
    titleEn?: string;
    items?: Array<{ name?: string; value?: number }>;
  }): FormGroup {
    return new FormGroup({
      titleFr: new FormControl(value?.titleFr ?? '', {
        nonNullable: true,
        validators: [Validators.required, Validators.maxLength(120)],
      }),
      titleEn: new FormControl(value?.titleEn ?? '', {
        nonNullable: true,
        validators: [Validators.required, Validators.maxLength(120)],
      }),
      items: new FormArray<FormGroup>(
        (value?.items ?? []).map((item) => this.createSkillItemGroup(item))
      ),
    });
  }

  private createSkillItemGroup(value?: {
    name?: string;
    value?: number;
  }): FormGroup {
    return new FormGroup({
      name: new FormControl(value?.name ?? '', {
        nonNullable: true,
        validators: [Validators.required, Validators.maxLength(80)],
      }),
      value: new FormControl(value?.value ?? 0, {
        nonNullable: true,
        validators: [Validators.required, Validators.min(0), Validators.max(100)],
      }),
    });
  }

  private createSoftSkillGroup(value?: {
    fr?: string;
    en?: string;
  }): FormGroup {
    return new FormGroup({
      fr: new FormControl(value?.fr ?? '', {
        nonNullable: true,
        validators: [Validators.required, Validators.maxLength(120)],
      }),
      en: new FormControl(value?.en ?? '', {
        nonNullable: true,
        validators: [Validators.required, Validators.maxLength(120)],
      }),
    });
  }

  private getSkillItemsFromGroup(group: FormGroup): FormArray<FormGroup> {
    return group.get('items') as FormArray<FormGroup>;
  }

  private moveFormArrayItem(
    formArray: FormArray<FormGroup>,
    fromIndex: number,
    toIndex: number
  ): void {
    if (
      fromIndex < 0 ||
      toIndex < 0 ||
      fromIndex >= formArray.length ||
      toIndex >= formArray.length ||
      fromIndex === toIndex
    ) {
      return;
    }

    const control = formArray.at(fromIndex);
    formArray.removeAt(fromIndex);
    formArray.insert(toIndex, control);
    this.form.markAsDirty();
  }
}