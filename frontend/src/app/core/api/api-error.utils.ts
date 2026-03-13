import { HttpErrorResponse } from '@angular/common/http';

export function extractApiErrorMessage(
  error: unknown,
  fallbackMessage = 'Une erreur inattendue est survenue.'
): string {
  if (!(error instanceof HttpErrorResponse)) {
    return fallbackMessage;
  }

  if (typeof error.error === 'string' && error.error.trim()) {
    return error.error;
  }

  if (
    error.error &&
    typeof error.error === 'object' &&
    typeof error.error.message === 'string' &&
    error.error.message.trim()
  ) {
    return error.error.message;
  }

  switch (error.status) {
    case 0:
      return 'Impossible de joindre le serveur backend.';
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