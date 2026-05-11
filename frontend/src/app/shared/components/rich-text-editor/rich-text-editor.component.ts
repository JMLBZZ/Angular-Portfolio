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
    this.syncVisualEditor();
  }

  writeValue(value: string | null): void {
    this.value = value ?? '';
    this.htmlValue = this.value;

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
    this.isHtmlMode = !this.isHtmlMode;

    if (!this.isHtmlMode) {
      setTimeout(() => this.syncVisualEditor(), 0);
    }
  }

  handleInput(): void {
    if (!this.editorRef?.nativeElement) {
      return;
    }

    const html = this.editorRef.nativeElement.innerHTML;

    this.value = html;
    this.htmlValue = html;

    this.onChange(html);
  }

  handleHtmlInput(value: string): void {
    this.htmlValue = value;
    this.value = value;

    this.onChange(value);
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

    const html =
      event.clipboardData?.getData('text/html') ||
      event.clipboardData?.getData('text/plain') ||
      '';

    document.execCommand('insertHTML', false, html);

    this.secureLinks();

    this.handleInput();
  }

  private syncVisualEditor(): void {
    if (!this.viewInitialized || !this.editorRef?.nativeElement || this.isHtmlMode) {
      return;
    }

    this.editorRef.nativeElement.innerHTML = this.value;
  }

  private focusEditor(): void {
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
}