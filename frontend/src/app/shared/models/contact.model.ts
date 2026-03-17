import { LocalizedText } from './project.model';

export interface Contact {
  title: LocalizedText;
  subtitle: LocalizedText;
  email: string;
  phone: string;
  location: string;
  linkedinUrl: string;
  githubUrl: string;
}