package com.portfolio.portfolio_backend.infrastructure.persistence.adapter;

import com.portfolio.portfolio_backend.domain.model.LegalContent;
import com.portfolio.portfolio_backend.domain.port.out.LegalContentRepositoryPort;
import com.portfolio.portfolio_backend.infrastructure.persistence.mapper.LegalContentMapper;
import com.portfolio.portfolio_backend.infrastructure.persistence.repository.JpaLegalContentRepository;
import org.springframework.stereotype.Component;

import java.util.Optional;

@Component
public class LegalContentRepositoryAdapter implements LegalContentRepositoryPort {

    private static final Long SINGLETON_ID = 1L;

    private final JpaLegalContentRepository repository;
    private final LegalContentMapper mapper;

    public LegalContentRepositoryAdapter(
            JpaLegalContentRepository repository,
            LegalContentMapper mapper
    ) {
        this.repository = repository;
        this.mapper = mapper;
    }

    @Override
    public Optional<LegalContent> find() {
        return repository.findById(SINGLETON_ID).map(mapper::toDomain);
    }

    @Override
    public LegalContent save(LegalContent legalContent) {
        return mapper.toDomain(repository.save(mapper.toEntity(legalContent)));
    }
}