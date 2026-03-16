import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable, map } from 'rxjs';

import { API_BASE_URL } from './api.config';

interface UploadedProjectImageResponse {
  url: string;
}

@Injectable({ providedIn: 'root' })
export class AdminProjectImagesApiService {
  private readonly baseUrl = API_BASE_URL;

  constructor(private http: HttpClient) {}

  upload(file: File): Observable<string> {
    const formData = new FormData();
    formData.append('file', file);

    return this.http
      .post<UploadedProjectImageResponse>(
        `${this.baseUrl}/api/admin/project-images`,
        formData
      )
      .pipe(map((response) => response.url));
  }
}