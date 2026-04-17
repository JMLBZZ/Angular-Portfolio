import { Injectable } from '@angular/core';

type GenerateProjectPdfOptions = {
  element: HTMLElement;
  title: string;
  author: string;
  filename?: string;
  generatedAt?: Date;
};

type PdfLinkArea = {
  href: string;
  xPx: number;
  yPx: number;
  widthPx: number;
  heightPx: number;
};

@Injectable({
  providedIn: 'root',
})
export class ProjectPdfService {
  async generateProjectPdf(options: GenerateProjectPdfOptions): Promise<void> {
    const { jsPDF } = await import('jspdf');
    const html2canvas = (await import('html2canvas')).default;

    const generatedAt = options.generatedAt ?? new Date();
    const linkAreas = this.collectLinkAreas(options.element);

    const canvas = await html2canvas(options.element, {
      scale: 2,
      useCORS: true,
      allowTaint: false,
      backgroundColor: '#ffffff',
      logging: false,
      imageTimeout: 15000,
      windowWidth: 1200,
      scrollX: 0,
      scrollY: 0,
    });

    const pdf = new jsPDF({
      orientation: 'p',
      unit: 'mm',
      format: 'a4',
      compress: true,
      putOnlyUsedFonts: true,
    });

    const pageWidth = pdf.internal.pageSize.getWidth();
    const pageHeight = pdf.internal.pageSize.getHeight();

    const marginLeft = 12;
    const marginRight = 12;
    const headerHeight = 22;
    const footerHeight = 14;
    const contentTop = headerHeight + 6;
    const contentBottom = footerHeight + 6;

    const contentWidthMm = pageWidth - marginLeft - marginRight;
    const contentHeightMm = pageHeight - contentTop - contentBottom;

    const mmPerPx = contentWidthMm / canvas.width;
    const pageSliceHeightPx = Math.floor(contentHeightMm / mmPerPx);

    const totalPages = Math.max(1, Math.ceil(canvas.height / pageSliceHeightPx));

    for (let pageIndex = 0; pageIndex < totalPages; pageIndex++) {
      if (pageIndex > 0) {
        pdf.addPage();
      }

      this.drawHeader(pdf, {
        title: options.title,
        author: options.author,
        pageWidth,
      });

      const sourceY = pageIndex * pageSliceHeightPx;
      const sliceHeightPx = Math.min(pageSliceHeightPx, canvas.height - sourceY);

      const pageCanvas = document.createElement('canvas');
      pageCanvas.width = canvas.width;
      pageCanvas.height = sliceHeightPx;

      const pageContext = pageCanvas.getContext('2d');

      if (!pageContext) {
        throw new Error('Impossible de préparer la page PDF.');
      }

      pageContext.fillStyle = '#ffffff';
      pageContext.fillRect(0, 0, pageCanvas.width, pageCanvas.height);
      pageContext.drawImage(
        canvas,
        0,
        sourceY,
        canvas.width,
        sliceHeightPx,
        0,
        0,
        canvas.width,
        sliceHeightPx
      );

      const imageData = pageCanvas.toDataURL('image/jpeg', 0.98);
      const renderedHeightMm = sliceHeightPx * mmPerPx;

      pdf.addImage(
        imageData,
        'JPEG',
        marginLeft,
        contentTop,
        contentWidthMm,
        renderedHeightMm,
        undefined,
        'FAST'
      );

      this.addPageLinks(pdf, {
        linkAreas,
        pageIndex,
        pageSliceHeightPx,
        sourceY,
        mmPerPx,
        marginLeft,
        contentTop,
      });

      this.drawFooter(pdf, {
        title: options.title,
        author: options.author,
        generatedAt,
        pageNumber: pageIndex + 1,
        totalPages,
        pageWidth,
        pageHeight,
      });
    }

    const filename = this.buildFilename(options.filename ?? options.title);

    const blob = pdf.output('blob');
    const blobUrl = URL.createObjectURL(blob);

    window.open(blobUrl, '_blank', 'noopener,noreferrer');

    pdf.save(filename);

    setTimeout(() => {
      URL.revokeObjectURL(blobUrl);
    }, 60000);
  }

