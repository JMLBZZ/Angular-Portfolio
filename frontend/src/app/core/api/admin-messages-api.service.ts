import { HttpClient, HttpParams } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';

import { AdminApiResult } from '../auth/auth.models';
import { API_BASE_URL } from './api.config';
import {
  ContactMessage,
  ContactMessageStats,
  ContactMessageStatus,
} from '../../shared/models/contact-message.model';

export type ContactMessageFilter = ContactMessageStatus | 'all';

@Injectable({ providedIn: 'root' })
export class AdminMessagesApiService {
  private readonly baseUrl = API_BASE_URL;

  constructor(private http: HttpClient) {}

  getAll(
    status: ContactMessageFilter,
    page: number,
    size: number
  ): Observable<AdminApiResult<ContactMessage[]>> {
    let params = new HttpParams()
      .set('page', page)
      .set('size', size)
      .set('sort', 'receivedAt,desc');

    if (status !== 'all') {
      params = params.set('status', status);
    }

    return this.http.get<AdminApiResult<ContactMessage[]>>(
      `${this.baseUrl}/api/admin/messages`,
      { params }
    );
  }

  getStats(): Observable<ContactMessageStats> {
    return this.http.get<ContactMessageStats>(`${this.baseUrl}/api/admin/messages/stats`);
  }

  getById(id: string): Observable<ContactMessage> {
    return this.http.get<ContactMessage>(`${this.baseUrl}/api/admin/messages/${id}`);
  }

  markAsRead(id: string): Observable<ContactMessage> {
    return this.http.patch<ContactMessage>(`${this.baseUrl}/api/admin/messages/${id}/read`, {});
  }

  markAsUnread(id: string): Observable<ContactMessage> {
    return this.http.patch<ContactMessage>(`${this.baseUrl}/api/admin/messages/${id}/unread`, {});
  }

  archive(id: string): Observable<ContactMessage> {
    return this.http.patch<ContactMessage>(`${this.baseUrl}/api/admin/messages/${id}/archive`, {});
  }

  delete(id: string): Observable<void> {
    return this.http.delete<void>(`${this.baseUrl}/api/admin/messages/${id}`);
  }
}