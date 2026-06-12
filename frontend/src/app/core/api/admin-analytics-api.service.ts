import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';

import { API_BASE_URL } from './api.config';

export interface SiteVisitStats {
  totalVisits: number;
}

@Injectable({ providedIn: 'root' })
export class AdminAnalyticsApiService {
  private readonly baseUrl = API_BASE_URL;

  constructor(private http: HttpClient) {}

  getVisitStats(): Observable<SiteVisitStats> {
    return this.http.get<SiteVisitStats>(
      `${this.baseUrl}/api/admin/analytics/visits`
    );
  }
}