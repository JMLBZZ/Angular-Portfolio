package com.portfolio.portfolio_backend.web.dto;

public class HeroCardContentResponseDTO {

    private LocalizedTextDTO title;
    private LocalizedTextDTO subtitle;
    private LocalizedTextDTO badge;
    private LocalizedTextDTO highlight1;
    private LocalizedTextDTO highlight2;
    private LocalizedTextDTO highlight3;
    private LocalizedTextDTO stat1Label;
    private String stat1Value;
    private LocalizedTextDTO stat2Label;
    private String stat2Value;
    private LocalizedTextDTO stat3Label;
    private String stat3Value;

    public HeroCardContentResponseDTO(
            LocalizedTextDTO title,
            LocalizedTextDTO subtitle,
            LocalizedTextDTO badge,
            LocalizedTextDTO highlight1,
            LocalizedTextDTO highlight2,
            LocalizedTextDTO highlight3,
            LocalizedTextDTO stat1Label,
            String stat1Value,
            LocalizedTextDTO stat2Label,
            String stat2Value,
            LocalizedTextDTO stat3Label,
            String stat3Value
    ) {
        this.title = title;
        this.subtitle = subtitle;
        this.badge = badge;
        this.highlight1 = highlight1;
        this.highlight2 = highlight2;
        this.highlight3 = highlight3;
        this.stat1Label = stat1Label;
        this.stat1Value = stat1Value;
        this.stat2Label = stat2Label;
        this.stat2Value = stat2Value;
        this.stat3Label = stat3Label;
        this.stat3Value = stat3Value;
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