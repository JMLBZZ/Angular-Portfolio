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

@Component
public class DeepLTranslationAdapter implements TranslationPort {

    private static final Logger logger = LoggerFactory.getLogger(DeepLTranslationAdapter.class);

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

        if (authKey.isBlank()) {
            throw new TranslationException("La traduction automatique n'est pas configurée sur le serveur.");
        }

        try {
            DeepLClient client = new DeepLClient(authKey);
            List<TextResult> results = client.translateText(
                    texts,
                    defaultIfBlank(deepLProperties.sourceLang(), "FR"),
                    defaultIfBlank(deepLProperties.targetLang(), "EN")
            );

            return results.stream()
                    .map(TextResult::getText)
                    .toList();
        } catch (Exception ex) {
            logger.error("DeepL translation failed", ex);
            throw new TranslationException(resolveMessage(ex), ex);
        }
    }

    private String sanitize(String value) {
        return value == null ? "" : value.trim();
    }

    private String defaultIfBlank(String value, String defaultValue) {
        String sanitized = sanitize(value);
        return sanitized.isBlank() ? defaultValue : sanitized;
    }

    private String resolveMessage(Exception ex) {
        String message = sanitize(ex.getMessage()).toLowerCase();

        if (message.contains("456") || message.contains("quota")) {
            return "Le quota DeepL est dépassé pour le moment.";
        }

        if (message.contains("403") || message.contains("auth")) {
            return "La clé DeepL configurée sur le serveur est invalide.";
        }

        return "Le service de traduction est temporairement indisponible.";
    }
}