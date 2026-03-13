/**
 * Dev: appelle le backend en dur sur localhost:8080
 * Prod: on peut basculer sur un reverse-proxy et mettre '' si même domaine
 */
export const API_BASE_URL =
  window.location.hostname === 'localhost' ? 'http://localhost:8080' : '';