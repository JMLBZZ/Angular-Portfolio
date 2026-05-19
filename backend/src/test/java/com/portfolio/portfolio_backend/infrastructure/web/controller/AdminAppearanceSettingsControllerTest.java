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
        when(service.getSettings()).thenReturn(new AppearanceSettings("#c5a567"));

        mockMvc.perform(get("/api/admin/appearance"))
                .andExpect(status().isOk())
                .andExpect(jsonPath("$.accentColor").value("#c5a567"));

        verify(service).getSettings();
    }

    @Test
    void shouldUpdateAppearanceSettings() throws Exception {
        when(service.updateSettings("#d4af37"))
                .thenReturn(new AppearanceSettings("#d4af37"));

        mockMvc.perform(
                        put("/api/admin/appearance")
                                .contentType(MediaType.APPLICATION_JSON)
                                .content("""
                                        {
                                          "accentColor": "#d4af37"
                                        }
                                        """)
                )
                .andExpect(status().isOk())
                .andExpect(jsonPath("$.accentColor").value("#d4af37"));

        verify(service).updateSettings("#d4af37");
    }

    @Test
    void shouldResetAppearanceSettingsToDefault() throws Exception {
        when(service.resetToDefault())
                .thenReturn(new AppearanceSettings("#c5a567"));

        mockMvc.perform(post("/api/admin/appearance/reset"))
                .andExpect(status().isOk())
                .andExpect(jsonPath("$.accentColor").value("#c5a567"));

        verify(service).resetToDefault();
    }

    @Test
    void shouldReturnBadRequest_whenAccentColorIsInvalid() throws Exception {
        mockMvc.perform(
                        put("/api/admin/appearance")
                                .contentType(MediaType.APPLICATION_JSON)
                                .content("""
                                        {
                                            "accentColor": "gold"
                                        }
                                        """)
                )
                .andExpect(status().isBadRequest());

        verify(service, never()).updateSettings(anyString());
    }

    @Test
    void shouldReturnBadRequest_whenAccentColorIsMissing() throws Exception {
        mockMvc.perform(
                        put("/api/admin/appearance")
                                .contentType(MediaType.APPLICATION_JSON)
                                .content("""
                                        {
                                        }
                                        """)
                )
                .andExpect(status().isBadRequest());

        verify(service, never()).updateSettings(anyString());
    }
}