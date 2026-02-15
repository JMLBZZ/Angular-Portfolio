package com.portfolio.portfolio_backend.infrastructure.web.response;

public class ApiResponse<T> {

    private boolean success;
    private T data;
    private Object meta;

    public ApiResponse(boolean success, T data, Object meta) {
        this.success = success;
        this.data = data;
        this.meta = meta;
    }

    public boolean isSuccess() {
        return success;
    }

    public T getData() {
        return data;
    }

    public Object getMeta() {
        return meta;
    }
}
