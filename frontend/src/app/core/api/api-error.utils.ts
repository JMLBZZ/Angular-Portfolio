import { HttpErrorResponse } from '@angular/common/http';

type ApiResultErrorPayload = {
  success?: boolean;
  error?: {
    message?: string;
    code?: string;
    details?: Record<string, string>;
  };
  message?: string;
  code?: string;
  details?: Record<string, string>;
};

function getErrorPayload(error: HttpErrorResponse): ApiResultErrorPayload | null {
  if (!error.error || typeof error.error !== 'object') {
    return null;
  }

  return error.error as ApiResultErrorPayload;
}

function getErrorMessageFromPayload(payload: ApiResultErrorPayload | null): string {
  if (!payload) {
    return '';
  }

  if (typeof payload.error?.message === 'string' && payload.error.message.trim()) {
    return payload.error.message.trim();
  }

  if (typeof payload.message === 'string' && payload.message.trim()) {
    return payload.message.trim();
  }

  return '';
}

function getErrorCodeFromPayload(payload: ApiResultErrorPayload | null): string {
  if (!payload) {
    return '';
  }

  if (typeof payload.error?.code === 'string' && payload.error.code.trim()) {
    return payload.error.code.trim();
  }

  if (typeof payload.code === 'string' && payload.code.trim()) {
    return payload.code.trim();
  }

  return '';
}

function getErrorDetailsFromPayload(
  payload: ApiResultErrorPayload | null
): Record<string, string> | null {
  if (!payload) {
    return null;
  }

  if (payload.error?.details && typeof payload.error.details === 'object') {
    return payload.error.details;
  }

  if (payload.details && typeof payload.details === 'object') {
    return payload.details;
  }

  return null;
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

  const payload = getErrorPayload(error);
  const payloadMessage = getErrorMessageFromPayload(payload);

  if (payloadMessage) {
    return payloadMessage;
  }

  switch (error.status) {
    case 0:
      return 'Impossible de joindre le serveur. Vérifie que le backend Spring Boot est bien démarré.';
    case 400:
      return 'La requête envoyée est invalide.';
    case 401:
      return 'Votre session a expiré. Veuillez vous reconnecter.';
    case 403:
      return 'Vous n’avez pas les droits nécessaires.';
    case 404:
      return 'La ressource demandée est introuvable.';
    case 409:
      return 'Une ressource avec ces informations existe déjà.';
    case 500:
      return 'Une erreur serveur est survenue.';
    default:
      return fallbackMessage;
  }
}

export function hasApiErrorCode(error: unknown, expectedCode: string): boolean {
  if (!(error instanceof HttpErrorResponse)) {
    return false;
  }

  const payload = getErrorPayload(error);
  const code = getErrorCodeFromPayload(payload);

  return code === expectedCode;
}

export function getApiFieldError(
  error: unknown,
  fieldName: string
): string | null {
  if (!(error instanceof HttpErrorResponse)) {
    return null;
  }

  const payload = getErrorPayload(error);
  const details = getErrorDetailsFromPayload(payload);

  if (!details) {
    return null;
  }

  const fieldError = details[fieldName];
  return typeof fieldError === 'string' && fieldError.trim()
    ? fieldError.trim()
    : null;
}