import {
  Component,
  Input,
  Output,
  EventEmitter,
  HostListener,
  OnChanges,
  SimpleChanges,
  OnDestroy,
  ElementRef,
  ViewChild,
  AfterViewInit
} from '@angular/core';
import { CommonModule } from '@angular/common';
import { TranslateModule } from '@ngx-translate/core';
import { Project, LocalizedText } from '../projects.data';
import { LanguageService } from '../../../core/i18n/language.service';

@Component({
  selector: 'app-project-detail-modal',
  standalone: true,
  imports: [CommonModule, TranslateModule],
  templateUrl: './project-detail-modal.component.html',
  styleUrls: ['./project-detail-modal.component.css'],
})
export class ProjectDetailModalComponent implements OnChanges, OnDestroy, AfterViewInit {

  @Input() open = false;
  @Input() project: Project | null = null;

  @Output() close = new EventEmitter<void>();

  isVisible = false;

  // root element du modal (pour focus trap)
  @ViewChild('modalRoot') modalRoot?: ElementRef<HTMLElement>;

  private focusableSelector =
    'a[href], button:not([disabled]), textarea, input, select, [tabindex]:not([tabindex="-1"])';

  constructor(private lang: LanguageService, private host: ElementRef<HTMLElement>) {}

  get currentLang(): 'fr' | 'en' {
    return this.lang.current;
  }

  loc(text: LocalizedText | undefined): string {
    if (!text) return '';
    return text[this.currentLang] ?? text.fr;
  }

  onClose() {
    this.isVisible = false;

    setTimeout(() => {
      this.close.emit();
    }, 200);
  }

  @HostListener('document:keydown.escape')
  handleEscape() {
    if (this.open) this.onClose();
  }

  @HostListener('document:keydown.tab', ['$event'])
  handleTab(event: KeyboardEvent) {
    if (!this.open) return;

    const root = this.host.nativeElement;
    const focusables = Array.from(root.querySelectorAll<HTMLElement>(this.focusableSelector))
      .filter(el => !el.hasAttribute('disabled') && el.tabIndex !== -1);

    if (focusables.length === 0) return;

    const first = focusables[0];
    const last = focusables[focusables.length - 1];

    if (event.shiftKey && document.activeElement === first) {
      event.preventDefault();
      last.focus();
    } else if (!event.shiftKey && document.activeElement === last) {
      event.preventDefault();
      first.focus();
    }
  }

  ngAfterViewInit(): void {
    // rien ici, focus géré à l'ouverture
  }

  ngOnChanges(changes: SimpleChanges): void {
    if (changes['open']) {
      if (this.open) {
        document.body.style.overflow = 'hidden';

        // inert sur tout le reste de la page
        const appRoot = document.querySelector('app-root') as HTMLElement | null;
        if (appRoot) {
          Array.from(appRoot.children).forEach((el) => {
            if (el.tagName.toLowerCase() !== 'app-project-detail-modal') {
              (el as HTMLElement).setAttribute('inert', '');
            }
          });
        }

        // animation IN
        setTimeout(() => {
          this.isVisible = true;

          // focus sur le premier élément focusable du modal
          const root = this.host.nativeElement;
          const firstFocusable = root.querySelector<HTMLElement>(this.focusableSelector);
          firstFocusable?.focus();
        }, 10);

      } else {
        document.body.style.overflow = '';
        this.removeInert();
      }
    }
  }

  ngOnDestroy(): void {
    document.body.style.overflow = '';
    this.removeInert();
  }

  private removeInert() {
    const appRoot = document.querySelector('app-root') as HTMLElement | null;
    if (!appRoot) return;

    Array.from(appRoot.children).forEach((el) => {
      (el as HTMLElement).removeAttribute('inert');
    });
  }
}