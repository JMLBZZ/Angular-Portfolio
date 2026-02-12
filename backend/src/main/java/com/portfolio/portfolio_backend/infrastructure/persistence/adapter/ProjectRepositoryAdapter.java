package com.portfolio.portfolio_backend.infrastructure.persistence.adapter;

import com.portfolio.portfolio_backend.domain.model.Project;
import com.portfolio.portfolio_backend.domain.port.out.ProjectRepositoryPort;
import com.portfolio.portfolio_backend.infrastructure.persistence.entity.ProjectEntity;
import com.portfolio.portfolio_backend.infrastructure.persistence.mapper.ProjectMapper;
import com.portfolio.portfolio_backend.infrastructure.persistence.repository.JpaProjectRepository;
import org.springframework.stereotype.Component;

import java.util.List;
import java.util.Optional;
import java.util.UUID;

@Component
public class ProjectRepositoryAdapter implements ProjectRepositoryPort {

    private final JpaProjectRepository repository;
    private final ProjectMapper mapper;

    public ProjectRepositoryAdapter(
            JpaProjectRepository repository,
            ProjectMapper mapper
    ) {
        this.repository = repository;
        this.mapper = mapper;
    }

    @Override
    public Project save(Project project) {

        ProjectEntity entity = mapper.toEntity(project);
        ProjectEntity saved = repository.save(entity);

        return mapper.toDomain(saved);
    }

    @Override
    public Optional<Project> findById(UUID id) {

        return repository.findById(id)
                .map(mapper::toDomain);
    }

    @Override
    public List<Project> findAll() {

        return repository.findAll()
                .stream()
                .map(mapper::toDomain)
                .toList();
    }

    @Override
    public void deleteById(UUID id) {
        repository.deleteById(id);
    }
}
