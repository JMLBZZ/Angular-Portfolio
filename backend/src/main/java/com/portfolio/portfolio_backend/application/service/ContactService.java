package com.portfolio.portfolio_backend.application.service;

import com.portfolio.portfolio_backend.application.exception.RateLimitException;
import com.portfolio.portfolio_backend.application.exception.SpamDetectedException;
import com.portfolio.portfolio_backend.domain.port.out.ContactRepositoryPort;
import com.portfolio.portfolio_backend.web.dto.ContactRequestDTO;
import jakarta.mail.MessagingException;
import jakarta.mail.internet.MimeMessage;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.mail.javamail.JavaMailSender;
import org.springframework.mail.javamail.MimeMessageHelper;
import org.springframework.stereotype.Service;
import org.springframework.web.util.HtmlUtils;

import java.time.Duration;
import java.time.Instant;
import java.time.LocalDateTime;
import java.time.format.DateTimeFormatter;
import java.util.Map;
import java.util.concurrent.ConcurrentHashMap;

@Service
public class ContactService {

    private static final Logger logger = LoggerFactory.getLogger(ContactService.class);

    private static final Duration COOLDOWN = Duration.ofSeconds(30);

    private final JavaMailSender mailSender;
    private final ContactRepositoryPort contactRepositoryPort;

    @Value("${app.contact.to}")
    private String to;

    @Value("${app.contact.from}")
    private String from;

    private final Map<String, Instant> lastSentByIp = new ConcurrentHashMap<>();

    public ContactService(
            JavaMailSender mailSender,
            ContactRepositoryPort contactRepositoryPort
    ) {
        this.mailSender = mailSender;
        this.contactRepositoryPort = contactRepositoryPort;
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

        String fullSubject = "[Portfolio] - " + name + " : " + subject;

        // 👉 Date/heure formatée
        String formattedDate = LocalDateTime.now()
                .format(DateTimeFormatter.ofPattern("dd/MM/yyyy HH:mm:ss"));

        String htmlBody = buildHtmlBody(name, email, subject, message, safeIp, formattedDate);

        try {
            MimeMessage mail = mailSender.createMimeMessage();
            MimeMessageHelper helper = new MimeMessageHelper(mail, false, "UTF-8");

            helper.setTo(resolveDestinationEmail());
            helper.setFrom(safeFrom);
            helper.setReplyTo(safeReplyTo);
            helper.setSubject(fullSubject);
            helper.setText(htmlBody, true);

            mailSender.send(mail);

            logger.info("Contact email successfully sent for IP={}", safeIp);
        } catch (MessagingException e) {
            logger.error("Failed to build contact email for IP={}", safeIp, e);
            throw new IllegalStateException("Unable to send contact email", e);
        }
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

    private String resolveDestinationEmail() {
        return contactRepositoryPort.find()
                .map(contact -> sanitize(contact.getEmail(), 160))
                .filter(email -> !email.isBlank())
                .orElseGet(() -> {
                    if (to == null || to.isBlank()) {
                        return "contact@localhost.localdomain";
                    }
                    return to.trim();
                });
    }

    private String sanitize(String input, int maxLength) {
        if (input == null) return "";
        String sanitized = input.replaceAll("[\\p{Cntrl}&&[^\r\n\t]]", "").trim();
        if (sanitized.length() > maxLength) {
            sanitized = sanitized.substring(0, maxLength);
        }
        return sanitized;
    }

    private String buildHtmlBody(String name, String email, String subject, String message, String ip, String date) {

        return """
                <div style="font-family: Arial, sans-serif; background:#ffffff; padding:20px;">
                    <div style="max-width:600px; margin:auto; border:1px solid #e5e7eb; border-radius:10px; overflow:hidden;">

                        <div style="background:#111111; color:#d4af37; padding:20px; text-align:center;">
                            <h2 style="margin:0;">Portfolio</h2>
                        </div>

                        <div style="padding:20px; color:#111;">
                            <p>Vous avez reçu un nouveau message :</p>

                            <table style="width:100%; border-collapse:collapse;">
                                <tr>
                                    <td style="padding:8px; font-weight:bold;">Nom :</td>
                                    <td style="padding:8px;">%s</td>
                                </tr>
                                <tr>
                                    <td style="padding:8px; font-weight:bold;">Email :</td>
                                    <td style="padding:8px;">%s</td>
                                </tr>
                                <tr>
                                    <td style="padding:8px; font-weight:bold;">Sujet :</td>
                                    <td style="padding:8px;">%s</td>
                                </tr>
                                <tr>
                                    <td style="padding:8px; font-weight:bold;">Date :</td>
                                    <td style="padding:8px;">%s</td>
                                </tr>
                                <tr>
                                    <td style="padding:8px; font-weight:bold;">IP :</td>
                                    <td style="padding:8px;">%s</td>
                                </tr>
                            </table>

                            <div style="margin-top:20px;">
                                <p style="font-weight:bold;">Message :</p>
                                <div style="border:1px solid #e5e7eb; padding:15px; border-radius:8px;">
                                    %s
                                </div>
                            </div>

                            <div style="margin-top:20px;">
                                <a href="mailto:%s"
                                   style="background:#d4af37; color:#000; padding:10px 15px; text-decoration:none; border-radius:5px;">
                                    Répondre
                                </a>
                            </div>
                        </div>
                    </div>
                </div>
                """.formatted(
                escapeHtml(name),
                escapeHtml(email),
                escapeHtml(subject),
                date,
                escapeHtml(ip),
                nl2br(escapeHtml(message)),
                email
        );
    }

    private String escapeHtml(String value) {
        return HtmlUtils.htmlEscape(value == null ? "" : value);
    }

    private String nl2br(String value) {
        return value.replace("\n", "<br>");
    }
}