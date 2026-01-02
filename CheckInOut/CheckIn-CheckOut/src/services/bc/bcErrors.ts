import { ApiResponse } from '@/types';

/**
 * Business Central API Error types
 */
export interface BCError {
  code: string;
  message: string;
  target?: string;
  details?: BCErrorDetail[];
}

export interface BCErrorDetail {
  code: string;
  message: string;
  target?: string;
}

/**
 * Custom error class for Business Central API errors
 */
export class BCApiError extends Error {
  public readonly code: string;
  public readonly statusCode: number;
  public readonly details?: BCErrorDetail[];

  constructor(
    message: string,
    code: string,
    statusCode: number,
    details?: BCErrorDetail[]
  ) {
    super(message);
    this.name = 'BCApiError';
    this.code = code;
    this.statusCode = statusCode;
    this.details = details;
  }

  /**
   * Create a user-friendly error message
   */
  toUserMessage(): string {
    switch (this.code) {
      case 'Authorization_RequestDenied':
        return 'You do not have permission to perform this action.';
      case 'Request_ResourceNotFound':
        return 'The requested resource was not found.';
      case 'BusinessCentral_RecordNotFound':
        return 'The record you are looking for does not exist.';
      case 'BusinessCentral_RecordLocked':
        return 'This record is currently being edited by another user.';
      case 'BusinessCentral_ValidationError':
        return this.message || 'Validation error. Please check your input.';
      case 'NetworkError':
        return 'Unable to connect to the server. Please check your connection.';
      default:
        return this.message || 'An unexpected error occurred.';
    }
  }
}

/**
 * Parse BC API error response
 */
export function parseBCError(response: Response, body: unknown): BCApiError {
  if (typeof body === 'object' && body !== null && 'error' in body) {
    const error = (body as { error: BCError }).error;
    return new BCApiError(
      error.message,
      error.code,
      response.status,
      error.details
    );
  }

  return new BCApiError(
    `HTTP Error ${response.status}`,
    `HTTP_${response.status}`,
    response.status
  );
}

/**
 * Wrap a BC service call with error handling
 */
export async function withErrorHandling<T>(
  operation: () => Promise<T>,
  fallbackData: T
): Promise<ApiResponse<T>> {
  try {
    const data = await operation();
    return { data, success: true };
  } catch (error) {
    if (error instanceof BCApiError) {
      return {
        data: fallbackData,
        success: false,
        error: error.toUserMessage(),
      };
    }

    if (error instanceof Error) {
      // Network errors
      if (error.message.includes('fetch') || error.message.includes('network')) {
        return {
          data: fallbackData,
          success: false,
          error: 'Unable to connect to the server. Please check your connection.',
        };
      }

      return {
        data: fallbackData,
        success: false,
        error: error.message,
      };
    }

    return {
      data: fallbackData,
      success: false,
      error: 'An unexpected error occurred.',
    };
  }
}

/**
 * Retry configuration for BC API calls
 */
export interface RetryConfig {
  maxRetries: number;
  delayMs: number;
  backoffMultiplier: number;
}

const defaultRetryConfig: RetryConfig = {
  maxRetries: 3,
  delayMs: 1000,
  backoffMultiplier: 2,
};

/**
 * Retry a BC API call with exponential backoff
 */
export async function withRetry<T>(
  operation: () => Promise<T>,
  config: Partial<RetryConfig> = {}
): Promise<T> {
  const { maxRetries, delayMs, backoffMultiplier } = { ...defaultRetryConfig, ...config };
  
  let lastError: Error | undefined;
  let currentDelay = delayMs;

  for (let attempt = 0; attempt <= maxRetries; attempt++) {
    try {
      return await operation();
    } catch (error) {
      lastError = error instanceof Error ? error : new Error(String(error));

      // Don't retry on certain errors
      if (error instanceof BCApiError) {
        if (error.statusCode === 401 || error.statusCode === 403 || error.statusCode === 404) {
          throw error;
        }
      }

      if (attempt < maxRetries) {
        await new Promise(resolve => setTimeout(resolve, currentDelay));
        currentDelay *= backoffMultiplier;
      }
    }
  }

  throw lastError;
}
