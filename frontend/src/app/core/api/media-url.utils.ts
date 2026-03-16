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
    return value;
  }

  if (value.startsWith('/')) {
    return API_BASE_URL ? `${API_BASE_URL}${value}` : value;
  }

  return value;
}