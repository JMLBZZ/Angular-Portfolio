import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';

import { API_BASE_URL } from './api.config';
import { ResumeContent } from '../../shared/models/resume.model';

@Injectable({ providedIn: 'root' })
export class ResumeContentApiService {
  private readonly baseUrl = API_BASE_URL;

  constructor(private http: HttpClient) {}

  get(): Observable<ResumeContent> {
    return this.http.get<ResumeContent>(`${this.baseUrl}/api/public/resume`);
  }
}