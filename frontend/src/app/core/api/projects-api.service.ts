import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable, map } from 'rxjs';

import { Project, ProjectCategory } from '../../shared/models/project.model';

@Injectable({ providedIn: 'root' })
export class ProjectsApiService {
  /**
   * Dev: appelle le backend en dur sur localhost:8080
   * Prod: on peut basculer sur un reverse-proxy et mettre '' si même domaine
   */
  private readonly baseUrl =
    window.location.hostname === 'localhost' ? 'http://localhost:8080' : '';

  constructor(private http: HttpClient) {}

  getPublishedProjects(): Observable<Project[]> {
    return this.http
      .get<Project[]>(`${this.baseUrl}/api/public/projects`)
      .pipe(
        map((projects) => projects.map((project) => this.normalizeProject(project)))
      );
  }

  getPublishedProjectBySlug(slug: string): Observable<Project> {
    return this.http
      .get<Project>(`${this.baseUrl}/api/public/projects/${slug}`)
      .pipe(
        map((project) => this.normalizeProject(project))
      );
  }

  private normalizeProject(project: Project): Project {
    return {
      ...project,
      category: this.normalizeCategory(project.category),
      image: this.normalizeImage(project.image),
      cover: this.normalizeImage(project.cover),
      images: project.images?.map((img) => this.normalizeImage(img)).filter(Boolean) as string[] | undefined,
    };
  }

  /**
   * Le backend peut renvoyer "frontend" / "backend"
   * alors que le frontend filtre avec "front" / "back".
   */
  private normalizeCategory(category: string | undefined): ProjectCategory {
    switch ((category ?? '').toLowerCase()) {
      case 'frontend':
      case 'front':
        return 'front';

      case 'backend':
      case 'back':
        return 'back';

      case 'fullstack':
      case 'full-stack':
        return 'fullstack';

      case 'uiux':
      case 'ui/ux':
        return 'uiux';

      case 'pao':
        return 'pao';

      default:
        return 'other';
    }
  }

  private normalizeImage(image: string | undefined): string | undefined {
    if (!image) return undefined;
    return image;
  }
}