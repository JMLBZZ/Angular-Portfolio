package com.portfolio.portfolio_backend.infrastructure.persistence.mapper;

import com.portfolio.portfolio_backend.domain.model.Project;
import com.portfolio.portfolio_backend.infrastructure.persistence.entity.ProjectEntity;
import org.springframework.stereotype.Component;

@Component
public class ProjectMapper {

    public ProjectEntity toEntity(Project project) {

        if (project == null) return null;

        return new ProjectEntity(
                project.getId(),
                project.getTitle(),
                project.getDescription(),
                project.getGithubUrl(),
                project.getLiveUrl(),
                project.getCreatedAt()
        );
    }

    public Project toDomain(ProjectEntity entity) {

        if (entity == null) return null;

        return new Project(
                entity.getId(),
                entity.getTitle(),
                entity.getDescription(),
                entity.getGithubUrl(),
                entity.getLiveUrl(),
                entity.getCreatedAt()
        );
    }
}
