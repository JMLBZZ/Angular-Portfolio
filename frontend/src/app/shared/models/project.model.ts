export type ProjectCategory =
  | 'front'
  | 'back'
  | 'fullstack'
  | 'uiux'
  | 'pao'
  | 'other';

export type ProjectType = 'professional' | 'personal' | 'school';

export type LocalizedText = {
  fr: string;
  en: string;
};

export interface Project {
  id: string; // UUID backend
  slug: string;
  title: string;
  category: ProjectCategory;

  image?: string;
  images?: string[];
  cover?: string;

  description: LocalizedText;
  longDescription?: LocalizedText;

  stack: string[];

  type: ProjectType;
  featured?: boolean;

  role?: LocalizedText;
  problem?: LocalizedText;
  solution?: LocalizedText;

  demoUrl?: string;
  tags: string[];

  githubUrl?: string;
  showGithub?: boolean;

  published?: boolean;
  displayOrder?: number;
  createdAt?: string;
}