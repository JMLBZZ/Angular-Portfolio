package com.portfolio.portfolio_backend.infrastructure.web.controller;

import com.portfolio.portfolio_backend.application.service.ContactMessageService;
import com.portfolio.portfolio_backend.domain.model.ContactMessage;
import com.portfolio.portfolio_backend.domain.model.ContactMessageStats;
import com.portfolio.portfolio_backend.domain.model.ContactMessageStatus;
import com.portfolio.portfolio_backend.infrastructure.security.JwtAuthenticationFilter;
import com.portfolio.portfolio_backend.infrastructure.security.JwtService;
import com.portfolio.portfolio_backend.web.controller.AdminContactMessageController;
import org.junit.jupiter.api.Test;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.boot.test.autoconfigure.web.servlet.AutoConfigureMockMvc;
import org.springframework.boot.test.autoconfigure.web.servlet.WebMvcTest;
import org.springframework.data.domain.PageImpl;
import org.springframework.data.domain.PageRequest;
import org.springframework.test.context.bean.override.mockito.MockitoBean;
import org.springframework.test.web.servlet.MockMvc;

import java.time.Instant;
import java.util.List;
import java.util.UUID;

import static org.mockito.ArgumentMatchers.any;
import static org.mockito.ArgumentMatchers.eq;
import static org.mockito.Mockito.verify;
import static org.mockito.Mockito.when;
import static org.springframework.test.web.servlet.request.MockMvcRequestBuilders.delete;
import static org.springframework.test.web.servlet.request.MockMvcRequestBuilders.get;
import static org.springframework.test.web.servlet.request.MockMvcRequestBuilders.patch;
import static org.springframework.test.web.servlet.result.MockMvcResultMatchers.jsonPath;
import static org.springframework.test.web.servlet.result.MockMvcResultMatchers.status;

@WebMvcTest(AdminContactMessageController.class)
@AutoConfigureMockMvc(addFilters = false)
class AdminContactMessageControllerTest {

    @Autowired
    private MockMvc mockMvc;

    @MockitoBean
    private ContactMessageService service;

    @MockitoBean
    private JwtService jwtService;

    @MockitoBean
    private JwtAuthenticationFilter jwtAuthenticationFilter;

    @Test
    void shouldReturnPagedMessages() throws Exception {
        UUID id = UUID.randomUUID();

        ContactMessage message = buildMessage(id, ContactMessageStatus.UNREAD, null);

        when(service.getAll(eq("unread"), any()))
                .thenReturn(new PageImpl<>(
                        List.of(message),
                        PageRequest.of(0, 10),
                        1
                ));

        mockMvc.perform(
                        get("/api/admin/messages")
                                .param("status", "unread")
                                .param("page", "0")
                                .param("size", "10")
                )
                .andExpect(status().isOk())
                .andExpect(jsonPath("$.success").value(true))
                .andExpect(jsonPath("$.data[0].id").value(id.toString()))
                .andExpect(jsonPath("$.data[0].senderName").value("Jean Dupont"))
                .andExpect(jsonPath("$.data[0].senderEmail").value("jean.dupont@example.com"))
                .andExpect(jsonPath("$.data[0].subject").value("Demande de contact"))
                .andExpect(jsonPath("$.data[0].message").value("Bonjour, je souhaite vous contacter."))
                .andExpect(jsonPath("$.data[0].status").value("unread"))
                .andExpect(jsonPath("$.meta.page").value(0))
                .andExpect(jsonPath("$.meta.size").value(10))
                .andExpect(jsonPath("$.meta.totalElements").value(1))
                .andExpect(jsonPath("$.meta.totalPages").value(1));

        verify(service).getAll(eq("unread"), any());
    }

    @Test
    void shouldReturnMessageStats() throws Exception {
        when(service.getStats())
                .thenReturn(new ContactMessageStats(12, 3, 7, 2));

        mockMvc.perform(get("/api/admin/messages/stats"))
                .andExpect(status().isOk())
                .andExpect(jsonPath("$.total").value(12))
                .andExpect(jsonPath("$.unread").value(3))
                .andExpect(jsonPath("$.read").value(7))
                .andExpect(jsonPath("$.archived").value(2));

        verify(service).getStats();
    }

    @Test
    void shouldReturnMessageDetail() throws Exception {
        UUID id = UUID.randomUUID();

        when(service.getById(id))
                .thenReturn(buildMessage(id, ContactMessageStatus.READ, Instant.parse("2026-05-17T10:05:00Z")));

        mockMvc.perform(get("/api/admin/messages/{id}", id))
                .andExpect(status().isOk())
                .andExpect(jsonPath("$.id").value(id.toString()))
                .andExpect(jsonPath("$.senderName").value("Jean Dupont"))
                .andExpect(jsonPath("$.senderEmail").value("jean.dupont@example.com"))
                .andExpect(jsonPath("$.status").value("read"))
                .andExpect(jsonPath("$.readAt").value("2026-05-17T10:05:00Z"));

        verify(service).getById(id);
    }

    @Test
    void shouldMarkMessageAsRead() throws Exception {
        UUID id = UUID.randomUUID();

        when(service.markAsRead(id))
                .thenReturn(buildMessage(id, ContactMessageStatus.READ, Instant.parse("2026-05-17T10:05:00Z")));

        mockMvc.perform(patch("/api/admin/messages/{id}/read", id))
                .andExpect(status().isOk())
                .andExpect(jsonPath("$.id").value(id.toString()))
                .andExpect(jsonPath("$.status").value("read"))
                .andExpect(jsonPath("$.readAt").value("2026-05-17T10:05:00Z"));

        verify(service).markAsRead(id);
    }

    @Test
    void shouldMarkMessageAsUnread() throws Exception {
        UUID id = UUID.randomUUID();

        when(service.markAsUnread(id))
                .thenReturn(buildMessage(id, ContactMessageStatus.UNREAD, null));

        mockMvc.perform(patch("/api/admin/messages/{id}/unread", id))
                .andExpect(status().isOk())
                .andExpect(jsonPath("$.id").value(id.toString()))
                .andExpect(jsonPath("$.status").value("unread"))
                .andExpect(jsonPath("$.readAt").doesNotExist());

        verify(service).markAsUnread(id);
    }

    @Test
    void shouldArchiveMessage() throws Exception {
        UUID id = UUID.randomUUID();

        when(service.archive(id))
                .thenReturn(buildMessage(id, ContactMessageStatus.ARCHIVED, Instant.parse("2026-05-17T10:10:00Z")));

        mockMvc.perform(patch("/api/admin/messages/{id}/archive", id))
                .andExpect(status().isOk())
                .andExpect(jsonPath("$.id").value(id.toString()))
                .andExpect(jsonPath("$.status").value("archived"))
                .andExpect(jsonPath("$.readAt").value("2026-05-17T10:10:00Z"));

        verify(service).archive(id);
    }

    @Test
    void shouldDeleteMessage() throws Exception {
        UUID id = UUID.randomUUID();

        mockMvc.perform(delete("/api/admin/messages/{id}", id))
                .andExpect(status().isOk());

        verify(service).delete(id);
    }

    private ContactMessage buildMessage(
            UUID id,
            ContactMessageStatus status,
            Instant readAt
    ) {
        return new ContactMessage(
                id,
                "Jean Dupont",
                "jean.dupont@example.com",
                "Demande de contact",
                "Bonjour, je souhaite vous contacter.",
                status,
                Instant.parse("2026-05-17T10:00:00Z"),
                readAt
        );
    }
}