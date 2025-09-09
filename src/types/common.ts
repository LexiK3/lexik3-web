// types/common.ts

// Generic API response wrapper
export interface ApiResponse<T> {
  success: true;
  data: T;
  message: string;
  timestamp: string;
}

// Books API response wrapper (has different structure)
export interface BooksApiResponse<T> {
  success: true;
  data: {
    items: T[];
    page: number;
    pageSize: number;
    totalItems: number;
    totalPages: number;
    hasNext: boolean;
    hasPrevious: boolean;
  };
  message: string;
  timestamp: string;
  errors: any[];
}

// API error response
export interface ApiError {
  success: false;
  error: {
    code: string;
    message: string;
    details?: Array<{
      field: string;
      message: string;
    }>;
  };
  timestamp: string;
}

// Pagination information
export interface PaginationInfo {
  page: number;
  pageSize: number;
  totalItems: number;
  totalPages: number;
  hasNext: boolean;
  hasPrevious: boolean;
}

// Generic paginated response
export interface PaginatedResponse<T> {
  items: T[];
  pagination: PaginationInfo;
}

// Loading states
export type LoadingState = 'idle' | 'loading' | 'succeeded' | 'failed';

// Generic entity with common fields
export interface BaseEntity {
  id: string;
  createdAt: string;
  updatedAt?: string;
}

// Generic entity with soft delete
export interface SoftDeletableEntity extends BaseEntity {
  deletedAt?: string;
  isDeleted: boolean;
}

// Generic entity with audit fields
export interface AuditableEntity extends BaseEntity {
  createdBy?: string;
  updatedBy?: string;
  version: number;
}
