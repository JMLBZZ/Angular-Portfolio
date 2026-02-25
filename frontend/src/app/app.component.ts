import { Component, OnInit } from '@angular/core';
import { RouterOutlet } from '@angular/router';
import { UpperCasePipe } from '@angular/common';
import { TranslateModule } from '@ngx-translate/core';

import { ThemeService } from './core/theme/theme.service';
import { LanguageService } from './core/i18n/language.service';
import { HeaderComponent } from './layout/header/header.component';
import { HeroComponent } from './sections/hero/hero.component';
import { ProjectsSectionComponent } from './sections/projects/projects-section.component';

@Component({
  selector: 'app-root',
  standalone: true,
  imports: [
    RouterOutlet, 
    TranslateModule, 
    UpperCasePipe, 
    HeaderComponent, 
    HeroComponent, 
    ProjectsSectionComponent
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
}