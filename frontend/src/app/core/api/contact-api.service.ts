import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { API_BASE_URL } from './api.config';

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
   * Prod: utilise la même base API centralisée que le reste de l'application
   */
  private readonly baseUrl: string;

  constructor(private http: HttpClient) {
    this.baseUrl = API_BASE_URL;
  }

  send(payload: ContactPayload): Observable<ApiResult<string>> {
    return this.http.post<ApiResult<string>>(`${this.baseUrl}/api/contact`, payload);
  }
}