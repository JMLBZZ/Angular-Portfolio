package com.portfolio.portfolio_backend.application.service;

import com.portfolio.portfolio_backend.domain.port.out.TranslationPort;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.LinkedHashMap;
import java.util.List;
import java.util.Map;

@Service
public class TranslationService {

    private final TranslationPort translationPort;

    public TranslationService(TranslationPort translationPort) {
        this.translationPort = translationPort;
    }

    @Transactional(readOnly = true)
    public Map<String, String> translateFrToEn(Map<String, String> fields) {
        Map<String, String> sanitizedFields = sanitizeFields(fields);

        if (sanitizedFields.isEmpty()) {
            throw new IllegalArgumentException("Aucun champ FR à traduire n'a été envoyé.");
        }

        List<String> sourceTexts = sanitizedFields.values().stream().toList();
        List<String> translatedTexts = translationPort.translateFrToEn(sourceTexts);

        if (translatedTexts.size() != sourceTexts.size()) {
            throw new IllegalStateException("Le service de traduction a renvoyé un nombre de résultats inattendu.");
        }

        Map<String, String> translatedFields = new LinkedHashMap<>();
        int index = 0;

        for (String sourceKey : sanitizedFields.keySet()) {
            String targetKey = toEnglishKey(sourceKey);
            translatedFields.put(targetKey, translatedTexts.get(index));
            index++;
        }

        return translatedFields;
    }

    private Map<String, String> sanitizeFields(Map<String, String> fields) {
        Map<String, String> sanitized = new LinkedHashMap<>();

        if (fields == null || fields.isEmpty()) {
            return sanitized;
        }

        for (Map.Entry<String, String> entry : fields.entrySet()) {
            String key = sanitizeKey(entry.getKey());
            String value = sanitizeValue(entry.getValue());

            if (key.isBlank() || value.isBlank()) {
                continue;
            }

            if (!key.endsWith("Fr")) {
                continue;
            }

            sanitized.put(key, value);
        }

        return sanitized;
    }

    private String sanitizeKey(String input) {
        if (input == null) {
            return "";
        }

        return input.trim();
    }

    private String sanitizeValue(String input) {
        if (input == null) {
            return "";
        }

        return input
                .replaceAll("[\\p{Cntrl}&&[^\\r\\n\\t]]", "")
                .trim();
    }

    private String toEnglishKey(String frenchKey) {
        return frenchKey.substring(0, frenchKey.length() - 2) + "En";
    }
}