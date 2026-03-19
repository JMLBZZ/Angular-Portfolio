package com.portfolio.portfolio_backend.infrastructure.persistence.adapter;

import com.portfolio.portfolio_backend.domain.model.Hero;
import com.portfolio.portfolio_backend.domain.port.out.HeroRepositoryPort;
import com.portfolio.portfolio_backend.infrastructure.persistence.entity.HeroEntity;
import com.portfolio.portfolio_backend.infrastructure.persistence.entity.HeroTechBadgeEntity;
import com.portfolio.portfolio_backend.infrastructure.persistence.mapper.HeroMapper;
import com.portfolio.portfolio_backend.infrastructure.persistence.repository.JpaHeroRepository;
import com.portfolio.portfolio_backend.infrastructure.persistence.repository.JpaHeroTechBadgeRepository;
import org.springframework.stereotype.Component;

import java.util.List;
import java.util.Optional;

@Component
public class HeroRepositoryAdapter implements HeroRepositoryPort {

    private static final Long SINGLETON_ID = 1L;

    private final JpaHeroRepository repository;
    private final JpaHeroTechBadgeRepository heroTechBadgeRepository;
    private final HeroMapper mapper;

    public HeroRepositoryAdapter(
            JpaHeroRepository repository,
            JpaHeroTechBadgeRepository heroTechBadgeRepository,
            HeroMapper mapper
    ) {
        this.repository = repository;
        this.heroTechBadgeRepository = heroTechBadgeRepository;
        this.mapper = mapper;
    }

    @Override
    public Optional<Hero> find() {
        Optional<HeroEntity> heroEntity = repository.findById(SINGLETON_ID);
        if (heroEntity.isEmpty()) {
            return Optional.empty();
        }

        List<HeroTechBadgeEntity> badgeEntities =
                heroTechBadgeRepository.findAllByOrderByDisplayOrderAscIdAsc();

        return Optional.of(mapper.toDomain(heroEntity.get(), badgeEntities));
    }

    @Override
    public Hero save(Hero hero) {
        HeroEntity savedHeroEntity = repository.save(mapper.toEntity(hero));

        heroTechBadgeRepository.deleteAll();

        List<HeroTechBadgeEntity> badgeEntities = hero.getTechBadges() == null
                ? List.of()
                : hero.getTechBadges().stream()
                    .map(mapper::toBadgeEntity)
                    .map(entity -> new HeroTechBadgeEntity(
                            null,
                            entity.getLabel(),
                            entity.getDisplayOrder()
                    ))
                    .toList();

        List<HeroTechBadgeEntity> savedBadgeEntities = heroTechBadgeRepository.saveAll(badgeEntities);

        return mapper.toDomain(savedHeroEntity, savedBadgeEntities);
    }
}