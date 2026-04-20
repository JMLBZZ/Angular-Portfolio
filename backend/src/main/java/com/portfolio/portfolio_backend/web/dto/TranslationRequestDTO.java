package com.portfolio.portfolio_backend.web.dto;

import jakarta.validation.constraints.NotEmpty;

import java.util.LinkedHashMap;
import java.util.Map;

public class TranslationRequestDTO {

    @NotEmpty(message = "Les champs à traduire sont obligatoires")
    private Map<String, String> fields = new LinkedHashMap<>();

    public TranslationRequestDTO() {
    }

    public TranslationRequestDTO(Map<String, String> fields) {
        this.fields = fields;
    }

    public Map<String, String> getFields() {
        return fields;
    }

    public void setFields(Map<String, String> fields) {
        this.fields = fields;
    }
}