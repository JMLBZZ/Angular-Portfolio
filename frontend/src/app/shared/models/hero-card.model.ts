import { LocalizedText } from './project.model';

export interface HeroCard {
  title: LocalizedText;
  subtitle: LocalizedText;
  badge: LocalizedText;
  highlight1: LocalizedText;
  highlight2: LocalizedText;
  highlight3: LocalizedText;
  stat1Label: LocalizedText;
  stat1Value: string;
  stat2Label: LocalizedText;
  stat2Value: string;
  stat3Label: LocalizedText;
  stat3Value: string;
}