import { Component, ElementRef, OnDestroy, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterLink } from '@angular/router';
import {
  DownloadIcon,
  EyeIcon,
  FileTextIcon,
  ImageIcon,
  InfoIcon,
  RotateCcwIcon,
  UploadCloudIcon,
  LucideAngularModule,
} from 'lucide-angular';

import { getDocument, GlobalWorkerOptions } from 'pdfjs-dist/legacy/build/pdf.mjs';

import { AdminResumeApiService } from '../../core/api/admin-resume-api.service';
import { resolveMediaUrl } from '../../core/api/media-url.utils';
import { ResumeContent } from '../../shared/models/resume.model';
import { PrimaryButtonComponent } from '../../shared/components/primary-button/primary-button.component';
import { ToastService } from '../../shared/services/toast.service';
import { extractApiErrorMessage } from '../../core/api/api-error.utils';
import { scrollToSelector } from '../../shared/utils/admin-form.utils';

GlobalWorkerOptions.workerSrc = new URL(
  'pdfjs-dist/legacy/build/pdf.worker.min.mjs',
  import.meta.url
).toString();

@Component({
  selector: 'app-admin-resume',
  standalone: true,
  imports: [
    CommonModule,
    RouterLink,
    PrimaryButtonComponent,
    LucideAngularModule,
  ],
  templateUrl: './admin-resume.component.html',
})
export class AdminResumeComponent implements OnInit, OnDestroy {
  readonly DownloadIcon = DownloadIcon;
  readonly EyeIcon = EyeIcon;
  readonly FileTextIcon = FileTextIcon;
  readonly ImageIcon = ImageIcon;
  readonly InfoIcon = InfoIcon;
  readonly RotateCcwIcon = RotateCcwIcon;
  readonly UploadCloudIcon = UploadCloudIcon;

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
    private toastService: ToastService,
    private elementRef: ElementRef<HTMLElement>
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

  get thumbnailUrl(): string | undefined {
    if (this.thumbnailDataUrl) {
      return this.thumbnailDataUrl;
    }

    if (!this.selectedFile) {
      return this.getCloudinaryPdfPreviewUrl(this.resumeUrl);
    }

    return undefined;
  }

  get hasThumbnail(): boolean {
    return !!this.thumbnailUrl;
  }

  get thumbnailTitle(): string {
    return this.selectedFile
      ? 'Miniature du PDF sélectionné'
      : 'Miniature du CV actuel';
  }

  async onFileSelected(event: Event): Promise<void> {
    const input = event.target as HTMLInputElement;
    const file = input.files?.[0] ?? null;

    this.errorMessage = '';

    if (!file) {
      this.clearSelectedFile(input);
      this.prepareCurrentResumeThumbnail();
      return;
    }

    if (file.type !== 'application/pdf' && !file.name.toLowerCase().endsWith('.pdf')) {
      this.errorMessage = 'Seuls les fichiers PDF sont autorisés.';
      this.toastService.error(this.errorMessage);
      this.scrollToGlobalError();
      this.clearSelectedFile(input);
      this.prepareCurrentResumeThumbnail();
      return;
    }

    this.selectedFile = file;
    await this.generateThumbnailFromFile(file);
  }

  upload(): void {
    this.errorMessage = '';

    if (!this.selectedFile) {
      this.errorMessage = 'Sélectionne un fichier PDF avant de continuer.';
      this.toastService.error(this.errorMessage);
      this.scrollToGlobalError();
      return;
    }

    this.isSubmitting = true;

    this.adminResumeApi.upload(this.selectedFile).subscribe({
      next: (resume) => {
        this.resume = resume;
        this.selectedFile = null;
        this.isSubmitting = false;
        this.errorMessage = '';
        this.toastService.success('CV mis à jour avec succès.');
        this.prepareCurrentResumeThumbnail();
      },
      error: (error) => {
        this.isSubmitting = false;
        this.errorMessage = extractApiErrorMessage(
          error,
          'Impossible de mettre à jour le CV.'
        );
        this.toastService.error(this.errorMessage);
        this.scrollToGlobalError();
        this.prepareCurrentResumeThumbnail();
      },
    });
  }

  clearSelection(fileInput?: HTMLInputElement): void {
    this.errorMessage = '';
    this.clearSelectedFile(fileInput);
    this.prepareCurrentResumeThumbnail();
  }

  private loadResume(): void {
    this.isLoading = true;
    this.errorMessage = '';

    this.adminResumeApi.get().subscribe({
      next: (resume) => {
        this.resume = resume;
        this.isLoading = false;
        this.prepareCurrentResumeThumbnail();
      },
      error: (error) => {
        this.isLoading = false;
        this.errorMessage = extractApiErrorMessage(
          error,
          'Impossible de charger les données du CV.'
        );
        this.toastService.error(this.errorMessage);
        this.scrollToGlobalError();
      },
    });
  }

  private prepareCurrentResumeThumbnail(): void {
    this.thumbnailRenderVersion++;
    this.thumbnailDataUrl = undefined;
    this.isGeneratingThumbnail = false;
  }

  private getCloudinaryPdfPreviewUrl(url: string | null | undefined): string | undefined {
    if (!url) {
      return undefined;
    }

    if (!url.includes('res.cloudinary.com') || !url.toLowerCase().endsWith('.pdf')) {
      return undefined;
    }

    if (url.includes('/image/upload/')) {
      return url.replace('/image/upload/', '/image/upload/pg_1,f_jpg,q_auto,w_900/');
    }

    if (url.includes('/raw/upload/')) {
      return url
        .replace('/raw/upload/', '/image/upload/')
        .replace('/upload/', '/upload/pg_1,f_jpg,q_auto,w_900/');
    }

    return undefined;
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
        this.errorMessage = 'Impossible de générer la miniature du PDF.';
        this.toastService.error(this.errorMessage);
        this.scrollToGlobalError();
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

  private scrollToGlobalError(): void {
    scrollToSelector(
      this.elementRef.nativeElement,
      '#admin-resume-global-error'
    );
  }
}