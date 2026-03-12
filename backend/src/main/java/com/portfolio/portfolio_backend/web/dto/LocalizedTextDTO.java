package com.portfolio.portfolio_backend.web.dto;

import jakarta.validation.constraints.NotBlank;

public class LocalizedTextDTO {

    @NotBlank(message = "Le texte FR est obligatoire")
    private String fr;

    @NotBlank(message = "Le texte EN est obligatoire")
    private String en;

    public LocalizedTextDTO() {
    }

    public LocalizedTextDTO(String fr, String en) {
        this.fr = fr;
        this.en = en;
    }

    public String getFr() {
        return fr;
    }

    public String getEn() {
        return en;
    }
}