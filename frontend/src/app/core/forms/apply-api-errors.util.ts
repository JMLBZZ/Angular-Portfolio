import { AbstractControl, FormArray, FormGroup } from '@angular/forms';
import { HttpErrorResponse } from '@angular/common/http';

type ApiErrorPayload = {
  error?: {
    details?: Record<string, string>;
  };
  details?: Record<string, string>;
};

function extractDetails(error: HttpErrorResponse): Record<string, string> | null {
  if (!error.error || typeof error.error !== 'object') {
    return null;
  }

  const payload = error.error as ApiErrorPayload;

  if (payload.error?.details) {
    return payload.error.details;
  }

  if (payload.details) {
    return payload.details;
  }

  return null;
}

function normalizeControlPath(path: string): string {
  return path.replace(/\[(\d+)\]/g, '.$1');
}

function clearApiErrors(control: AbstractControl): void {
  if (control instanceof FormGroup) {
    Object.values(control.controls).forEach((child) => clearApiErrors(child));
    return;
  }

  if (control instanceof FormArray) {
    control.controls.forEach((child) => clearApiErrors(child));
    return;
  }

  if (!control.errors?.['apiError']) {
    return;
  }

  const { apiError, ...remainingErrors } = control.errors;
  control.setErrors(Object.keys(remainingErrors).length > 0 ? remainingErrors : null);
}

export function clearApiErrorsFromForm(form: FormGroup): void {
  clearApiErrors(form);
}

export function applyApiErrorsToForm(
  form: FormGroup,
  error: unknown
): void {
  clearApiErrorsFromForm(form);

  if (!(error instanceof HttpErrorResponse)) {
    return;
  }

  const details = extractDetails(error);

  if (!details) {
    return;
  }

  Object.entries(details).forEach(([field, message]) => {
    const control = form.get(normalizeControlPath(field));

    if (!control) {
      return;
    }

    const existingErrors = control.errors ?? {};

    control.setErrors({
      ...existingErrors,
      apiError: message,
    });

    control.markAsTouched();
  });
}