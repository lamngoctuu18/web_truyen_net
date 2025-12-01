import type { RequestOptions } from '../types/api.types';
import { API_BASE_URL, APP_CONFIG } from '../utils/constants';

class ApiService {
  private cache = new Map<string, { data: any; expires: number }>();
  private baseURL: string;

  constructor() {
    this.baseURL = API_BASE_URL;
  }

  private getCacheKey(url: string, params?: any): string {
    const searchParams = params ? `?${new URLSearchParams(params).toString()}` : '';
    return `${url}${searchParams}`;
  }

  private setCache(key: string, data: any, ttl: number = APP_CONFIG.CACHE_DURATION): void {
    this.cache.set(key, {
      data,
      expires: Date.now() + ttl,
    });
  }

  private getCache(key: string): any | null {
    const cached = this.cache.get(key);
    if (!cached) return null;
    
    if (Date.now() > cached.expires) {
      this.cache.delete(key);
      return null;
    }
    
    return cached.data;
  }

  async get<T = any>(
    endpoint: string, 
    options: RequestOptions = {}
  ): Promise<T> {
    const cacheKey = this.getCacheKey(endpoint, options.params);
    
    // Check cache first
    const cachedData = this.getCache(cacheKey);
    if (cachedData) {
      return cachedData;
    }

    try {
      // Build full URL - remove leading slash from endpoint if present
      const cleanEndpoint = endpoint.startsWith('/') ? endpoint.slice(1) : endpoint;
      const url = new URL(cleanEndpoint, this.baseURL.endsWith('/') ? this.baseURL : this.baseURL + '/');
      
      // Add query parameters
      if (options.params) {
        Object.keys(options.params).forEach(key => {
          if (options.params![key] !== undefined && options.params![key] !== null) {
            url.searchParams.append(key, options.params![key]);
          }
        });
      }

      const response = await fetch(url.toString(), {
        method: 'GET',
        headers: {
          'Content-Type': 'application/json',
          'Accept': 'application/json',
          ...options.headers,
        },
        signal: options.timeout ? AbortSignal.timeout(options.timeout) : undefined,
      });

      if (!response.ok) {
        throw new Error(`HTTP Error: ${response.status} ${response.statusText}`);
      }

      const data: T = await response.json();
      
      // Cache successful responses
      this.setCache(cacheKey, data);
      
      return data;
    } catch (error) {
      throw this.handleError(error);
    }
  }

  async post<T = any>(
    endpoint: string,
    body?: any,
    options: RequestOptions = {}
  ): Promise<T> {
    try {
      const url = new URL(endpoint, this.baseURL);

      const response = await fetch(url.toString(), {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Accept': 'application/json',
          ...options.headers,
        },
        body: body ? JSON.stringify(body) : undefined,
        signal: options.timeout ? AbortSignal.timeout(options.timeout) : undefined,
      });

      if (!response.ok) {
        throw new Error(`HTTP Error: ${response.status} ${response.statusText}`);
      }

      return await response.json();
    } catch (error) {
      throw this.handleError(error);
    }
  }

  private handleError(error: any): Error {
    if (error.name === 'AbortError') {
      return new Error('Request timeout');
    }
    
    if (error instanceof TypeError) {
      return new Error('Network error: Could not connect to server');
    }
    
    return error instanceof Error ? error : new Error('An unexpected error occurred');
  }

  clearCache(): void {
    this.cache.clear();
  }
}

export const apiService = new ApiService();
export default apiService;