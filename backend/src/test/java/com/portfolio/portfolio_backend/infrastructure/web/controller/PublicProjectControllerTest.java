package com.portfolio.portfolio_backend.infrastructure.web.controller;

import com.portfolio.portfolio_backend.application.service.ProjectService;
import com.portfolio.portfolio_backend.domain.model.LocalizedText;
import com.portfolio.portfolio_backend.domain.model.Project;
import com.portfolio.portfolio_backend.infrastructure.security.JwtAuthenticationFilter;
import com.portfolio.portfolio_backend.infrastructure.security.JwtService;
import com.portfolio.portfolio_backend.web.controller.PublicProjectController;

import org.junit.jupiter.api.Test;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.boot.test.autoconfigure.web.servlet.AutoConfigureMockMvc;
import org.springframework.boot.test.autoconfigure.web.servlet.WebMvcTest;
import org.springframework.test.context.bean.override.mockito.MockitoBean;
import org.springframework.test.web.servlet.MockMvc;

import java.time.LocalDate;
import java.util.List;
import java.util.Optional;
import java.util.UUID;

import static org.mockito.Mockito.when;
import static org.springframework.test.web.servlet.request.MockMvcRequestBuilders.get;
import static org.springframework.test.web.servlet.result.MockMvcResultMatchers.*;

@WebMvcTest(PublicProjectController.class)
@AutoConfigureMockMvc(addFilters = false)
class PublicProjectControllerTest {

    @Autowired
    private MockMvc mockMvc;

    @MockitoBean
    private ProjectService service;

    @MockitoBean
    private JwtService jwtService;

    @MockitoBean
    private JwtAuthenticationFilter jwtAuthenticationFilter;

    @Test
    void shouldReturnPublishedProjects() throws Exception {
        Project project = buildProject(UUID.randomUUID(), "portfolio-angular", true);

        when(service.getPublishedProjects()).thenReturn(List.of(project));

        mockMvc.perform(get("/api/public/projects"))
                .andExpect(status().isOk())
                .andExpect(jsonPath("$[0].slug").value("portfolio-angular"))
                .andExpect(jsonPath("$[0].title").value("Portfolio Angular"))
                .andExpect(jsonPath("$[0].published").value(true));
    }

    @Test
    void shouldReturnPublishedProjectBySlug() throws Exception {
        Project project = buildProject(UUID.randomUUID(), "portfolio-angular", true);

        when(service.getPublishedProjectBySlug("portfolio-angular"))
                .thenReturn(Optional.of(project));

        mockMvc.perform(get("/api/public/projects/portfolio-angular"))
                .andExpect(status().isOk())
                .andExpect(jsonPath("$.slug").value("portfolio-angular"))
                .andExpect(jsonPath("$.title").value("Portfolio Angular"))
                .andExpect(jsonPath("$.description.fr").value("Description FR"))
                .andExpect(jsonPath("$.description.en").value("Description EN"));
    }

    @Test
    void shouldReturn404WhenPublishedProjectDoesNotExist() throws Exception {
        when(service.getPublishedProjectBySlug("inexistant"))
                .thenReturn(Optional.empty());

        mockMvc.perform(get("/api/public/projects/inexistant"))
                .andExpect(status().isNotFound());
    }

    private Project buildProject(UUID id, String slug, boolean published) {
        return new Project(
                id,
                slug,
                "Portfolio Angular",
                "fullstack",
                "/assets/projects/test.jpg",
                "/assets/projects/test-cover.jpg",
                List.of(
                        "/assets/projects/test-1.jpg",
                        "/assets/projects/test-2.jpg"
                ),
                new LocalizedText("Description FR", "Description EN"),
                new LocalizedText("Long description FR", "Long description EN"),
                List.of("Angular", "Spring Boot", "PostgreSQL"),
                "personal",
                true,
                new LocalizedText("Développeur Full-Stack", "Full-Stack Developer"),
                new LocalizedText("Problème FR", "Problem EN"),
                new LocalizedText("Solution FR", "Solution EN"),
                "https://demo.test",
                List.of("Angular", "Java", "JWT"),
                "https://github.com/test/project",
                true,
                published,
                1,
                LocalDate.now()
        );
    }
}