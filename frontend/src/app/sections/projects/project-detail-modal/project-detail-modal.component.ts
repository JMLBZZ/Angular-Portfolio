import {
  Component,
  Input,
  Output,
  EventEmitter,
  HostListener,
  OnChanges,
  SimpleChanges,
  OnDestroy
} from '@angular/core';
import { CommonModule } from '@angular/common';
import { TranslateModule } from '@ngx-translate/core';
import { trigger, transition, style, animate } from '@angular/animations';
import { Project, LocalizedText } from '../projects.data';
import { LanguageService } from '../../../core/i18n/language.service';

type Layer = { id: number; src: string };

@Component({
  selector: 'app-project-detail-modal',
  standalone: true,
  imports: [CommonModule, TranslateModule],
  templateUrl: './project-detail-modal.component.html',
  styleUrls: ['./project-detail-modal.component.css'],
  animations: [
    trigger('crossfade', [
      transition(':enter', [
        style({ opacity: 0 }),
        animate('450ms ease-in-out', style({ opacity: 1 })),
      ]),
      transition(':leave', [
        animate('450ms ease-in-out', style({ opacity: 0 })),
      ]),
    ]),
  ],
})
export class ProjectDetailModalComponent implements OnChanges, OnDestroy {

  @Input() open = false;
  @Input() project: Project | null = null;

  @Output() close = new EventEmitter<void>();

  isVisible = false;

  // Carousel
  activeImageIndex = 0;

  // Crossfade layers
  layers: Layer[] = [];
  private layerId = 0;

  private readonly fadeMs = 450;
  private cleanupTimer: any = null;

  // Swipe (Pointer events)
  private pointerDown = false;
  private startX = 0;
  private startY = 0;
  private moved = false;

  // Ajuste à ton goût :
  private readonly swipeThresholdPx = 45;     // distance min horizontale
  private readonly verticalTolerancePx = 35;  // si trop vertical -> on ignore

  constructor(private lang: LanguageService) {}

  get currentLang(): 'fr' | 'en' {
    return this.lang.current;
  }

  loc(text: LocalizedText | undefined): string {
    if (!text) return '';
    return text[this.currentLang] ?? text.fr;
  }

  get images(): string[] {
    const imgs = this.project?.images?.filter(Boolean) ?? [];
    if (imgs.length > 0) return imgs;

    const single = this.project?.image;
    return single ? [single] : [];
  }

  get hasCarousel(): boolean {
    return this.images.length > 1;
  }

  trackLayer = (_: number, layer: Layer) => layer.id;

  private setInitialLayer() {
    this.layers = [];
    this.layerId = 0;
    const first = this.images[0];
    if (first) this.layers = [{ id: ++this.layerId, src: first }];
  }

  private goToInternal(nextIndex: number) {
    const total = this.images.length;
    if (total === 0) return;

    const normalized = ((nextIndex % total) + total) % total;
    if (normalized === this.activeImageIndex) return;

    const nextSrc = this.images[normalized];
    if (!nextSrc) return;

    this.activeImageIndex = normalized;

    // New layer on top -> :enter fade-in
    this.layers = [...this.layers, { id: ++this.layerId, src: nextSrc }];

    // Cleanup after fade
    if (this.cleanupTimer) clearTimeout(this.cleanupTimer);
    this.cleanupTimer = setTimeout(() => {
      this.layers = this.layers.slice(-1);
      this.cleanupTimer = null;
    }, this.fadeMs);
  }

  goTo(index: number) {
    this.goToInternal(index);
  }

  next() {
    this.goToInternal(this.activeImageIndex + 1);
  }

  prev() {
    this.goToInternal(this.activeImageIndex - 1);
  }

  onClose() {
    this.isVisible = false;
    setTimeout(() => this.close.emit(), 200);
  }

  @HostListener('document:keydown.escape')
  handleEscape() {
    if (this.open) this.onClose();
  }

  @HostListener('document:keydown.arrowright')
  handleArrowRight() {
    if (this.open && this.hasCarousel) this.next();
  }

  @HostListener('document:keydown.arrowleft')
  handleArrowLeft() {
    if (this.open && this.hasCarousel) this.prev();
  }

  // ===== Swipe handlers (called from template) =====
  onPointerDown(e: PointerEvent) {
    if (!this.hasCarousel) return;
    this.pointerDown = true;
    this.moved = false;
    this.startX = e.clientX;
    this.startY = e.clientY;
  }

  onPointerMove(e: PointerEvent) {
    if (!this.pointerDown || !this.hasCarousel) return;
    const dx = e.clientX - this.startX;
    const dy = e.clientY - this.startY;

    // on considère qu'il a "bougé" si on dépasse un mini seuil
    if (Math.abs(dx) > 4 || Math.abs(dy) > 4) this.moved = true;

    // Important : on ne bloque pas le scroll vertical (modal scroll),
    // donc on n'appelle PAS preventDefault ici.
  }

  onPointerUp(e: PointerEvent) {
    if (!this.pointerDown || !this.hasCarousel) return;

    const dx = e.clientX - this.startX;
    const dy = e.clientY - this.startY;

    this.pointerDown = false;

    // Si c'était surtout vertical -> ignore (l'utilisateur scroll)
    if (Math.abs(dy) > this.verticalTolerancePx && Math.abs(dy) > Math.abs(dx)) return;

    // Si pas assez horizontal -> ignore
    if (Math.abs(dx) < this.swipeThresholdPx) return;

    // Swipe gauche (dx négatif) => next
    if (dx < 0) this.next();
    else this.prev();
  }

  onPointerCancel() {
    this.pointerDown = false;
  }

  ngOnChanges(changes: SimpleChanges): void {
    if (changes['open']) {
      if (this.open) {
        document.body.style.overflow = 'hidden';

        this.activeImageIndex = 0;
        this.setInitialLayer();

        setTimeout(() => (this.isVisible = true), 10);
      } else {
        document.body.style.overflow = '';
      }
    }

    if (changes['project'] && this.open) {
      this.activeImageIndex = 0;
      this.setInitialLayer();
    }
  }

  ngOnDestroy(): void {
    document.body.style.overflow = '';
    if (this.cleanupTimer) clearTimeout(this.cleanupTimer);
  }
}