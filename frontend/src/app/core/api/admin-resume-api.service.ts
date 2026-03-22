import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';

import { API_BASE_URL } from './api.config';
import { ResumeContent } from '../../shared/models/resume.model';

@Injectable({ providedIn: 'root' })
export class AdminResumeApiService {
  private readonly baseUrl = API_BASE_URL;

  constructor(private http: HttpClient) {}

  get(): Observable<ResumeContent> {
    return this.http.get<ResumeContent>(`${this.baseUrl}/api/admin/resume`);
  }

  upload(file: File): Observable<ResumeContent> {
    const formData = new FormData();
    formData.append('file', file);

    return this.http.post<ResumeContent>(
      `${this.baseUrl}/api/admin/resume`,
      formData
    );
  }
}