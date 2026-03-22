import { Component, OnDestroy, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';

import { getDocument, GlobalWorkerOptions } from 'pdfjs-dist/legacy/build/pdf.mjs';

import { AdminResumeApiService } from '../../core/api/admin-resume-api.service';
import { resolveMediaUrl } from '../../core/api/media-url.utils';
import { ResumeContent } from '../../shared/models/resume.model';
import { PrimaryButtonComponent } from '../../shared/components/primary-button/primary-button.component';
import { ToastService } from '../../shared/services/toast.service';

GlobalWorkerOptions.workerSrc = new URL(
  'pdfjs-dist/legacy/build/pdf.worker.min.mjs',
  import.meta.url
).toString();

@Component({
  selector: 'app-admin-resume',
  standalone: true,
  imports: [
    CommonModule,
    PrimaryButtonComponent,
  ],
  templateUrl: './admin-resume.component.html',
})
export class AdminResumeComponent implements OnInit, OnDestroy {
  isLoading = false;
  isSubmitting = false;
  isGeneratingThumbnail = false;
  errorMessage = '';

  resume: ResumeContent | null = null;
  selectedFile: File | null = null;

  /**
   * Miniature générée à partir de la première page du PDF.
   * C’est une vraie image (data URL), pas un iframe.
   */
  thumbnailDataUrl?: string;

  /**
   * Permet d’éviter qu’un rendu PDF plus lent écrase un rendu plus récent.
   */
  private thumbnailRenderVersion = 0;

  constructor(
    private adminResumeApi: AdminResumeApiService,
    private toastService: ToastService
  ) {}

  ngOnInit(): void {
    this.loadResume();
  }

  ngOnDestroy(): void {
    this.thumbnailRenderVersion++;
  }

  get hasResume(): boolean {
    return !!this.resume?.fileUrl;
  }

  get resumeUrl(): string | undefined {
    return resolveMediaUrl(this.resume?.fileUrl);
  }

  get currentFileName(): string {
    return this.resume?.originalFileName || 'CV.pdf';
  }

  get selectedFileName(): string | null {
    return this.selectedFile?.name ?? null;
  }

  get hasThumbnail(): boolean {
    return !!this.thumbnailDataUrl;
  }

  get thumbnailTitle(): string {
    return this.selectedFile
      ? 'Miniature du PDF sélectionné'
      : 'Miniature du CV actuel';
  }

  async onFileSelected(event: Event): Promise<void> {
    const input = event.target as HTMLInputElement;
    const file = input.files?.[0] ?? null;

    if (!file) {
      this.clearSelectedFile(input);
      await this.generateThumbnailFromCurrentResume();
      return;
    }

    if (file.type !== 'application/pdf' && !file.name.toLowerCase().endsWith('.pdf')) {
      this.toastService.error('Seuls les fichiers PDF sont autorisés.');
      this.clearSelectedFile(input);
      await this.generateThumbnailFromCurrentResume();
      return;
    }

    this.selectedFile = file;
    await this.generateThumbnailFromFile(file);
  }

  upload(): void {
    if (!this.selectedFile) {
      this.toastService.error('Sélectionne un fichier PDF avant de continuer.');
      return;
    }

    this.isSubmitting = true;
    this.errorMessage = '';

    this.adminResumeApi.upload(this.selectedFile).subscribe({
      next: async (resume) => {
        this.resume = resume;
        this.selectedFile = null;
        this.isSubmitting = false;
        this.toastService.success('CV mis à jour avec succès.');
        await this.generateThumbnailFromCurrentResume();
      },
      error: () => {
        this.isSubmitting = false;
        this.toastService.error('Impossible de mettre à jour le CV.');
      },
    });
  }

  clearSelection(fileInput?: HTMLInputElement): void {
    this.clearSelectedFile(fileInput);
    void this.generateThumbnailFromCurrentResume();
  }

  private loadResume(): void {
    this.isLoading = true;
    this.errorMessage = '';

    this.adminResumeApi.get().subscribe({
      next: async (resume) => {
        this.resume = resume;
        this.isLoading = false;
        await this.generateThumbnailFromCurrentResume();
      },
      error: () => {
        this.isLoading = false;
        this.errorMessage = 'Impossible de charger les données du CV.';
      },
    });
  }

  private async generateThumbnailFromCurrentResume(): Promise<void> {
    const url = this.resumeUrl;

    if (!url) {
      this.thumbnailDataUrl = undefined;
      return;
    }

    await this.generateThumbnailFromUrl(url);
  }

  private async generateThumbnailFromUrl(url: string): Promise<void> {
    const version = ++this.thumbnailRenderVersion;
    this.isGeneratingThumbnail = true;

    try {
      const loadingTask = getDocument(url);
      const pdf = await loadingTask.promise;

      if (version !== this.thumbnailRenderVersion) {
        return;
      }

      const page = await pdf.getPage(1);
      const baseViewport = page.getViewport({ scale: 1 });

      /**
       * On génère une image assez nette,
       * puis on laisse le CSS faire le cadrage "cover".
       */
      const targetWidth = 900;
      const scale = targetWidth / baseViewport.width;
      const viewport = page.getViewport({ scale });

      const canvas = document.createElement('canvas');
      const context = canvas.getContext('2d');

      if (!context) {
        throw new Error('Impossible de créer le contexte canvas.');
      }

      canvas.width = Math.floor(viewport.width);
      canvas.height = Math.floor(viewport.height);

      await page.render({
        canvas,
        canvasContext: context,
        viewport,
      }).promise;

      if (version !== this.thumbnailRenderVersion) {
        return;
      }

      this.thumbnailDataUrl = canvas.toDataURL('image/png');
    } catch {
      if (version === this.thumbnailRenderVersion) {
        this.thumbnailDataUrl = undefined;
      }
    } finally {
      if (version === this.thumbnailRenderVersion) {
        this.isGeneratingThumbnail = false;
      }
    }
  }

  private async generateThumbnailFromFile(file: File): Promise<void> {
    const version = ++this.thumbnailRenderVersion;
    this.isGeneratingThumbnail = true;

    try {
      const buffer = await file.arrayBuffer();

      if (version !== this.thumbnailRenderVersion) {
        return;
      }

      const loadingTask = getDocument({ data: new Uint8Array(buffer) });
      const pdf = await loadingTask.promise;

      if (version !== this.thumbnailRenderVersion) {
        return;
      }

      const page = await pdf.getPage(1);
      const baseViewport = page.getViewport({ scale: 1 });

      const targetWidth = 900;
      const scale = targetWidth / baseViewport.width;
      const viewport = page.getViewport({ scale });

      const canvas = document.createElement('canvas');
      const context = canvas.getContext('2d');

      if (!context) {
        throw new Error('Impossible de créer le contexte canvas.');
      }

      canvas.width = Math.floor(viewport.width);
      canvas.height = Math.floor(viewport.height);

      await page.render({
        canvas,
        canvasContext: context,
        viewport,
      }).promise;

      if (version !== this.thumbnailRenderVersion) {
        return;
      }

      this.thumbnailDataUrl = canvas.toDataURL('image/png');
    } catch {
      if (version === this.thumbnailRenderVersion) {
        this.thumbnailDataUrl = undefined;
        this.toastService.error('Impossible de générer la miniature du PDF.');
      }
    } finally {
      if (version === this.thumbnailRenderVersion) {
        this.isGeneratingThumbnail = false;
      }
    }
  }

  private clearSelectedFile(fileInput?: HTMLInputElement): void {
    this.selectedFile = null;

    if (fileInput) {
      fileInput.value = '';
    }
  }
}