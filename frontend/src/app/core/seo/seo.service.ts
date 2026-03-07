import { Injectable } from '@angular/core';
import { Meta, Title } from '@angular/platform-browser';

@Injectable({
  providedIn: 'root',
})
export class SeoService {
  constructor(
    private title: Title,
    private meta: Meta
  ) {}

  updateSeo(config: {
    title: string;
    description: string;
    image?: string;
    url?: string;
  }): void {
    const pageTitle = config.title;
    const description = config.description;
    const image = config.image ?? 'https://domainearemplacer.com/og-image.jpg';//<!-- A REMPLACER LORSQUE J'AURAIS MON NOM DE DOMAINE-->
    const url = config.url ?? 'https://domainearemplacer.com';//<!-- A REMPLACER LORSQUE J'AURAIS MON NOM DE DOMAINE-->

    this.title.setTitle(pageTitle);

    this.meta.updateTag({
      name: 'description',
      content: description,
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
      property: 'og:image',
      content: image,
    });

    this.meta.updateTag({
      property: 'og:url',
      content: url,
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
  }
}