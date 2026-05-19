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
        AppearanceSettings existingSettings = new AppearanceSettings("#d4af37");

        when(appearanceSettingsRepositoryPort.find()).thenReturn(Optional.of(existingSettings));

        AppearanceSettings result = appearanceSettingsService.getSettings();

        assertNotNull(result);
        assertEquals("#d4af37", result.getAccentColor());

        verify(appearanceSettingsRepositoryPort).find();
        verify(appearanceSettingsRepositoryPort, never()).save(any());
    }

    @Test
    void getSettings_shouldReturnDefaultSettings_whenRepositoryIsEmpty() {
        when(appearanceSettingsRepositoryPort.find()).thenReturn(Optional.empty());

        AppearanceSettings result = appearanceSettingsService.getSettings();

        assertNotNull(result);
        assertEquals("#c5a567", result.getAccentColor());

        verify(appearanceSettingsRepositoryPort).find();
        verify(appearanceSettingsRepositoryPort, never()).save(any());
    }

    @Test
    void updateSettings_shouldNormalizeAndSaveAccentColor() {
        when(appearanceSettingsRepositoryPort.save(any(AppearanceSettings.class)))
                .thenAnswer(invocation -> invocation.getArgument(0));

        AppearanceSettings result = appearanceSettingsService.updateSettings("   #D4AF37   ");

        ArgumentCaptor<AppearanceSettings> captor = ArgumentCaptor.forClass(AppearanceSettings.class);
        verify(appearanceSettingsRepositoryPort).save(captor.capture());

        AppearanceSettings savedSettings = captor.getValue();

        assertEquals("#d4af37", savedSettings.getAccentColor());
        assertEquals("#d4af37", result.getAccentColor());
    }

    @Test
    void updateSettings_shouldThrowException_whenAccentColorIsNull() {
        IllegalArgumentException exception = assertThrows(
                IllegalArgumentException.class,
                () -> appearanceSettingsService.updateSettings(null)
        );

        assertEquals("La couleur principale est obligatoire.", exception.getMessage());

        verify(appearanceSettingsRepositoryPort, never()).save(any());
    }

    @Test
    void updateSettings_shouldThrowException_whenAccentColorIsBlank() {
        IllegalArgumentException exception = assertThrows(
                IllegalArgumentException.class,
                () -> appearanceSettingsService.updateSettings("   ")
        );

        assertEquals("La couleur principale est obligatoire.", exception.getMessage());

        verify(appearanceSettingsRepositoryPort, never()).save(any());
    }

    @Test
    void updateSettings_shouldThrowException_whenAccentColorFormatIsInvalid() {
        IllegalArgumentException exception = assertThrows(
                IllegalArgumentException.class,
                () -> appearanceSettingsService.updateSettings("gold")
        );

        assertEquals("La couleur principale doit être au format hexadécimal #RRGGBB.", exception.getMessage());

        verify(appearanceSettingsRepositoryPort, never()).save(any());
    }

    @Test
    void resetToDefault_shouldSaveDefaultAccentColor() {
        when(appearanceSettingsRepositoryPort.save(any(AppearanceSettings.class)))
                .thenAnswer(invocation -> invocation.getArgument(0));

        AppearanceSettings result = appearanceSettingsService.resetToDefault();

        ArgumentCaptor<AppearanceSettings> captor = ArgumentCaptor.forClass(AppearanceSettings.class);
        verify(appearanceSettingsRepositoryPort).save(captor.capture());

        AppearanceSettings savedSettings = captor.getValue();

        assertEquals("#c5a567", savedSettings.getAccentColor());
        assertEquals("#c5a567", result.getAccentColor());
    }
}