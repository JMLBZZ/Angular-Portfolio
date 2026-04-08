import { FormGroup } from '@angular/forms';
import { Subscription } from 'rxjs';

import { ToastService } from '../services/toast.service';

type InvalidFormOptions = {
  form: FormGroup;
  container: HTMLElement;
  toastService?: ToastService;
  message?: string;
  scopeSelector?: string;
};

export function setupAdminFormErrorCleanup(
  form: FormGroup,
  clearError: () => void
): Subscription {
  return form.valueChanges.subscribe(() => {
    clearError();
  });
}

export function handleInvalidAdminForm({
  form,
  container,
  toastService,
  message = 'Veuillez corriger les champs du formulaire.',
  scopeSelector,
}: InvalidFormOptions): void {
  form.markAllAsTouched();

  toastService?.warning(message);
  focusFirstInvalidControl(container, scopeSelector);
}

export function focusFirstInvalidControl(
  container: HTMLElement,
  scopeSelector?: string
): void {
  setTimeout(() => {
    const scope = scopeSelector
      ? (container.querySelector(scopeSelector) as HTMLElement | null)
      : container;

    const searchRoot = scope ?? container;

    const firstInvalidField = searchRoot.querySelector(
      'input.ng-invalid, textarea.ng-invalid, select.ng-invalid'
    ) as HTMLElement | null;

    if (!firstInvalidField) {
      return;
    }

    firstInvalidField.scrollIntoView({
      behavior: 'smooth',
      block: 'center',
    });

    firstInvalidField.focus();
  });
}

export function scrollToSelector(
  container: HTMLElement,
  selector: string
): void {
  setTimeout(() => {
    const element = container.querySelector(selector) as HTMLElement | null;

    if (!element) {
      return;
    }

    element.scrollIntoView({
      behavior: 'smooth',
      block: 'center',
    });

    element.focus();
  });
}