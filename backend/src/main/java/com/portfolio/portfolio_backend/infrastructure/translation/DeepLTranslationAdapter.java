package com.portfolio.portfolio_backend.infrastructure.translation;

import com.deepl.api.DeepLClient;
import com.deepl.api.TextResult;
import com.portfolio.portfolio_backend.application.exception.TranslationException;
import com.portfolio.portfolio_backend.domain.port.out.TranslationPort;
import com.portfolio.portfolio_backend.infrastructure.config.DeepLProperties;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.stereotype.Component;

import java.util.Collections;
import java.util.List;
import java.util.Set;

@Component
public class DeepLTranslationAdapter implements TranslationPort {

    private static final Logger logger = LoggerFactory.getLogger(DeepLTranslationAdapter.class);

    private static final Set<String> SUPPORTED_SOURCE_LANGS = Set.of("FR");
    private static final Set<String> SUPPORTED_TARGET_LANGS = Set.of("EN-US", "EN-GB");

    private final DeepLProperties deepLProperties;

    public DeepLTranslationAdapter(DeepLProperties deepLProperties) {
        this.deepLProperties = deepLProperties;
    }

    @Override
    public List<String> translateFrToEn(List<String> texts) {
        if (texts == null || texts.isEmpty()) {
            return Collections.emptyList();
        }

        String authKey = sanitize(deepLProperties.authKey());
        String sourceLang = normalizeLanguage(defaultIfBlank(deepLProperties.sourceLang(), "FR"));
        String targetLang = normalizeLanguage(defaultIfBlank(deepLProperties.targetLang(), "EN-US"));

        if (authKey.isBlank()) {
            throw new TranslationException(
                    TranslationException.Reason.CONFIGURATION,
                    "La traduction automatique n'est pas configurée sur le serveur."
            );
        }

        validateLanguages(sourceLang, targetLang);

        try {
            DeepLClient client = new DeepLClient(authKey);
            List<TextResult> results = client.translateText(texts, sourceLang, targetLang);

            return results.stream()
                    .map(TextResult::getText)
                    .toList();
        } catch (IllegalArgumentException ex) {
            logger.error("DeepL translation failed", ex);
            throw mapIllegalArgumentException(ex);
        } catch (Exception ex) {
            logger.error("DeepL translation failed", ex);
            throw mapGenericException(ex);
        }
    }

    private void validateLanguages(String sourceLang, String targetLang) {
        if (!SUPPORTED_SOURCE_LANGS.contains(sourceLang)) {
            throw new TranslationException(
                    TranslationException.Reason.CONFIGURATION,
                    "La langue source DeepL configurée sur le serveur est invalide."
            );
        }

        if (!SUPPORTED_TARGET_LANGS.contains(targetLang)) {
            throw new TranslationException(
                    TranslationException.Reason.CONFIGURATION,
                    "La langue cible DeepL configurée sur le serveur est invalide."
            );
        }
    }

    private TranslationException mapIllegalArgumentException(IllegalArgumentException ex) {
        String message = sanitize(ex.getMessage()).toLowerCase();

        if (message.contains("targetlang") || message.contains("target language")) {
            return new TranslationException(
                    TranslationException.Reason.CONFIGURATION,
                    "La langue cible DeepL configurée sur le serveur est invalide.",
                    ex
            );
        }

        if (message.contains("sourcelang") || message.contains("source language")) {
            return new TranslationException(
                    TranslationException.Reason.CONFIGURATION,
                    "La langue source DeepL configurée sur le serveur est invalide.",
                    ex
            );
        }

        return new TranslationException(
                TranslationException.Reason.TEMPORARY_UNAVAILABLE,
                "Le service de traduction est temporairement indisponible.",
                ex
        );
    }

    private TranslationException mapGenericException(Exception ex) {
        String details = buildDiagnosticMessage(ex).toLowerCase();

        if (details.contains("456") || details.contains("quota")) {
            return new TranslationException(
                    TranslationException.Reason.QUOTA_EXCEEDED,
                    "Le quota mensuel DeepL est dépassé.",
                    ex
            );
        }

        if (details.contains("429") || details.contains("too many requests")) {
            return new TranslationException(
                    TranslationException.Reason.TOO_MANY_REQUESTS,
                    "Trop de demandes de traduction en peu de temps. Réessaie dans quelques secondes.",
                    ex
            );
        }

        if (details.contains("403")
                || details.contains("forbidden")
                || details.contains("authorization")
                || details.contains("authentication")
                || details.contains("auth_key")
                || details.contains("auth key")) {
            return new TranslationException(
                    TranslationException.Reason.INVALID_CREDENTIALS,
                    "La clé DeepL configurée sur le serveur est invalide.",
                    ex
            );
        }

        if (details.contains("targetlang")
                || details.contains("sourcelang")
                || details.contains("not allowed")) {
            return new TranslationException(
                    TranslationException.Reason.CONFIGURATION,
                    "La configuration de langue DeepL est invalide sur le serveur.",
                    ex
            );
        }

        if (details.contains("timeout")
                || details.contains("timed out")
                || details.contains("connection reset")
                || details.contains("connection refused")
                || details.contains("unknownhostexception")
                || details.contains("unknown host")
                || details.contains("unresolved")
                || details.contains("network")
                || details.contains("i/o error")
                || details.contains("ioexception")
                || details.contains("500")
                || details.contains("502")
                || details.contains("503")
                || details.contains("504")) {
            return new TranslationException(
                    TranslationException.Reason.TEMPORARY_UNAVAILABLE,
                    "Le service de traduction est temporairement indisponible.",
                    ex
            );
        }

        return new TranslationException(
                TranslationException.Reason.TEMPORARY_UNAVAILABLE,
                "Le service de traduction est temporairement indisponible.",
                ex
        );
    }

    private String buildDiagnosticMessage(Throwable throwable) {
        StringBuilder builder = new StringBuilder();
        Throwable current = throwable;

        while (current != null) {
            if (builder.length() > 0) {
                builder.append(" | ");
            }

            builder.append(current.getClass().getSimpleName());

            String message = sanitize(current.getMessage());
            if (!message.isBlank()) {
                builder.append(": ").append(message);
            }

            current = current.getCause();
        }

        return builder.toString();
    }

    private String sanitize(String value) {
        return value == null ? "" : value.trim();
    }

    private String defaultIfBlank(String value, String defaultValue) {
        String sanitized = sanitize(value);
        return sanitized.isBlank() ? defaultValue : sanitized;
    }

    private String normalizeLanguage(String value) {
        return sanitize(value).toUpperCase();
    }
}