package com.portfolio.portfolio_backend.web.dto;

import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.Size;

public class LegalHtmlContentDTO {

    @NotBlank(message = "Le contenu FR est obligatoire")
    @Size(max = 20000, message = "Le contenu FR est trop long")
    private String fr;

    @NotBlank(message = "Le contenu EN est obligatoire")
    @Size(max = 20000, message = "Le contenu EN est trop long")
    private String en;

    public LegalHtmlContentDTO() {
    }

    public LegalHtmlContentDTO(String fr, String en) {
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