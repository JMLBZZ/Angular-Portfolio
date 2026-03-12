package com.portfolio.portfolio_backend.infrastructure.persistence.mapper;

import com.portfolio.portfolio_backend.domain.model.LocalizedText;
import com.portfolio.portfolio_backend.domain.model.Project;
import com.portfolio.portfolio_backend.infrastructure.persistence.entity.ProjectEntity;
import org.springframework.stereotype.Component;

@Component
public class ProjectMapper {

    public ProjectEntity toEntity(Project project) {

        if (project == null) {
            return null;
        }

        return new ProjectEntity(
                project.getId(),
                project.getSlug(),
                project.getTitle(),
                project.getCategory(),
                project.getImage(),
                project.getCover(),
                project.getImages(),
                getFr(project.getDescription()),
                getEn(project.getDescription()),
                getFr(project.getLongDescription()),
                getEn(project.getLongDescription()),
                project.getStack(),
                project.getType(),
                project.isFeatured(),
                getFr(project.getRole()),
                getEn(project.getRole()),
                getFr(project.getProblem()),
                getEn(project.getProblem()),
                getFr(project.getSolution()),
                getEn(project.getSolution()),
                project.getDemoUrl(),
                project.getTags(),
                project.getGithubUrl(),
                project.isShowGithub(),
                project.isPublished(),
                project.getDisplayOrder(),
                project.getCreatedAt()
        );
    }

    public Project toDomain(ProjectEntity entity) {

        if (entity == null) {
            return null;
        }

        return new Project(
                entity.getId(),
                entity.getSlug(),
                entity.getTitle(),
                entity.getCategory(),
                entity.getImage(),
                entity.getCover(),
                entity.getImages(),
                new LocalizedText(entity.getDescriptionFr(), entity.getDescriptionEn()),
                toLocalizedText(entity.getLongDescriptionFr(), entity.getLongDescriptionEn()),
                entity.getStack(),
                entity.getType(),
                entity.isFeatured(),
                toLocalizedText(entity.getRoleFr(), entity.getRoleEn()),
                toLocalizedText(entity.getProblemFr(), entity.getProblemEn()),
                toLocalizedText(entity.getSolutionFr(), entity.getSolutionEn()),
                entity.getDemoUrl(),
                entity.getTags(),
                entity.getGithubUrl(),
                entity.isShowGithub(),
                entity.isPublished(),
                entity.getDisplayOrder(),
                entity.getCreatedAt()
        );
    }

    private LocalizedText toLocalizedText(String fr, String en) {
        if (isBlank(fr) && isBlank(en)) {
            return null;
        }
        return new LocalizedText(fr, en);
    }

    private String getFr(LocalizedText text) {
        return text != null ? text.getFr() : null;
    }

    private String getEn(LocalizedText text) {
        return text != null ? text.getEn() : null;
    }

    private boolean isBlank(String value) {
        return value == null || value.isBlank();
    }
}