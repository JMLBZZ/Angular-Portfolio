package com.portfolio.portfolio_backend.infrastructure.web.controller;

import com.portfolio.portfolio_backend.application.service.AppearanceSettingsService;
import com.portfolio.portfolio_backend.domain.model.AppearanceSettings;
import com.portfolio.portfolio_backend.infrastructure.security.JwtAuthenticationFilter;
import com.portfolio.portfolio_backend.infrastructure.security.JwtService;
import com.portfolio.portfolio_backend.web.controller.AdminAppearanceSettingsController;
import org.junit.jupiter.api.Test;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.boot.test.autoconfigure.web.servlet.AutoConfigureMockMvc;
import org.springframework.boot.test.autoconfigure.web.servlet.WebMvcTest;
import org.springframework.http.MediaType;
import org.springframework.test.context.bean.override.mockito.MockitoBean;
import org.springframework.test.web.servlet.MockMvc;

import static org.mockito.ArgumentMatchers.any;
import static org.mockito.ArgumentMatchers.anyString;
import static org.mockito.Mockito.never;
import static org.mockito.Mockito.verify;
import static org.mockito.Mockito.when;
import static org.springframework.test.web.servlet.request.MockMvcRequestBuilders.get;
import static org.springframework.test.web.servlet.request.MockMvcRequestBuilders.post;
import static org.springframework.test.web.servlet.request.MockMvcRequestBuilders.put;
import static org.springframework.test.web.servlet.result.MockMvcResultMatchers.jsonPath;
import static org.springframework.test.web.servlet.result.MockMvcResultMatchers.status;

@WebMvcTest(AdminAppearanceSettingsController.class)
@AutoConfigureMockMvc(addFilters = false)
class AdminAppearanceSettingsControllerTest {

    @Autowired
    private MockMvc mockMvc;

    @MockitoBean
    private AppearanceSettingsService service;

    @MockitoBean
    private JwtService jwtService;

    @MockitoBean
    private JwtAuthenticationFilter jwtAuthenticationFilter;

    @Test
    void shouldReturnAdminAppearanceSettings() throws Exception {
        when(service.getSettings()).thenReturn(new AppearanceSettings(
                "#c5a567",
                "https://res.cloudinary.com/demo/image/upload/portfolio/Logo/logo.png",
                "<svg viewBox=\"0 0 100 100\"></svg>",
                true
        ));

        mockMvc.perform(get("/api/admin/appearance"))
                .andExpect(status().isOk())
                .andExpect(jsonPath("$.accentColor").value("#c5a567"))
                .andExpect(jsonPath("$.logoImageUrl").value("https://res.cloudinary.com/demo/image/upload/portfolio/Logo/logo.png"))
                .andExpect(jsonPath("$.logoSvgCode").value("<svg viewBox=\"0 0 100 100\"></svg>"))
                .andExpect(jsonPath("$.showHeroLogo").value(true));

        verify(service).getSettings();
    }

    @Test
    void shouldUpdateAppearanceSettings() throws Exception {
        when(service.updateSettings(
                "#d4af37",
                "https://res.cloudinary.com/demo/image/upload/portfolio/Logo/logo.png",
                "<svg viewBox=\"0 0 100 100\"></svg>",
                true
        )).thenReturn(new AppearanceSettings(
                "#d4af37",
                "https://res.cloudinary.com/demo/image/upload/portfolio/Logo/logo.png",
                "<svg viewBox=\"0 0 100 100\"></svg>",
                true
        ));

        mockMvc.perform(
                        put("/api/admin/appearance")
                                .contentType(MediaType.APPLICATION_JSON)
                                .content("""
                                        {
                                          "accentColor": "#d4af37",
                                          "logoImageUrl": "https://res.cloudinary.com/demo/image/upload/portfolio/Logo/logo.png",
                                          "logoSvgCode": "<svg viewBox=\\"0 0 100 100\\"></svg>",
                                          "showHeroLogo": true
                                        }
                                        """)
                )
                .andExpect(status().isOk())
                .andExpect(jsonPath("$.accentColor").value("#d4af37"))
                .andExpect(jsonPath("$.logoImageUrl").value("https://res.cloudinary.com/demo/image/upload/portfolio/Logo/logo.png"))
                .andExpect(jsonPath("$.logoSvgCode").value("<svg viewBox=\"0 0 100 100\"></svg>"))
                .andExpect(jsonPath("$.showHeroLogo").value(true));

        verify(service).updateSettings(
                "#d4af37",
                "https://res.cloudinary.com/demo/image/upload/portfolio/Logo/logo.png",
                "<svg viewBox=\"0 0 100 100\"></svg>",
                true
        );
    }

    @Test
    void shouldResetAppearanceSettingsToDefault() throws Exception {
        when(service.resetToDefault())
                .thenReturn(new AppearanceSettings("#c5a567", "", "", true));

        mockMvc.perform(post("/api/admin/appearance/reset"))
                .andExpect(status().isOk())
                .andExpect(jsonPath("$.accentColor").value("#c5a567"))
                .andExpect(jsonPath("$.logoImageUrl").value(""))
                .andExpect(jsonPath("$.logoSvgCode").value(""))
                .andExpect(jsonPath("$.showHeroLogo").value(true));

        verify(service).resetToDefault();
    }

    @Test
    void shouldReturnBadRequest_whenAccentColorIsInvalid() throws Exception {
        mockMvc.perform(
                        put("/api/admin/appearance")
                                .contentType(MediaType.APPLICATION_JSON)
                                .content("""
                                        {
                                            "accentColor": "gold",
                                            "showHeroLogo": true
                                        }
                                        """)
                )
                .andExpect(status().isBadRequest());

        verify(service, never()).updateSettings(
                anyString(),
                anyString(),
                anyString(),
                any()
        );
    }

    @Test
    void shouldReturnBadRequest_whenAccentColorIsMissing() throws Exception {
        mockMvc.perform(
                        put("/api/admin/appearance")
                                .contentType(MediaType.APPLICATION_JSON)
                                .content("""
                                        {
                                            "showHeroLogo": true
                                        }
                                        """)
                )
                .andExpect(status().isBadRequest());

        verify(service, never()).updateSettings(
                anyString(),
                anyString(),
                anyString(),
                any()
        );
    }
}