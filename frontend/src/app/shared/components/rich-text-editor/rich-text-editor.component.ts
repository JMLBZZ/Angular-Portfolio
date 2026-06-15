import { CommonModule } from '@angular/common';
import {
  AfterViewInit,
  Component,
  ElementRef,
  forwardRef,
  Input,
  ViewChild,
} from '@angular/core';
import {
  ControlValueAccessor,
  NG_VALUE_ACCESSOR,
  ReactiveFormsModule,
} from '@angular/forms';

@Component({
  selector: 'app-rich-text-editor',
  standalone: true,
  imports: [CommonModule, ReactiveFormsModule],
  templateUrl: './rich-text-editor.component.html',
  providers: [
    {
      provide: NG_VALUE_ACCESSOR,
      useExisting: forwardRef(() => RichTextEditorComponent),
      multi: true,
    },
  ],
})
export class RichTextEditorComponent implements ControlValueAccessor, AfterViewInit {
  @Input() label = '';
  @Input() id = '';
  @Input() placeholder = '';

  @ViewChild('editor') editorRef?: ElementRef<HTMLDivElement>;

  value = '';
  disabled = false;
  isTouched = false;

  isHtmlMode = false;
  htmlValue = '';

  private viewInitialized = false;

  private onChange: (value: string) => void = () => {};
  private onTouched: () => void = () => {};

  ngAfterViewInit(): void {
    this.viewInitialized = true;
    this.prepareVisualEditor();
    this.syncVisualEditor();
  }

  writeValue(value: string | null): void {
    const normalizedValue = this.normalizeRichHtml(value ?? '');

    this.value = normalizedValue;
    this.htmlValue = normalizedValue;

    this.syncVisualEditor();
  }

  registerOnChange(fn: (value: string) => void): void {
    this.onChange = fn;
  }

  registerOnTouched(fn: () => void): void {
    this.onTouched = fn;
  }

  setDisabledState(isDisabled: boolean): void {
    this.disabled = isDisabled;
  }

  toggleHtmlMode(): void {
    if (this.disabled) {
      return;
    }

    if (this.isHtmlMode) {
      const normalizedValue = this.normalizeRichHtml(this.htmlValue);
      const hasChanged = normalizedValue !== this.value;

      this.value = normalizedValue;
      this.htmlValue = normalizedValue;
      this.isHtmlMode = false;

      if (hasChanged) {
        this.onChange(normalizedValue);
      }

      setTimeout(() => {
        this.prepareVisualEditor();
        this.syncVisualEditor();
      }, 0);

      return;
    }

    const normalizedValue = this.normalizeRichHtml(this.value);
    const hasChanged = normalizedValue !== this.value;

    this.value = normalizedValue;
    this.htmlValue = normalizedValue;
    this.isHtmlMode = true;

    if (hasChanged) {
      this.onChange(normalizedValue);
    }
  }

  handleInput(): void {
    if (!this.editorRef?.nativeElement) {
      return;
    }

    const html = this.normalizeRichHtml(this.editorRef.nativeElement.innerHTML);

    this.value = html;
    this.htmlValue = html;

    this.onChange(html);
  }

  handleHtmlInput(value: string): void {
    const normalizedValue = this.normalizeRichHtml(value);

    this.htmlValue = value;
    this.value = normalizedValue;

    this.onChange(normalizedValue);
  }

  handleBlur(): void {
    if (!this.isTouched) {
      this.isTouched = true;
      this.onTouched();
    }
  }

  applyCommand(command: string, value?: string): void {
    if (this.disabled || this.isHtmlMode) {
      return;
    }

    this.focusEditor();

    document.execCommand(command, false, value);

    this.handleInput();
  }

  applyHeading(level: 'h2' | 'h3' | 'p'): void {
    this.applyCommand('formatBlock', level);
  }

  addLink(): void {
    if (this.disabled || this.isHtmlMode) {
      return;
    }

    const url = window.prompt('URL du lien, par exemple https://exemple.com');

    if (!url?.trim()) {
      return;
    }

    const trimmedUrl = url.trim();

    if (
      !trimmedUrl.startsWith('http://') &&
      !trimmedUrl.startsWith('https://') &&
      !trimmedUrl.startsWith('mailto:')
    ) {
      window.alert('Le lien doit commencer par http://, https:// ou mailto:');
      return;
    }

    this.focusEditor();

    document.execCommand('createLink', false, trimmedUrl);

    this.secureLinks();

    this.handleInput();
  }

  clearEditor(): void {
    if (this.disabled) {
      return;
    }

    const confirmed = window.confirm(
      'Voulez-vous vraiment vider entièrement le contenu ?'
    );

    if (!confirmed) {
      return;
    }

    this.value = '';
    this.htmlValue = '';

    if (this.editorRef?.nativeElement) {
      this.editorRef.nativeElement.innerHTML = '';
    }

    this.onChange('');
    this.onTouched();
  }

