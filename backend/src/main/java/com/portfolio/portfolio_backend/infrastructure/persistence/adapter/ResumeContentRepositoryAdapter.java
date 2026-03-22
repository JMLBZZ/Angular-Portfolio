package com.portfolio.portfolio_backend.infrastructure.persistence.adapter;

import com.portfolio.portfolio_backend.domain.model.ResumeContent;
import com.portfolio.portfolio_backend.domain.port.out.ResumeContentRepositoryPort;
import com.portfolio.portfolio_backend.infrastructure.persistence.mapper.ResumeContentMapper;
import com.portfolio.portfolio_backend.infrastructure.persistence.repository.JpaResumeContentRepository;
import org.springframework.stereotype.Component;

import java.util.Optional;

@Component
public class ResumeContentRepositoryAdapter implements ResumeContentRepositoryPort {

    private static final Long SINGLETON_ID = 1L;

    private final JpaResumeContentRepository repository;
    private final ResumeContentMapper mapper;

    public ResumeContentRepositoryAdapter(
            JpaResumeContentRepository repository,
            ResumeContentMapper mapper
    ) {
        this.repository = repository;
        this.mapper = mapper;
    }

    @Override
    public Optional<ResumeContent> find() {
        return repository.findById(SINGLETON_ID).map(mapper::toDomain);
    }

    @Override
    public ResumeContent save(ResumeContent resumeContent) {
        return mapper.toDomain(
                repository.save(mapper.toEntity(resumeContent))
        );
    }
}