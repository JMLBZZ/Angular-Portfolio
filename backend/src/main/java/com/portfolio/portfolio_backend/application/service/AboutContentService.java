package com.portfolio.portfolio_backend.application.service;

import com.portfolio.portfolio_backend.domain.model.AboutContent;
import com.portfolio.portfolio_backend.domain.model.AboutSkillGroup;
import com.portfolio.portfolio_backend.domain.model.AboutSkillItem;
import com.portfolio.portfolio_backend.domain.model.AboutTimelineItem;
import com.portfolio.portfolio_backend.domain.model.LocalizedText;
import com.portfolio.portfolio_backend.domain.port.out.AboutContentRepositoryPort;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.ArrayList;
import java.util.List;

@Service
public class AboutContentService {

    private final AboutContentRepositoryPort aboutContentRepositoryPort;

    public AboutContentService(AboutContentRepositoryPort aboutContentRepositoryPort) {
        this.aboutContentRepositoryPort = aboutContentRepositoryPort;
    }

    @Transactional(readOnly = true)
    public AboutContent get() {
        return aboutContentRepositoryPort.find().orElseGet(this::buildDefaultAboutContent);
    }

    @Transactional
    public AboutContent update(AboutContent aboutContent) {
        AboutContent sanitized = new AboutContent(
                sanitizeLocalizedText(aboutContent.getTitle()),
                sanitizeLocalizedText(aboutContent.getSubtitle()),
                sanitize(aboutContent.getProfileName(), 120),
                sanitizeLocalizedText(aboutContent.getProfileRole()),
                sanitizeLocalizedText(aboutContent.getBio(), 3000),
                sanitizeLocalizedText(aboutContent.getLocation(), 255),
                sanitizeLocalizedText(aboutContent.getTimelineTitle()),
                sanitizeLocalizedText(aboutContent.getSkillsTitle()),
                sanitizeLocalizedText(aboutContent.getSoftSkillsTitle()),
                sanitizeTimelineItems(aboutContent.getTimelineItems()),
                sanitizeSkillGroups(aboutContent.getSkillGroups()),
                sanitizeSoftSkills(aboutContent.getSoftSkills())
        );

        return aboutContentRepositoryPort.save(sanitized);
    }

    private AboutContent buildDefaultAboutContent() {
        return new AboutContent(
                new LocalizedText("À propos", "About"),
                new LocalizedText("Mon parcours et mes compétences", "My background and skills"),
                "Jamel BOUAZZA",
                new LocalizedText("Développeur Full-Stack", "Full-Stack Developer"),
                new LocalizedText(
                        "Passionné par le développement web, je conçois des applications performantes et des interfaces utilisateur intuitives. Mon approche combine rigueur technique, sens du détail et vision produit.",
                        "Passionate about web development, I build high-performance applications and intuitive user interfaces. My approach combines technical rigor, attention to detail and product vision."
                ),
                new LocalizedText("Paris, France", "Paris, France"),
                new LocalizedText("Mon parcours", "My journey"),
                new LocalizedText("Compétences techniques", "Technical skills"),
                new LocalizedText("Soft skills", "Soft skills"),
                List.of(
                        new AboutTimelineItem(
                                new LocalizedText("2023 - Présent", "2023 - Present"),
                                new LocalizedText("TechCorp Solutions", "TechCorp Solutions"),
                                new LocalizedText("Développeur Full-Stack Senior", "Senior Full-Stack Developer"),
                                new LocalizedText(
                                        "Développement d'applications web complexes avec React et Node.js. Lead technique sur plusieurs projets majeurs.",
                                        "Development of complex web applications with React and Node.js. Technical lead on several major projects."
                                ),
                                "work"
                        ),
                        new AboutTimelineItem(
                                new LocalizedText("2021 - 2023", "2021 - 2023"),
                                new LocalizedText("Digital Agency Paris", "Digital Agency Paris"),
                                new LocalizedText("Développeur Front-End", "Front-End Developer"),
                                new LocalizedText(
                                        "Création d'interfaces utilisateur modernes et responsive. Collaboration étroite avec les équipes design.",
                                        "Creation of modern and responsive user interfaces. Close collaboration with design teams."
                                ),
                                "work"
                        ),
                        new AboutTimelineItem(
                                new LocalizedText("2019 - 2021", "2019 - 2021"),
                                new LocalizedText("StartupLab", "StartupLab"),
                                new LocalizedText("Développeur Junior", "Junior Developer"),
                                new LocalizedText(
                                        "Premiers pas dans le développement professionnel. Apprentissage des bonnes pratiques et méthodologies agiles.",
                                        "First steps in professional development. Learning best practices and agile methodologies."
                                ),
                                "work"
                        ),
                        new AboutTimelineItem(
                                new LocalizedText("2016 - 2019", "2016 - 2019"),
                                new LocalizedText("Université Paris-Saclay", "Paris-Saclay University"),
                                new LocalizedText("Master Informatique", "Master's Degree in Computer Science"),
                                new LocalizedText(
                                        "Spécialisation en génie logiciel et systèmes distribués.",
                                        "Specialization in software engineering and distributed systems."
                                ),
                                "education"
                        )
                ),
                List.of(
                        new AboutSkillGroup(
                                new LocalizedText("Front-End", "Front-End"),
                                List.of(
                                        new AboutSkillItem("React", 90),
                                        new AboutSkillItem("TypeScript", 85),
                                        new AboutSkillItem("Angular", 75),
                                        new AboutSkillItem("Vue.js", 70)
                                )
                        ),
                        new AboutSkillGroup(
                                new LocalizedText("Back-End", "Back-End"),
                                List.of(
                                        new AboutSkillItem("Node.js", 85),
                                        new AboutSkillItem("Python", 80),
                                        new AboutSkillItem("PostgreSQL", 80),
                                        new AboutSkillItem("Java", 75),
                                        new AboutSkillItem("MongoDB", 75)
                                )
                        ),
                        new AboutSkillGroup(
                                new LocalizedText("DevOps", "DevOps"),
                                List.of(
                                        new AboutSkillItem("Docker", 70),
                                        new AboutSkillItem("AWS", 65)
                                )
                        ),
                        new AboutSkillGroup(
                                new LocalizedText("Design", "Design"),
                                List.of(new AboutSkillItem("Figma", 80))
                        ),
                        new AboutSkillGroup(
                                new LocalizedText("Outils", "Tools"),
                                List.of(new AboutSkillItem("Git", 90))
                        )
                ),
                List.of(
                        new LocalizedText("Travail d'équipe", "Teamwork"),
                        new LocalizedText("Communication", "Communication"),
                        new LocalizedText("Résolution de problèmes", "Problem solving"),
                        new LocalizedText("Adaptabilité", "Adaptability"),
                        new LocalizedText("Gestion du temps", "Time management"),
                        new LocalizedText("Créativité", "Creativity"),
                        new LocalizedText("Autonomie", "Autonomy"),
                        new LocalizedText("Curiosité technique", "Technical curiosity")
                )
        );
    }

