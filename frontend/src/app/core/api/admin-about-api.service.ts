import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable, map } from 'rxjs';

import { API_BASE_URL } from './api.config';
import { AboutContent } from '../../shared/models/about.model';

interface UploadedAboutProfileImageResponse {
  url: string;
}

@Injectable({ providedIn: 'root' })
export class AdminAboutApiService {
  private readonly baseUrl = API_BASE_URL;

  constructor(private http: HttpClient) {}

  get(): Observable<AboutContent> {
    return this.http.get<AboutContent>(`${this.baseUrl}/api/admin/about`);
  }

  update(payload: AboutContent): Observable<AboutContent> {
    return this.http.put<AboutContent>(`${this.baseUrl}/api/admin/about`, payload);
  }

  uploadProfileImage(file: File): Observable<string> {
    const formData = new FormData();
    formData.append('file', file);

    return this.http
      .post<UploadedAboutProfileImageResponse>(
        `${this.baseUrl}/api/admin/about/profile-image`,
        formData
      )
      .pipe(map((response) => response.url));
  }
}