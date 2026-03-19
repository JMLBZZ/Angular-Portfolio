package com.portfolio.portfolio_backend.domain.model;

public class HeroCard {

    private LocalizedText title;
    private LocalizedText subtitle;
    private LocalizedText badge;
    private LocalizedText highlight1;
    private LocalizedText highlight2;
    private LocalizedText highlight3;
    private LocalizedText stat1Label;
    private String stat1Value;
    private LocalizedText stat2Label;
    private String stat2Value;
    private LocalizedText stat3Label;
    private String stat3Value;

    public HeroCard(
            LocalizedText title,
            LocalizedText subtitle,
            LocalizedText badge,
            LocalizedText highlight1,
            LocalizedText highlight2,
            LocalizedText highlight3,
            LocalizedText stat1Label,
            String stat1Value,
            LocalizedText stat2Label,
            String stat2Value,
            LocalizedText stat3Label,
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

    public LocalizedText getTitle() {
        return title;
    }

    public LocalizedText getSubtitle() {
        return subtitle;
    }

    public LocalizedText getBadge() {
        return badge;
    }

    public LocalizedText getHighlight1() {
        return highlight1;
    }

    public LocalizedText getHighlight2() {
        return highlight2;
    }

    public LocalizedText getHighlight3() {
        return highlight3;
    }

    public LocalizedText getStat1Label() {
        return stat1Label;
    }

    public String getStat1Value() {
        return stat1Value;
    }

    public LocalizedText getStat2Label() {
        return stat2Label;
    }

    public String getStat2Value() {
        return stat2Value;
    }

    public LocalizedText getStat3Label() {
        return stat3Label;
    }

    public String getStat3Value() {
        return stat3Value;
    }
}