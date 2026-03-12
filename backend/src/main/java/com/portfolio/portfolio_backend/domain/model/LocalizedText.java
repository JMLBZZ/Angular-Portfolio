package com.portfolio.portfolio_backend.domain.model;

public class LocalizedText {

    private String fr;
    private String en;

    public LocalizedText(String fr, String en) {
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