import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';

import { AdminResumeApiService } from '../../core/api/admin-resume-api.service';
import { resolveMediaUrl } from '../../core/api/media-url.utils';
import { ResumeContent } from '../../shared/models/resume.model';
import { PrimaryButtonComponent } from '../../shared/components/primary-button/primary-button.component';
import { ToastService } from '../../shared/services/toast.service';

@Component({
  selector: 'app-admin-resume',
  standalone: true,
  imports: [
    CommonModule,
    PrimaryButtonComponent,
  ],
  templateUrl: './admin-resume.component.html',
})
export class AdminResumeComponent implements OnInit {
  isLoading = false;
  isSubmitting = false;
  errorMessage = '';

  resume: ResumeContent | null = null;
  selectedFile: File | null = null;

  constructor(
    private adminResumeApi: AdminResumeApiService,
    private toastService: ToastService
  ) {}

  ngOnInit(): void {
    this.loadResume();
  }

  get hasResume(): boolean {
    return !!this.resume?.fileUrl;
  }

  get resumeUrl(): string | undefined {
    return resolveMediaUrl(this.resume?.fileUrl);
  }

  onFileSelected(event: Event): void {
    const input = event.target as HTMLInputElement;
    const file = input.files?.[0] ?? null;

    if (!file) {
      this.selectedFile = null;
      return;
    }

    if (file.type !== 'application/pdf' && !file.name.toLowerCase().endsWith('.pdf')) {
      this.toastService.error('Seuls les fichiers PDF sont autorisés.');
      input.value = '';
      this.selectedFile = null;
      return;
    }

    this.selectedFile = file;
  }

  upload(): void {
    if (!this.selectedFile) {
      this.toastService.error('Sélectionne un fichier PDF avant de continuer.');
      return;
    }

    this.isSubmitting = true;
    this.errorMessage = '';

    this.adminResumeApi.upload(this.selectedFile).subscribe({
      next: (resume) => {
        this.resume = resume;
        this.selectedFile = null;
        this.isSubmitting = false;
        this.toastService.success('CV mis à jour avec succès.');
      },
      error: () => {
        this.isSubmitting = false;
        this.toastService.error('Impossible de mettre à jour le CV.');
      },
    });
  }

  private loadResume(): void {
    this.isLoading = true;
    this.errorMessage = '';

    this.adminResumeApi.get().subscribe({
      next: (resume) => {
        this.resume = resume;
        this.isLoading = false;
      },
      error: () => {
        this.isLoading = false;
        this.errorMessage = 'Impossible de charger les données du CV.';
      },
    });
  }
}