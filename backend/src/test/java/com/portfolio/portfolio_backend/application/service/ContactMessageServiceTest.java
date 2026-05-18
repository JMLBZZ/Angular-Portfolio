package com.portfolio.portfolio_backend.application.service;

import com.portfolio.portfolio_backend.domain.exception.ResourceNotFoundException;
import com.portfolio.portfolio_backend.domain.model.ContactMessage;
import com.portfolio.portfolio_backend.domain.model.ContactMessageStats;
import com.portfolio.portfolio_backend.domain.model.ContactMessageStatus;
import com.portfolio.portfolio_backend.domain.port.out.ContactMessageRepositoryPort;
import org.junit.jupiter.api.BeforeEach;
import org.junit.jupiter.api.Test;
import org.junit.jupiter.api.extension.ExtendWith;
import org.mockito.ArgumentCaptor;
import org.mockito.InjectMocks;
import org.mockito.Mock;
import org.mockito.junit.jupiter.MockitoExtension;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.PageImpl;
import org.springframework.data.domain.PageRequest;

import java.time.Instant;
import java.util.List;
import java.util.Optional;
import java.util.UUID;

import static org.assertj.core.api.Assertions.assertThat;
import static org.assertj.core.api.Assertions.assertThatThrownBy;
import static org.mockito.ArgumentMatchers.any;
import static org.mockito.ArgumentMatchers.eq;
import static org.mockito.Mockito.never;
import static org.mockito.Mockito.times;
import static org.mockito.Mockito.verify;
import static org.mockito.Mockito.when;

@ExtendWith(MockitoExtension.class)
class ContactMessageServiceTest {

    @Mock
    private ContactMessageRepositoryPort repository;

    @InjectMocks
    private ContactMessageService service;

    private UUID messageId;
    private ContactMessage unreadMessage;
    private ContactMessage readMessage;
    private ContactMessage archivedMessage;

    @BeforeEach
    void setUp() {
        messageId = UUID.randomUUID();

        unreadMessage = new ContactMessage(
                messageId,
                "Jean Dupont",
                "jean.dupont@example.com",
                "Demande de contact",
                "Bonjour, je souhaite vous contacter.",
                ContactMessageStatus.UNREAD,
                Instant.parse("2026-05-17T10:00:00Z"),
                null
        );

        readMessage = new ContactMessage(
                messageId,
                "Jean Dupont",
                "jean.dupont@example.com",
                "Demande de contact",
                "Bonjour, je souhaite vous contacter.",
                ContactMessageStatus.READ,
                Instant.parse("2026-05-17T10:00:00Z"),
                Instant.parse("2026-05-17T10:05:00Z")
        );

        archivedMessage = new ContactMessage(
                messageId,
                "Jean Dupont",
                "jean.dupont@example.com",
                "Demande de contact",
                "Bonjour, je souhaite vous contacter.",
                ContactMessageStatus.ARCHIVED,
                Instant.parse("2026-05-17T10:00:00Z"),
                Instant.parse("2026-05-17T10:10:00Z")
        );
    }

    @Test
    void shouldSaveIncomingMessageAsUnread() {
        when(repository.save(any(ContactMessage.class)))
                .thenAnswer(invocation -> invocation.getArgument(0));

        ContactMessage result = service.saveIncomingMessage(
                " Jean Dupont ",
                " jean.dupont@example.com ",
                " Demande de contact ",
                " Bonjour, je souhaite vous contacter. "
        );

        assertThat(result.getId()).isNotNull();
        assertThat(result.getSenderName()).isEqualTo("Jean Dupont");
        assertThat(result.getSenderEmail()).isEqualTo("jean.dupont@example.com");
        assertThat(result.getSubject()).isEqualTo("Demande de contact");
        assertThat(result.getMessage()).isEqualTo("Bonjour, je souhaite vous contacter.");
        assertThat(result.getStatus()).isEqualTo(ContactMessageStatus.UNREAD);
        assertThat(result.getReceivedAt()).isNotNull();
        assertThat(result.getReadAt()).isNull();

        verify(repository, times(1)).save(any(ContactMessage.class));
    }

