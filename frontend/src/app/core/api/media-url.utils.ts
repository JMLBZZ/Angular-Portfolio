import { API_BASE_URL } from './api.config';

export function resolveMediaUrl(url: string | null | undefined): string | undefined {
  const value = (url ?? '').trim();

  if (!value) {
    return undefined;
  }

  if (
    value.startsWith('http://') ||
    value.startsWith('https://') ||
    value.startsWith('data:') ||
    value.startsWith('blob:')
  ) {
    return optimizeCloudinaryUrl(value);
  }

  if (value.startsWith('/')) {
    return API_BASE_URL ? `${API_BASE_URL}${value}` : value;
  }

  return value;
}

function optimizeCloudinaryUrl(url: string): string {

  // IMAGE → optimisation classique
  if (url.includes('/image/upload/')) {
    if (url.includes('/f_auto,q_auto/')) {
      return url;
    }

    return url.replace('/image/upload/', '/image/upload/f_auto,q_auto/');
  }

  // PDF → transformation en image preview
  if (url.includes('/raw/upload/') && url.endsWith('.pdf')) {

    return url
      .replace('/raw/upload/', '/image/upload/')
      .replace('/upload/', '/upload/pg_1,f_jpg,q_auto,w_600/');
  }

  return url;
}