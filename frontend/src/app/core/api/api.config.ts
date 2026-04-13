import { API_RUNTIME_CONFIG } from './api.runtime-config';

/**
 * Dev navigateur : appelle le backend en dur sur localhost:8080
 * Build/prerender serveur : on garde aussi localhost pour pouvoir pré-rendre si le backend tourne localement
 * Prod : on utilise l'URL publique injectée au build via Render
 */
const isBrowser = typeof window !== 'undefined';

const hostname = isBrowser ? window.location.hostname : 'localhost';

const normalizeBaseUrl = (value: string | null | undefined): string =>
  String(value ?? '').trim().replace(/\/+$/, '');

const isLocalHost = hostname === 'localhost' || hostname === '127.0.0.1';

const configuredApiBaseUrl = normalizeBaseUrl(
  API_RUNTIME_CONFIG.publicApiBaseUrl
);

export const API_BASE_URL = isLocalHost
  ? 'http://localhost:8080'
  : configuredApiBaseUrl;