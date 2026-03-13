import { Project } from '../../shared/models/project.model';

export interface AuthResponse {
  accessToken: string;
  tokenType: string;
  expiresIn: number;
  email: string;
}

export interface LoginPayload {
  email: string;
  password: string;
}

export interface StoredAuthSession {
  accessToken: string;
  tokenType: string;
  expiresIn: number;
  expiresAt: number;
  email: string;
}

export interface AdminApiResult<T> {
  success: boolean;
  data: T;
  meta?: {
    page: number;
    size: number;
    totalElements: number;
    totalPages: number;
  };
}

export type AdminProject = Project;

export interface AdminProjectPayload {
  slug: string;
  title: string;
  category: string;

  image?: string;
  cover?: string;
  images?: string[];

  description: {
    fr: string;
    en: string;
  };

  longDescription?: {
    fr: string;
    en: string;
  } | null;

  stack: string[];
  type: string;
  featured?: boolean;

  role?: {
    fr: string;
    en: string;
  } | null;

  problem?: {
    fr: string;
    en: string;
  } | null;

  solution?: {
    fr: string;
    en: string;
  } | null;

  demoUrl?: string;
  tags: string[];

  githubUrl?: string;
  showGithub?: boolean;

  published?: boolean;
  displayOrder?: number;
}