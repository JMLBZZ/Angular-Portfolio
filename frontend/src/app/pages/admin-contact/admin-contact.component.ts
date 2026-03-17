import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormControl, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { RouterLink } from '@angular/router';

import { TextFieldComponent } from '../../shared/components/text-field/text-field.component';
import { PrimaryButtonComponent } from '../../shared/components/primary-button/primary-button.component';
import { ToastService } from '../../shared/services/toast.service';
import { AdminContactApiService } from '../../core/api/admin-contact-api.service';
import { Contact } from '../../shared/models/contact.model';

@Component({
  selector: 'app-admin-contact',
  standalone: true,
  imports: [
    CommonModule,
    ReactiveFormsModule,
    RouterLink,
    TextFieldComponent,
    PrimaryButtonComponent,
  ],
  templateUrl: './admin-contact.component.html',
})
export class AdminContactComponent implements OnInit {
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
      validators: [Validators.pattern(/^(|https?:\/\/.+)$/), Validators.maxLength(255)],
    }),
    githubUrl: new FormControl('', {
      nonNullable: true,
      validators: [Validators.pattern(/^(|https?:\/\/.+)$/), Validators.maxLength(255)],
    }),
  });

  constructor(
    private adminContactApi: AdminContactApiService,
    private toastService: ToastService
  ) {}

  ngOnInit(): void {
    this.loadContact();
  }

  loadContact(): void {
    this.isLoading = true;
    this.errorMessage = '';

    this.adminContactApi.get().subscribe({
      next: (contact) => {
        this.isLoading = false;
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
      error: () => {
        this.isLoading = false;
        this.errorMessage = 'Impossible de charger les données du contact.';
      },
    });
  }

  save(): void {
    if (this.form.invalid) {
      this.form.markAllAsTouched();
      return;
    }

    this.isSubmitting = true;
    this.errorMessage = '';

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
      error: () => {
        this.isSubmitting = false;
        this.toastService.error('Impossible d’enregistrer le contact.');
      },
    });
  }
}