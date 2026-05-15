import { CommonModule } from '@angular/common';
import { Component } from '@angular/core';

type AppearanceOption = {
  title: string;
  description: string;
  status: 'active' | 'planned';
};

@Component({
  selector: 'app-admin-appearance',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './admin-appearance.component.html',
})
export class AdminAppearanceComponent {
  readonly options: AppearanceOption[] = [
    {
      title: 'Identité visuelle',
      description: 'Conserver les couleurs, les arrondis, les cartes et le style actuel du portfolio.',
      status: 'active',
    },
    {
      title: 'Interface admin',
      description: 'Uniformiser les layouts, boutons, espacements, formulaires et états visuels.',
      status: 'active',
    },
    {
      title: 'Thème clair / sombre',
      description: 'Préparer une future configuration plus avancée du thème.',
      status: 'planned',
    },
    {
      title: 'Couleurs personnalisables',
      description: 'Prévoir plus tard des couleurs modifiables depuis le backoffice.',
      status: 'planned',
    },
  ];

  get activeOptionsCount(): number {
    return this.options.filter((option) => option.status === 'active').length;
  }

  get plannedOptionsCount(): number {
    return this.options.filter((option) => option.status === 'planned').length;
  }

  getStatusLabel(status: AppearanceOption['status']): string {
    return status === 'active' ? 'Actif' : 'Prévu';
  }
}