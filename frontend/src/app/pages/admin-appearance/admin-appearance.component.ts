import { CommonModule } from '@angular/common';
import { Component, OnDestroy, OnInit } from '@angular/core';
import { FormsModule } from '@angular/forms';
import {
  BrushIcon,
  CheckCircle2Icon,
  Code2Icon,
  EyeIcon,
  ImageIcon,
  PaletteIcon,
  RefreshCcwDotIcon,
  RotateCcwIcon,
  Settings2Icon,
  SparklesIcon,
  Trash2Icon,
  UploadCloudIcon,
  WandSparklesIcon,
  LucideAngularModule,
} from 'lucide-angular';
import { catchError, EMPTY, finalize, take } from 'rxjs';

import { AdminAppearanceApiService } from '../../core/api/admin-appearance-api.service';
import { resolveMediaUrl } from '../../core/api/media-url.utils';
import { ThemeService } from '../../core/theme/theme.service';
import { DEFAULT_ACCENT_COLOR } from '../../shared/models/appearance.model';
import { ToastService } from '../../shared/services/toast.service';
import { PendingChangesComponent } from '../../core/auth/pending-changes.guard';
import { AdminFloatingActionsComponent } from '../../shared/components/admin-floating-actions/admin-floating-actions.component';
import { CharacterCounterComponent } from '../../shared/components/character-counter/character-counter.component';

@Component({
  selector: 'app-admin-appearance',
  standalone: true,
  imports: [
    CommonModule,
    FormsModule,
    LucideAngularModule,
    AdminFloatingActionsComponent,
    CharacterCounterComponent,
  ],
  templateUrl: './admin-appearance.component.html',
})
export class AdminAppearanceComponent implements OnInit, OnDestroy, PendingChangesComponent {
  readonly PaletteIcon = PaletteIcon;
  readonly RefreshCcwDotIcon = RefreshCcwDotIcon;
  readonly CheckCircle2Icon = CheckCircle2Icon;
  readonly EyeIcon = EyeIcon;
  readonly SparklesIcon = SparklesIcon;
  readonly Settings2Icon = Settings2Icon;
  readonly WandSparklesIcon = WandSparklesIcon;
  readonly BrushIcon = BrushIcon;
  readonly ImageIcon = ImageIcon;
  readonly UploadCloudIcon = UploadCloudIcon;
  readonly RotateCcwIcon = RotateCcwIcon;
  readonly Trash2Icon = Trash2Icon;
  readonly Code2Icon = Code2Icon;

  readonly defaultAccentColor = DEFAULT_ACCENT_COLOR;
  readonly maxLogoFileSize = 5 * 1024 * 1024; // 5 MB
  readonly maxLogoImageUrlLength = 1000;
  readonly maxLogoSvgCodeLength = 20000;
  readonly logoImageUrlWarningThreshold = 100;
  readonly logoSvgCodeWarningThreshold = 1000;
  readonly allowedLogoAccept = '.svg,.png,.jpg,.jpeg,.gif,image/svg+xml,image/png,image/jpeg,image/gif';

  accentColor = DEFAULT_ACCENT_COLOR;
  savedAccentColor = DEFAULT_ACCENT_COLOR;

  logoImageUrl = '';
  savedLogoImageUrl = '';

  logoSvgCode = '';
  savedLogoSvgCode = '';

  showHeroLogo = true;
  savedShowHeroLogo = true;

  logoImagePreviewFailed = false;

  isLoading = false;
  isSaving = false;
  isResetting = false;
  isUploadingLogo = false;

  constructor(
    private adminAppearanceApi: AdminAppearanceApiService,
    private themeService: ThemeService,
    private toastService: ToastService
  ) {}

  ngOnInit(): void {
    this.loadSettings();
  }

  ngOnDestroy(): void {
    if (this.hasUnsavedChanges) {
      this.themeService.applyAccentColor(this.savedAccentColor);
    }
  }

  canDeactivate(): boolean {
    if (!this.hasUnsavedChanges || this.isSaving || this.isResetting) {
      return true;
    }

    return window.confirm(
      'Vous avez des modifications non enregistrées. Voulez-vous vraiment quitter cette page ?'
    );
  }

  cancelChanges(): void {
    if (!this.hasUnsavedChanges || this.isBusy) {
      return;
    }

    const confirmed = window.confirm(
      'Vous avez des modifications non enregistrées. Voulez-vous vraiment les annuler ?'
    );

    if (!confirmed) {
      return;
    }

    this.restoreSavedAppearance();
    this.toastService.info('Modifications annulées.');
  }

