import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';

import { API_BASE_URL } from './api.config';

export type SiteVisitStatsResponse = {
  totalVisits: number;
};

@Injectable({ providedIn: 'root' })
export class AdminAnalyticsApiService {
  private readonly baseUrl = API_BASE_URL;

  constructor(private http: HttpClient) {}

  getVisitStats(): Observable<SiteVisitStatsResponse> {
    return this.http.get<SiteVisitStatsResponse>(
      `${this.baseUrl}/api/admin/analytics/visits`
    );
  }

  resetVisitStats(): Observable<SiteVisitStatsResponse> {
    return this.http.post<SiteVisitStatsResponse>(
      `${this.baseUrl}/api/admin/analytics/visits/reset`,
      {}
    );
  }
}