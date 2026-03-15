import { DOCUMENT } from '@angular/common';
import { Inject, Injectable } from '@angular/core';
import { Meta, Title } from '@angular/platform-browser';

@Injectable({
  providedIn: 'root',
})
export class SeoService {
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
    const image = config.image;
    const url = config.url;
    const type = config.type ?? 'website';
    const robots = config.robots ?? 'index, follow';
    const lang = config.lang ?? 'fr';

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
      name: 'twitter:title',
      content: pageTitle,
    });

    this.meta.updateTag({
      name: 'twitter:description',
      content: description,
    });

    this.meta.updateTag({
      name: 'twitter:card',
      content: image ? 'summary_large_image' : 'summary',
    });

    if (image) {
      this.meta.updateTag({
        property: 'og:image',
        content: image,
      });

      this.meta.updateTag({
        name: 'twitter:image',
        content: image,
      });
    }

    if (url) {
      this.meta.updateTag({
        property: 'og:url',
        content: url,
      });

      this.setCanonicalUrl(url);
    }
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
}