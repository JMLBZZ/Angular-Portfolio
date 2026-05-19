package com.portfolio.portfolio_backend.infrastructure.web.controller;

import com.portfolio.portfolio_backend.application.service.AppearanceSettingsService;
import com.portfolio.portfolio_backend.domain.model.AppearanceSettings;
import com.portfolio.portfolio_backend.infrastructure.security.JwtAuthenticationFilter;
import com.portfolio.portfolio_backend.infrastructure.security.JwtService;
import com.portfolio.portfolio_backend.web.controller.PublicAppearanceSettingsController;
import org.junit.jupiter.api.Test;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.boot.test.autoconfigure.web.servlet.AutoConfigureMockMvc;
import org.springframework.boot.test.autoconfigure.web.servlet.WebMvcTest;
import org.springframework.test.context.bean.override.mockito.MockitoBean;
import org.springframework.test.web.servlet.MockMvc;

import static org.mockito.Mockito.verify;
import static org.mockito.Mockito.when;
import static org.springframework.test.web.servlet.request.MockMvcRequestBuilders.get;
import static org.springframework.test.web.servlet.result.MockMvcResultMatchers.jsonPath;
import static org.springframework.test.web.servlet.result.MockMvcResultMatchers.status;

@WebMvcTest(PublicAppearanceSettingsController.class)
@AutoConfigureMockMvc(addFilters = false)
class PublicAppearanceSettingsControllerTest {

    @Autowired
    private MockMvc mockMvc;

    @MockitoBean
    private AppearanceSettingsService service;

    @MockitoBean
    private JwtService jwtService;

    @MockitoBean
    private JwtAuthenticationFilter jwtAuthenticationFilter;

    @Test
    void shouldReturnPublicAppearanceSettings() throws Exception {
        when(service.getSettings()).thenReturn(new AppearanceSettings("#c5a567"));

        mockMvc.perform(get("/api/public/appearance"))
                .andExpect(status().isOk())
                .andExpect(jsonPath("$.accentColor").value("#c5a567"));

        verify(service).getSettings();
    }
}