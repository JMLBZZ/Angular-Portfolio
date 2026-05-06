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
    return optimizeCloudinaryImageUrl(value);
  }

  if (value.startsWith('/')) {
    return API_BASE_URL ? `${API_BASE_URL}${value}` : value;
  }

  return value;
}

function optimizeCloudinaryImageUrl(url: string): string {
  if (!url.includes('res.cloudinary.com') || !url.includes('/image/upload/')) {
    return url;
  }

  if (url.includes('/image/upload/f_auto,q_auto/')) {
    return url;
  }

  return url.replace('/image/upload/', '/image/upload/f_auto,q_auto/');
}