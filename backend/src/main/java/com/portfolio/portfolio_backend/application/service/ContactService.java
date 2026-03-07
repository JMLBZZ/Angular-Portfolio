package com.portfolio.portfolio_backend.application.service;

import com.portfolio.portfolio_backend.application.exception.RateLimitException;
import com.portfolio.portfolio_backend.application.exception.SpamDetectedException;
import com.portfolio.portfolio_backend.web.dto.ContactRequestDTO;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.mail.SimpleMailMessage;
import org.springframework.mail.javamail.JavaMailSender;
import org.springframework.stereotype.Service;

import java.time.Duration;
import java.time.Instant;
import java.util.Map;
import java.util.concurrent.ConcurrentHashMap;

@Service
public class ContactService {

    private static final Logger logger = LoggerFactory.getLogger(ContactService.class);

    private static final Duration COOLDOWN = Duration.ofSeconds(30);

    private final JavaMailSender mailSender;

    @Value("${app.contact.to}")
    private String to;

    @Value("${app.contact.from}")
    private String from;

    private final Map<String, Instant> lastSentByIp = new ConcurrentHashMap<>();

    public ContactService(JavaMailSender mailSender) {
        this.mailSender = mailSender;
    }

    public void send(ContactRequestDTO dto, String clientIp) {
        String safeIp = normalizeIp(clientIp);

        logger.info("Contact request received from IP={}", safeIp);

        checkHoneypot(dto);
        checkRateLimit(safeIp);

        String name = sanitize(dto.getName(), 80);
        String email = sanitize(dto.getEmail(), 120);
        String subject = sanitize(dto.getSubject(), 120);
        String message = sanitize(dto.getMessage(), 4000);

        String safeFrom = buildSafeFrom();
        String safeReplyTo = buildSafeReplyTo(email, safeFrom);

        String fullSubject = "[Portfolio] " + subject;

        String body = """
                Nouveau message via le portfolio

                Nom: %s
                Email: %s
                IP: %s

                Message:
                %s
                """.formatted(name, email, safeIp, message);

        SimpleMailMessage mail = new SimpleMailMessage();
        mail.setTo(to);
        mail.setFrom(safeFrom);
        mail.setReplyTo(safeReplyTo);
        mail.setSubject(fullSubject);
        mail.setText(body);

        mailSender.send(mail);

        logger.info("Contact email successfully sent for IP={}", safeIp);
    }

    private void checkHoneypot(ContactRequestDTO dto) {
        if (dto.getWebsite() != null && !dto.getWebsite().trim().isEmpty()) {
            logger.warn("Spam detected via honeypot field");
            throw new SpamDetectedException("Spam detected");
        }
    }

    private void checkRateLimit(String clientIp) {
        Instant now = Instant.now();
        Instant lastSentAt = lastSentByIp.get(clientIp);

        if (lastSentAt != null) {
            Duration elapsed = Duration.between(lastSentAt, now);

            if (elapsed.compareTo(COOLDOWN) < 0) {
                logger.warn("Rate limit exceeded for IP={}", clientIp);
                throw new RateLimitException("Too many requests");
            }
        }

        lastSentByIp.put(clientIp, now);
    }

    private String normalizeIp(String clientIp) {
        if (clientIp == null || clientIp.isBlank()) {
            return "unknown";
        }
        return clientIp.trim();
    }

    private String buildSafeFrom() {
        if (from == null || from.isBlank()) {
            return "no-reply@localhost.localdomain";
        }
        return from.trim();
    }

    private String buildSafeReplyTo(String email, String fallback) {
        if (email == null || email.isBlank()) {
            return fallback;
        }
        return email.trim();
    }

    private String sanitize(String input, int maxLength) {
        if (input == null) {
            return "";
        }

        String sanitized = input
                .replaceAll("[\\p{Cntrl}&&[^\r\n\t]]", "")
                .trim();

        if (sanitized.length() > maxLength) {
            sanitized = sanitized.substring(0, maxLength);
        }

        return sanitized;
    }
}