package com.portfolio.portfolio_backend.web.dto;

public class ContactMessageStatsDTO {

    private final long total;
    private final long unread;
    private final long read;
    private final long archived;

    public ContactMessageStatsDTO(long total, long unread, long read, long archived) {
        this.total = total;
        this.unread = unread;
        this.read = read;
        this.archived = archived;
    }

    public long getTotal() {
        return total;
    }

    public long getUnread() {
        return unread;
    }

    public long getRead() {
        return read;
    }

    public long getArchived() {
        return archived;
    }
}