import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterLink } from '@angular/router';
import {
  ActivityIcon,
  EyeIcon,
  FileTextIcon,
  FolderKanbanIcon,
  GaugeIcon,
  GlobeIcon,
  LayoutDashboardIcon,
  MailIcon,
  PaletteIcon,
  PlusIcon,
  ScaleIcon,
  SparklesIcon,
  StarIcon,
  UserRoundIcon,
  LucideAngularModule,
} from 'lucide-angular';

import { AdminProjectsApiService } from '../../core/api/admin-projects-api.service';
import { AdminProject } from '../../core/auth/auth.models';
import { extractApiErrorMessage } from '../../core/api/api-error.utils';
import { ToastService } from '../../shared/services/toast.service';

type DashboardShortcut = {
  title: string;
  description: string;
  path: string;
  label: string;
  icon: any;
};

@Component({
  selector: 'app-admin-dashboard',
  standalone: true,
  imports: [
    CommonModule,
    RouterLink,
    LucideAngularModule,
  ],
  templateUrl: './admin-dashboard.component.html',
})
export class AdminDashboardComponent implements OnInit {
  readonly LayoutDashboardIcon = LayoutDashboardIcon;
  readonly FolderKanbanIcon = FolderKanbanIcon;
  readonly EyeIcon = EyeIcon;
  readonly FileTextIcon = FileTextIcon;
  readonly StarIcon = StarIcon;
  readonly GaugeIcon = GaugeIcon;
  readonly ActivityIcon = ActivityIcon;
  readonly PlusIcon = PlusIcon;
  readonly GlobeIcon = GlobeIcon;

  projects: AdminProject[] = [];
  isLoading = true;
  errorMessage = '';

  readonly shortcuts: DashboardShortcut[] = [
    {
      title: 'Gérer les projets',
      description: 'Créer, modifier, dupliquer, supprimer et réorganiser les projets.',
      path: '/admin/projects',
      label: 'Ouvrir les projets',
      icon: FolderKanbanIcon,
    },
    {
      title: 'Modifier le hero',
      description: 'Mettre à jour la première section visible sur le portfolio.',
      path: '/admin/hero',
      label: 'Modifier le hero',
      icon: SparklesIcon,
    },
    {
      title: 'Modifier le contenu About',
      description: 'Gérer la présentation, les textes et les informations personnelles.',
      path: '/admin/about',
      label: 'Modifier About',
      icon: UserRoundIcon,
    },
    {
      title: 'Gérer le CV',
      description: 'Mettre à jour le CV dynamique et la prévisualisation PDF.',
      path: '/admin/resume',
      label: 'Gérer le CV',
      icon: FileTextIcon,
    },
    {
      title: 'Paramètres contact',
      description: 'Gérer les informations de contact affichées sur le site.',
      path: '/admin/contact',
      label: 'Modifier Contact',
      icon: MailIcon,
    },
    {
      title: 'Mentions légales',
      description: 'Mettre à jour les contenus légaux et la confidentialité.',
      path: '/admin/legal',
      label: 'Gérer le légal',
      icon: ScaleIcon,
    },
    {
      title: 'Messages',
      description: 'Préparer la future gestion des messages reçus depuis le formulaire.',
      path: '/admin/messages',
      label: 'Voir les messages',
      icon: MailIcon,
    },
    {
      title: 'Apparence',
      description: 'Centraliser les réglages visuels et la cohérence de l’admin.',
      path: '/admin/appearance',
      label: 'Gérer l’apparence',
      icon: PaletteIcon,
    },
  ];

  constructor(
    private adminProjectsApi: AdminProjectsApiService,
    private toastService: ToastService
  ) {}

  ngOnInit(): void {
    this.loadDashboardData();
  }

  loadDashboardData(): void {
    this.isLoading = true;
    this.errorMessage = '';

    this.adminProjectsApi.getAll().subscribe({
      next: (response) => {
        this.projects = response.data;
        this.isLoading = false;
      },
      error: (error) => {
        this.projects = [];
        this.errorMessage = extractApiErrorMessage(
          error,
          'Impossible de charger les données du dashboard.'
        );
        this.toastService.error(this.errorMessage);
        this.isLoading = false;
      },
    });
  }

  get totalProjects(): number {
    return this.projects.length;
  }

  get publishedCount(): number {
    return this.projects.filter((project) => project.published).length;
  }

  get draftCount(): number {
    return this.projects.filter((project) => !project.published).length;
  }

  get featuredCount(): number {
    return this.projects.filter((project) => project.featured).length;
  }

  get recentProjects(): AdminProject[] {
    return [...this.projects]
      .sort((a, b) => {
        const dateA = a.createdAt ? new Date(a.createdAt).getTime() : 0;
        const dateB = b.createdAt ? new Date(b.createdAt).getTime() : 0;

        if (dateA !== dateB) {
          return dateB - dateA;
        }

        return (b.displayOrder ?? 0) - (a.displayOrder ?? 0);
      })
      .slice(0, 4);
  }

  get portfolioStatusLabel(): string {
    if (this.totalProjects === 0) {
      return 'À compléter';
    }

    if (this.publishedCount === 0) {
      return 'Aucun projet publié';
    }

    if (this.draftCount > 0) {
      return 'En cours de mise à jour';
    }

    return 'Portfolio à jour';
  }

  get publicationRate(): number {
    if (this.totalProjects === 0) {
      return 0;
    }

    return Math.round((this.publishedCount / this.totalProjects) * 100);
  }
}