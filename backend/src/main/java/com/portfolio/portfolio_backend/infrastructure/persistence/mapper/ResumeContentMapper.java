package com.portfolio.portfolio_backend.infrastructure.persistence.mapper;

import com.portfolio.portfolio_backend.domain.model.ResumeContent;
import com.portfolio.portfolio_backend.infrastructure.persistence.entity.ResumeContentEntity;
import org.springframework.stereotype.Component;

@Component
public class ResumeContentMapper {

    public ResumeContentEntity toEntity(ResumeContent resumeContent) {
        if (resumeContent == null) {
            return null;
        }

        return new ResumeContentEntity(
                1L,
                resumeContent.getFileUrl(),
                resumeContent.getOriginalFileName()
        );
    }

    public ResumeContent toDomain(ResumeContentEntity entity) {
        if (entity == null) {
            return null;
        }

        return new ResumeContent(
                entity.getFileUrl(),
                entity.getOriginalFileName()
        );
    }
}