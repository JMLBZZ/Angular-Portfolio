import { AbstractControl, ValidationErrors, ValidatorFn } from '@angular/forms';

export function slugValidator(): ValidatorFn {
  return (control: AbstractControl): ValidationErrors | null => {
    const value = String(control.value ?? '').trim();

    if (!value) {
      return null;
    }

    const slugPattern = /^[a-z0-9]+(?:-[a-z0-9]+)*$/;

    return slugPattern.test(value)
      ? null
      : {
          slugFormat: true,
        };
  };
}

export function optionalUrlValidator(): ValidatorFn {
  return (control: AbstractControl): ValidationErrors | null => {
    const value = String(control.value ?? '').trim();

    if (!value) {
      return null;
    }

    try {
      const url = new URL(value);
      const isHttp = url.protocol === 'http:' || url.protocol === 'https:';

      return isHttp ? null : { invalidUrl: true };
    } catch {
      return { invalidUrl: true };
    }
  };
}

export function commaSeparatedListValidator(options?: {
  minItems?: number;
  unique?: boolean;
}): ValidatorFn {
  return (control: AbstractControl): ValidationErrors | null => {
    const value = String(control.value ?? '').trim();

    if (!value) {
      if ((options?.minItems ?? 0) > 0) {
        return { minItems: { required: options?.minItems ?? 0, actual: 0 } };
      }

      return null;
    }

    const items = value
      .split(',')
      .map((item) => item.trim())
      .filter(Boolean);

    if ((options?.minItems ?? 0) > items.length) {
      return {
        minItems: {
          required: options?.minItems ?? 0,
          actual: items.length,
        },
      };
    }

    if (options?.unique) {
      const normalized = items.map((item) => item.toLowerCase());
      const uniqueCount = new Set(normalized).size;

      if (uniqueCount !== normalized.length) {
        return { duplicatedItems: true };
      }
    }

    return null;
  };
}

export function commaSeparatedUrlListValidator(): ValidatorFn {
  return (control: AbstractControl): ValidationErrors | null => {
    const value = String(control.value ?? '').trim();

    if (!value) {
      return null;
    }

    const items = value
      .split(',')
      .map((item) => item.trim())
      .filter(Boolean);

    const invalidItem = items.find((item) => {
      try {
        const url = new URL(item);
        return !(url.protocol === 'http:' || url.protocol === 'https:');
      } catch {
        return true;
      }
    });

    return invalidItem
      ? {
          invalidUrlList: true,
        }
      : null;
  };
}