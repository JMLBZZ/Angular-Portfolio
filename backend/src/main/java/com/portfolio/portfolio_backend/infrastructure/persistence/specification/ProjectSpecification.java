package com.portfolio.portfolio_backend.infrastructure.persistence.specification;

import com.portfolio.portfolio_backend.infrastructure.persistence.entity.ProjectEntity;
import org.springframework.data.jpa.domain.Specification;

import java.time.LocalDate;

public class ProjectSpecification {

    public static Specification<ProjectEntity> hasGithub(Boolean hasGithub) {
        return (root, query, cb) -> {
            if (hasGithub == null)
                return null;

            if (hasGithub) {
                return cb.isNotNull(root.get("githubUrl"));
            } else {
                return cb.isNull(root.get("githubUrl"));
            }
        };
    }

    public static Specification<ProjectEntity> hasLive(Boolean hasLive) {
        return (root, query, cb) -> {
            if (hasLive == null)
                return null;

            if (hasLive) {
                return cb.isNotNull(root.get("liveUrl"));
            } else {
                return cb.isNull(root.get("liveUrl"));
            }
        };
    }

    public static Specification<ProjectEntity> createdAfter(LocalDate date) {
        return (root, query, cb) -> {
            if (date == null)
                return null;

            return cb.greaterThanOrEqualTo(root.get("createdAt"), date);
        };
    }

    public static Specification<ProjectEntity> containsText(String search) {
        return (root, query, cb) -> {
            if (search == null || search.isBlank())
                return null;

            String pattern = "%" + search.toLowerCase() + "%";

            return cb.or(
                    cb.like(cb.lower(root.get("title")), pattern),
                    cb.like(cb.lower(root.get("description")), pattern));
        };
    }
}
