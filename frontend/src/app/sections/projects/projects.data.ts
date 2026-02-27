export type ProjectCategory =
  | 'front'
  | 'back'
  | 'fullstack'
  | 'uiux'
  | 'pao'
  | 'other';

export type ProjectType = 'professional' | 'personal' | 'school';

export type LocalizedText = { fr: string; en: string };

export interface Project {
  id: number;
  title: string;
  category: ProjectCategory;

  image?: string;
  images?: string[];

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
  cover?: string;
  githubUrl?: string;
  showGithub?: boolean;
}

export const PROJECTS: Project[] = [
  {
    id: 1,
    title: 'Portfolio Angular',
    category: 'fullstack',
    image: '/assets/projects/placeholder.jpg',
    images: ['/assets/projects/placeholder.jpg','/assets/projects/placeholder2.jpg'],
    cover: '/assets/projects/placeholder.jpg',
    tags: ['Angular', 'Tailwind', 'Spring Boot', 'PostgreSQL', 'JWT'],
    description: {
      fr: 'Portfolio fullstack avec Angular + Spring Boot.',
      en: 'Fullstack portfolio with Angular + Spring Boot.'
    },
    longDescription: {
      fr: 'Détails plus longs du projet, objectifs, fonctionnalités, etc.',
      en: 'Longer project details, goals, features, etc.'
    },
    stack: ['Angular', 'Tailwind', 'Spring Boot', 'PostgreSQL'],
    type: 'personal',
    featured: true,
    role: { fr: 'Développeur Full-Stack', en: 'Full-Stack Developer' },
    problem: { fr: 'Problème à résoudre…', en: 'Problem to solve…' },
    solution: { fr: 'Solution apportée…', en: 'Solution delivered…' },
    demoUrl: '#',
    githubUrl: '#',
    showGithub: true,
  },
  {
    id: 2,
    title: 'Landing Page Moderne',
    category: 'front',
    image: '/assets/projects/placeholder.jpg',
    cover: '/assets/projects/placeholder.jpg',
    tags: ['Angular', 'Tailwind', 'Animations'],
    description: {
      fr: 'Landing page responsive avec animations.',
      en: 'Responsive landing page with animations.'
    },
    longDescription: {
      fr: 'Détails plus longs du projet…',
      en: 'Longer project details…'
    },
    stack: ['Angular', 'Tailwind'],
    type: 'personal',
    featured: true,
    role: { fr: 'Intégration / UI', en: 'UI / Integration' },
    //problem: { fr: 'Problème à résoudre…', en: 'Problem to solve…' },
    //solution: { fr: 'Solution apportée…', en: 'Solution delivered…' },
    demoUrl: '#',
    githubUrl: '#',
    showGithub: true,
  },
  {
    id: 3,
    title: 'API Sécurisée',
    category: 'back',
    image: '/assets/projects/placeholder.jpg',
    cover: '/assets/projects/placeholder.jpg',
    tags: ['Spring Boot', 'JWT', 'RBAC', 'PostgreSQL'],
    description: {
      fr: 'API REST sécurisée avec JWT et RBAC.',
      en: 'Secure REST API with JWT and RBAC.'
    },
    longDescription: {
      fr: 'Détails plus longs du projet…',
      en: 'Longer project details…'
    },
    stack: ['Spring Boot', 'Spring Security', 'PostgreSQL', 'JWT'],
    type: 'personal',
    featured: true,
    role: { fr: 'Backend', en: 'Backend' },
    problem: { fr: 'Problème à résoudre…', en: 'Problem to solve…' },
    solution: { fr: 'Solution apportée…', en: 'Solution delivered…' },
    demoUrl: '#',
    githubUrl: '#',
    showGithub: true,
  },
  {
    id: 4,
    title: 'Identité Visuelle',
    category: 'pao',
    image: '/assets/projects/placeholder.jpg',
    cover: '/assets/projects/placeholder.jpg',
    tags: ['Illustrator', 'Photoshop', 'Print'],
    description: {
      fr: 'Création logo et supports print.',
      en: 'Logo design and print assets.'
    },
    longDescription: {
      fr: 'Détails plus longs du projet…',
      en: 'Longer project details…'
    },
    stack: ['Illustrator', 'Photoshop'],
    type: 'personal',
    featured: true,
    role: { fr: 'Design / PAO', en: 'Design / DTP' },
    problem: { fr: 'Problème à résoudre…', en: 'Problem to solve…' },
    solution: { fr: 'Solution apportée…', en: 'Solution delivered…' },
    demoUrl: '#',
    githubUrl: '#',
    showGithub: true,
  }
];