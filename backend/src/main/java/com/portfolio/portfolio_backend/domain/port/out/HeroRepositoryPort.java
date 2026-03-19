package com.portfolio.portfolio_backend.domain.port.out;

import com.portfolio.portfolio_backend.domain.model.Hero;

import java.util.Optional;

public interface HeroRepositoryPort {

    Optional<Hero> find();

    Hero save(Hero hero);
}