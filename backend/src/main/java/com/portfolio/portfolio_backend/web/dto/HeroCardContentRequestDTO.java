package com.portfolio.portfolio_backend.web.dto;

import jakarta.validation.Valid;

public class HeroCardContentRequestDTO {

    @Valid
    private LocalizedTextDTO title;

    @Valid
    private LocalizedTextDTO subtitle;

    @Valid
    private LocalizedTextDTO badge;

    @Valid
    private LocalizedTextDTO highlight1;

    @Valid
    private LocalizedTextDTO highlight2;

    @Valid
    private LocalizedTextDTO highlight3;

    @Valid
    private LocalizedTextDTO stat1Label;

    private String stat1Value;

    @Valid
    private LocalizedTextDTO stat2Label;

    private String stat2Value;

    @Valid
    private LocalizedTextDTO stat3Label;

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