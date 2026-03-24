package com.portfolio.portfolio_backend.domain.model;

import java.util.List;

public class AboutSkillGroup {

    private LocalizedText title;
    private List<AboutSkillItem> items;

    public AboutSkillGroup(LocalizedText title, List<AboutSkillItem> items) {
        this.title = title;
        this.items = items;
    }

    public LocalizedText getTitle() {
        return title;
    }

    public List<AboutSkillItem> getItems() {
        return items;
    }
}