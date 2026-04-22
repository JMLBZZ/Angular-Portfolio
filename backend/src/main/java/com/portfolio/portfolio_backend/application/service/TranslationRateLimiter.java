package com.portfolio.portfolio_backend.application.service;

import com.portfolio.portfolio_backend.application.exception.RateLimitException;
import com.portfolio.portfolio_backend.infrastructure.config.TranslationRateLimitProperties;
import org.springframework.stereotype.Service;

import java.time.Instant;
import java.util.ArrayDeque;
import java.util.Deque;
import java.util.Map;
import java.util.concurrent.ConcurrentHashMap;

@Service
public class TranslationRateLimiter {

    private final TranslationRateLimitProperties properties;
    private final Map<String, Deque<Long>> requestsByUser = new ConcurrentHashMap<>();

    public TranslationRateLimiter(TranslationRateLimitProperties properties) {
        this.properties = properties;
    }

    public void checkLimit(String userKey) {
        if (!properties.enabled()) {
            return;
        }

        if (userKey == null || userKey.isBlank()) {
            throw new RateLimitException("Impossible d’identifier l’utilisateur pour la limitation de traduction.");
        }

        long now = Instant.now().getEpochSecond();
        long windowStart = now - properties.windowSeconds();

        Deque<Long> requestTimestamps = requestsByUser.computeIfAbsent(
                userKey.trim().toLowerCase(),
                key -> new ArrayDeque<>()
        );

        synchronized (requestTimestamps) {
            while (!requestTimestamps.isEmpty() && requestTimestamps.peekFirst() <= windowStart) {
                requestTimestamps.pollFirst();
            }

            if (requestTimestamps.size() >= properties.maxRequests()) {
                throw new RateLimitException(
                        "Trop de demandes de traduction en peu de temps. Réessaie dans quelques secondes."
                );
            }

            requestTimestamps.addLast(now);
        }

        cleanupEmptyQueues();
    }

    private void cleanupEmptyQueues() {
        requestsByUser.entrySet().removeIf(entry -> {
            Deque<Long> timestamps = entry.getValue();

            synchronized (timestamps) {
                return timestamps.isEmpty();
            }
        });
    }
}