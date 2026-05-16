package com.portfolio.portfolio_backend.application.service;

import org.springframework.stereotype.Service;
import com.portfolio.portfolio_backend.application.port.in.HealthUseCase;

@Service
public class HealthService implements HealthUseCase {

    @Override
    public String check() {
        return "OK";
    }
}