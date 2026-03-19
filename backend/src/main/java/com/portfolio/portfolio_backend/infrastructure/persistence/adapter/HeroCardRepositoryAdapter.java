package com.portfolio.portfolio_backend.infrastructure.persistence.adapter;

import com.portfolio.portfolio_backend.domain.model.HeroCard;
import com.portfolio.portfolio_backend.domain.port.out.HeroCardRepositoryPort;
import com.portfolio.portfolio_backend.infrastructure.persistence.mapper.HeroCardMapper;
import com.portfolio.portfolio_backend.infrastructure.persistence.repository.JpaHeroCardRepository;
import org.springframework.stereotype.Component;

import java.util.Optional;

@Component
public class HeroCardRepositoryAdapter implements HeroCardRepositoryPort {

    private static final Long SINGLETON_ID = 1L;

    private final JpaHeroCardRepository repository;
    private final HeroCardMapper mapper;

    public HeroCardRepositoryAdapter(
            JpaHeroCardRepository repository,
            HeroCardMapper mapper
    ) {
        this.repository = repository;
        this.mapper = mapper;
    }

    @Override
    public Optional<HeroCard> find() {
        return repository.findById(SINGLETON_ID).map(mapper::toDomain);
    }

    @Override
    public HeroCard save(HeroCard heroCard) {
        return mapper.toDomain(repository.save(mapper.toEntity(heroCard)));
    }
}