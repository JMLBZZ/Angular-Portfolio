package com.portfolio.portfolio_backend.application.service;

import com.portfolio.portfolio_backend.domain.model.AppearanceSettings;
import com.portfolio.portfolio_backend.domain.port.out.AppearanceSettingsRepositoryPort;
import org.jsoup.Jsoup;
import org.jsoup.safety.Safelist;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

@Service
public class AppearanceSettingsService {

    public static final String DEFAULT_ACCENT_COLOR = "#c5a567";

    private static final int MAX_LOGO_URL_LENGTH = 1000;
    private static final int MAX_LOGO_SVG_CODE_LENGTH = 20000;

    private final AppearanceSettingsRepositoryPort appearanceSettingsRepositoryPort;

    public AppearanceSettingsService(AppearanceSettingsRepositoryPort appearanceSettingsRepositoryPort) {
        this.appearanceSettingsRepositoryPort = appearanceSettingsRepositoryPort;
    }

    @Transactional(readOnly = true)
    public AppearanceSettings getSettings() {
        return appearanceSettingsRepositoryPort
                .find()
                .orElseGet(this::getDefaultSettings);
    }

    @Transactional
    public AppearanceSettings updateSettings(
            String accentColor,
            String logoImageUrl,
            String logoSvgCode
    ) {
        return updateSettings(accentColor, logoImageUrl, logoSvgCode, true);
    }

    @Transactional
    public AppearanceSettings updateSettings(
            String accentColor,
            String logoImageUrl,
            String logoSvgCode,
            Boolean showHeroLogo
    ) {
        String normalizedAccentColor = normalizeAccentColor(accentColor);
        String sanitizedLogoImageUrl = sanitizePlainText(logoImageUrl, MAX_LOGO_URL_LENGTH);
        String sanitizedLogoSvgCode = sanitizeSvgCode(logoSvgCode);
        boolean normalizedShowHeroLogo = showHeroLogo == null || showHeroLogo;

        AppearanceSettings appearanceSettings = new AppearanceSettings(
                normalizedAccentColor,
                sanitizedLogoImageUrl,
                sanitizedLogoSvgCode,
                normalizedShowHeroLogo
        );

        return appearanceSettingsRepositoryPort.save(appearanceSettings);
    }

    @Transactional
    public AppearanceSettings resetToDefault() {
        AppearanceSettings appearanceSettings = getDefaultSettings();

        return appearanceSettingsRepositoryPort.save(appearanceSettings);
    }

    public AppearanceSettings getDefaultSettings() {
        return new AppearanceSettings(DEFAULT_ACCENT_COLOR, "", "", true);
    }

    private String normalizeAccentColor(String accentColor) {
        if (accentColor == null || accentColor.isBlank()) {
            throw new IllegalArgumentException("La couleur principale est obligatoire.");
        }

        String normalizedAccentColor = accentColor.trim().toLowerCase();

        if (!normalizedAccentColor.matches("^#[0-9a-f]{6}$")) {
            throw new IllegalArgumentException("La couleur principale doit être au format hexadécimal #RRGGBB.");
        }

        return normalizedAccentColor;
    }

    private String sanitizePlainText(String input, int maxLength) {
        if (input == null) {
            return "";
        }

        String sanitized = input
                .replaceAll("[\\p{Cntrl}&&[^\r\n\t]]", "")
                .trim();

        if (sanitized.length() > maxLength) {
            sanitized = sanitized.substring(0, maxLength);
        }

        return sanitized;
    }

    private String sanitizeSvgCode(String input) {
        if (input == null || input.isBlank()) {
            return "";
        }

        String cleanedInput = input.trim();

        if (!cleanedInput.toLowerCase().contains("<svg")) {
            throw new IllegalArgumentException("Le code du logo doit contenir une balise SVG valide.");
        }

        Safelist svgSafelist = Safelist.none()
                .addTags(
                        "svg",
                        "g",
                        "path",
                        "circle",
                        "rect",
                        "line",
                        "polyline",
                        "polygon",
                        "ellipse",
                        "defs",
                        "lineargradient",
                        "radialgradient",
                        "stop",
                        "title",
                        "desc"
                )
                .addAttributes(
                        "svg",
                        "xmlns",
                        "viewbox",
                        "viewBox",
                        "width",
                        "height",
                        "fill",
                        "stroke",
                        "stroke-width",
                        "stroke-linecap",
                        "stroke-linejoin",
                        "role",
                        "aria-hidden",
                        "aria-label",
                        "focusable"
                )
                .addAttributes(
                        "g",
                        "fill",
                        "stroke",
                        "stroke-width",
                        "stroke-linecap",
                        "stroke-linejoin",
                        "transform",
                        "opacity"
                )
                .addAttributes(
                        "path",
                        "d",
                        "fill",
                        "stroke",
                        "stroke-width",
                        "stroke-linecap",
                        "stroke-linejoin",
                        "transform",
                        "opacity"
                )
                .addAttributes(
                        "circle",
                        "cx",
                        "cy",
                        "r",
                        "fill",
                        "stroke",
                        "stroke-width",
                        "opacity"
                )
                .addAttributes(
                        "rect",
                        "x",
                        "y",
                        "rx",
                        "ry",
                        "width",
                        "height",
                        "fill",
                        "stroke",
                        "stroke-width",
                        "opacity"
                )
                .addAttributes(
                        "line",
                        "x1",
                        "y1",
                        "x2",
                        "y2",
                        "stroke",
                        "stroke-width",
                        "stroke-linecap",
                        "opacity"
                )
                .addAttributes(
                        "polyline",
                        "points",
                        "fill",
                        "stroke",
                        "stroke-width",
                        "stroke-linecap",
                        "stroke-linejoin",
                        "opacity"
                )
                .addAttributes(
                        "polygon",
                        "points",
                        "fill",
                        "stroke",
                        "stroke-width",
                        "stroke-linejoin",
                        "opacity"
                )
                .addAttributes(
                        "ellipse",
                        "cx",
                        "cy",
                        "rx",
                        "ry",
                        "fill",
                        "stroke",
                        "stroke-width",
                        "opacity"
                )
                .addAttributes(
                        "lineargradient",
                        "id",
                        "x1",
                        "y1",
                        "x2",
                        "y2",
                        "gradientUnits",
                        "gradientunits"
                )
                .addAttributes(
                        "radialgradient",
                        "id",
                        "cx",
                        "cy",
                        "r",
                        "gradientUnits",
                        "gradientunits"
                )
                .addAttributes(
                        "stop",
                        "offset",
                        "stop-color",
                        "stop-opacity"
                );

        String cleaned = Jsoup.clean(cleanedInput, svgSafelist).trim();

        if (cleaned.length() > MAX_LOGO_SVG_CODE_LENGTH) {
            cleaned = cleaned.substring(0, MAX_LOGO_SVG_CODE_LENGTH);
        }

        return cleaned;
    }
}