package com.portfolio.portfolio_backend.infrastructure.persistence.adapter;

import com.portfolio.portfolio_backend.domain.model.AboutContent;
import com.portfolio.portfolio_backend.domain.port.out.AboutContentRepositoryPort;
import com.portfolio.portfolio_backend.infrastructure.persistence.mapper.AboutContentMapper;
import com.portfolio.portfolio_backend.infrastructure.persistence.repository.JpaAboutContentRepository;
import org.springframework.stereotype.Component;

import java.util.Optional;

@Component
public class AboutContentRepositoryAdapter implements AboutContentRepositoryPort {

    private static final Long SINGLETON_ID = 1L;

    private final JpaAboutContentRepository repository;
    private final AboutContentMapper mapper;

    public AboutContentRepositoryAdapter(
            JpaAboutContentRepository repository,
            AboutContentMapper mapper
    ) {
        this.repository = repository;
        this.mapper = mapper;
    }

    @Override
    public Optional<AboutContent> find() {
        return repository.findById(SINGLETON_ID).map(mapper::toDomain);
    }

    @Override
    public AboutContent save(AboutContent aboutContent) {
        return mapper.toDomain(repository.save(mapper.toEntity(aboutContent)));
    }
}