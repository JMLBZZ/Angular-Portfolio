package com.portfolio.portfolio_backend.application.service;

import com.portfolio.portfolio_backend.domain.model.AppearanceSettings;
import com.portfolio.portfolio_backend.domain.port.out.AppearanceSettingsRepositoryPort;
import org.junit.jupiter.api.BeforeEach;
import org.junit.jupiter.api.Test;
import org.mockito.ArgumentCaptor;

import java.util.Optional;

import static org.junit.jupiter.api.Assertions.*;
import static org.mockito.Mockito.*;

class AppearanceSettingsServiceTest {

    private AppearanceSettingsRepositoryPort appearanceSettingsRepositoryPort;
    private AppearanceSettingsService appearanceSettingsService;

    @BeforeEach
    void setUp() {
        appearanceSettingsRepositoryPort = mock(AppearanceSettingsRepositoryPort.class);
        appearanceSettingsService = new AppearanceSettingsService(appearanceSettingsRepositoryPort);
    }

    @Test
    void getSettings_shouldReturnExistingSettings_whenRepositoryContainsSettings() {
        AppearanceSettings existingSettings = new AppearanceSettings(
                "#d4af37",
                "https://res.cloudinary.com/demo/image/upload/portfolio/Logo/logo.png",
                "<svg viewBox=\"0 0 100 100\"><circle cx=\"50\" cy=\"50\" r=\"40\"></circle></svg>"
        );

        when(appearanceSettingsRepositoryPort.find()).thenReturn(Optional.of(existingSettings));

        AppearanceSettings result = appearanceSettingsService.getSettings();

        assertNotNull(result);
        assertEquals("#d4af37", result.getAccentColor());
        assertEquals(
                "https://res.cloudinary.com/demo/image/upload/portfolio/Logo/logo.png",
                result.getLogoImageUrl()
        );
        assertTrue(result.getLogoSvgCode().contains("<svg"));

        verify(appearanceSettingsRepositoryPort).find();
        verify(appearanceSettingsRepositoryPort, never()).save(any());
    }

    @Test
    void getSettings_shouldReturnDefaultSettings_whenRepositoryIsEmpty() {
        when(appearanceSettingsRepositoryPort.find()).thenReturn(Optional.empty());

        AppearanceSettings result = appearanceSettingsService.getSettings();

        assertNotNull(result);
        assertEquals("#c5a567", result.getAccentColor());
        assertEquals("", result.getLogoImageUrl());
        assertEquals("", result.getLogoSvgCode());

        verify(appearanceSettingsRepositoryPort).find();
        verify(appearanceSettingsRepositoryPort, never()).save(any());
    }

    @Test
    void updateSettings_shouldNormalizeAndSaveAccentColorAndLogoFields() {
        when(appearanceSettingsRepositoryPort.save(any(AppearanceSettings.class)))
                .thenAnswer(invocation -> invocation.getArgument(0));

        AppearanceSettings result = appearanceSettingsService.updateSettings(
                "   #D4AF37   ",
                "   https://res.cloudinary.com/demo/image/upload/portfolio/Logo/logo.png   ",
                "   <svg viewBox=\"0 0 100 100\"><circle cx=\"50\" cy=\"50\" r=\"40\" onclick=\"alert(1)\"></circle><script>alert(1)</script></svg>   "
        );

        ArgumentCaptor<AppearanceSettings> captor = ArgumentCaptor.forClass(AppearanceSettings.class);
        verify(appearanceSettingsRepositoryPort).save(captor.capture());

        AppearanceSettings savedSettings = captor.getValue();

        assertEquals("#d4af37", savedSettings.getAccentColor());
        assertEquals(
                "https://res.cloudinary.com/demo/image/upload/portfolio/Logo/logo.png",
                savedSettings.getLogoImageUrl()
        );
        assertTrue(savedSettings.getLogoSvgCode().contains("<svg"));
        assertTrue(savedSettings.getLogoSvgCode().contains("<circle"));
        assertFalse(savedSettings.getLogoSvgCode().contains("script"));
        assertFalse(savedSettings.getLogoSvgCode().contains("onclick"));

        assertEquals("#d4af37", result.getAccentColor());
    }

    @Test
    void updateSettings_shouldThrowException_whenAccentColorIsNull() {
        IllegalArgumentException exception = assertThrows(
                IllegalArgumentException.class,
                () -> appearanceSettingsService.updateSettings(null, "", "")
        );

        assertEquals("La couleur principale est obligatoire.", exception.getMessage());

        verify(appearanceSettingsRepositoryPort, never()).save(any());
    }

    @Test
    void updateSettings_shouldThrowException_whenAccentColorIsBlank() {
        IllegalArgumentException exception = assertThrows(
                IllegalArgumentException.class,
                () -> appearanceSettingsService.updateSettings("   ", "", "")
        );

        assertEquals("La couleur principale est obligatoire.", exception.getMessage());

        verify(appearanceSettingsRepositoryPort, never()).save(any());
    }

    @Test
    void updateSettings_shouldThrowException_whenAccentColorFormatIsInvalid() {
        IllegalArgumentException exception = assertThrows(
                IllegalArgumentException.class,
                () -> appearanceSettingsService.updateSettings("gold", "", "")
        );

        assertEquals("La couleur principale doit être au format hexadécimal #RRGGBB.", exception.getMessage());

        verify(appearanceSettingsRepositoryPort, never()).save(any());
    }

    @Test
    void updateSettings_shouldThrowException_whenSvgCodeDoesNotContainSvgTag() {
        IllegalArgumentException exception = assertThrows(
                IllegalArgumentException.class,
                () -> appearanceSettingsService.updateSettings("#c5a567", "", "<div>Logo</div>")
        );

        assertEquals("Le code du logo doit contenir une balise SVG valide.", exception.getMessage());

        verify(appearanceSettingsRepositoryPort, never()).save(any());
    }

    @Test
    void resetToDefault_shouldSaveDefaultAccentColorAndClearLogoFields() {
        when(appearanceSettingsRepositoryPort.save(any(AppearanceSettings.class)))
                .thenAnswer(invocation -> invocation.getArgument(0));

        AppearanceSettings result = appearanceSettingsService.resetToDefault();

        ArgumentCaptor<AppearanceSettings> captor = ArgumentCaptor.forClass(AppearanceSettings.class);
        verify(appearanceSettingsRepositoryPort).save(captor.capture());

        AppearanceSettings savedSettings = captor.getValue();

        assertEquals("#c5a567", savedSettings.getAccentColor());
        assertEquals("", savedSettings.getLogoImageUrl());
        assertEquals("", savedSettings.getLogoSvgCode());

        assertEquals("#c5a567", result.getAccentColor());
        assertEquals("", result.getLogoImageUrl());
        assertEquals("", result.getLogoSvgCode());
    }
}