package com.portfolio.portfolio_backend.infrastructure.persistence.adapter;

import com.portfolio.portfolio_backend.domain.model.Hero;
import com.portfolio.portfolio_backend.domain.port.out.HeroRepositoryPort;
import com.portfolio.portfolio_backend.infrastructure.persistence.mapper.HeroMapper;
import com.portfolio.portfolio_backend.infrastructure.persistence.repository.JpaHeroRepository;
import org.springframework.stereotype.Component;

import java.util.Optional;

@Component
public class HeroRepositoryAdapter implements HeroRepositoryPort {

    private static final Long SINGLETON_ID = 1L;

    private final JpaHeroRepository repository;
    private final HeroMapper mapper;

    public HeroRepositoryAdapter(
            JpaHeroRepository repository,
            HeroMapper mapper
    ) {
        this.repository = repository;
        this.mapper = mapper;
    }

    @Override
    public Optional<Hero> find() {
        return repository.findById(SINGLETON_ID).map(mapper::toDomain);
    }

    @Override
    public Hero save(Hero hero) {
        return mapper.toDomain(repository.save(mapper.toEntity(hero)));
    }
}