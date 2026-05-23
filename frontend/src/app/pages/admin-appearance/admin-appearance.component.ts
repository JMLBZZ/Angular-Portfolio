import { CommonModule } from '@angular/common';
import { Component, OnDestroy, OnInit } from '@angular/core';
import { FormsModule } from '@angular/forms';
import {
  BrushIcon,
  CheckCircle2Icon,
  EyeIcon,
  PaletteIcon,
  Settings2Icon,
  SparklesIcon,
  WandSparklesIcon,
  LucideAngularModule,
} from 'lucide-angular';
import { finalize, take } from 'rxjs';

import { AdminAppearanceApiService } from '../../core/api/admin-appearance-api.service';
import { ThemeService } from '../../core/theme/theme.service';
import { DEFAULT_ACCENT_COLOR } from '../../shared/models/appearance.model';
import { ToastService } from '../../shared/services/toast.service';
import { PendingChangesComponent } from '../../core/auth/pending-changes.guard';

@Component({
  selector: 'app-admin-appearance',
  standalone: true,
  imports: [
    CommonModule,
    FormsModule,
    LucideAngularModule,
  ],
  templateUrl: './admin-appearance.component.html',
})
export class AdminAppearanceComponent implements OnInit, OnDestroy, PendingChangesComponent {
  readonly PaletteIcon = PaletteIcon;
  readonly CheckCircle2Icon = CheckCircle2Icon;
  readonly EyeIcon = EyeIcon;
  readonly SparklesIcon = SparklesIcon;
  readonly Settings2Icon = Settings2Icon;
  readonly WandSparklesIcon = WandSparklesIcon;
  readonly BrushIcon = BrushIcon;

  readonly defaultAccentColor = DEFAULT_ACCENT_COLOR;

  accentColor = DEFAULT_ACCENT_COLOR;
  savedAccentColor = DEFAULT_ACCENT_COLOR;

  isLoading = false;
  isSaving = false;
  isResetting = false;

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

  get normalizedAccentColor(): string {
    return this.normalizeAccentColor(this.accentColor);
  }

  get isAccentColorValid(): boolean {
    return this.isValidHexColor(this.accentColor);
  }

  get accentColorError(): string | null {
    if (!this.accentColor.trim()) {
      return 'La couleur principale est obligatoire.';
    }

    if (!this.isAccentColorValid) {
      return 'Utilise le format hexadécimal #RRGGBB, par exemple$ {this.defaultAccentColor}.';
    }

    return null;
  }

  get hasUnsavedChanges(): boolean {
    return this.normalizedAccentColor !== this.savedAccentColor;
  }

  get isBusy(): boolean {
    return this.isLoading || this.isSaving || this.isResetting;
  }

  get colorPickerValue(): string {
    return this.isAccentColorValid ? this.normalizedAccentColor : this.savedAccentColor;
  }

  get isDefaultColorSaved(): boolean {
    return this.savedAccentColor === DEFAULT_ACCENT_COLOR;
  }

  loadSettings(): void {
    this.isLoading = true;

    this.adminAppearanceApi
      .get()
      .pipe(
        take(1),
        finalize(() => {
          this.isLoading = false;
        })
      )
      .subscribe({
        next: (settings) => {
          const color = this.normalizeOrDefault(settings.accentColor);

          this.accentColor = color;
          this.savedAccentColor = color;
          this.themeService.applyAccentColor(color);
        },
        error: () => {
          this.accentColor = DEFAULT_ACCENT_COLOR;
          this.savedAccentColor = DEFAULT_ACCENT_COLOR;
          this.themeService.resetAccentColor();

          this.toastService.error(
            'Impossible de charger les paramètres d’apparence. La couleur par défaut est utilisée.'
          );
        },
      });
  }

  onAccentColorChange(value: string): void {
    this.accentColor = value;

    if (this.isAccentColorValid) {
      this.themeService.applyAccentColor(this.normalizedAccentColor);
    }
  }

  save(): void {
    if (!this.isAccentColorValid) {
      this.toastService.warning('Corrige la couleur avant de sauvegarder.');
      return;
    }

    this.isSaving = true;

    this.adminAppearanceApi
      .update({
        accentColor: this.normalizedAccentColor,
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

          this.accentColor = color;
          this.savedAccentColor = color;
          this.themeService.applyAccentColor(color);

          this.toastService.success('Couleur principale sauvegardée.');
        },
        error: () => {
          this.themeService.applyAccentColor(this.savedAccentColor);

          this.toastService.error(
            'La sauvegarde a échoué. La dernière couleur enregistrée a été restaurée.'
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

          this.accentColor = color;
          this.savedAccentColor = color;
          this.themeService.applyAccentColor(color);

          this.toastService.success('Couleur d’origine restaurée.');
        },
        error: () => {
          this.themeService.applyAccentColor(this.savedAccentColor);

          this.toastService.error(
            'La réinitialisation a échoué. La dernière couleur enregistrée a été restaurée.'
          );
        },
      });
  }

  restoreSavedColor(): void {
    this.accentColor = this.savedAccentColor;
    this.themeService.applyAccentColor(this.savedAccentColor);
  }

  private normalizeAccentColor(color: string): string {
    return String(color ?? '').trim().toLowerCase();
  }

  private normalizeOrDefault(color: string): string {
    const normalizedColor = this.normalizeAccentColor(color);

    return this.isValidHexColor(normalizedColor) ? normalizedColor : DEFAULT_ACCENT_COLOR;
  }

  private isValidHexColor(color: string): boolean {
    return /^#[0-9a-f]{6}$/.test(this.normalizeAccentColor(color));
  }
}