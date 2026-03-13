import { Injectable } from '@angular/core';
import { AuthResponse, StoredAuthSession } from './auth.models';

@Injectable({ providedIn: 'root' })
export class AuthStorageService {
  private readonly storageKey = 'portfolio_admin_auth';

  saveSession(response: AuthResponse): void {
    const session: StoredAuthSession = {
      accessToken: response.accessToken,
      tokenType: response.tokenType,
      expiresIn: response.expiresIn,
      expiresAt: Date.now() + response.expiresIn,
      email: response.email,
    };

    localStorage.setItem(this.storageKey, JSON.stringify(session));
  }

  getSession(): StoredAuthSession | null {
    const raw = localStorage.getItem(this.storageKey);
    if (!raw) return null;

    try {
      const session = JSON.parse(raw) as StoredAuthSession;

      if (!session.accessToken || !session.expiresAt) {
        this.clearSession();
        return null;
      }

      if (Date.now() >= session.expiresAt) {
        this.clearSession();
        return null;
      }

      return session;
    } catch {
      this.clearSession();
      return null;
    }
  }

  getAccessToken(): string | null {
    return this.getSession()?.accessToken ?? null;
  }

  getUserEmail(): string | null {
    return this.getSession()?.email ?? null;
  }

  isAuthenticated(): boolean {
    return !!this.getSession();
  }

  clearSession(): void {
    localStorage.removeItem(this.storageKey);
  }
}