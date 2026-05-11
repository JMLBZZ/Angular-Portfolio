package com.portfolio.portfolio_backend.application.service;

import com.portfolio.portfolio_backend.domain.model.LegalContent;
import com.portfolio.portfolio_backend.domain.model.LocalizedText;
import com.portfolio.portfolio_backend.domain.port.out.LegalContentRepositoryPort;
import org.jsoup.Jsoup;
import org.jsoup.safety.Safelist;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

@Service
public class LegalContentService {

    private final LegalContentRepositoryPort legalContentRepositoryPort;

    public LegalContentService(LegalContentRepositoryPort legalContentRepositoryPort) {
        this.legalContentRepositoryPort = legalContentRepositoryPort;
    }

    @Transactional(readOnly = true)
    public LegalContent get() {
        return legalContentRepositoryPort.find().orElseGet(this::buildDefaultLegalContent);
    }

    @Transactional
    public LegalContent update(LegalContent legalContent) {
        LegalContent sanitizedLegalContent = new LegalContent(
                sanitizeLocalizedPlainText(legalContent.getTitle(), 255),
                sanitizeLocalizedHtml(legalContent.getContent(), 20000)
        );

        return legalContentRepositoryPort.save(sanitizedLegalContent);
    }

    private LegalContent buildDefaultLegalContent() {
        return new LegalContent(
                new LocalizedText(
                        "Mentions légales & Politique de confidentialité",
                        "Legal notice & Privacy policy"
                ),
                new LocalizedText(
                        "<h2>Mentions légales</h2><p>Contenu à compléter depuis l’administration.</p>",
                        "<h2>Legal notice</h2><p>Content to be completed from the admin dashboard.</p>"
                )
        );
    }

    private LocalizedText sanitizeLocalizedPlainText(LocalizedText text, int maxLength) {
        if (text == null) {
            return new LocalizedText("", "");
        }

        return new LocalizedText(
                sanitizePlainText(text.getFr(), maxLength),
                sanitizePlainText(text.getEn(), maxLength)
        );
    }

    private LocalizedText sanitizeLocalizedHtml(LocalizedText text, int maxLength) {
        if (text == null) {
            return new LocalizedText("", "");
        }

        return new LocalizedText(
                sanitizeHtml(text.getFr(), maxLength),
                sanitizeHtml(text.getEn(), maxLength)
        );
    }

    private String sanitizePlainText(String input, int maxLength) {
        if (input == null) {
            return "";
        }

        String sanitized = input
                .replaceAll("[\\p{Cntrl}&&[^\r\n\t]]", "")
                .trim();

        if (sanitized.length() > maxLength) {
            sanitized = sanitized.substring(0, maxLength);
        }

        return sanitized;
    }

    private String sanitizeHtml(String input, int maxLength) {
        if (input == null) {
            return "";
        }

        Safelist safelist = Safelist.basic()
                .addTags("h1", "h2", "h3", "h4", "u")
                .addAttributes("a", "href", "title", "target", "rel")
                .addProtocols("a", "href", "http", "https", "mailto");

        String cleaned = Jsoup.clean(input, safelist).trim();

        if (cleaned.length() > maxLength) {
            cleaned = cleaned.substring(0, maxLength);
        }

        return cleaned;
    }
}