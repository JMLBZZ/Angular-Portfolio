package com.portfolio.portfolio_backend.application.service;

import com.portfolio.portfolio_backend.domain.model.AboutContent;
import com.portfolio.portfolio_backend.domain.model.AboutSkillGroup;
import com.portfolio.portfolio_backend.domain.model.AboutSkillItem;
import com.portfolio.portfolio_backend.domain.model.AboutTimelineItem;
import com.portfolio.portfolio_backend.domain.model.LocalizedText;
import com.portfolio.portfolio_backend.domain.port.out.AboutContentRepositoryPort;
import org.junit.jupiter.api.BeforeEach;
import org.junit.jupiter.api.Test;
import org.mockito.ArgumentCaptor;

import java.util.List;
import java.util.Optional;

import static org.junit.jupiter.api.Assertions.*;
import static org.mockito.Mockito.*;

class AboutContentServiceTest {

    private AboutContentRepositoryPort aboutContentRepositoryPort;
    private AboutContentService aboutContentService;

    @BeforeEach
    void setUp() {
        aboutContentRepositoryPort = mock(AboutContentRepositoryPort.class);
        aboutContentService = new AboutContentService(aboutContentRepositoryPort);
    }

    @Test
    void get_shouldReturnExistingAboutContent_whenRepositoryContainsSingleton() {
        AboutContent expected = buildAboutContent();

        when(aboutContentRepositoryPort.find()).thenReturn(Optional.of(expected));

        AboutContent result = aboutContentService.get();

        assertNotNull(result);
        assertEquals("À propos", result.getTitle().getFr());
        assertEquals("About", result.getTitle().getEn());
        verify(aboutContentRepositoryPort).find();
    }

    @Test
    void get_shouldReturnDefaultAboutContent_whenRepositoryIsEmpty() {
        when(aboutContentRepositoryPort.find()).thenReturn(Optional.empty());

        AboutContent result = aboutContentService.get();

        assertNotNull(result);
        assertNotNull(result.getTitle());
        assertNotNull(result.getBio());
        assertFalse(result.getTimelineItems().isEmpty());
        assertFalse(result.getSkillGroups().isEmpty());
        assertFalse(result.getSoftSkills().isEmpty());

        verify(aboutContentRepositoryPort).find();
    }

    @Test
    void update_shouldSanitizeAndSaveAboutContent() {
        AboutContent input = new AboutContent(
                new LocalizedText("   À propos   ", "   About   "),
                new LocalizedText("   Mon parcours   ", "   My journey   "),
                "   Jamel Bouazza   ",
                "   https://res.cloudinary.com/demo/image/upload/portfolio/Profile/profile.webp   ",
                new LocalizedText("   Développeur Full-Stack   ", "   Full-Stack Developer   "),
                new LocalizedText("   Bio FR   ", "   Bio EN   "),
                new LocalizedText("   Paris, France   ", "   Paris, France   "),
                new LocalizedText("   Timeline   ", "   Timeline   "),
                new LocalizedText("   Skills   ", "   Skills   "),
                new LocalizedText("   Soft skills   ", "   Soft skills   "),
                List.of(
                        new AboutTimelineItem(
                                new LocalizedText(" 2024 ", " 2024 "),
                                new LocalizedText(" OpenAI ", " OpenAI "),
                                new LocalizedText(" Engineer ", " Engineer "),
                                new LocalizedText(" Description FR ", " Description EN "),
                                "invalid-icon"
                        )
                ),
                List.of(
                        new AboutSkillGroup(
                                new LocalizedText(" Front-End ", " Front-End "),
                                List.of(
                                        new AboutSkillItem(" Angular ", 120),
                                        new AboutSkillItem(" ", 50),
                                        new AboutSkillItem(" Java ", -10)
                                )
                        )
                ),
                List.of(
                        new LocalizedText(" Communication ", " Communication "),
                        new LocalizedText(" ", " ")
                )
        );

        when(aboutContentRepositoryPort.save(any(AboutContent.class)))
                .thenAnswer(invocation -> invocation.getArgument(0));

        AboutContent result = aboutContentService.update(input);

        ArgumentCaptor<AboutContent> captor = ArgumentCaptor.forClass(AboutContent.class);
        verify(aboutContentRepositoryPort).save(captor.capture());

        AboutContent saved = captor.getValue();

        assertEquals("À propos", saved.getTitle().getFr());
        assertEquals("About", saved.getTitle().getEn());
        assertEquals("Jamel Bouazza", saved.getProfileName());
        assertEquals(
                "https://res.cloudinary.com/demo/image/upload/portfolio/Profile/profile.webp",
                saved.getProfileImageUrl()
        );

        assertEquals(1, saved.getTimelineItems().size());
        assertEquals("work", saved.getTimelineItems().get(0).getIcon());

        assertEquals(1, saved.getSkillGroups().size());
        assertEquals(2, saved.getSkillGroups().get(0).getItems().size());
        assertEquals("Angular", saved.getSkillGroups().get(0).getItems().get(0).getName());
        assertEquals(100, saved.getSkillGroups().get(0).getItems().get(0).getValue());
        assertEquals("Java", saved.getSkillGroups().get(0).getItems().get(1).getName());
        assertEquals(0, saved.getSkillGroups().get(0).getItems().get(1).getValue());

        assertEquals(1, saved.getSoftSkills().size());
        assertEquals("Communication", saved.getSoftSkills().get(0).getFr());

        assertEquals(saved.getTitle().getFr(), result.getTitle().getFr());
    }

