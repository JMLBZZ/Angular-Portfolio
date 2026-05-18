package com.portfolio.portfolio_backend.web.controller;

import com.portfolio.portfolio_backend.application.service.ContactMessageService;
import com.portfolio.portfolio_backend.domain.model.ContactMessage;
import com.portfolio.portfolio_backend.domain.model.ContactMessageStats;
import com.portfolio.portfolio_backend.web.dto.BulkContactMessageRequestDTO;
import com.portfolio.portfolio_backend.web.dto.ContactMessageResponseDTO;
import com.portfolio.portfolio_backend.web.dto.ContactMessageStatsDTO;
import com.portfolio.portfolio_backend.web.response.ApiResult;
import com.portfolio.portfolio_backend.web.response.PageMetadata;
import jakarta.validation.Valid;
import org.springdoc.core.annotations.ParameterObject;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.data.domain.Sort;
import org.springframework.data.web.PageableDefault;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.web.bind.annotation.DeleteMapping;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PatchMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RequestParam;
import org.springframework.web.bind.annotation.RestController;

import java.util.List;
import java.util.Locale;
import java.util.UUID;

@RestController
@RequestMapping("/api/admin/messages")
@PreAuthorize("hasRole('ADMIN')")
public class AdminContactMessageController {

    private final ContactMessageService contactMessageService;

    public AdminContactMessageController(ContactMessageService contactMessageService) {
        this.contactMessageService = contactMessageService;
    }

    @GetMapping
    public ApiResult<List<ContactMessageResponseDTO>> getAll(
            @RequestParam(required = false) String status,
            @RequestParam(required = false, name = "q") String query,
            @ParameterObject
            @PageableDefault(page = 0, size = 10, sort = "receivedAt", direction = Sort.Direction.DESC) Pageable pageable
    ) {
        Page<ContactMessageResponseDTO> pageResult = contactMessageService
                .getAll(status, query, pageable)
                .map(this::toResponse);

        PageMetadata meta = new PageMetadata(
                pageResult.getNumber(),
                pageResult.getSize(),
                pageResult.getTotalElements(),
                pageResult.getTotalPages()
        );

        return new ApiResult<>(true, pageResult.getContent(), meta);
    }

    @GetMapping("/stats")
    public ContactMessageStatsDTO getStats() {
        ContactMessageStats stats = contactMessageService.getStats();

        return new ContactMessageStatsDTO(
                stats.getTotal(),
                stats.getUnread(),
                stats.getRead(),
                stats.getArchived()
        );
    }

    @GetMapping("/{id}")
    public ContactMessageResponseDTO getById(@PathVariable UUID id) {
        return toResponse(contactMessageService.getById(id));
    }

    @PatchMapping("/{id}/read")
    public ContactMessageResponseDTO markAsRead(@PathVariable UUID id) {
        return toResponse(contactMessageService.markAsRead(id));
    }

    @PatchMapping("/{id}/unread")
    public ContactMessageResponseDTO markAsUnread(@PathVariable UUID id) {
        return toResponse(contactMessageService.markAsUnread(id));
    }

    @PatchMapping("/{id}/archive")
    public ContactMessageResponseDTO archive(@PathVariable UUID id) {
        return toResponse(contactMessageService.archive(id));
    }

    @PatchMapping("/bulk/read")
    public List<ContactMessageResponseDTO> markBulkAsRead(@Valid @RequestBody BulkContactMessageRequestDTO request) {
        return contactMessageService.markAsRead(request.getIds())
                .stream()
                .map(this::toResponse)
                .toList();
    }

    @PatchMapping("/bulk/unread")
    public List<ContactMessageResponseDTO> markBulkAsUnread(@Valid @RequestBody BulkContactMessageRequestDTO request) {
        return contactMessageService.markAsUnread(request.getIds())
                .stream()
                .map(this::toResponse)
                .toList();
    }

    @PatchMapping("/bulk/archive")
    public List<ContactMessageResponseDTO> archiveBulk(@Valid @RequestBody BulkContactMessageRequestDTO request) {
        return contactMessageService.archive(request.getIds())
                .stream()
                .map(this::toResponse)
                .toList();
    }

    @DeleteMapping("/bulk")
    public void deleteBulk(@Valid @RequestBody BulkContactMessageRequestDTO request) {
        contactMessageService.delete(request.getIds());
    }

    @DeleteMapping("/{id}")
    public void delete(@PathVariable UUID id) {
        contactMessageService.delete(id);
    }

    private ContactMessageResponseDTO toResponse(ContactMessage message) {
        return new ContactMessageResponseDTO(
                message.getId(),
                message.getSenderName(),
                message.getSenderEmail(),
                message.getSubject(),
                message.getMessage(),
                message.getStatus().name().toLowerCase(Locale.ROOT),
                message.getReceivedAt(),
                message.getReadAt()
        );
    }
}