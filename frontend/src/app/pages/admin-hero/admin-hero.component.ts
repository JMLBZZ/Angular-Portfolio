import { Component, ElementRef, OnDestroy, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import {
  FormArray,
  FormControl,
  FormGroup,
  ReactiveFormsModule,
  Validators,
} from '@angular/forms';
import { RouterLink } from '@angular/router';
import { CdkDragDrop, DragDropModule, moveItemInArray } from '@angular/cdk/drag-drop';
import {
  BadgeCheckIcon,
  GripVerticalIcon,
  LanguagesIcon,
  PlusIcon,
  SaveIcon,
  SparklesIcon,
  StarIcon,
  Trash2Icon,
  LucideAngularModule,
} from 'lucide-angular';

import { TextFieldComponent } from '../../shared/components/text-field/text-field.component';
import { PrimaryButtonComponent } from '../../shared/components/primary-button/primary-button.component';
import { ToastService } from '../../shared/services/toast.service';
import { AdminHeroApiService } from '../../core/api/admin-hero-api.service';
import { AdminHeroCardApiService } from '../../core/api/admin-hero-card-api.service';
import { Hero, HeroTechBadge } from '../../shared/models/hero.model';
import { HeroCard } from '../../shared/models/hero-card.model';
import { Subscription } from 'rxjs';
import { extractApiErrorMessage } from '../../core/api/api-error.utils';
import { applyApiErrorsToForm, clearApiErrorsFromForm } from '../../core/forms/apply-api-errors.util';
import {
  handleInvalidAdminForm,
  scrollToSelector,
  setupAdminFormErrorCleanup,
} from '../../shared/utils/admin-form.utils';
import { TranslationApiService } from '../../core/api/translation-api.service';
import { PendingChangesComponent } from '../../core/auth/pending-changes.guard';

type HeroTechBadgeFormGroup = FormGroup<{
  id: FormControl<number | null>;
  label: FormControl<string>;
  displayOrder: FormControl<number>;
}>;

@Component({
  selector: 'app-admin-hero',
  standalone: true,
  imports: [
    CommonModule,
    ReactiveFormsModule,
    RouterLink,
    DragDropModule,
    TextFieldComponent,
    PrimaryButtonComponent,
    LucideAngularModule,
  ],
  templateUrl: './admin-hero.component.html',
})
export class AdminHeroComponent implements OnInit, OnDestroy, PendingChangesComponent {
  readonly BadgeCheckIcon = BadgeCheckIcon;
  readonly GripVerticalIcon = GripVerticalIcon;
  readonly LanguagesIcon = LanguagesIcon;
  readonly PlusIcon = PlusIcon;
  readonly SaveIcon = SaveIcon;
  readonly SparklesIcon = SparklesIcon;
  readonly StarIcon = StarIcon;
  readonly Trash2Icon = Trash2Icon;

  isLoadingHero = false;
  isSubmittingHero = false;
  isTranslatingHero = false;
  heroErrorMessage = '';

  isLoadingHeroCard = false;
  isSubmittingHeroCard = false;
  isTranslatingHeroCard = false;
  heroCardErrorMessage = '';

  private subscriptions = new Subscription();

  readonly heroForm = new FormGroup({
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
    available: new FormControl(true, {
      nonNullable: true,
    }),
    techBadges: new FormArray<HeroTechBadgeFormGroup>([]),
  });

  readonly heroCardForm = new FormGroup({
    titleFr: new FormControl('', {
      nonNullable: true,
      validators: [Validators.required, Validators.maxLength(120)],
    }),
    titleEn: new FormControl('', {
      nonNullable: true,
      validators: [Validators.required, Validators.maxLength(120)],
    }),
    subtitleFr: new FormControl('', {
      nonNullable: true,
      validators: [Validators.required, Validators.maxLength(180)],
    }),
    subtitleEn: new FormControl('', {
      nonNullable: true,
      validators: [Validators.required, Validators.maxLength(180)],
    }),
    badgeFr: new FormControl('', {
      nonNullable: true,
      validators: [Validators.required, Validators.maxLength(80)],
    }),
    badgeEn: new FormControl('', {
      nonNullable: true,
      validators: [Validators.required, Validators.maxLength(80)],
    }),
    highlight1Fr: new FormControl('', {
      nonNullable: true,
      validators: [Validators.required, Validators.maxLength(120)],
    }),
    highlight1En: new FormControl('', {
      nonNullable: true,
      validators: [Validators.required, Validators.maxLength(120)],
    }),
    highlight2Fr: new FormControl('', {
      nonNullable: true,
      validators: [Validators.required, Validators.maxLength(120)],
    }),
    highlight2En: new FormControl('', {
      nonNullable: true,
      validators: [Validators.required, Validators.maxLength(120)],
    }),
    highlight3Fr: new FormControl('', {
      nonNullable: true,
      validators: [Validators.required, Validators.maxLength(120)],
    }),
    highlight3En: new FormControl('', {
      nonNullable: true,
      validators: [Validators.required, Validators.maxLength(120)],
    }),
    stat1LabelFr: new FormControl('', {
      nonNullable: true,
      validators: [Validators.required, Validators.maxLength(80)],
    }),
    stat1LabelEn: new FormControl('', {
      nonNullable: true,
      validators: [Validators.required, Validators.maxLength(80)],
    }),
    stat1Value: new FormControl('', {
      nonNullable: true,
      validators: [Validators.required, Validators.maxLength(80)],
    }),
    stat2LabelFr: new FormControl('', {
      nonNullable: true,
      validators: [Validators.required, Validators.maxLength(80)],
    }),
    stat2LabelEn: new FormControl('', {
      nonNullable: true,
      validators: [Validators.required, Validators.maxLength(80)],
    }),
    stat2Value: new FormControl('', {
      nonNullable: true,
      validators: [Validators.required, Validators.maxLength(80)],
    }),
    stat3LabelFr: new FormControl('', {
      nonNullable: true,
      validators: [Validators.required, Validators.maxLength(80)],
    }),
    stat3LabelEn: new FormControl('', {
      nonNullable: true,
      validators: [Validators.required, Validators.maxLength(80)],
    }),
    stat3Value: new FormControl('', {
      nonNullable: true,
      validators: [Validators.required, Validators.maxLength(80)],
    }),
  });

  constructor(
    private adminHeroApi: AdminHeroApiService,
    private adminHeroCardApi: AdminHeroCardApiService,
    private translationApi: TranslationApiService,
    private toastService: ToastService,
    private elementRef: ElementRef<HTMLElement>
  ) {}

  ngOnInit(): void {
    this.loadHero();
    this.loadHeroCard();

    this.subscriptions.add(
      setupAdminFormErrorCleanup(this.heroForm, () => {
        if (this.heroErrorMessage) {
          this.heroErrorMessage = '';
        }
      })
    );

    this.subscriptions.add(
      setupAdminFormErrorCleanup(this.heroCardForm, () => {
        if (this.heroCardErrorMessage) {
          this.heroCardErrorMessage = '';
        }
      })
    );
  }

  ngOnDestroy(): void {
    this.subscriptions.unsubscribe();
  }

  canDeactivate(): boolean {
  if (!this.hasUnsavedChanges || this.isSubmittingHero || this.isSubmittingHeroCard) {
      return true;
    }

    return window.confirm(
      'Vous avez des modifications non enregistrées. Voulez-vous vraiment quitter cette page ?'
    );
  }

  get hasUnsavedChanges(): boolean {
    return this.heroForm.dirty || this.heroCardForm.dirty;
  }

  get techBadgesFormArray(): FormArray<HeroTechBadgeFormGroup> {
    return this.heroForm.controls.techBadges;
  }

  loadHero(): void {
    this.isLoadingHero = true;
    this.heroErrorMessage = '';
    clearApiErrorsFromForm(this.heroForm);

    this.adminHeroApi.get().subscribe({
      next: (hero) => {
        this.isLoadingHero = false;

        clearApiErrorsFromForm(this.heroForm);
        this.heroForm.patchValue({
          titleFr: hero.title.fr,
          titleEn: hero.title.en,
          subtitleFr: hero.subtitle.fr,
          subtitleEn: hero.subtitle.en,
          available: hero.available,
        });

        this.setTechBadges(hero.techBadges);
        this.heroForm.markAsPristine();
      },
      error: (error) => {
        this.isLoadingHero = false;
        this.heroErrorMessage = extractApiErrorMessage(
          error,
          'Impossible de charger les données du hero.'
        );
        this.toastService.error(this.heroErrorMessage);
        this.scrollToHeroError();
      },
    });
  }

  translateHeroToEnglish(): void {
    if (this.isSubmittingHero || this.isTranslatingHero) {
      return;
    }

    const fieldsToTranslate = this.buildHeroTranslationFields();

    if (Object.keys(fieldsToTranslate).length === 0) {
      this.toastService.warning(
        'Renseigne au moins un champ français avant de lancer la traduction.'
      );
      return;
    }

    this.isTranslatingHero = true;

    this.translationApi.translateFrToEn(fieldsToTranslate).subscribe({
      next: (translatedFields) => {
        let translatedCount = 0;

        translatedCount += this.applyTranslatedValue(
          this.heroForm.controls.titleEn,
          translatedFields['titleEn']
        );

        translatedCount += this.applyTranslatedValue(
          this.heroForm.controls.subtitleEn,
          translatedFields['subtitleEn']
        );

        if (translatedCount === 0) {
          this.toastService.warning(
            'Aucune traduction exploitable n’a été renvoyée par le serveur.'
          );
          this.isTranslatingHero = false;
          return;
        }

        this.toastService.success('Les champs anglais du hero ont été mis à jour.');
        this.isTranslatingHero = false;
      },
      error: (error) => {
        const message = extractApiErrorMessage(
          error,
          'La traduction automatique du hero a échoué.'
        );

        this.toastService.error(message);
        this.isTranslatingHero = false;
      },
    });
  }

  saveHero(): void {
    this.updateTechBadgeDisplayOrders();
    this.heroErrorMessage = '';
    clearApiErrorsFromForm(this.heroForm);

    if (this.heroForm.invalid) {
      handleInvalidAdminForm({
        form: this.heroForm,
        container: this.elementRef.nativeElement,
        toastService: this.toastService,
        message: 'Veuillez corriger les champs du formulaire.',
        scopeSelector: '#admin-hero-main-form',
      });
      return;
    }

    this.isSubmittingHero = true;

    const payload: Hero = {
      title: {
        fr: this.heroForm.controls.titleFr.value,
        en: this.heroForm.controls.titleEn.value,
      },
      subtitle: {
        fr: this.heroForm.controls.subtitleFr.value,
        en: this.heroForm.controls.subtitleEn.value,
      },
      available: this.heroForm.controls.available.value,
      techBadges: this.techBadgesFormArray.controls.map((group) => ({
        id: group.controls.id.value,
        label: group.controls.label.value,
        displayOrder: group.controls.displayOrder.value,
      })),
    };

    this.adminHeroApi.update(payload).subscribe({
      next: (hero) => {
        this.isSubmittingHero = false;

        clearApiErrorsFromForm(this.heroForm);
        this.heroForm.patchValue({
          titleFr: hero.title.fr,
          titleEn: hero.title.en,
          subtitleFr: hero.subtitle.fr,
          subtitleEn: hero.subtitle.en,
          available: hero.available,
        });

        this.setTechBadges(hero.techBadges);
        this.heroForm.markAsPristine();
        this.toastService.success('Hero enregistré avec succès.');
      },
      error: (error) => {
        this.isSubmittingHero = false;
        applyApiErrorsToForm(this.heroForm, error);
        this.heroErrorMessage = extractApiErrorMessage(
          error,
          'Impossible d’enregistrer le hero.'
        );
        this.toastService.error(this.heroErrorMessage);
        this.scrollToHeroError();
      },
    });
  }

  addTechBadge(): void {
    this.techBadgesFormArray.push(this.createTechBadgeFormGroup({
      id: null,
      label: '',
      displayOrder: this.techBadgesFormArray.length,
    }));
    this.heroForm.markAsDirty();
  }

  removeTechBadge(index: number): void {
    this.techBadgesFormArray.removeAt(index);
    this.updateTechBadgeDisplayOrders();
    this.heroForm.markAsDirty();
  }

  dropTechBadge(event: CdkDragDrop<HeroTechBadgeFormGroup[]>): void {
    moveItemInArray(
      this.techBadgesFormArray.controls,
      event.previousIndex,
      event.currentIndex
    );

    this.updateTechBadgeDisplayOrders();
    this.techBadgesFormArray.updateValueAndValidity();
    this.heroForm.markAsDirty();
  }

  trackByTechBadgeIndex(index: number): number {
    return index;
  }

  private setTechBadges(badges: HeroTechBadge[]): void {
    this.techBadgesFormArray.clear();

    (badges ?? []).forEach((badge, index) => {
      this.techBadgesFormArray.push(this.createTechBadgeFormGroup({
        id: badge.id ?? null,
        label: badge.label ?? '',
        displayOrder: badge.displayOrder ?? index,
      }));
    });

    this.updateTechBadgeDisplayOrders();
  }

  private createTechBadgeFormGroup(badge: HeroTechBadge): HeroTechBadgeFormGroup {
    return new FormGroup({
      id: new FormControl<number | null>(badge.id),
      label: new FormControl(badge.label, {
        nonNullable: true,
        validators: [Validators.required, Validators.maxLength(40)],
      }),
      displayOrder: new FormControl(badge.displayOrder, {
        nonNullable: true,
      }),
    });
  }

  private updateTechBadgeDisplayOrders(): void {
    this.techBadgesFormArray.controls.forEach((group, index) => {
      group.controls.displayOrder.setValue(index, { emitEvent: false });
    });
  }

  private scrollToHeroError(): void {
    scrollToSelector(
      this.elementRef.nativeElement,
      '#admin-hero-main-global-error'
    );
  }

  private scrollToHeroCardError(): void {
    scrollToSelector(
      this.elementRef.nativeElement,
      '#admin-hero-card-global-error'
    );
  }

  loadHeroCard(): void {
    this.isLoadingHeroCard = true;
    this.heroCardErrorMessage = '';
    clearApiErrorsFromForm(this.heroCardForm);

    this.adminHeroCardApi.get().subscribe({
      next: (heroCard) => {
        this.isLoadingHeroCard = false;
        clearApiErrorsFromForm(this.heroCardForm);
        this.heroCardForm.setValue({
          titleFr: heroCard.title.fr,
          titleEn: heroCard.title.en,
          subtitleFr: heroCard.subtitle.fr,
          subtitleEn: heroCard.subtitle.en,
          badgeFr: heroCard.badge.fr,
          badgeEn: heroCard.badge.en,
          highlight1Fr: heroCard.highlight1.fr,
          highlight1En: heroCard.highlight1.en,
          highlight2Fr: heroCard.highlight2.fr,
          highlight2En: heroCard.highlight2.en,
          highlight3Fr: heroCard.highlight3.fr,
          highlight3En: heroCard.highlight3.en,
          stat1LabelFr: heroCard.stat1Label.fr,
          stat1LabelEn: heroCard.stat1Label.en,
          stat1Value: heroCard.stat1Value,
          stat2LabelFr: heroCard.stat2Label.fr,
          stat2LabelEn: heroCard.stat2Label.en,
          stat2Value: heroCard.stat2Value,
          stat3LabelFr: heroCard.stat3Label.fr,
          stat3LabelEn: heroCard.stat3Label.en,
          stat3Value: heroCard.stat3Value,
        });
        this.heroCardForm.markAsPristine();
      },
      error: (error) => {
        this.isLoadingHeroCard = false;
        this.heroCardErrorMessage = extractApiErrorMessage(
          error,
          'Impossible de charger les données de la hero card.'
        );
        this.toastService.error(this.heroCardErrorMessage);
        this.scrollToHeroCardError();
      },
    });
  }

  translateHeroCardToEnglish(): void {
    if (this.isSubmittingHeroCard || this.isTranslatingHeroCard) {
      return;
    }

    const fieldsToTranslate = this.buildHeroCardTranslationFields();

    if (Object.keys(fieldsToTranslate).length === 0) {
      this.toastService.warning(
        'Renseigne au moins un champ français avant de lancer la traduction.'
      );
      return;
    }

    this.isTranslatingHeroCard = true;

    this.translationApi.translateFrToEn(fieldsToTranslate).subscribe({
      next: (translatedFields) => {
        let translatedCount = 0;

        translatedCount += this.applyTranslatedValue(
          this.heroCardForm.controls.titleEn,
          translatedFields['titleEn']
        );
        translatedCount += this.applyTranslatedValue(
          this.heroCardForm.controls.subtitleEn,
          translatedFields['subtitleEn']
        );
        translatedCount += this.applyTranslatedValue(
          this.heroCardForm.controls.badgeEn,
          translatedFields['badgeEn']
        );
        translatedCount += this.applyTranslatedValue(
          this.heroCardForm.controls.highlight1En,
          translatedFields['highlight1En']
        );
        translatedCount += this.applyTranslatedValue(
          this.heroCardForm.controls.highlight2En,
          translatedFields['highlight2En']
        );
        translatedCount += this.applyTranslatedValue(
          this.heroCardForm.controls.highlight3En,
          translatedFields['highlight3En']
        );
        translatedCount += this.applyTranslatedValue(
          this.heroCardForm.controls.stat1LabelEn,
          translatedFields['stat1LabelEn']
        );
        translatedCount += this.applyTranslatedValue(
          this.heroCardForm.controls.stat2LabelEn,
          translatedFields['stat2LabelEn']
        );
        translatedCount += this.applyTranslatedValue(
          this.heroCardForm.controls.stat3LabelEn,
          translatedFields['stat3LabelEn']
        );

        if (translatedCount === 0) {
          this.toastService.warning(
            'Aucune traduction exploitable n’a été renvoyée par le serveur.'
          );
          this.isTranslatingHeroCard = false;
          return;
        }

        this.toastService.success('Les champs anglais de la hero card ont été mis à jour.');
        this.isTranslatingHeroCard = false;
      },
      error: (error) => {
        const message = extractApiErrorMessage(
          error,
          'La traduction automatique de la hero card a échoué.'
        );

        this.toastService.error(message);
        this.isTranslatingHeroCard = false;
      },
    });
  }

  saveHeroCard(): void {
    this.heroCardErrorMessage = '';
    clearApiErrorsFromForm(this.heroCardForm);

    if (this.heroCardForm.invalid) {
      handleInvalidAdminForm({
        form: this.heroCardForm,
        container: this.elementRef.nativeElement,
        toastService: this.toastService,
        message: 'Veuillez corriger les champs du formulaire.',
        scopeSelector: '#admin-hero-card-form',
      });
      return;
    }

    this.isSubmittingHeroCard = true;

    const payload: HeroCard = {
      title: {
        fr: this.heroCardForm.controls.titleFr.value,
        en: this.heroCardForm.controls.titleEn.value,
      },
      subtitle: {
        fr: this.heroCardForm.controls.subtitleFr.value,
        en: this.heroCardForm.controls.subtitleEn.value,
      },
      badge: {
        fr: this.heroCardForm.controls.badgeFr.value,
        en: this.heroCardForm.controls.badgeEn.value,
      },
      highlight1: {
        fr: this.heroCardForm.controls.highlight1Fr.value,
        en: this.heroCardForm.controls.highlight1En.value,
      },
      highlight2: {
        fr: this.heroCardForm.controls.highlight2Fr.value,
        en: this.heroCardForm.controls.highlight2En.value,
      },
      highlight3: {
        fr: this.heroCardForm.controls.highlight3Fr.value,
        en: this.heroCardForm.controls.highlight3En.value,
      },
      stat1Label: {
        fr: this.heroCardForm.controls.stat1LabelFr.value,
        en: this.heroCardForm.controls.stat1LabelEn.value,
      },
      stat1Value: this.heroCardForm.controls.stat1Value.value,
      stat2Label: {
        fr: this.heroCardForm.controls.stat2LabelFr.value,
        en: this.heroCardForm.controls.stat2LabelEn.value,
      },
      stat2Value: this.heroCardForm.controls.stat2Value.value,
      stat3Label: {
        fr: this.heroCardForm.controls.stat3LabelFr.value,
        en: this.heroCardForm.controls.stat3LabelEn.value,
      },
      stat3Value: this.heroCardForm.controls.stat3Value.value,
    };

    this.adminHeroCardApi.update(payload).subscribe({
      next: (heroCard) => {
        this.isSubmittingHeroCard = false;
        clearApiErrorsFromForm(this.heroCardForm);
        this.heroCardForm.setValue({
          titleFr: heroCard.title.fr,
          titleEn: heroCard.title.en,
          subtitleFr: heroCard.subtitle.fr,
          subtitleEn: heroCard.subtitle.en,
          badgeFr: heroCard.badge.fr,
          badgeEn: heroCard.badge.en,
          highlight1Fr: heroCard.highlight1.fr,
          highlight1En: heroCard.highlight1.en,
          highlight2Fr: heroCard.highlight2.fr,
          highlight2En: heroCard.highlight2.en,
          highlight3Fr: heroCard.highlight3.fr,
          highlight3En: heroCard.highlight3.en,
          stat1LabelFr: heroCard.stat1Label.fr,
          stat1LabelEn: heroCard.stat1Label.en,
          stat1Value: heroCard.stat1Value,
          stat2LabelFr: heroCard.stat2Label.fr,
          stat2LabelEn: heroCard.stat2Label.en,
          stat2Value: heroCard.stat2Value,
          stat3LabelFr: heroCard.stat3Label.fr,
          stat3LabelEn: heroCard.stat3Label.en,
          stat3Value: heroCard.stat3Value,
        });
        this.heroCardForm.markAsPristine();
        this.toastService.success('Hero card enregistrée avec succès.');
      },
      error: (error) => {
        this.isSubmittingHeroCard = false;
        applyApiErrorsToForm(this.heroCardForm, error);
        this.heroCardErrorMessage = extractApiErrorMessage(
          error,
          'Impossible d’enregistrer la hero card.'
        );
        this.toastService.error(this.heroCardErrorMessage);
        this.scrollToHeroCardError();
      },
    });
  }

  private buildHeroTranslationFields(): Record<string, string> {
    const fields: Record<string, string> = {};

    this.addTranslationField(fields, 'titleFr', this.heroForm.controls.titleFr.value);
    this.addTranslationField(fields, 'subtitleFr', this.heroForm.controls.subtitleFr.value);

    return fields;
  }

  private buildHeroCardTranslationFields(): Record<string, string> {
    const fields: Record<string, string> = {};

    this.addTranslationField(fields, 'titleFr', this.heroCardForm.controls.titleFr.value);
    this.addTranslationField(fields, 'subtitleFr', this.heroCardForm.controls.subtitleFr.value);
    this.addTranslationField(fields, 'badgeFr', this.heroCardForm.controls.badgeFr.value);
    this.addTranslationField(fields, 'highlight1Fr', this.heroCardForm.controls.highlight1Fr.value);
    this.addTranslationField(fields, 'highlight2Fr', this.heroCardForm.controls.highlight2Fr.value);
    this.addTranslationField(fields, 'highlight3Fr', this.heroCardForm.controls.highlight3Fr.value);
    this.addTranslationField(fields, 'stat1LabelFr', this.heroCardForm.controls.stat1LabelFr.value);
    this.addTranslationField(fields, 'stat2LabelFr', this.heroCardForm.controls.stat2LabelFr.value);
    this.addTranslationField(fields, 'stat3LabelFr', this.heroCardForm.controls.stat3LabelFr.value);

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
}