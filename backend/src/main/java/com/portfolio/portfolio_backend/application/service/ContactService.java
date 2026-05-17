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
import java.time.ZoneId;
import java.time.format.DateTimeFormatter;
import java.util.Map;
import java.util.concurrent.ConcurrentHashMap;

@Service
public class ContactService {

    private static final Logger logger = LoggerFactory.getLogger(ContactService.class);

    private static final Duration COOLDOWN = Duration.ofSeconds(30);

    private static final ZoneId PARIS_ZONE = ZoneId.of("Europe/Paris");

    private static final DateTimeFormatter CONTACT_DATE_FORMATTER =
            DateTimeFormatter.ofPattern("dd/MM/yyyy HH:mm:ss");

    private final JavaMailSender mailSender;
    private final ContactRepositoryPort contactRepositoryPort;
    private final ContactMessageService contactMessageService;

    @Value("${app.contact.to}")
    private String to;

    @Value("${app.contact.from}")
    private String from;

    private final Map<String, Instant> lastSentByIp = new ConcurrentHashMap<>();

    public ContactService(
            JavaMailSender mailSender,
            ContactRepositoryPort contactRepositoryPort,
            ContactMessageService contactMessageService
    ) {
        this.mailSender = mailSender;
        this.contactRepositoryPort = contactRepositoryPort;
        this.contactMessageService = contactMessageService;
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

        String sentAt = Instant.now()
                .atZone(PARIS_ZONE)
                .format(CONTACT_DATE_FORMATTER);

        contactMessageService.saveIncomingMessage(name, email, subject, message);

        String htmlBody = buildHtmlBody(name, email, subject, message, sentAt, safeIp);

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
            logger.error(
                    "Contact message was saved, but email notification could not be built for IP={}",
                    safeIp,
                    e
            );
        } catch (RuntimeException e) {
            logger.error(
                    "Contact message was saved, but email notification could not be sent for IP={}",
                    safeIp,
                    e
            );
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

    private String buildHtmlBody(
            String name,
            String email,
            String subject,
            String message,
            String sentAt,
            String clientIp
    ) {
        String safeName = escapeHtml(name);
        String safeEmail = escapeHtml(email);
        String safeSubject = escapeHtml(subject);
        String safeMessage = nl2br(escapeHtml(message));
        String safeSentAt = escapeHtml(sentAt);
        String safeIp = escapeHtml(clientIp);

        return """
                <!DOCTYPE html>
                <html lang="fr">
                <head>
                    <meta charset="UTF-8">
                    <meta name="viewport" content="width=device-width, initial-scale=1.0">
                    <title>Nouveau message de contact</title>
                </head>
                <body style="margin:0; padding:0; background-color:#ffffff; font-family:Arial, Helvetica, sans-serif; color:#171717;">
                    <div style="width:100%%; background-color:#ffffff; padding:28px 14px;">
                        <table role="presentation" style="width:100%%; border-collapse:collapse;">
                            <tr>
                                <td align="center">
                                    <table role="presentation" style="width:100%%; max-width:680px; border-collapse:separate; border-spacing:0; background-color:#ffffff; border:1px solid #e7dcc4; border-radius:22px; overflow:hidden;">
                                        <tr>
                                            <td style="padding:30px 32px 24px 32px; background-color:#ffffff; border-bottom:1px solid #e7dcc4;">
                                                <div style="font-size:12px; line-height:18px; letter-spacing:1.8px; text-transform:uppercase; color:#b08d57; font-weight:700; margin-bottom:10px;">
                                                    Portfolio
                                                </div>
                                                <h1 style="margin:0; font-size:28px; line-height:36px; font-weight:700; color:#171717;">
                                                    Nouveau message de contact
                                                </h1>
                                                <p style="margin:12px 0 0 0; font-size:15px; line-height:24px; color:#525252;">
                                                    Un visiteur a utilisé le formulaire de contact de ton portfolio.
                                                </p>
                                            </td>
                                        </tr>

                                        <tr>
                                            <td style="padding:32px;">
                                                <table role="presentation" style="width:100%%; border-collapse:collapse; margin-bottom:24px;">
                                                    <tr>
                                                        <td style="padding:0 0 16px 0;">
                                                            <div style="font-size:13px; line-height:20px; font-weight:700; color:#b08d57; text-transform:uppercase; letter-spacing:0.8px; margin-bottom:10px;">
                                                                Informations du contact
                                                            </div>

                                                            <div style="background-color:#fffaf0; border:1px solid #e7dcc4; border-radius:18px; padding:20px;">
                                                                <table role="presentation" style="width:100%%; border-collapse:collapse;">
                                                                    <tr>
                                                                        <td style="padding:0 0 12px 0; width:120px; font-size:14px; line-height:22px; font-weight:700; color:#171717; vertical-align:top;">Nom</td>
                                                                        <td style="padding:0 0 12px 0; font-size:14px; line-height:22px; color:#404040; vertical-align:top;">%s</td>
                                                                    </tr>
                                                                    <tr>
                                                                        <td style="padding:0 0 12px 0; width:120px; font-size:14px; line-height:22px; font-weight:700; color:#171717; vertical-align:top;">Email</td>
                                                                        <td style="padding:0 0 12px 0; font-size:14px; line-height:22px; color:#404040; vertical-align:top;">
                                                                            <a href="mailto:%s" style="color:#9a6b24; text-decoration:none; font-weight:700;">%s</a>
                                                                        </td>
                                                                    </tr>
                                                                    <tr>
                                                                        <td style="padding:0 0 12px 0; width:120px; font-size:14px; line-height:22px; font-weight:700; color:#171717; vertical-align:top;">Sujet</td>
                                                                        <td style="padding:0 0 12px 0; font-size:14px; line-height:22px; color:#404040; vertical-align:top;">%s</td>
                                                                    </tr>
                                                                    <tr>
                                                                        <td style="padding:0 0 12px 0; width:120px; font-size:14px; line-height:22px; font-weight:700; color:#171717; vertical-align:top;">Date</td>
                                                                        <td style="padding:0 0 12px 0; font-size:14px; line-height:22px; color:#404040; vertical-align:top;">%s</td>
                                                                    </tr>
                                                                    <tr>
                                                                        <td style="padding:0; width:120px; font-size:14px; line-height:22px; font-weight:700; color:#171717; vertical-align:top;">IP</td>
                                                                        <td style="padding:0; font-size:14px; line-height:22px; color:#404040; vertical-align:top;">%s</td>
                                                                    </tr>
                                                                </table>
                                                            </div>
                                                        </td>
                                                    </tr>
                                                </table>

                                                <table role="presentation" style="width:100%%; border-collapse:collapse;">
                                                    <tr>
                                                        <td>
                                                            <div style="font-size:13px; line-height:20px; font-weight:700; color:#b08d57; text-transform:uppercase; letter-spacing:0.8px; margin-bottom:10px;">
                                                                Message
                                                            </div>
                                                            <div style="background-color:#ffffff; border:1px solid #e7dcc4; border-left:4px solid #b08d57; border-radius:18px; padding:20px; font-size:15px; line-height:26px; color:#171717;">
                                                                %s
                                                            </div>
                                                        </td>
                                                    </tr>
                                                </table>

                                                <table role="presentation" style="width:100%%; border-collapse:collapse; margin-top:24px;">
                                                    <tr>
                                                        <td align="left">
                                                            <a href="mailto:%s?subject=%s"
                                                               style="display:inline-block; background-color:#b08d57; color:#ffffff; text-decoration:none; font-size:14px; font-weight:700; line-height:20px; padding:12px 20px; border-radius:999px;">
                                                                Répondre au contact
                                                            </a>
                                                        </td>
                                                    </tr>
                                                </table>
                                            </td>
                                        </tr>

                                        <tr>
                                            <td style="padding:20px 32px 32px 32px; border-top:1px solid #e7dcc4; background-color:#ffffff;">
                                                <p style="margin:0; font-size:12px; line-height:20px; color:#737373; text-align:center;">
                                                    Message envoyé depuis le formulaire de contact du portfolio.
                                                </p>
                                            </td>
                                        </tr>
                                    </table>
                                </td>
                            </tr>
                        </table>
                    </div>
                </body>
                </html>
                """.formatted(
                safeName,
                safeEmail,
                safeEmail,
                safeSubject,
                safeSentAt,
                safeIp,
                safeMessage,
                safeEmail,
                urlEncodeSubject("Re: " + subject)
        );
    }

    private String escapeHtml(String value) {
        return HtmlUtils.htmlEscape(value == null ? "" : value);
    }

    private String nl2br(String value) {
        return value.replace("\r\n", "\n").replace("\n", "<br>");
    }

    private String urlEncodeSubject(String value) {
        return value
                .replace("%", "%25")
                .replace(" ", "%20")
                .replace(":", "%3A")
                .replace("[", "%5B")
                .replace("]", "%5D");
    }
}