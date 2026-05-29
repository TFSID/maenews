// app/typing/Api.ts

/**
 * Generic wrapper for single-resource API responses.
 */
export interface ApiResponse<T> {
    data: T;
    message: string;
    status: number;
}

/**
 * Wrapper for paginated list API responses.
 */
export interface PaginatedResponse<T> {
    data: T[];
    meta: PaginationMeta;
}

/**
 * Pagination metadata returned by list endpoints.
 */
export interface PaginationMeta {
    page: number;
    perPage: number;
    total: number;
    totalPages: number;
}

/**
 * Determines whether the API layer uses local mock data or the live REST API.
 */
export type ApiMode = "mock" | "live";

/**
 * Runtime configuration for the API service.
 */
export interface ApiConfig {
    baseUrl: string;
    mode: ApiMode;
}
