package com.portfolio.portfolio_backend.infrastructure.persistence.adapter;

import com.portfolio.portfolio_backend.domain.model.ContactMessage;
import com.portfolio.portfolio_backend.domain.model.ContactMessageStatus;
import com.portfolio.portfolio_backend.domain.port.out.ContactMessageRepositoryPort;
import com.portfolio.portfolio_backend.infrastructure.persistence.entity.ContactMessageEntity;
import com.portfolio.portfolio_backend.infrastructure.persistence.mapper.ContactMessageMapper;
import com.portfolio.portfolio_backend.infrastructure.persistence.repository.JpaContactMessageRepository;
import jakarta.persistence.criteria.Predicate;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.data.jpa.domain.Specification;
import org.springframework.stereotype.Component;

import java.time.Instant;
import java.time.LocalDate;
import java.time.ZoneOffset;
import java.time.format.DateTimeFormatter;
import java.time.format.DateTimeParseException;
import java.util.ArrayList;
import java.util.List;
import java.util.Locale;
import java.util.Optional;
import java.util.UUID;

@Component
public class ContactMessageRepositoryAdapter implements ContactMessageRepositoryPort {

    private final JpaContactMessageRepository repository;
    private final ContactMessageMapper mapper;

    public ContactMessageRepositoryAdapter(
            JpaContactMessageRepository repository,
            ContactMessageMapper mapper
    ) {
        this.repository = repository;
        this.mapper = mapper;
    }

    @Override
    public Page<ContactMessage> findAll(Pageable pageable) {
        return repository.findAll(pageable).map(mapper::toDomain);
    }

    @Override
    public Page<ContactMessage> findByStatus(ContactMessageStatus status, Pageable pageable) {
        return repository.findByStatus(status, pageable).map(mapper::toDomain);
    }

    @Override
    public Page<ContactMessage> search(ContactMessageStatus status, String query, Pageable pageable) {
        String normalizedQuery = normalizeQuery(query);

        if (status == null && normalizedQuery.isBlank()) {
            return findAll(pageable);
        }

        if (status != null && normalizedQuery.isBlank()) {
            return findByStatus(status, pageable);
        }

        return repository.findAll(buildSearchSpecification(status, normalizedQuery), pageable)
                .map(mapper::toDomain);
    }

    @Override
    public Optional<ContactMessage> findById(UUID id) {
        return repository.findById(id).map(mapper::toDomain);
    }

    @Override
    public List<ContactMessage> findAllByIds(List<UUID> ids) {
        return repository.findAllById(ids)
                .stream()
                .map(mapper::toDomain)
                .toList();
    }

    @Override
    public ContactMessage save(ContactMessage message) {
        return mapper.toDomain(repository.save(mapper.toEntity(message)));
    }

    @Override
    public List<ContactMessage> saveAll(List<ContactMessage> messages) {
        return repository.saveAll(messages.stream().map(mapper::toEntity).toList())
                .stream()
                .map(mapper::toDomain)
                .toList();
    }

    @Override
    public long countAll() {
        return repository.count();
    }

    @Override
    public long countByStatus(ContactMessageStatus status) {
        return repository.countByStatus(status);
    }

    @Override
    public void deleteById(UUID id) {
        repository.deleteById(id);
    }

    @Override
    public void deleteAllByIds(List<UUID> ids) {
        repository.deleteAllById(ids);
    }

    private Specification<ContactMessageEntity> buildSearchSpecification(
            ContactMessageStatus status,
            String query
    ) {
        return (root, criteriaQuery, criteriaBuilder) -> {
            List<Predicate> predicates = new ArrayList<>();

            if (status != null) {
                predicates.add(criteriaBuilder.equal(root.get("status"), status));
            }

            if (!query.isBlank()) {
                String likeQuery = "%" + query.toLowerCase(Locale.ROOT) + "%";

                Predicate textPredicate = criteriaBuilder.or(
                        criteriaBuilder.like(criteriaBuilder.lower(root.<String>get("senderName")), likeQuery),
                        criteriaBuilder.like(criteriaBuilder.lower(root.<String>get("senderEmail")), likeQuery),
                        criteriaBuilder.like(criteriaBuilder.lower(root.<String>get("subject")), likeQuery),
                        criteriaBuilder.like(criteriaBuilder.lower(root.<String>get("message")), likeQuery)
                );

                Optional<DateRange> dateRange = parseDateRange(query);

                if (dateRange.isPresent()) {
                    DateRange range = dateRange.get();
                    textPredicate = criteriaBuilder.or(
                            textPredicate,
                            criteriaBuilder.between(root.<Instant>get("receivedAt"), range.start(), range.end())
                    );
                }

                predicates.add(textPredicate);
            }

            return criteriaBuilder.and(predicates.toArray(Predicate[]::new));
        };
    }

    private String normalizeQuery(String query) {
        if (query == null) {
            return "";
        }

        return query.trim().replaceAll("\\s+", " ");
    }

    private Optional<DateRange> parseDateRange(String query) {
        List<DateTimeFormatter> formatters = List.of(
                DateTimeFormatter.ISO_LOCAL_DATE,
                DateTimeFormatter.ofPattern("dd/MM/yyyy"),
                DateTimeFormatter.ofPattern("dd-MM-yyyy"),
                DateTimeFormatter.ofPattern("yyyy/MM/dd")
        );

        for (DateTimeFormatter formatter : formatters) {
            try {
                LocalDate date = LocalDate.parse(query, formatter);
                Instant start = date.atStartOfDay().toInstant(ZoneOffset.UTC);
                Instant end = date.plusDays(1).atStartOfDay().minusNanos(1).toInstant(ZoneOffset.UTC);

                return Optional.of(new DateRange(start, end));
            } catch (DateTimeParseException ignored) {
                // Ce format ne correspond pas : on essaie le suivant.
            }
        }

        return Optional.empty();
    }

    private record DateRange(Instant start, Instant end) {
    }
}