/**
 * Dev navigateur : appelle le backend en dur sur localhost:8080
 * Build/prerender serveur : on garde aussi localhost pour pouvoir pré-rendre si le backend tourne localement
 * Prod : on peut basculer sur un reverse-proxy et mettre '' si même domaine
 */
const isBrowser = typeof window !== 'undefined';

const hostname = isBrowser ? window.location.hostname : 'localhost';

export const API_BASE_URL =
  hostname === 'localhost' ? 'http://localhost:8080' : '';