    @Test
    void update_shouldHandleNullCollections() {
        AboutContent input = new AboutContent(
                new LocalizedText("À propos", "About"),
                new LocalizedText("Sous-titre", "Subtitle"),
                "Jamel Bouazza",
                "",
                new LocalizedText("Développeur", "Developer"),
                new LocalizedText("Bio FR", "Bio EN"),
                new LocalizedText("Paris", "Paris"),
                new LocalizedText("Timeline", "Timeline"),
                new LocalizedText("Skills", "Skills"),
                new LocalizedText("Soft skills", "Soft skills"),
                null,
                null,
                null
        );

        when(aboutContentRepositoryPort.save(any(AboutContent.class)))
                .thenAnswer(invocation -> invocation.getArgument(0));

        AboutContent result = aboutContentService.update(input);

        assertNotNull(result);
        assertNotNull(result.getTimelineItems());
        assertNotNull(result.getSkillGroups());
        assertNotNull(result.getSoftSkills());

        assertEquals(0, result.getTimelineItems().size());
        assertEquals(0, result.getSkillGroups().size());
        assertEquals(0, result.getSoftSkills().size());
    }

    private AboutContent buildAboutContent() {
        return new AboutContent(
                new LocalizedText("À propos", "About"),
                new LocalizedText("Mon parcours et mes compétences", "My background and skills"),
                "Jamel Bouazza",
                "https://res.cloudinary.com/demo/image/upload/portfolio/Profile/profile.webp",
                new LocalizedText("Développeur Full-Stack", "Full-Stack Developer"),
                new LocalizedText("Bio FR", "Bio EN"),
                new LocalizedText("Paris, France", "Paris, France"),
                new LocalizedText("Mon parcours", "My journey"),
                new LocalizedText("Compétences techniques", "Technical skills"),
                new LocalizedText("Soft skills", "Soft skills"),
                List.of(
                        new AboutTimelineItem(
                                new LocalizedText("2023 - Présent", "2023 - Present"),
                                new LocalizedText("Entreprise", "Company"),
                                new LocalizedText("Titre", "Title"),
                                new LocalizedText("Description FR", "Description EN"),
                                "work"
                        )
                ),
                List.of(
                        new AboutSkillGroup(
                                new LocalizedText("Front-End", "Front-End"),
                                List.of(new AboutSkillItem("Angular", 90))
                        )
                ),
                List.of(new LocalizedText("Communication", "Communication"))
        );
    }
}