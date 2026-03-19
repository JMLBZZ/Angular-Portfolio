package com.portfolio.portfolio_backend.domain.port.out;

import com.portfolio.portfolio_backend.domain.model.HeroCard;

import java.util.Optional;

public interface HeroCardRepositoryPort {

    Optional<HeroCard> find();

    HeroCard save(HeroCard heroCard);
}