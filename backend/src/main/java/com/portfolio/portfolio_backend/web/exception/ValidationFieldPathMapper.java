package com.portfolio.portfolio_backend.web.exception;

import java.util.List;
import java.util.regex.Matcher;
import java.util.regex.Pattern;

public final class ValidationFieldPathMapper {

    private static final List<String> ROOT_FIELDS = List.of(
            "slug",
            "title",
            "subtitle",
            "category",
            "type",
            "image",
            "cover",
            "imagesInput",
            "descriptionFr",
            "descriptionEn",
            "longDescriptionFr",
            "longDescriptionEn",
            "stackInput",
            "tagsInput",
            "roleFr",
            "roleEn",
            "problemFr",
            "problemEn",
            "solutionFr",
            "solutionEn",
            "demoUrl",
            "githubUrl",
            "featured",
            "showGithub",
            "published",
            "available",
            "techBadges",
            "badge",
            "highlight1",
            "highlight2",
            "highlight3",
            "stat1Label",
            "stat1Value",
            "stat2Label",
            "stat2Value",
            "stat3Label",
            "stat3Value",
            "email",
            "phone",
            "location",
            "linkedinUrl",
            "profileName",
            "profileRole",
            "bio",
            "timelineTitle",
            "skillsTitle",
            "softSkillsTitle",
            "timelineItems",
            "skillGroups",
            "softSkills",
            "date",
            "company",
            "label",
            "displayOrder",
            "name",
            "value",
            "icon",
            "items"
    );

    private ValidationFieldPathMapper() {
    }

    public static String toFrontendFieldPath(String rawPath) {
        if (rawPath == null || rawPath.isBlank()) {
            return "request";
        }

        String normalized = stripTechnicalPrefix(rawPath.trim());

        if (normalized.isBlank()) {
            return "request";
        }

        String[] parts = normalized.split("\\.");
        if (parts.length == 0) {
            return normalized;
        }

        StringBuilder result = new StringBuilder(parts[0]);

        for (int i = 1; i < parts.length; i++) {
            String part = parts[i];

            if (part.isBlank()) {
                continue;
            }

            if ("fr".equals(part)) {
                result.append("Fr");
                continue;
            }

            if ("en".equals(part)) {
                result.append("En");
                continue;
            }

            result.append(".").append(part);
        }

        return result.toString();
    }

    private static String stripTechnicalPrefix(String rawPath) {
        for (String rootField : ROOT_FIELDS) {
            Pattern pattern = Pattern.compile("(^|\\.)" + Pattern.quote(rootField) + "(\\[[0-9]+\\])?(\\.|$)");
            Matcher matcher = pattern.matcher(rawPath);

            if (matcher.find()) {
                int startIndex = rawPath.indexOf(rootField, matcher.start());
                if (startIndex >= 0) {
                    return rawPath.substring(startIndex);
                }
            }
        }

        int lastDot = rawPath.lastIndexOf('.');
        if (lastDot >= 0 && lastDot < rawPath.length() - 1) {
            return rawPath.substring(lastDot + 1);
        }

        return rawPath;
    }
}