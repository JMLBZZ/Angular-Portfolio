package com.portfolio.portfolio_backend.domain.port.out;

import com.portfolio.portfolio_backend.domain.model.Project;

import java.util.List;
import java.util.Optional;
import java.util.UUID;

public interface ProjectRepositoryPort {

    List<Project> findAll();

    Optional<Project> findById(UUID id);

    Project save(Project project);

    void deleteById(UUID id);
}
