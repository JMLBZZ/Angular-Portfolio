package com.portfolio.portfolio_backend.infrastructure.persistence.adaptater;

import com.portfolio.portfolio_backend.domain.model.Project;
import com.portfolio.portfolio_backend.domain.port.out.ProjectRepositoryPort;
import com.portfolio.portfolio_backend.infrastructure.persistence.entity.ProjectEntity;
import com.portfolio.portfolio_backend.infrastructure.persistence.repository.JpaProjectRepository;
import org.springframework.stereotype.Component;

import java.util.List;
import java.util.Optional;
import java.util.UUID;
import java.util.stream.Collectors;

@Component
public class ProjectRepositoryAdapter implements ProjectRepositoryPort {

    private final JpaProjectRepository repository;

    public ProjectRepositoryAdapter(JpaProjectRepository repository) {
        this.repository = repository;
    }

    @Override
    public Project save(Project project) {

        ProjectEntity entity = new ProjectEntity(
                project.getId(),
                project.getTitle(),
                project.getDescription(),
                project.getGithubUrl(),
                project.getLiveUrl(),
                project.getCreatedAt()
        );

        ProjectEntity saved = repository.save(entity);

        return new Project(
                saved.getId(),
                saved.getTitle(),
                saved.getDescription(),
                saved.getGithubUrl(),
                saved.getLiveUrl(),
                saved.getCreatedAt()
        );
    }

    @Override
    public Optional<Project> findById(UUID id) {
        return repository.findById(id)
                .map(e -> new Project(
                        e.getId(),
                        e.getTitle(),
                        e.getDescription(),
                        e.getGithubUrl(),
                        e.getLiveUrl(),
                        e.getCreatedAt()
                ));
    }

    @Override
    public List<Project> findAll() {
        return repository.findAll()
                .stream()
                .map(e -> new Project(
                        e.getId(),
                        e.getTitle(),
                        e.getDescription(),
                        e.getGithubUrl(),
                        e.getLiveUrl(),
                        e.getCreatedAt()
                ))
                .collect(Collectors.toList());
    }

    @Override
    public void deleteById(UUID id) {
        repository.deleteById(id);
    }
}
