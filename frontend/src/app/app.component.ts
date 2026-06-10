import { isPlatformBrowser } from '@angular/common';
import { Component, Inject, OnInit, PLATFORM_ID } from '@angular/core';
import { RouterOutlet } from '@angular/router';
import { catchError, EMPTY, take } from 'rxjs';

import { LogoIdentityService } from './core/logo/logo-identity.service';
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
    private logoIdentityService: LogoIdentityService,
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

    this.logoIdentityService.appearance$
      .pipe(
        take(1),
        catchError(() => EMPTY)
      )
      .subscribe((appearance) => {
        this.theme.applyAccentColor(appearance.accentColor);
      });
  }
}