import { isPlatformBrowser } from '@angular/common';
import { Component, Inject, OnInit, PLATFORM_ID } from '@angular/core';
import { RouterOutlet } from '@angular/router';
import { catchError, EMPTY, take } from 'rxjs';

import { AppearanceApiService } from './core/api/appearance-api.service';
import { ThemeService } from './core/theme/theme.service';
import { ToastContainerComponent } from './shared/components/toast-container/toast-container.component';

@Component({
  selector: 'app-root',
  standalone: true,
  imports: [
    RouterOutlet,
    ToastContainerComponent,
  ],
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.css'],
})
export class AppComponent implements OnInit {
  constructor(
    public theme: ThemeService,
    private appearanceApi: AppearanceApiService,
    @Inject(PLATFORM_ID) private platformId: object
  ) {}

  ngOnInit(): void {
    this.theme.apply();
    this.loadPublicAppearance();
  }

  private loadPublicAppearance(): void {
    if (!isPlatformBrowser(this.platformId)) {
      return;
    }

    this.appearanceApi
      .get()
      .pipe(
        take(1),
        catchError(() => EMPTY)
      )
      .subscribe((settings) => {
        this.theme.applyAccentColor(settings.accentColor);
      });
  }
}