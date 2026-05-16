import { CommonModule } from '@angular/common';
import { Component } from '@angular/core';
import {
  BrushIcon,
  CheckCircle2Icon,
  EyeIcon,
  LayoutDashboardIcon,
  PaletteIcon,
  Settings2Icon,
  SparklesIcon,
  SunMoonIcon,
  WandSparklesIcon,
  LucideAngularModule,
} from 'lucide-angular';

type AppearanceOption = {
  title: string;
  description: string;
  status: 'active' | 'planned';
  icon: any;
};

@Component({
  selector: 'app-admin-appearance',
  standalone: true,
  imports: [
    CommonModule,
    LucideAngularModule,
  ],
  templateUrl: './admin-appearance.component.html',
})
export class AdminAppearanceComponent {
  readonly PaletteIcon = PaletteIcon;
  readonly CheckCircle2Icon = CheckCircle2Icon;
  readonly EyeIcon = EyeIcon;
  readonly LayoutDashboardIcon = LayoutDashboardIcon;
  readonly SparklesIcon = SparklesIcon;
  readonly Settings2Icon = Settings2Icon;
  readonly WandSparklesIcon = WandSparklesIcon;

  readonly options: AppearanceOption[] = [
    {
      title: 'Identité visuelle',
      description: 'Conserver les couleurs, les arrondis, les cartes et le style actuel du portfolio.',
      status: 'active',
      icon: PaletteIcon,
    },
    {
      title: 'Interface admin',
      description: 'Uniformiser les layouts, boutons, espacements, formulaires et états visuels.',
      status: 'active',
      icon: LayoutDashboardIcon,
    },
    {
      title: 'Thème clair / sombre',
      description: 'Préparer une future configuration plus avancée du thème.',
      status: 'planned',
      icon: SunMoonIcon,
    },
    {
      title: 'Couleurs personnalisables',
      description: 'Prévoir plus tard des couleurs modifiables depuis le backoffice.',
      status: 'planned',
      icon: BrushIcon,
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