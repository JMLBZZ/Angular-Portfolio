package com.portfolio.portfolio_backend.infrastructure.web.controller;

import com.portfolio.portfolio_backend.application.service.ProjectService;
import com.portfolio.portfolio_backend.domain.exception.ResourceNotFoundException;
import com.portfolio.portfolio_backend.domain.model.Project;
import com.portfolio.portfolio_backend.infrastructure.security.JwtAuthenticationFilter;
import com.portfolio.portfolio_backend.infrastructure.security.JwtService;
import com.portfolio.portfolio_backend.web.controller.ProjectController;

import org.junit.jupiter.api.Test;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.boot.test.autoconfigure.web.servlet.AutoConfigureMockMvc;
import org.springframework.boot.test.autoconfigure.web.servlet.WebMvcTest;
import org.springframework.test.context.bean.override.mockito.MockitoBean;
import org.springframework.test.web.servlet.MockMvc;

import java.time.LocalDate;
import java.util.Optional;
import java.util.UUID;

import static org.mockito.Mockito.when;
import static org.springframework.test.web.servlet.request.MockMvcRequestBuilders.get;
import static org.springframework.test.web.servlet.result.MockMvcResultMatchers.*;

@WebMvcTest(ProjectController.class)
@AutoConfigureMockMvc(addFilters = false) // Désactive Spring security dans ce test
class ProjectControllerTest {

        @Autowired
        private MockMvc mockMvc;// Simule http requête

        @MockitoBean
        private ProjectService service;

        @MockitoBean
        private JwtService jwtService;

        @MockitoBean
        private JwtAuthenticationFilter jwtAuthenticationFilter;

        @Test
        void shouldReturnProjectWhenIdExists() throws Exception {

                UUID id = UUID.randomUUID();

                Project project = new Project(
                                id,
                                "Test Project",
                                "Description",
                                "github",
                                "live",
                                LocalDate.now());

                when(service.getById(id))
                                .thenReturn(Optional.of(project));

                mockMvc.perform(get("/projects/{id}", id))
                                .andExpect(status().isOk())
                                .andExpect(jsonPath("$.title").value("Test Project"))// jsonpath : vérifie le json retourné
                                .andExpect(jsonPath("$.description").value("Description"));
        }

        @Test
        void shouldReturn404WhenProjectDoesNotExist() throws Exception {

                UUID id = UUID.randomUUID();

                when(service.getById(id))
                                .thenReturn(Optional.empty());

                mockMvc.perform(get("/projects/{id}", id))
                                .andExpect(status().isNotFound());
        }
}
