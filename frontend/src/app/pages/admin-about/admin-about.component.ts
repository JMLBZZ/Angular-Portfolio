import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import {
  FormArray,
  FormControl,
  FormGroup,
  ReactiveFormsModule,
  Validators,
} from '@angular/forms';
import { RouterLink } from '@angular/router';

import { TextFieldComponent } from '../../shared/components/text-field/text-field.component';
import { TextAreaComponent } from '../../shared/components/text-area/text-area.component';
import { PrimaryButtonComponent } from '../../shared/components/primary-button/primary-button.component';
import { ToastService } from '../../shared/services/toast.service';
import { AdminAboutApiService } from '../../core/api/admin-about-api.service';
import { AboutContent } from '../../shared/models/about.model';
import { extractApiErrorMessage } from '../../core/api/api-error.utils';
import { PendingChangesComponent } from '../../core/auth/pending-changes.guard';

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
  ],
  templateUrl: './admin-about.component.html',
})
export class AdminAboutComponent implements OnInit, PendingChangesComponent {
  isLoading = false;
  isSubmitting = false;
  errorMessage = '';

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
    profileRoleFr: new FormControl('', {
      nonNullable: true,
      validators: [Validators.required, Validators.maxLength(255)],
    }),
    profileRoleEn: new FormControl('', {
      nonNullable: true,
      validators: [Validators.required, Validators.maxLength(255)],
    }),
    bioFr: new FormControl('', {
      nonNullable: true,
      validators: [Validators.required, Validators.maxLength(3000)],
    }),
    bioEn: new FormControl('', {
      nonNullable: true,
      validators: [Validators.required, Validators.maxLength(3000)],
    }),
    locationFr: new FormControl('', {
      nonNullable: true,
      validators: [Validators.required, Validators.maxLength(255)],
    }),
    locationEn: new FormControl('', {
      nonNullable: true,
      validators: [Validators.required, Validators.maxLength(255)],
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
    private toastService: ToastService
  ) {}

  ngOnInit(): void {
    this.loadAbout();
  }

  canDeactivate(): boolean {
    return !this.form.dirty || this.isSubmitting;
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

  loadAbout(): void {
    this.isLoading = true;
    this.errorMessage = '';

    this.adminAboutApi.get().subscribe({
      next: (about) => {
        this.isLoading = false;
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

  addSkillGroup(): void {
    const group = this.createSkillGroupGroup();
    this.getSkillItemsFromGroup(group).push(this.createSkillItemGroup());
    this.skillGroups.push(group);
    this.form.markAsDirty();
  }

  removeSkillGroup(index: number): void {
    this.skillGroups.removeAt(index);
    this.form.markAsDirty();
  }

  addSkillItem(groupIndex: number): void {
    this.getSkillItems(groupIndex).push(this.createSkillItemGroup());
    this.form.markAsDirty();
  }

  removeSkillItem(groupIndex: number, itemIndex: number): void {
    this.getSkillItems(groupIndex).removeAt(itemIndex);
    this.form.markAsDirty();
  }

  addSoftSkill(): void {
    this.softSkills.push(this.createSoftSkillGroup());
    this.form.markAsDirty();
  }

  removeSoftSkill(index: number): void {
    this.softSkills.removeAt(index);
    this.form.markAsDirty();
  }

  getSkillItems(groupIndex: number): FormArray<FormGroup> {
    return this.getSkillItemsFromGroup(this.skillGroups.at(groupIndex));
  }

  save(): void {
    if (this.form.invalid) {
      this.form.markAllAsTouched();
      return;
    }

    this.isSubmitting = true;
    this.errorMessage = '';

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
        icon: (group.get('icon')?.value ?? 'work') as 'work' | 'education',
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
        this.patchForm(about);
        this.form.markAsPristine();
        this.toastService.success('Section About enregistrée avec succès.');
      },
      error: (error) => {
        this.isSubmitting = false;
        this.errorMessage = extractApiErrorMessage(
          error,
          'Impossible d’enregistrer la section About.'
        );
        this.toastService.error(this.errorMessage);
      },
    });
  }

  private patchForm(about: AboutContent): void {
    this.form.patchValue({
      titleFr: about.title.fr,
      titleEn: about.title.en,
      subtitleFr: about.subtitle.fr,
      subtitleEn: about.subtitle.en,
      profileName: about.profileName,
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
      this.timelineItems.push(
        this.createTimelineItemGroup({
          dateFr: item.date.fr,
          dateEn: item.date.en,
          companyFr: item.company.fr,
          companyEn: item.company.en,
          titleFr: item.title.fr,
          titleEn: item.title.en,
          descriptionFr: item.description.fr,
          descriptionEn: item.description.en,
          icon: item.icon,
        })
      );
    });

    this.skillGroups.clear();
    (about.skillGroups ?? []).forEach((group) => {
      const skillGroup = this.createSkillGroupGroup({
        titleFr: group.title.fr,
        titleEn: group.title.en,
      });

      const itemsArray = this.getSkillItemsFromGroup(skillGroup);
      itemsArray.clear();

      (group.items ?? []).forEach((item) => {
        itemsArray.push(
          this.createSkillItemGroup({
            name: item.name,
            value: item.value,
          })
        );
      });

      if (itemsArray.length === 0) {
        itemsArray.push(this.createSkillItemGroup());
      }

      this.skillGroups.push(skillGroup);
    });

    this.softSkills.clear();
    (about.softSkills ?? []).forEach((skill) => {
      this.softSkills.push(
        this.createSoftSkillGroup({
          fr: skill.fr,
          en: skill.en,
        })
      );
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
    icon?: 'work' | 'education';
  }): FormGroup {
    return new FormGroup({
      dateFr: new FormControl(value?.dateFr ?? '', {
        nonNullable: true,
        validators: [Validators.required, Validators.maxLength(255)],
      }),
      dateEn: new FormControl(value?.dateEn ?? '', {
        nonNullable: true,
        validators: [Validators.required, Validators.maxLength(255)],
      }),
      companyFr: new FormControl(value?.companyFr ?? '', {
        nonNullable: true,
        validators: [Validators.required, Validators.maxLength(255)],
      }),
      companyEn: new FormControl(value?.companyEn ?? '', {
        nonNullable: true,
        validators: [Validators.required, Validators.maxLength(255)],
      }),
      titleFr: new FormControl(value?.titleFr ?? '', {
        nonNullable: true,
        validators: [Validators.required, Validators.maxLength(255)],
      }),
      titleEn: new FormControl(value?.titleEn ?? '', {
        nonNullable: true,
        validators: [Validators.required, Validators.maxLength(255)],
      }),
      descriptionFr: new FormControl(value?.descriptionFr ?? '', {
        nonNullable: true,
        validators: [Validators.required, Validators.maxLength(2000)],
      }),
      descriptionEn: new FormControl(value?.descriptionEn ?? '', {
        nonNullable: true,
        validators: [Validators.required, Validators.maxLength(2000)],
      }),
      icon: new FormControl<'work' | 'education'>(value?.icon ?? 'work', {
        nonNullable: true,
      }),
    });
  }

  private createSkillGroupGroup(value?: {
    titleFr?: string;
    titleEn?: string;
  }): FormGroup {
    return new FormGroup({
      titleFr: new FormControl(value?.titleFr ?? '', {
        nonNullable: true,
        validators: [Validators.required, Validators.maxLength(255)],
      }),
      titleEn: new FormControl(value?.titleEn ?? '', {
        nonNullable: true,
        validators: [Validators.required, Validators.maxLength(255)],
      }),
      items: new FormArray<FormGroup>([]),
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
}