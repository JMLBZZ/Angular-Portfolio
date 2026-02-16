package com.portfolio.portfolio_backend.application.service;

import com.portfolio.portfolio_backend.domain.model.Project;
import com.portfolio.portfolio_backend.domain.port.out.ProjectRepositoryPort;
//import com.portfolio.portfolio_backend.infrastructure.persistence.entity.ProjectEntity;
import com.portfolio.portfolio_backend.infrastructure.persistence.entity.ProjectEntity;

import org.junit.jupiter.api.BeforeEach;
import org.junit.jupiter.api.Test;
import org.junit.jupiter.api.extension.ExtendWith;

import org.mockito.InjectMocks;
import org.mockito.Mock;
import org.mockito.junit.jupiter.MockitoExtension;

import java.time.LocalDate;
import java.util.Optional;
import java.util.UUID;

import static org.assertj.core.api.Assertions.assertThat;
import static org.mockito.ArgumentMatchers.any;
import static org.mockito.Mockito.*;

@ExtendWith(MockitoExtension.class)
class ProjectServiceTest {

    @Mock//Simule le repository
    private ProjectRepositoryPort repository;

    @InjectMocks//Injecte le mock dans le service
    private ProjectService service;

    private UUID projectId;
    //private ProjectEntity entity;
    private Project project;

    @BeforeEach
    void setUp() {
        projectId = UUID.randomUUID();

        project = new Project(
            projectId,
            "Test Project",
            "Description",
            "github",
            "live",
            LocalDate.now()
        );

    }

    @Test
    void shouldReturnProjectWhenIdExists() {
        // GIVEN
        when(repository.findById(projectId))
                .thenReturn(Optional.of(project));//Simule le comportement

        // WHEN
        Optional<Project> result = service.getById(projectId);

        // THEN
        assertThat(result).isPresent();
        assertThat(result.get().getTitle()).isEqualTo("Test Project");

        verify(repository, times(1)).findById(projectId);//Vérifie que la méthode a été appelée
    }

    @Test
    void shouldReturnEmptyWhenProjectDoesNotExist() {
        // GIVEN
        when(repository.findById(projectId))
                .thenReturn(Optional.empty());

        // WHEN
        Optional<Project> result = service.getById(projectId);

        // THEN
        assertThat(result).isEmpty();
        verify(repository, times(1)).findById(projectId);
    }

    @Test
    void shouldCreateProject() {
        // GIVEN
        Project project = new Project(
                projectId,
                "Test Project",
                "Description",
                "github",
                "live",
                LocalDate.now()
        );

        when(repository.save(any(Project.class)))
        .thenReturn(project);


        // WHEN
        Project result = service.create(project);

        // THEN
        assertThat(result.getTitle()).isEqualTo("Test Project");
        verify(repository, times(1)).save(any(Project.class));
    }

    @Test
    void shouldDeleteProject() {
        // WHEN
        service.delete(projectId);

        // THEN
        verify(repository, times(1)).deleteById(projectId);
    }
}