    @Test
    void shouldLimitIncomingMessageLengthsBeforeSaving() {
        when(repository.save(any(ContactMessage.class)))
                .thenAnswer(invocation -> invocation.getArgument(0));

        String longName = "A".repeat(120);
        String longEmail = "b".repeat(150) + "@example.com";
        String longSubject = "C".repeat(160);
        String longMessage = "D".repeat(4500);

        ContactMessage result = service.saveIncomingMessage(
                longName,
                longEmail,
                longSubject,
                longMessage
        );

        assertThat(result.getSenderName()).hasSize(80);
        assertThat(result.getSenderEmail()).hasSize(120);
        assertThat(result.getSubject()).hasSize(120);
        assertThat(result.getMessage()).hasSize(4000);

        verify(repository, times(1)).save(any(ContactMessage.class));
    }

    @Test
    void shouldReturnAllMessagesWhenStatusIsAllAndQueryIsEmpty() {
        PageRequest pageable = PageRequest.of(0, 10);
        Page<ContactMessage> expectedPage = new PageImpl<>(List.of(unreadMessage), pageable, 1);

        when(repository.search(null, "", pageable)).thenReturn(expectedPage);

        Page<ContactMessage> result = service.getAll("all", "", pageable);

        assertThat(result.getContent()).hasSize(1);
        assertThat(result.getContent().get(0).getStatus()).isEqualTo(ContactMessageStatus.UNREAD);

        verify(repository, times(1)).search(null, "", pageable);
        verify(repository, never()).findAll(any());
        verify(repository, never()).findByStatus(any(), any());
    }

    @Test
    void shouldReturnMessagesByStatusWithEmptyQuery() {
        PageRequest pageable = PageRequest.of(0, 10);
        Page<ContactMessage> expectedPage = new PageImpl<>(List.of(unreadMessage), pageable, 1);

        when(repository.search(ContactMessageStatus.UNREAD, "", pageable)).thenReturn(expectedPage);

        Page<ContactMessage> result = service.getAll("unread", null, pageable);

        assertThat(result.getContent()).hasSize(1);
        assertThat(result.getContent().get(0).getStatus()).isEqualTo(ContactMessageStatus.UNREAD);

        verify(repository, times(1)).search(ContactMessageStatus.UNREAD, "", pageable);
        verify(repository, never()).findAll(any());
        verify(repository, never()).findByStatus(any(), any());
    }

    @Test
    void shouldReturnMessagesByStatusAndSearchQuery() {
        PageRequest pageable = PageRequest.of(0, 10);
        Page<ContactMessage> expectedPage = new PageImpl<>(List.of(unreadMessage), pageable, 1);

        when(repository.search(ContactMessageStatus.UNREAD, "Jean Dupont", pageable)).thenReturn(expectedPage);

        Page<ContactMessage> result = service.getAll("unread", "  Jean   Dupont  ", pageable);

        assertThat(result.getContent()).hasSize(1);
        assertThat(result.getContent().get(0).getSenderName()).isEqualTo("Jean Dupont");

        verify(repository, times(1)).search(ContactMessageStatus.UNREAD, "Jean Dupont", pageable);
    }

    @Test
    void shouldLimitSearchQueryLengthBeforeSearching() {
        PageRequest pageable = PageRequest.of(0, 10);
        String longQuery = "A".repeat(180);
        String expectedQuery = "A".repeat(120);
        Page<ContactMessage> expectedPage = new PageImpl<>(List.of(unreadMessage), pageable, 1);

        when(repository.search(null, expectedQuery, pageable)).thenReturn(expectedPage);

        Page<ContactMessage> result = service.getAll("all", longQuery, pageable);

        assertThat(result.getContent()).hasSize(1);

        verify(repository, times(1)).search(null, expectedQuery, pageable);
    }

    @Test
    void shouldThrowWhenStatusIsInvalid() {
        PageRequest pageable = PageRequest.of(0, 10);

        assertThatThrownBy(() -> service.getAll("invalid-status", "", pageable))
                .isInstanceOf(IllegalArgumentException.class)
                .hasMessage("Invalid message status");

        verify(repository, never()).search(any(), any(), any());
        verify(repository, never()).findAll(any());
        verify(repository, never()).findByStatus(any(), any());
    }

    @Test
    void shouldReturnMessageById() {
        when(repository.findById(messageId)).thenReturn(Optional.of(unreadMessage));

        ContactMessage result = service.getById(messageId);

        assertThat(result.getId()).isEqualTo(messageId);
        assertThat(result.getSenderEmail()).isEqualTo("jean.dupont@example.com");

        verify(repository, times(1)).findById(messageId);
    }

