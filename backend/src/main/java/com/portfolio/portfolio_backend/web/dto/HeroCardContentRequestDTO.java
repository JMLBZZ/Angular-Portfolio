package com.portfolio.portfolio_backend.web.dto;

import jakarta.validation.Valid;
import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.NotNull;
import jakarta.validation.constraints.Size;

public class HeroCardContentRequestDTO {

    @Valid
    @NotNull(message = "Le titre est obligatoire")
    private LocalizedTextDTO title;

    @Valid
    @NotNull(message = "Le sous-titre est obligatoire")
    private LocalizedTextDTO subtitle;

    @Valid
    @NotNull(message = "Le badge est obligatoire")
    private LocalizedTextDTO badge;

    @Valid
    @NotNull(message = "Le point fort 1 est obligatoire")
    private LocalizedTextDTO highlight1;

    @Valid
    @NotNull(message = "Le point fort 2 est obligatoire")
    private LocalizedTextDTO highlight2;

    @Valid
    @NotNull(message = "Le point fort 3 est obligatoire")
    private LocalizedTextDTO highlight3;

    @Valid
    @NotNull(message = "Le label de statistique 1 est obligatoire")
    private LocalizedTextDTO stat1Label;

    @NotBlank(message = "La valeur de statistique 1 est obligatoire")
    @Size(max = 80, message = "La valeur de statistique 1 est trop longue")
    private String stat1Value;

    @Valid
    @NotNull(message = "Le label de statistique 2 est obligatoire")
    private LocalizedTextDTO stat2Label;

    @NotBlank(message = "La valeur de statistique 2 est obligatoire")
    @Size(max = 80, message = "La valeur de statistique 2 est trop longue")
    private String stat2Value;

    @Valid
    @NotNull(message = "Le label de statistique 3 est obligatoire")
    private LocalizedTextDTO stat3Label;

    @NotBlank(message = "La valeur de statistique 3 est obligatoire")
    @Size(max = 80, message = "La valeur de statistique 3 est trop longue")
    private String stat3Value;

    public HeroCardContentRequestDTO() {
    }

    public LocalizedTextDTO getTitle() {
        return title;
    }

    public LocalizedTextDTO getSubtitle() {
        return subtitle;
    }

    public LocalizedTextDTO getBadge() {
        return badge;
    }

    public LocalizedTextDTO getHighlight1() {
        return highlight1;
    }

    public LocalizedTextDTO getHighlight2() {
        return highlight2;
    }

    public LocalizedTextDTO getHighlight3() {
        return highlight3;
    }

    public LocalizedTextDTO getStat1Label() {
        return stat1Label;
    }

    public String getStat1Value() {
        return stat1Value;
    }

    public LocalizedTextDTO getStat2Label() {
        return stat2Label;
    }

    public String getStat2Value() {
        return stat2Value;
    }

    public LocalizedTextDTO getStat3Label() {
        return stat3Label;
    }

    public String getStat3Value() {
        return stat3Value;
    }
}