    private List<AboutTimelineItem> sanitizeTimelineItems(List<AboutTimelineItem> items) {
        if (items == null || items.isEmpty()) {
            return List.of();
        }

        List<AboutTimelineItem> sanitized = new ArrayList<>();

        for (AboutTimelineItem item : items) {
            if (item == null) {
                continue;
            }

            String icon = sanitize(item.getIcon(), 20);
            if (!icon.equals("work") && !icon.equals("education")) {
                icon = "work";
            }

            sanitized.add(new AboutTimelineItem(
                    sanitizeLocalizedText(item.getDate()),
                    sanitizeLocalizedText(item.getCompany()),
                    sanitizeLocalizedText(item.getTitle()),
                    sanitizeLocalizedText(item.getDescription(), 2000),
                    icon
            ));
        }

        return sanitized;
    }

    private List<AboutSkillGroup> sanitizeSkillGroups(List<AboutSkillGroup> groups) {
        if (groups == null || groups.isEmpty()) {
            return List.of();
        }

        List<AboutSkillGroup> sanitizedGroups = new ArrayList<>();

        for (AboutSkillGroup group : groups) {
            if (group == null) {
                continue;
            }

            List<AboutSkillItem> sanitizedItems = new ArrayList<>();

            if (group.getItems() != null) {
                for (AboutSkillItem item : group.getItems()) {
                    if (item == null) {
                        continue;
                    }

                    String name = sanitize(item.getName(), 80);
                    if (name.isBlank()) {
                        continue;
                    }

                    int value = Math.max(0, Math.min(100, item.getValue()));

                    sanitizedItems.add(new AboutSkillItem(name, value));
                }
            }

            sanitizedGroups.add(new AboutSkillGroup(
                    sanitizeLocalizedText(group.getTitle()),
                    sanitizedItems
            ));
        }

        return sanitizedGroups;
    }

    private List<LocalizedText> sanitizeSoftSkills(List<LocalizedText> softSkills) {
        if (softSkills == null || softSkills.isEmpty()) {
            return List.of();
        }

        List<LocalizedText> sanitized = new ArrayList<>();

        for (LocalizedText skill : softSkills) {
            if (skill == null) {
                continue;
            }

            LocalizedText localizedText = sanitizeLocalizedText(skill, 120);

            if (!localizedText.getFr().isBlank() || !localizedText.getEn().isBlank()) {
                sanitized.add(localizedText);
            }
        }

        return sanitized;
    }

    private LocalizedText sanitizeLocalizedText(LocalizedText text) {
        return sanitizeLocalizedText(text, 255);
    }

    private LocalizedText sanitizeLocalizedText(LocalizedText text, int maxLength) {
        if (text == null) {
            return new LocalizedText("", "");
        }

        return new LocalizedText(
                sanitize(text.getFr(), maxLength),
                sanitize(text.getEn(), maxLength)
        );
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