    @Test
    void shouldThrowWhenMessageDoesNotExist() {
        when(repository.findById(messageId)).thenReturn(Optional.empty());

        assertThatThrownBy(() -> service.getById(messageId))
                .isInstanceOf(ResourceNotFoundException.class)
                .hasMessage("Contact message not found");

        verify(repository, times(1)).findById(messageId);
    }

    @Test
    void shouldReturnStats() {
        when(repository.countAll()).thenReturn(12L);
        when(repository.countByStatus(ContactMessageStatus.UNREAD)).thenReturn(3L);
        when(repository.countByStatus(ContactMessageStatus.READ)).thenReturn(7L);
        when(repository.countByStatus(ContactMessageStatus.ARCHIVED)).thenReturn(2L);

        ContactMessageStats result = service.getStats();

        assertThat(result.getTotal()).isEqualTo(12L);
        assertThat(result.getUnread()).isEqualTo(3L);
        assertThat(result.getRead()).isEqualTo(7L);
        assertThat(result.getArchived()).isEqualTo(2L);

        verify(repository, times(1)).countAll();
        verify(repository, times(1)).countByStatus(ContactMessageStatus.UNREAD);
        verify(repository, times(1)).countByStatus(ContactMessageStatus.READ);
        verify(repository, times(1)).countByStatus(ContactMessageStatus.ARCHIVED);
    }

    @Test
    void shouldMarkMessageAsRead() {
        ArgumentCaptor<ContactMessage> captor = ArgumentCaptor.forClass(ContactMessage.class);

        when(repository.findById(messageId)).thenReturn(Optional.of(unreadMessage));
        when(repository.save(any(ContactMessage.class))).thenAnswer(invocation -> invocation.getArgument(0));

        ContactMessage result = service.markAsRead(messageId);

        assertThat(result.getStatus()).isEqualTo(ContactMessageStatus.READ);
        assertThat(result.getReadAt()).isNotNull();

        verify(repository, times(1)).findById(messageId);
        verify(repository, times(1)).save(captor.capture());

        ContactMessage savedMessage = captor.getValue();

        assertThat(savedMessage.getId()).isEqualTo(messageId);
        assertThat(savedMessage.getStatus()).isEqualTo(ContactMessageStatus.READ);
        assertThat(savedMessage.getReadAt()).isNotNull();
    }

    @Test
    void shouldKeepExistingReadAtWhenMarkingAlreadyReadMessageAsRead() {
        when(repository.findById(messageId)).thenReturn(Optional.of(readMessage));
        when(repository.save(any(ContactMessage.class))).thenAnswer(invocation -> invocation.getArgument(0));

        ContactMessage result = service.markAsRead(messageId);

        assertThat(result.getStatus()).isEqualTo(ContactMessageStatus.READ);
        assertThat(result.getReadAt()).isEqualTo(Instant.parse("2026-05-17T10:05:00Z"));

        verify(repository, times(1)).findById(messageId);
        verify(repository, times(1)).save(any(ContactMessage.class));
    }

    @Test
    void shouldMarkMessageAsUnread() {
        when(repository.findById(messageId)).thenReturn(Optional.of(readMessage));
        when(repository.save(any(ContactMessage.class))).thenAnswer(invocation -> invocation.getArgument(0));

        ContactMessage result = service.markAsUnread(messageId);

        assertThat(result.getStatus()).isEqualTo(ContactMessageStatus.UNREAD);
        assertThat(result.getReadAt()).isNull();

        verify(repository, times(1)).findById(messageId);
        verify(repository, times(1)).save(any(ContactMessage.class));
    }

    @Test
    void shouldArchiveMessage() {
        when(repository.findById(messageId)).thenReturn(Optional.of(unreadMessage));
        when(repository.save(any(ContactMessage.class))).thenAnswer(invocation -> invocation.getArgument(0));

        ContactMessage result = service.archive(messageId);

        assertThat(result.getStatus()).isEqualTo(ContactMessageStatus.ARCHIVED);
        assertThat(result.getReadAt()).isNotNull();

        verify(repository, times(1)).findById(messageId);
        verify(repository, times(1)).save(any(ContactMessage.class));
    }

    @Test
    void shouldMarkMultipleMessagesAsRead() {
        UUID secondId = UUID.randomUUID();
        ContactMessage secondUnreadMessage = buildMessage(secondId, ContactMessageStatus.UNREAD, null);

        when(repository.findAllByIds(List.of(messageId, secondId)))
                .thenReturn(List.of(unreadMessage, secondUnreadMessage));
        when(repository.saveAll(any()))
                .thenAnswer(invocation -> invocation.getArgument(0));

        List<ContactMessage> result = service.markAsRead(List.of(messageId, secondId));

        assertThat(result).hasSize(2);
        assertThat(result).allMatch(message -> message.getStatus() == ContactMessageStatus.READ);
        assertThat(result).allMatch(message -> message.getReadAt() != null);

        verify(repository, times(1)).findAllByIds(List.of(messageId, secondId));
        verify(repository, times(1)).saveAll(any());
    }

