package com.portfolio.portfolio_backend.application.service;

import com.portfolio.portfolio_backend.web.dto.ContactRequestDTO;
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

    private final JavaMailSender mailSender;

    @Value("${app.contact.to}")
    private String to;

    @Value("${app.contact.from}")
    private String from;

    // Rate-limit basique en mémoire: 1 message / 30s / IP
    private final Map<String, Instant> lastSentByIp = new ConcurrentHashMap<>();
    private static final Duration COOLDOWN = Duration.ofSeconds(30);

    public ContactService(JavaMailSender mailSender) {
        this.mailSender = mailSender;
    }

    public void send(ContactRequestDTO dto, String clientIp) {
        // 1) Honeypot anti-spam
        if (dto.getWebsite() != null && !dto.getWebsite().trim().isEmpty()) {
            throw new IllegalArgumentException("SPAM_DETECTED");
        }

        // 2) Rate limit basique
        if (clientIp == null || clientIp.isBlank()) clientIp = "unknown";
        Instant now = Instant.now();
        Instant last = lastSentByIp.get(clientIp);
        if (last != null && Duration.between(last, now).compareTo(COOLDOWN) < 0) {
            throw new IllegalStateException("RATE_LIMIT");
        }
        lastSentByIp.put(clientIp, now);

        // 3) Sanitization simple
        String name = sanitize(dto.getName(), 80);
        String email = sanitize(dto.getEmail(), 120);
        String subject = sanitize(dto.getSubject(), 120);
        String message = sanitize(dto.getMessage(), 4000);

        String fullSubject = "[Portfolio] " + subject;

        String body = """
                Nouveau message via le portfolio
                
                Nom: %s
                Email: %s
                IP: %s
                
                Message:
                %s
                """.formatted(name, email, clientIp, message);

        SimpleMailMessage mail = new SimpleMailMessage();
        mail.setTo(to);
        mail.setFrom(from);

        // Important: reply-to = email du visiteur
        mail.setReplyTo(email);

        mail.setSubject(fullSubject);
        mail.setText(body);

        mailSender.send(mail);
    }

    private String sanitize(String input, int maxLen) {
        if (input == null) return "";
        String s = input
                .replaceAll("[\\p{Cntrl}&&[^\r\n\t]]", "")
                .trim();
        if (s.length() > maxLen) s = s.substring(0, maxLen);
        return s;
    }
}