  get normalizedAccentColor(): string {
    return this.normalizeAccentColor(this.accentColor);
  }

  get normalizedLogoImageUrl(): string {
    return this.logoImageUrl.trim();
  }

  get normalizedLogoSvgCode(): string {
    return this.logoSvgCode.trim();
  }

  get isAccentColorValid(): boolean {
    return this.isValidHexColor(this.accentColor);
  }

  get isLogoImageUrlValid(): boolean {
    return this.normalizedLogoImageUrl.length <= this.maxLogoImageUrlLength;
  }

  get isLogoSvgCodeValid(): boolean {
    if (!this.normalizedLogoSvgCode) {
      return true;
    }

    return (
      this.normalizedLogoSvgCode.length <= this.maxLogoSvgCodeLength &&
      this.normalizedLogoSvgCode.toLowerCase().includes('<svg')
    );
  }

  get accentColorError(): string | null {
    if (!this.accentColor.trim()) {
      return 'La couleur principale est obligatoire.';
    }

    if (!this.isAccentColorValid) {
      return `Utilise le format hexadécimal #RRGGBB, par exemple ${this.defaultAccentColor}.`;
    }

    return null;
  }

  get logoImageUrlError(): string | null {
    if (!this.normalizedLogoImageUrl) {
      return null;
    }

    if (this.normalizedLogoImageUrl.length > this.maxLogoImageUrlLength) {
      return `L’URL du logo ne doit pas dépasser ${this.maxLogoImageUrlLength} caractères.`;
    }

    return null;
  }

  get logoSvgCodeError(): string | null {
    if (!this.normalizedLogoSvgCode) {
      return null;
    }

    if (this.normalizedLogoSvgCode.length > this.maxLogoSvgCodeLength) {
      return `Le code SVG ne doit pas dépasser ${this.maxLogoSvgCodeLength} caractères.`;
    }

    if (!this.normalizedLogoSvgCode.toLowerCase().includes('<svg')) {
      return 'Le code doit contenir une balise <svg>.';
    }

    return null;
  }

  get resolvedLogoImageUrl(): string | null {
    return resolveMediaUrl(this.normalizedLogoImageUrl) ?? null;
  }

  get hasLogoImage(): boolean {
    return !!this.resolvedLogoImageUrl;
  }

  get hasLogoSvgCode(): boolean {
    return !!this.normalizedLogoSvgCode;
  }

  get hasLogoConfigured(): boolean {
    return this.hasLogoImage || this.hasLogoSvgCode;
  }

  get shouldShowLogoImagePreview(): boolean {
    return this.hasLogoImage && !this.logoImagePreviewFailed;
  }

  get shouldShowLogoSvgPreview(): boolean {
    return (!this.hasLogoImage || this.logoImagePreviewFailed) && this.hasLogoSvgCode;
  }

  get shouldShowLogoTextFallback(): boolean {
    return !this.shouldShowLogoImagePreview && !this.shouldShowLogoSvgPreview;
  }

  get logoStatusLabel(): string {
    if (this.shouldShowLogoImagePreview) {
      return 'Image Cloudinary active';
    }

    if (this.shouldShowLogoSvgPreview) {
      return this.logoImagePreviewFailed
        ? 'SVG de secours actif'
        : 'SVG personnalisé actif';
    }

    return 'Logo texte par défaut';
  }

  get heroLogoStatusLabel(): string {
    return this.showHeroLogo ? 'Logo Hero visible' : 'Logo Hero masqué';
  }

  get hasUnsavedChanges(): boolean {
    return (
      this.normalizedAccentColor !== this.savedAccentColor ||
      this.normalizedLogoImageUrl !== this.savedLogoImageUrl ||
      this.normalizedLogoSvgCode !== this.savedLogoSvgCode ||
      this.showHeroLogo !== this.savedShowHeroLogo
    );
  }

  get isBusy(): boolean {
    return this.isLoading || this.isSaving || this.isResetting || this.isUploadingLogo;
  }

  get colorPickerValue(): string {
    return this.isAccentColorValid ? this.normalizedAccentColor : this.savedAccentColor;
  }

  get isDefaultColorSaved(): boolean {
    return this.savedAccentColor === DEFAULT_ACCENT_COLOR;
  }

