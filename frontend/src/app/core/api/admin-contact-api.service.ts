import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';

import { API_BASE_URL } from './api.config';
import { Contact } from '../../shared/models/contact.model';

@Injectable({ providedIn: 'root' })
export class AdminContactApiService {
  private readonly baseUrl = API_BASE_URL;

  constructor(private http: HttpClient) {}

  get(): Observable<Contact> {
    return this.http.get<Contact>(`${this.baseUrl}/api/admin/contact`);
  }

  update(payload: Contact): Observable<Contact> {
    return this.http.put<Contact>(`${this.baseUrl}/api/admin/contact`, payload);
  }
}