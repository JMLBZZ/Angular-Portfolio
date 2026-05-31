package com.portfolio.portfolio_backend.web.dto;

import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.Size;

public class ProjectShortLocalizedTextDTO {

    @NotBlank(message = "Le texte FR est obligatoire")
    @Size(max = 300, message = "Le texte FR est trop long")
    private String fr;

    @NotBlank(message = "Le texte EN est obligatoire")
    @Size(max = 300, message = "Le texte EN est trop long")
    private String en;

    public ProjectShortLocalizedTextDTO() {
    }

    public ProjectShortLocalizedTextDTO(String fr, String en) {
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