  loadSettings(): void {
    this.isLoading = true;
    this.logoImagePreviewFailed = false;

    this.adminAppearanceApi
      .get()
      .pipe(
        take(1),
        catchError(() => {
          this.accentColor = DEFAULT_ACCENT_COLOR;
          this.savedAccentColor = DEFAULT_ACCENT_COLOR;

          this.logoImageUrl = '';
          this.savedLogoImageUrl = '';

          this.logoSvgCode = '';
          this.savedLogoSvgCode = '';

          this.showHeroLogo = true;
          this.savedShowHeroLogo = true;

          this.logoImagePreviewFailed = false;
          this.themeService.resetAccentColor();

          this.toastService.error(
            'Impossible de charger les paramètres d’apparence. La couleur par défaut est utilisée.'
          );

          return EMPTY;
        }),
        finalize(() => {
          this.isLoading = false;
        })
      )
      .subscribe((settings) => {
        const color = this.normalizeOrDefault(settings.accentColor);
        const logoImageUrl = this.normalizePlainText(settings.logoImageUrl ?? '');
        const logoSvgCode = this.normalizeSvgCode(settings.logoSvgCode ?? '');
        const showHeroLogo = settings.showHeroLogo ?? true;

        this.accentColor = color;
        this.savedAccentColor = color;

        this.logoImageUrl = logoImageUrl;
        this.savedLogoImageUrl = logoImageUrl;

        this.logoSvgCode = logoSvgCode;
        this.savedLogoSvgCode = logoSvgCode;

        this.showHeroLogo = showHeroLogo;
        this.savedShowHeroLogo = showHeroLogo;

        this.logoImagePreviewFailed = false;
        this.themeService.applyAccentColor(color);
      });
  }

  onAccentColorChange(value: string): void {
    this.accentColor = value;

    if (this.isAccentColorValid) {
      this.themeService.applyAccentColor(this.normalizedAccentColor);
    }
  }

  resetAccentColorToDefault(): void {
    if (this.isBusy) {
      return;
    }

    this.onAccentColorChange(this.defaultAccentColor);
  }

  onLogoImageUrlChange(value: string): void {
    this.logoImageUrl = value;
    this.logoImagePreviewFailed = false;
  }

  onLogoSvgCodeChange(value: string): void {
    this.logoSvgCode = value;
  }

  onShowHeroLogoChange(value: boolean): void {
    this.showHeroLogo = value;
  }

  toggleHeroLogo(): void {
    if (this.isBusy) {
      return;
    }

    this.showHeroLogo = !this.showHeroLogo;
  }

  onLogoImagePreviewError(): void {
    this.logoImagePreviewFailed = true;
  }

  onLogoFileSelected(event: Event): void {
    const input = event.target as HTMLInputElement;
    const file = input.files?.[0] ?? null;

    if (!file) {
      return;
    }

    if (!this.isAllowedLogoFile(file)) {
      this.toastService.error('Formats autorisés : SVG, PNG, JPG, JPEG ou GIF.');
      input.value = '';
      return;
    }

    if (file.size > this.maxLogoFileSize) {
      this.toastService.error('Le fichier dépasse la taille maximale autorisée de 5 MB.');
      input.value = '';
      return;
    }

    this.isUploadingLogo = true;

    this.adminAppearanceApi
      .uploadLogo(file)
      .pipe(
        take(1),
        finalize(() => {
          this.isUploadingLogo = false;
        })
      )
      .subscribe({
        next: (url) => {
          this.logoImageUrl = url;
          this.logoImagePreviewFailed = false;

          this.toastService.success(
            'Logo uploadé. Pense à enregistrer la page Apparence.'
          );

          input.value = '';
        },
        error: () => {
          this.toastService.error(
            'Impossible d’uploader le logo. Vérifie le format du fichier.'
          );

          input.value = '';
        },
      });
  }

  clearLogoImage(fileInput?: HTMLInputElement): void {
    this.logoImageUrl = '';
    this.logoImagePreviewFailed = false;

    if (fileInput) {
      fileInput.value = '';
    }
  }

  clearLogoSvgCode(): void {
    this.logoSvgCode = '';
  }

  clearLogo(): void {
    this.logoImageUrl = '';
    this.logoSvgCode = '';
    this.logoImagePreviewFailed = false;
  }

