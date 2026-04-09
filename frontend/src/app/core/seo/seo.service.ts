import { DOCUMENT } from '@angular/common';
import { Inject, Injectable } from '@angular/core';
import { Meta, Title } from '@angular/platform-browser';

import { SEO_CONFIG } from './seo.config';

@Injectable({
  providedIn: 'root',
})
export class SeoService {
  private readonly structuredDataElementId = 'app-structured-data';

  constructor(
    private title: Title,
    private meta: Meta,
    @Inject(DOCUMENT) private document: Document
  ) {}

  updateSeo(config: {
    title: string;
    description: string;
    image?: string;
    url?: string;
    type?: string;
    robots?: string;
    lang?: string;
  }): void {
    const pageTitle = config.title;
    const description = config.description;
    const type = config.type ?? 'website';
    const robots = config.robots ?? SEO_CONFIG.defaultRobots;
    const lang = config.lang ?? 'fr';
    const locale =
      SEO_CONFIG.supportedLocales[lang as keyof typeof SEO_CONFIG.supportedLocales]
      ?? SEO_CONFIG.defaultLocale;

    const image = config.image?.trim() || this.buildAbsoluteUrl(SEO_CONFIG.defaultImagePath);
    const url = config.url?.trim() || this.document.location.href;

    this.title.setTitle(pageTitle);
    this.document.documentElement.lang = lang;

    this.meta.updateTag({
      name: 'description',
      content: description,
    });

    this.meta.updateTag({
      name: 'robots',
      content: robots,
    });

    this.meta.updateTag({
      property: 'og:title',
      content: pageTitle,
    });

    this.meta.updateTag({
      property: 'og:description',
      content: description,
    });

    this.meta.updateTag({
      property: 'og:type',
      content: type,
    });

    this.meta.updateTag({
      property: 'og:url',
      content: url,
    });

    this.meta.updateTag({
      property: 'og:site_name',
      content: SEO_CONFIG.siteName,
    });

    this.meta.updateTag({
      property: 'og:locale',
      content: locale,
    });

    this.meta.updateTag({
      property: 'og:image',
      content: image,
    });

    this.meta.updateTag({
      name: 'twitter:card',
      content: image ? 'summary_large_image' : 'summary',
    });

    this.meta.updateTag({
      name: 'twitter:title',
      content: pageTitle,
    });

    this.meta.updateTag({
      name: 'twitter:description',
      content: description,
    });

    this.meta.updateTag({
      name: 'twitter:image',
      content: image,
    });

    this.setCanonicalUrl(url);
  }

  setStructuredData(data: Record<string, unknown> | Record<string, unknown>[]): void {
    this.removeStructuredData();

    const script = this.document.createElement('script');
    script.type = 'application/ld+json';
    script.id = this.structuredDataElementId;
    script.text = JSON.stringify(data);

    this.document.head.appendChild(script);
  }

  removeStructuredData(): void {
    const existingScript = this.document.getElementById(this.structuredDataElementId);
    existingScript?.remove();
  }

  private setCanonicalUrl(url: string): void {
    let link: HTMLLinkElement | null =
      this.document.querySelector('link[rel="canonical"]');

    if (!link) {
      link = this.document.createElement('link');
      link.setAttribute('rel', 'canonical');
      this.document.head.appendChild(link);
    }

    link.setAttribute('href', url);
  }

  private buildAbsoluteUrl(path: string): string {
    if (path.startsWith('http://') || path.startsWith('https://')) {
      return path;
    }

    const normalizedPath = path.startsWith('/') ? path : `/${path}`;
    return `${this.document.location.origin}${normalizedPath}`;
  }
}