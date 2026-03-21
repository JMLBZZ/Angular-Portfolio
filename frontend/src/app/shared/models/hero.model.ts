import { LocalizedText } from './project.model';

export interface HeroTechBadge {
  id: number | null;
  label: string;
  displayOrder: number;
}

export interface Hero {
  title: LocalizedText;
  subtitle: LocalizedText;
  available: boolean;
  techBadges: HeroTechBadge[];
}