import { HttpErrorResponse } from '@angular/common/http';

type BackendApiError = {
  message?: string;
  code?: string;
  errors?: Record<string, string | string[]>;
};

function normalizeMessage(value: unknown): string {
  return typeof value === 'string' ? value.trim() : '';
}

function extractValidationMessages(errorBody: BackendApiError): string[] {
  if (!errorBody.errors || typeof errorBody.errors !== 'object') {
    return [];
  }

  return Object.entries(errorBody.errors)
    .flatMap(([field, value]) => {
      if (Array.isArray(value)) {
        return value
          .map((item) => normalizeMessage(item))
          .filter(Boolean)
          .map((message) => `${field} : ${message}`);
      }

      const message = normalizeMessage(value);
      return message ? [`${field} : ${message}`] : [];
    })
    .filter(Boolean);
}

export function extractApiErrorMessage(
  error: unknown,
  fallbackMessage = 'Une erreur inattendue est survenue.'
): string {
  if (!(error instanceof HttpErrorResponse)) {
    return fallbackMessage;
  }

  if (typeof error.error === 'string' && error.error.trim()) {
    return error.error.trim();
  }

  const errorBody =
    error.error && typeof error.error === 'object'
      ? (error.error as BackendApiError)
      : null;

  if (errorBody) {
    const directMessage = normalizeMessage(errorBody.message);
    if (directMessage) {
      return directMessage;
    }

    const validationMessages = extractValidationMessages(errorBody);
    if (validationMessages.length > 0) {
      return validationMessages.join(' • ');
    }
  }

  if (error.status === 0) {
    return 'Impossible de joindre le serveur. Vérifie que le backend Spring Boot est bien démarré.';
  }

  if (error.status === 400) {
    return 'La requête est invalide. Vérifie les champs saisis puis réessaie.';
  }

  if (error.status === 401) {
    return 'Votre session a expiré. Veuillez vous reconnecter.';
  }

  if (error.status === 403) {
    return 'Vous n’avez pas les droits nécessaires pour effectuer cette action.';
  }

  if (error.status === 404) {
    return 'La ressource demandée est introuvable.';
  }

  if (error.status === 409) {
    return 'Une ressource avec ces informations existe déjà.';
  }

  if (error.status >= 500) {
    return 'Le serveur a rencontré une erreur. Réessaie dans quelques instants.';
  }

  return fallbackMessage;
}

export function isUnauthorizedError(error: unknown): boolean {
  return error instanceof HttpErrorResponse && error.status === 401;
}

export function isForbiddenError(error: unknown): boolean {
  return error instanceof HttpErrorResponse && error.status === 403;
}

export function isNetworkError(error: unknown): boolean {
  return error instanceof HttpErrorResponse && error.status === 0;
}