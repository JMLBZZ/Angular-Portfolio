package com.portfolio.portfolio_backend.application.service;

import com.portfolio.portfolio_backend.domain.model.LocalizedText;
import com.portfolio.portfolio_backend.domain.model.Project;
import com.portfolio.portfolio_backend.domain.port.out.ProjectRepositoryPort;

import org.junit.jupiter.api.BeforeEach;
import org.junit.jupiter.api.Test;
import org.junit.jupiter.api.extension.ExtendWith;

import org.mockito.InjectMocks;
import org.mockito.Mock;
import org.mockito.junit.jupiter.MockitoExtension;

import java.time.LocalDate;
import java.util.List;
import java.util.Optional;
import java.util.UUID;

import static org.assertj.core.api.Assertions.assertThat;
import static org.mockito.ArgumentMatchers.any;
import static org.mockito.Mockito.*;

@ExtendWith(MockitoExtension.class)
class ProjectServiceTest {

    @Mock
    private ProjectRepositoryPort repository;

    @Mock
    private ProjectImageStorageService projectImageStorageService;

    @InjectMocks
    private ProjectService service;

    private UUID projectId;
    private Project project;

    @BeforeEach
    void setUp() {
        projectId = UUID.randomUUID();
        project = buildProject(projectId);
    }

    @Test
    void shouldReturnProjectWhenIdExists() {
        when(repository.findById(projectId))
                .thenReturn(Optional.of(project));

        Optional<Project> result = service.getById(projectId);

        assertThat(result).isPresent();
        assertThat(result.get().getTitle()).isEqualTo("Test Project");

        verify(repository, times(1)).findById(projectId);
    }

    @Test
    void shouldReturnEmptyWhenProjectDoesNotExist() {
        when(repository.findById(projectId))
                .thenReturn(Optional.empty());

        Optional<Project> result = service.getById(projectId);

        assertThat(result).isEmpty();
        verify(repository, times(1)).findById(projectId);
    }

    @Test
    void shouldCreateProject() {
        when(repository.save(any(Project.class)))
                .thenReturn(project);

        Project result = service.create(project);

        assertThat(result.getTitle()).isEqualTo("Test Project");
        assertThat(result.getDescription().getFr()).isEqualTo("Description FR");
        verify(repository, times(1)).save(any(Project.class));
    }

    @Test
    void shouldDeleteProject() {
        when(repository.findById(projectId))
                .thenReturn(Optional.of(project));

        service.delete(projectId);

        verify(repository, times(1)).findById(projectId);
        verify(repository, times(1)).deleteById(projectId);
        verify(projectImageStorageService, times(1)).delete("/assets/projects/test.jpg");
        verify(projectImageStorageService, times(1)).delete("/assets/projects/test-cover.jpg");
        verify(projectImageStorageService, times(1)).delete("/assets/projects/test-1.jpg");
        verify(projectImageStorageService, times(1)).delete("/assets/projects/test-2.jpg");
    }

    private Project buildProject(UUID id) {
        return new Project(
                id,
                "test-project",
                "Test Project",
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
                true,
                1,
                LocalDate.now()
        );
    }
}