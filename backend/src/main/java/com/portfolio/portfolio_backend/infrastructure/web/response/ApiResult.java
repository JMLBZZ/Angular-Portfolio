package com.portfolio.portfolio_backend.infrastructure.web.response;

public class ApiResult<T> {

    private boolean success;
    private T data;
    private PageMetadata meta;
    private ApiError error;

    public ApiResult(boolean success, T data, PageMetadata meta) {
        this.success = success;
        this.data = data;
        this.meta = meta;
        this.error = null;
    }

    public ApiResult(ApiError error) {
        this.success = false;
        this.data = null;
        this.meta = null;
        this.error = error;
    }

    public boolean isSuccess() { return success; }
    public T getData() { return data; }
    public PageMetadata getMeta() { return meta; }
    public ApiError getError() { return error; }
}