  private collectLinkAreas(root: HTMLElement): PdfLinkArea[] {
    const rootRect = root.getBoundingClientRect();

    return Array.from(root.querySelectorAll<HTMLAnchorElement>('a[href]'))
      .map((anchor) => {
        const href = anchor.href?.trim();

        if (!href) {
          return null;
        }

        const rect = anchor.getBoundingClientRect();

        if (rect.width <= 0 || rect.height <= 0) {
          return null;
        }

        return {
          href,
          xPx: rect.left - rootRect.left,
          yPx: rect.top - rootRect.top,
          widthPx: rect.width,
          heightPx: rect.height,
        };
      })
      .filter((value): value is PdfLinkArea => value !== null);
  }

  private addPageLinks(
    pdf: InstanceType<typeof import('jspdf').jsPDF>,
    options: {
      linkAreas: PdfLinkArea[];
      pageIndex: number;
      pageSliceHeightPx: number;
      sourceY: number;
      mmPerPx: number;
      marginLeft: number;
      contentTop: number;
    }
  ): void {
    const pageStartY = options.sourceY;
    const pageEndY = options.sourceY + options.pageSliceHeightPx;

    for (const link of options.linkAreas) {
      const linkTop = link.yPx;
      const linkBottom = link.yPx + link.heightPx;

      if (linkBottom <= pageStartY || linkTop >= pageEndY) {
        continue;
      }

      const visibleTopPx = Math.max(linkTop, pageStartY);
      const visibleBottomPx = Math.min(linkBottom, pageEndY);
      const visibleHeightPx = visibleBottomPx - visibleTopPx;

      const xMm = options.marginLeft + (link.xPx * options.mmPerPx);
      const yMm = options.contentTop + ((visibleTopPx - pageStartY) * options.mmPerPx);
      const widthMm = link.widthPx * options.mmPerPx;
      const heightMm = visibleHeightPx * options.mmPerPx;

      if (widthMm <= 0 || heightMm <= 0) {
        continue;
      }

      pdf.link(xMm, yMm, widthMm, heightMm, {
        url: link.href,
      });
    }
  }

  private drawHeader(
    pdf: InstanceType<typeof import('jspdf').jsPDF>,
    options: {
      title: string;
      author: string;
      pageWidth: number;
    }
  ): void {
    pdf.setTextColor(30, 41, 59);

    pdf.setFont('helvetica', 'bold');
    pdf.setFontSize(13);
    pdf.text(options.title, options.pageWidth / 2, 10, { align: 'center' });

    pdf.setFont('helvetica', 'normal');
    pdf.setFontSize(10);
    pdf.text(options.author, options.pageWidth / 2, 16, { align: 'center' });

    pdf.setDrawColor(220, 226, 232);
    pdf.line(12, 19, options.pageWidth - 12, 19);
  }

  private drawFooter(
    pdf: InstanceType<typeof import('jspdf').jsPDF>,
    options: {
      title: string;
      author: string;
      generatedAt: Date;
      pageNumber: number;
      totalPages: number;
      pageWidth: number;
      pageHeight: number;
    }
  ): void {
    const footerY = options.pageHeight - 8;
    const currentYear = options.generatedAt.getFullYear();
    const formattedDate = new Intl.DateTimeFormat('fr-FR', {
      dateStyle: 'short',
      timeStyle: 'short',
    }).format(options.generatedAt);

    pdf.setDrawColor(220, 226, 232);
    pdf.line(12, options.pageHeight - 13, options.pageWidth - 12, options.pageHeight - 13);

    pdf.setTextColor(71, 85, 105);
    pdf.setFont('helvetica', 'normal');
    pdf.setFontSize(8);

    pdf.text(`Généré le ${formattedDate}`, 12, footerY);

    pdf.text(options.title, options.pageWidth / 2, footerY, {
      align: 'center',
    });

    pdf.text(
      `© ${currentYear} ${options.author} • Page ${options.pageNumber}/${options.totalPages}`,
      options.pageWidth - 12,
      footerY,
      { align: 'right' }
    );
  }

  private buildFilename(value: string): string {
    const sanitized = value
      .normalize('NFD')
      .replace(/[\u0300-\u036f]/g, '')
      .replace(/[^a-zA-Z0-9-_ ]/g, '')
      .trim()
      .replace(/\s+/g, ' ');

    const baseName = sanitized || 'Projet';
    return `${baseName} - Portfolio Jamel Bouazza.pdf`;
  }
}