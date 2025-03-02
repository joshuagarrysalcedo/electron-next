import { apiService, ApiResponse } from '../lib/api';

// Define the request and response types for this endpoint
export interface ExampleRequest {
  param1: string;
  param2: number;
}

export interface ExampleResponse {
  id: string;
  name: string;
  status: boolean;
  createdAt: string;
}

// API endpoint constants
const API_PATH = '/api/example';

/**
 * Example API service
 * 
 * This is a template for creating API endpoints.
 * Duplicate this file and customize for each new API endpoint.
 */
export const exampleApi = {
  /**
   * Get all examples
   */
  getAll: async (): Promise<ApiResponse<ExampleResponse[]>> => {
    return apiService.get<ExampleResponse[]>(API_PATH);
  },

  /**
   * Get example by ID
   */
  getById: async (id: string): Promise<ApiResponse<ExampleResponse>> => {
    return apiService.get<ExampleResponse>(`${API_PATH}/${id}`);
  },

  /**
   * Create a new example
   */
  create: async (data: ExampleRequest): Promise<ApiResponse<ExampleResponse>> => {
    return apiService.post<ExampleResponse>(API_PATH, data);
  },

  /**
   * Update an existing example
   */
  update: async (id: string, data: Partial<ExampleRequest>): Promise<ApiResponse<ExampleResponse>> => {
    return apiService.put<ExampleResponse>(`${API_PATH}/${id}`, data);
  },

  /**
   * Delete an example
   */
  delete: async (id: string): Promise<ApiResponse<void>> => {
    return apiService.delete<void>(`${API_PATH}/${id}`);
  },
};