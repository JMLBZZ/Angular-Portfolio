import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable, map } from 'rxjs';

import { API_BASE_URL } from './api.config';

export interface TranslationRequest {
  fields: Record<string, string>;
}

export interface TranslationResponse {
  fields: Record<string, string>;
}

@Injectable({ providedIn: 'root' })
export class TranslationApiService {
  private readonly baseUrl = API_BASE_URL;

  constructor(private http: HttpClient) {}

  translateFrToEn(fields: Record<string, string>): Observable<Record<string, string>> {
    return this.http
      .post<TranslationResponse>(`${this.baseUrl}/api/admin/translations/fr-to-en`, {
        fields,
      } satisfies TranslationRequest)
      .pipe(map((response) => response.fields ?? {}));
  }
}