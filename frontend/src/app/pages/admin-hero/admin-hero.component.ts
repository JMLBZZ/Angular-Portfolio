import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormControl, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { RouterLink } from '@angular/router';

import { TextFieldComponent } from '../../shared/components/text-field/text-field.component';
import { PrimaryButtonComponent } from '../../shared/components/primary-button/primary-button.component';
import { ToastService } from '../../shared/services/toast.service';
import { AdminHeroApiService } from '../../core/api/admin-hero-api.service';
import { AdminHeroCardApiService } from '../../core/api/admin-hero-card-api.service';
import { Hero } from '../../shared/models/hero.model';
import { HeroCard } from '../../shared/models/hero-card.model';

@Component({
  selector: 'app-admin-hero',
  standalone: true,
  imports: [
    CommonModule,
    ReactiveFormsModule,
    RouterLink,
    TextFieldComponent,
    PrimaryButtonComponent,
  ],
  templateUrl: './admin-hero.component.html',
})
export class AdminHeroComponent implements OnInit {
  isLoadingHero = false;
  isSubmittingHero = false;
  heroErrorMessage = '';

  isLoadingHeroCard = false;
  isSubmittingHeroCard = false;
  heroCardErrorMessage = '';

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
    private toastService: ToastService
  ) {}

  ngOnInit(): void {
    this.loadHero();
    this.loadHeroCard();
  }

  loadHero(): void {
    this.isLoadingHero = true;
    this.heroErrorMessage = '';

    this.adminHeroApi.get().subscribe({
      next: (hero) => {
        this.isLoadingHero = false;
        this.heroForm.setValue({
          titleFr: hero.title.fr,
          titleEn: hero.title.en,
          subtitleFr: hero.subtitle.fr,
          subtitleEn: hero.subtitle.en,
          available: hero.available,
        });
        this.heroForm.markAsPristine();
      },
      error: () => {
        this.isLoadingHero = false;
        this.heroErrorMessage = 'Impossible de charger les données du hero.';
      },
    });
  }

  saveHero(): void {
    if (this.heroForm.invalid) {
      this.heroForm.markAllAsTouched();
      return;
    }

    this.isSubmittingHero = true;
    this.heroErrorMessage = '';

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
    };

    this.adminHeroApi.update(payload).subscribe({
      next: (hero) => {
        this.isSubmittingHero = false;
        this.heroForm.setValue({
          titleFr: hero.title.fr,
          titleEn: hero.title.en,
          subtitleFr: hero.subtitle.fr,
          subtitleEn: hero.subtitle.en,
          available: hero.available,
        });
        this.heroForm.markAsPristine();
        this.toastService.success('Hero enregistré avec succès.');
      },
      error: () => {
        this.isSubmittingHero = false;
        this.toastService.error('Impossible d’enregistrer le hero.');
      },
    });
  }

  loadHeroCard(): void {
    this.isLoadingHeroCard = true;
    this.heroCardErrorMessage = '';

    this.adminHeroCardApi.get().subscribe({
      next: (heroCard) => {
        this.isLoadingHeroCard = false;
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
      error: () => {
        this.isLoadingHeroCard = false;
        this.heroCardErrorMessage = 'Impossible de charger les données de la hero card.';
      },
    });
  }

  saveHeroCard(): void {
    if (this.heroCardForm.invalid) {
      this.heroCardForm.markAllAsTouched();
      return;
    }

    this.isSubmittingHeroCard = true;
    this.heroCardErrorMessage = '';

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
      error: () => {
        this.isSubmittingHeroCard = false;
        this.toastService.error('Impossible d’enregistrer la hero card.');
      },
    });
  }
}