  save(): void {
    if (this.isUploadingLogo) {
      this.toastService.warning('Attends la fin de l’upload du logo avant de sauvegarder.');
      return;
    }

    if (!this.isAccentColorValid) {
      this.toastService.warning('Corrige la couleur avant de sauvegarder.');
      return;
    }

    if (!this.isLogoImageUrlValid) {
      this.toastService.warning('Corrige l’URL du logo avant de sauvegarder.');
      return;
    }

    if (!this.isLogoSvgCodeValid) {
      this.toastService.warning('Corrige le code SVG du logo avant de sauvegarder.');
      return;
    }

    this.isSaving = true;

    this.adminAppearanceApi
      .update({
        accentColor: this.normalizedAccentColor,
        logoImageUrl: this.normalizedLogoImageUrl,
        logoSvgCode: this.normalizedLogoSvgCode,
        showHeroLogo: this.showHeroLogo,
      })
      .pipe(
        take(1),
        finalize(() => {
          this.isSaving = false;
        })
      )
      .subscribe({
        next: (settings) => {
          const color = this.normalizeOrDefault(settings.accentColor);
          const logoImageUrl = this.normalizePlainText(settings.logoImageUrl ?? '');
          const logoSvgCode = this.normalizeSvgCode(settings.logoSvgCode ?? '');
          const showHeroLogo = settings.showHeroLogo ?? true;

          this.accentColor = color;
          this.savedAccentColor = color;

          this.logoImageUrl = logoImageUrl;
          this.savedLogoImageUrl = logoImageUrl;

          this.logoSvgCode = logoSvgCode;
          this.savedLogoSvgCode = logoSvgCode;

          this.showHeroLogo = showHeroLogo;
          this.savedShowHeroLogo = showHeroLogo;

          this.logoImagePreviewFailed = false;
          this.themeService.applyAccentColor(color);

          this.toastService.success('Paramètres d’apparence sauvegardés.');
        },
        error: () => {
          this.themeService.applyAccentColor(this.savedAccentColor);

          this.toastService.error(
            'La sauvegarde a échoué. Les derniers paramètres enregistrés ont été conservés.'
          );
        },
      });
  }

  resetToDefault(): void {
    this.isResetting = true;

    this.adminAppearanceApi
      .reset()
      .pipe(
        take(1),
        finalize(() => {
          this.isResetting = false;
        })
      )
      .subscribe({
        next: (settings) => {
          const color = this.normalizeOrDefault(settings.accentColor);
          const logoImageUrl = this.normalizePlainText(settings.logoImageUrl ?? '');
          const logoSvgCode = this.normalizeSvgCode(settings.logoSvgCode ?? '');
          const showHeroLogo = settings.showHeroLogo ?? true;

          this.accentColor = color;
          this.savedAccentColor = color;

          this.logoImageUrl = logoImageUrl;
          this.savedLogoImageUrl = logoImageUrl;

          this.logoSvgCode = logoSvgCode;
          this.savedLogoSvgCode = logoSvgCode;

          this.showHeroLogo = showHeroLogo;
          this.savedShowHeroLogo = showHeroLogo;

          this.logoImagePreviewFailed = false;
          this.themeService.applyAccentColor(color);

          this.toastService.success('Paramètres d’apparence réinitialisés.');
        },
        error: () => {
          this.themeService.applyAccentColor(this.savedAccentColor);

          this.toastService.error(
            'La réinitialisation a échoué. Les derniers paramètres enregistrés ont été conservés.'
          );
        },
      });
  }

  restoreSavedColor(): void {
    this.restoreSavedAppearance();
  }

  restoreSavedAppearance(): void {
    this.accentColor = this.savedAccentColor;
    this.logoImageUrl = this.savedLogoImageUrl;
    this.logoSvgCode = this.savedLogoSvgCode;
    this.showHeroLogo = this.savedShowHeroLogo;
    this.logoImagePreviewFailed = false;

    this.themeService.applyAccentColor(this.savedAccentColor);
  }

  private normalizeAccentColor(color: string): string {
    return String(color ?? '').trim().toLowerCase();
  }

  private normalizeOrDefault(color: string): string {
    const normalizedColor = this.normalizeAccentColor(color);

    return this.isValidHexColor(normalizedColor) ? normalizedColor : DEFAULT_ACCENT_COLOR;
  }

  private normalizePlainText(value: string): string {
    return String(value ?? '').trim();
  }

  private normalizeSvgCode(value: string): string {
    return String(value ?? '').trim();
  }

  private isValidHexColor(color: string): boolean {
    return /^#[0-9a-f]{6}$/.test(this.normalizeAccentColor(color));
  }

  private isAllowedLogoFile(file: File): boolean {
    const allowedTypes = [
      'image/svg+xml',
      'image/png',
      'image/jpeg',
      'image/gif',
    ];

    const allowedExtensions = [
      '.svg',
      '.png',
      '.jpg',
      '.jpeg',
      '.gif',
    ];

    const fileType = file.type.toLowerCase();
    const fileName = file.name.toLowerCase();

    return (
      allowedTypes.includes(fileType) ||
      allowedExtensions.some((extension) => fileName.endsWith(extension))
    );
  }
}