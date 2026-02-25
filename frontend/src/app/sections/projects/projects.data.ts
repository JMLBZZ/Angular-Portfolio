export type ProjectCategory =
  | 'front'
  | 'back'
  | 'fullstack'
  | 'uiux'
  | 'pao'
  | 'other';

export interface Project {
  id: number;
  title: string;
  description: string;
  category: ProjectCategory;
  tags: string[];
}

export const PROJECTS: Project[] = [
  {
    id: 1,
    title: 'Portfolio Angular',
    description: 'Portfolio fullstack avec Angular et Spring Boot.',
    category: 'fullstack',
    tags: ['Angular', 'Spring Boot', 'JWT']
  },
  {
    id: 2,
    title: 'Landing Page Moderne',
    description: 'Landing page responsive avec animations.',
    category: 'front',
    tags: ['Angular', 'Tailwind']
  },
  {
    id: 3,
    title: 'API Sécurisée',
    description: 'API REST sécurisée avec JWT et RBAC.',
    category: 'back',
    tags: ['Spring Boot', 'PostgreSQL']
  },
  {
    id: 4,
    title: 'Identité Visuelle',
    description: 'Création logo et supports print.',
    category: 'pao',
    tags: ['Illustrator', 'Photoshop']
  }
];