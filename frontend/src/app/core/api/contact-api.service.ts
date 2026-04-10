import { Inject, Injectable, PLATFORM_ID } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { isPlatformBrowser } from '@angular/common';
import { Observable } from 'rxjs';

export type ApiResult<T> = {
  success: boolean;
  data: T | null;
  meta: unknown | null;
  error: { message: string; code: string; details?: Record<string, string> } | null;
};

export type ContactPayload = {
  name: string;
  email: string;
  subject: string;
  message: string;
  website?: string; // honeypot
};

@Injectable({ providedIn: 'root' })
export class ContactApiService {
  /**
   * Dev: appelle le backend en dur sur localhost:8080
   * Prod: on peut basculer sur un reverse-proxy et mettre '' si même domaine
   */
  private readonly baseUrl: string;

  constructor(
    private http: HttpClient,
    @Inject(PLATFORM_ID) private platformId: object
  ) {
    const hostname = isPlatformBrowser(this.platformId)
      ? window.location.hostname
      : 'localhost';

    this.baseUrl = hostname === 'localhost' ? 'http://localhost:8080' : '';
  }

  send(payload: ContactPayload): Observable<ApiResult<string>> {
    return this.http.post<ApiResult<string>>(`${this.baseUrl}/api/contact`, payload);
  }
}