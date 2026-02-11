package com.portfolio.portfolio_backend.adapter.in.web;

import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RestController;

import com.portfolio.portfolio_backend.application.port.in.HealthUseCase;

@RestController
public class HealthController {

    private final HealthUseCase healthUseCase;

    public HealthController(HealthUseCase healthUseCase) {
        this.healthUseCase = healthUseCase;
    }

    @GetMapping("/api/health")
    public String health() {
        return healthUseCase.check();
    }
}
