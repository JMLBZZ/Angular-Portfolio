import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable, map } from 'rxjs';

import { Project } from '../../shared/models/project.model';
import { API_BASE_URL } from './api.config';
import { normalizeProject } from './project-normalizer';

@Injectable({ providedIn: 'root' })
export class ProjectsApiService {
  /**
   * Dev: appelle le backend en dur sur localhost:8080
   * Prod: on peut basculer sur un reverse-proxy et mettre '' si même domaine
   */
  private readonly baseUrl = API_BASE_URL;

  constructor(private http: HttpClient) {}

  getPublishedProjects(): Observable<Project[]> {
    return this.http
      .get<Project[]>(`${this.baseUrl}/api/public/projects`)
      .pipe(map((projects) => projects.map((project) => normalizeProject(project))));
  }

  getPublishedProjectBySlug(slug: string): Observable<Project> {
    return this.http
      .get<Project>(`${this.baseUrl}/api/public/projects/${slug}`)
      .pipe(map((project) => normalizeProject(project)));
  }
}