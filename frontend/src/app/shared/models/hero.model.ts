import { LocalizedText } from './project.model';

export interface Hero {
  title: LocalizedText;
  subtitle: LocalizedText;
  available: boolean;
  techBadge1: string;
  techBadge2: string;
  techBadge3: string;
  techBadge4: string;
  techBadge5: string;
}