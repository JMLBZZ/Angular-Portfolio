import { Component, OnInit } from '@angular/core';
import { RouterOutlet } from '@angular/router';
import { UpperCasePipe } from '@angular/common';
import { TranslateModule } from '@ngx-translate/core';

import { ThemeService } from './core/theme/theme.service';
import { LanguageService } from './core/i18n/language.service';
import { HeaderComponent } from './layout/header/header.component';
import { HeroComponent } from './sections/hero/hero.component';
import { ProjectsSectionComponent } from './sections/projects/projects-section.component';
import { Project } from './sections/projects/projects.data';
import { ProjectDetailModalComponent } from './sections/projects/project-detail-modal/project-detail-modal.component';
import { AboutSectionComponent } from './sections/about/about-section.component';

@Component({
  selector: 'app-root',
  standalone: true,
  imports: [
    RouterOutlet, 
    TranslateModule, 
    UpperCasePipe, 
    HeaderComponent, 
    HeroComponent, 
    ProjectsSectionComponent,
    ProjectDetailModalComponent,
    AboutSectionComponent
  ],
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.css'],
})
export class AppComponent implements OnInit {
  title = 'Portfolio JMLBZZ';

  constructor(public theme: ThemeService, public lang: LanguageService) {}

  ngOnInit(): void {
    this.theme.apply();
  }

  selectedProject: Project | null = null;
  isProjectModalOpen = false;

  openProject(project: Project) {
    this.selectedProject = project;
    this.isProjectModalOpen = true;
  }

  closeProjectModal() {
    this.isProjectModalOpen = false;
    setTimeout(() => this.selectedProject = null, 200);
  }
}