  handlePaste(event: ClipboardEvent): void {
    if (this.isHtmlMode) {
      return;
    }

    event.preventDefault();

    const pastedHtml = event.clipboardData?.getData('text/html') ?? '';
    const pastedText = event.clipboardData?.getData('text/plain') ?? '';

    const htmlToInsert = pastedHtml
      ? this.normalizeRichHtml(pastedHtml)
      : this.plainTextToHtml(pastedText);

    document.execCommand('insertHTML', false, htmlToInsert);

    this.secureLinks();

    this.handleInput();
  }

  prepareVisualEditor(): void {
    if (this.disabled || this.isHtmlMode || typeof document === 'undefined') {
      return;
    }

    try {
      document.execCommand('defaultParagraphSeparator', false, 'p');
    } catch {
      // Certains navigateurs peuvent ignorer cette commande.
      // La normalisation HTML appliquée ensuite garantit quand même des <p>.
    }
  }

  private syncVisualEditor(): void {
    if (!this.viewInitialized || !this.editorRef?.nativeElement || this.isHtmlMode) {
      return;
    }

    this.prepareVisualEditor();
    this.editorRef.nativeElement.innerHTML = this.value;
  }

  private focusEditor(): void {
    this.prepareVisualEditor();
    this.editorRef?.nativeElement.focus();
  }

  private secureLinks(): void {
    if (!this.editorRef?.nativeElement) {
      return;
    }

    const links = this.editorRef.nativeElement.querySelectorAll('a');

    links.forEach((link) => {
      link.setAttribute('target', '_blank');
      link.setAttribute('rel', 'noopener noreferrer');
    });
  }

  private normalizeRichHtml(html: string): string {
    const rawHtml = String(html ?? '').trim();

    if (!rawHtml) {
      return '';
    }

    if (typeof document === 'undefined') {
      return rawHtml;
    }

    const container = document.createElement('div');
    container.innerHTML = rawHtml;

    this.convertDivsToParagraphs(container);
    this.wrapLooseInlineRootNodes(container);

    return container.innerHTML.trim();
  }

  private convertDivsToParagraphs(container: HTMLElement): void {
    const divs = Array.from(container.querySelectorAll('div'));

    divs.forEach((div) => {
      if (this.hasBlockElementInside(div)) {
        const fragment = document.createDocumentFragment();

        while (div.firstChild) {
          fragment.appendChild(div.firstChild);
        }

        div.replaceWith(fragment);
        return;
      }

      const paragraph = document.createElement('p');

      while (div.firstChild) {
        paragraph.appendChild(div.firstChild);
      }

      div.replaceWith(paragraph);
    });
  }

  private wrapLooseInlineRootNodes(container: HTMLElement): void {
    const nodes = Array.from(container.childNodes);
    let paragraph: HTMLParagraphElement | null = null;

    nodes.forEach((node) => {
      if (this.isIgnorableTextNode(node)) {
        return;
      }

      if (this.isBlockNode(node)) {
        paragraph = null;
        return;
      }

      if (!paragraph) {
        paragraph = document.createElement('p');
        container.insertBefore(paragraph, node);
      }

      paragraph.appendChild(node);
    });
  }

  private hasBlockElementInside(element: HTMLElement): boolean {
    return !!element.querySelector(
      'p,h1,h2,h3,h4,h5,h6,ul,ol,li,blockquote,pre,table'
    );
  }

  private isBlockNode(node: ChildNode): boolean {
    if (node.nodeType !== 1) {
      return false;
    }

    const tagName = (node as HTMLElement).tagName.toLowerCase();

    return [
      'p',
      'h1',
      'h2',
      'h3',
      'h4',
      'h5',
      'h6',
      'ul',
      'ol',
      'li',
      'blockquote',
      'pre',
      'table',
    ].includes(tagName);
  }

  private isIgnorableTextNode(node: ChildNode): boolean {
    return node.nodeType === 3 && !node.textContent?.trim();
  }

  private plainTextToHtml(text: string): string {
    const normalizedText = String(text ?? '').replace(/\r\n/g, '\n').trim();

    if (!normalizedText) {
      return '';
    }

    return normalizedText
      .split(/\n{2,}/)
      .map((paragraph) => paragraph.trim())
      .filter(Boolean)
      .map((paragraph) => {
        const escapedParagraph = this.escapeHtml(paragraph)
          .replace(/\n/g, '<br>');

        return `<p>${escapedParagraph}</p>`;
      })
      .join('');
  }

  private escapeHtml(value: string): string {
    return value
      .replace(/&/g, '&amp;')
      .replace(/</g, '&lt;')
      .replace(/>/g, '&gt;')
      .replace(/"/g, '&quot;')
      .replace(/'/g, '&#039;');
  }
}