import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
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
  private readonly baseUrl =
    window.location.hostname === 'localhost' ? 'http://localhost:8080' : '';

  constructor(private http: HttpClient) {}

  send(payload: ContactPayload): Observable<ApiResult<string>> {
    return this.http.post<ApiResult<string>>(`${this.baseUrl}/api/contact`, payload);
  }
}