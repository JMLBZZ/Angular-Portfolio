import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { TranslateModule } from '@ngx-translate/core';
import { PrimaryButtonComponent } from '../../shared/components/primary-button/primary-button.component';
import { SecondaryButtonComponent } from '../../shared/components/secondary-button/secondary-button.component';

@Component({
  selector: 'app-hero',
  standalone: true,
  imports: [
    CommonModule, 
    TranslateModule, 
    PrimaryButtonComponent, 
    SecondaryButtonComponent,
  ],
  templateUrl: './hero.component.html',
})
export class HeroComponent {
  cvUrl: string = '/assets/cv/CV-DSR_02P_JAMEL_BOUAZZA.pdf';
  
  /** Scroll smooth vers une section */
  scrollTo(id: 'projects' | 'contact'): void {
    const el = document.getElementById(id);
    if (!el) return;

    const offset = 90; // hauteur du header sticky
    const y = el.getBoundingClientRect().top + window.scrollY - offset;

    window.scrollTo({ top: y, behavior: 'smooth' });
  }
}