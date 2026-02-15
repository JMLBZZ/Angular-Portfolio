package com.portfolio.portfolio_backend.infrastructure.web.response;

public class PageMetadata {

    private int page;
    private int size;
    private long totalElements;
    private int totalPages;

    public PageMetadata(int page, int size, long totalElements, int totalPages) {
        this.page = page;
        this.size = size;
        this.totalElements = totalElements;
        this.totalPages = totalPages;
    }

    public int getPage() {
        return page;
    }

    public int getSize() {
        return size;
    }

    public long getTotalElements() {
        return totalElements;
    }

    public int getTotalPages() {
        return totalPages;
    }
}
