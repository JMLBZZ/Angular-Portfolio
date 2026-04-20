package com.portfolio.portfolio_backend.web.dto;

import java.util.LinkedHashMap;
import java.util.Map;

public class TranslationResponseDTO {

    private Map<String, String> fields = new LinkedHashMap<>();

    public TranslationResponseDTO() {
    }

    public TranslationResponseDTO(Map<String, String> fields) {
        this.fields = fields;
    }

    public Map<String, String> getFields() {
        return fields;
    }

    public void setFields(Map<String, String> fields) {
        this.fields = fields;
    }
}