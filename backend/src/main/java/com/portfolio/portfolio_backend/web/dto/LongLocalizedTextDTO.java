package com.portfolio.portfolio_backend.web.dto;

import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.Size;

public class LongLocalizedTextDTO {

    @NotBlank(message = "Le texte FR est obligatoire")
    @Size(max = 3000, message = "Le texte FR est trop long")
    private String fr;

    @NotBlank(message = "Le texte EN est obligatoire")
    @Size(max = 3000, message = "Le texte EN est trop long")
    private String en;

    public LongLocalizedTextDTO() {
    }

    public LongLocalizedTextDTO(String fr, String en) {
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