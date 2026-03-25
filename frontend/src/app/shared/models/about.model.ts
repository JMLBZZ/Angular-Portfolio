import { LocalizedText } from './project.model';

export type AboutTimelineIcon = 'work' | 'education';

export interface AboutTimelineItem {
  date: LocalizedText;
  company: LocalizedText;
  title: LocalizedText;
  description: LocalizedText;
  icon: AboutTimelineIcon;
}

export interface AboutSkillItem {
  name: string;
  value: number;
}

export interface AboutSkillGroup {
  title: LocalizedText;
  items: AboutSkillItem[];
}

export interface AboutContent {
  title: LocalizedText;
  subtitle: LocalizedText;
  profileName: string;
  profileRole: LocalizedText;
  bio: LocalizedText;
  location: LocalizedText;
  timelineTitle: LocalizedText;
  skillsTitle: LocalizedText;
  softSkillsTitle: LocalizedText;
  timelineItems: AboutTimelineItem[];
  skillGroups: AboutSkillGroup[];
  softSkills: LocalizedText[];
}