    @Test
    void shouldRemoveDuplicateIdsBeforeBulkUpdate() {
        when(repository.findAllByIds(List.of(messageId)))
                .thenReturn(List.of(unreadMessage));
        when(repository.saveAll(any()))
                .thenAnswer(invocation -> invocation.getArgument(0));

        List<ContactMessage> result = service.markAsRead(List.of(messageId, messageId));

        assertThat(result).hasSize(1);
        assertThat(result.get(0).getStatus()).isEqualTo(ContactMessageStatus.READ);

        verify(repository, times(1)).findAllByIds(List.of(messageId));
        verify(repository, times(1)).saveAll(any());
    }

    @Test
    void shouldThrowWhenBulkUpdateReceivesEmptyIds() {
        assertThatThrownBy(() -> service.archive(List.of()))
                .isInstanceOf(IllegalArgumentException.class)
                .hasMessage("At least one message id is required");

        verify(repository, never()).findAllByIds(any());
        verify(repository, never()).saveAll(any());
    }

    @Test
    void shouldThrowWhenBulkUpdateReceivesTooManyIds() {
        List<UUID> ids = java.util.stream.IntStream.range(0, 101)
                .mapToObj(index -> UUID.randomUUID())
                .toList();

        assertThatThrownBy(() -> service.markAsUnread(ids))
                .isInstanceOf(IllegalArgumentException.class)
                .hasMessage("Too many messages selected");

        verify(repository, never()).findAllByIds(any());
        verify(repository, never()).saveAll(any());
    }

    @Test
    void shouldThrowWhenBulkUpdateContainsMissingMessage() {
        UUID secondId = UUID.randomUUID();

        when(repository.findAllByIds(List.of(messageId, secondId)))
                .thenReturn(List.of(unreadMessage));

        assertThatThrownBy(() -> service.markAsRead(List.of(messageId, secondId)))
                .isInstanceOf(ResourceNotFoundException.class)
                .hasMessage("One or more contact messages were not found");

        verify(repository, times(1)).findAllByIds(List.of(messageId, secondId));
        verify(repository, never()).saveAll(any());
    }

    @Test
    void shouldDeleteExistingMessage() {
        when(repository.findById(messageId)).thenReturn(Optional.of(archivedMessage));

        service.delete(messageId);

        verify(repository, times(1)).findById(messageId);
        verify(repository, times(1)).deleteById(messageId);
    }

    @Test
    void shouldThrowWhenDeletingMissingMessage() {
        when(repository.findById(messageId)).thenReturn(Optional.empty());

        assertThatThrownBy(() -> service.delete(messageId))
                .isInstanceOf(ResourceNotFoundException.class)
                .hasMessage("Contact message not found");

        verify(repository, times(1)).findById(messageId);
        verify(repository, never()).deleteById(any());
    }

    @Test
    void shouldDeleteMultipleExistingMessages() {
        UUID secondId = UUID.randomUUID();
        ContactMessage secondArchivedMessage = buildMessage(secondId, ContactMessageStatus.ARCHIVED, Instant.parse("2026-05-17T10:10:00Z"));

        when(repository.findAllByIds(List.of(messageId, secondId)))
                .thenReturn(List.of(archivedMessage, secondArchivedMessage));

        service.delete(List.of(messageId, secondId));

        verify(repository, times(1)).findAllByIds(List.of(messageId, secondId));
        verify(repository, times(1)).deleteAllByIds(List.of(messageId, secondId));
    }

    @Test
    void shouldThrowWhenBulkDeleteContainsMissingMessage() {
        UUID secondId = UUID.randomUUID();

        when(repository.findAllByIds(List.of(messageId, secondId)))
                .thenReturn(List.of(archivedMessage));

        assertThatThrownBy(() -> service.delete(List.of(messageId, secondId)))
                .isInstanceOf(ResourceNotFoundException.class)
                .hasMessage("One or more contact messages were not found");

        verify(repository, times(1)).findAllByIds(List.of(messageId, secondId));
        verify(repository, never()).deleteAllByIds(any());
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
