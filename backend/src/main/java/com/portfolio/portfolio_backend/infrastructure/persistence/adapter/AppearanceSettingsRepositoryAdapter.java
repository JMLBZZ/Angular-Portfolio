package com.portfolio.portfolio_backend.infrastructure.persistence.adapter;

import com.portfolio.portfolio_backend.domain.model.AppearanceSettings;
import com.portfolio.portfolio_backend.domain.port.out.AppearanceSettingsRepositoryPort;
import com.portfolio.portfolio_backend.infrastructure.persistence.mapper.AppearanceSettingsMapper;
import com.portfolio.portfolio_backend.infrastructure.persistence.repository.JpaAppearanceSettingsRepository;
import org.springframework.stereotype.Component;

import java.util.Optional;

@Component
public class AppearanceSettingsRepositoryAdapter implements AppearanceSettingsRepositoryPort {

    private static final Long SINGLETON_ID = 1L;

    private final JpaAppearanceSettingsRepository repository;
    private final AppearanceSettingsMapper mapper;

    public AppearanceSettingsRepositoryAdapter(
            JpaAppearanceSettingsRepository repository,
            AppearanceSettingsMapper mapper
    ) {
        this.repository = repository;
        this.mapper = mapper;
    }

    @Override
    public Optional<AppearanceSettings> find() {
        return repository.findById(SINGLETON_ID).map(mapper::toDomain);
    }

    @Override
    public AppearanceSettings save(AppearanceSettings appearanceSettings) {
        return mapper.toDomain(repository.save(mapper.toEntity(appearanceSettings)));
    }
}