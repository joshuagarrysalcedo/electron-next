import { useElectron } from '../hooks/use-electron';

// Default API configuration
const API_CONFIG = {
  baseUrl: process.env.NEXT_PUBLIC_API_BASE_URL || 'https://api.example.com',
  timeout: 30000, // 30 seconds
  headers: {
    'Content-Type': 'application/json',
  },
};

// Generic type for API responses
export interface ApiResponse<T = any> {
  data?: T;
  error?: {
    code: string;
    message: string;
    details?: any;
  };
  status: number;
}

// Create an API service that handles both web and Electron environments
export class ApiService {
  private baseUrl: string;
  private headers: Record<string, string>;
  private timeout: number;
  private isElectron: boolean;

  constructor(config = API_CONFIG) {
    this.baseUrl = config.baseUrl;
    this.headers = { ...config.headers };
    this.timeout = config.timeout;
    this.isElectron = typeof window !== 'undefined' && !!(window as any).electron;
  }

  // Set auth token for requests
  setAuthToken(token: string | null) {
    if (token) {
      this.headers['Authorization'] = `Bearer ${token}`;
    } else {
      delete this.headers['Authorization'];
    }
  }

  // Handle API requests through Electron's IPC when in Electron environment
  private async callThroughElectron<T>(
    method: string,
    endpoint: string,
    data?: any
  ): Promise<ApiResponse<T>> {
    return new Promise((resolve) => {
      const requestId = `req_${Date.now()}_${Math.random().toString(36).substring(2, 9)}`;
      
      // Listen for the response
      (window as any).electron.receive('api-response', (response: any) => {
        if (response.requestId === requestId) {
          resolve(response.result);
        }
      });
      
      // Send request through IPC
      (window as any).electron.send('api-request', {
        requestId,
        method,
        endpoint,
        data,
      });
    });
  }

  // Make HTTP requests when in web environment
  private async callThroughFetch<T>(
    method: string,
    endpoint: string,
    data?: any
  ): Promise<ApiResponse<T>> {
    const url = `${this.baseUrl}${endpoint}`;
    const options: RequestInit = {
      method,
      headers: this.headers,
    };

    if (data) {
      if (method === 'GET') {
        // Convert data to query string for GET requests
        const params = new URLSearchParams();
        Object.entries(data).forEach(([key, value]) => {
          params.append(key, String(value));
        });
        const queryString = params.toString();
        if (queryString) {
          endpoint += `?${queryString}`;
        }
      } else {
        // Add body for non-GET requests
        options.body = JSON.stringify(data);
      }
    }

    try {
      const response = await fetch(url, options);
      const responseData = await response.json();
      
      return {
        data: responseData,
        status: response.status,
      };
    } catch (error) {
      return {
        error: {
          code: 'REQUEST_FAILED',
          message: error instanceof Error ? error.message : 'Unknown error',
          details: error,
        },
        status: 0,
      };
    }
  }

  // Generic request method that routes through Electron or direct HTTP based on environment
  async request<T = any>(
    method: 'GET' | 'POST' | 'PUT' | 'DELETE' | 'PATCH',
    endpoint: string,
    data?: any
  ): Promise<ApiResponse<T>> {
    if (this.isElectron) {
      return this.callThroughElectron<T>(method, endpoint, data);
    } else {
      return this.callThroughFetch<T>(method, endpoint, data);
    }
  }

  // Convenience methods for different HTTP verbs
  async get<T = any>(endpoint: string, params?: any): Promise<ApiResponse<T>> {
    return this.request<T>('GET', endpoint, params);
  }

  async post<T = any>(endpoint: string, data?: any): Promise<ApiResponse<T>> {
    return this.request<T>('POST', endpoint, data);
  }

  async put<T = any>(endpoint: string, data?: any): Promise<ApiResponse<T>> {
    return this.request<T>('PUT', endpoint, data);
  }

  async delete<T = any>(endpoint: string, data?: any): Promise<ApiResponse<T>> {
    return this.request<T>('DELETE', endpoint, data);
  }

  async patch<T = any>(endpoint: string, data?: any): Promise<ApiResponse<T>> {
    return this.request<T>('PATCH', endpoint, data);
  }
}

// Create a singleton instance
export const apiService = new ApiService();

// Custom hook for using the API in components
export function useApi() {
  const { isElectron } = useElectron();
  
  // We can add additional API-related functionality here if needed
  return {
    api: apiService,
    isElectron,
  };
}