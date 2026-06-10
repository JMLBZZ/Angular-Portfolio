export interface AppearanceSettings {
  accentColor: string;
  logoImageUrl?: string | null;
  logoSvgCode?: string | null;
  showHeroLogo?: boolean | null;
}

export interface AppearanceSettingsPayload {
  accentColor: string;
  logoImageUrl?: string | null;
  logoSvgCode?: string | null;
  showHeroLogo?: boolean | null;
}

export const DEFAULT_ACCENT_COLOR = '#c5a567';