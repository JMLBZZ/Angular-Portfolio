import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable, tap } from 'rxjs';

import { API_BASE_URL } from '../api/api.config';
import { AuthResponse, LoginPayload } from './auth.models';
import { AuthStorageService } from './auth-storage.service';

@Injectable({ providedIn: 'root' })
export class AuthService {
  private readonly baseUrl = API_BASE_URL;

  constructor(
    private http: HttpClient,
    private authStorage: AuthStorageService
  ) {}

  login(payload: LoginPayload): Observable<AuthResponse> {
    return this.http
      .post<AuthResponse>(`${this.baseUrl}/api/auth/login`, payload)
      .pipe(
        tap((response) => this.authStorage.saveSession(response))
      );
  }

  logout(): void {
    this.authStorage.clearSession();
  }

  isAuthenticated(): boolean {
    return this.authStorage.isAuthenticated();
  }

  getUserEmail(): string | null {
    return this.authStorage.getUserEmail();
  }
}