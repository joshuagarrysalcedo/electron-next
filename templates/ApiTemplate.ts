/**
 * API Template - A template for creating API services
 * 
 * @author Joshua Salcedo
 */

// Define request and response types
export interface ExampleRequest {
  // Define your request data structure
  id?: string;
  name: string;
  // Add more fields as needed
}

export interface ExampleResponse {
  // Define your response data structure
  id: string;
  name: string;
  createdAt: string;
  // Add more fields as needed
}

// Define error response
export interface ApiError {
  code: string;
  message: string;
  details?: any;
}

// Generic API response type
export interface ApiResponse<T = any> {
  data?: T;
  error?: ApiError;
  status: number;
}

// Base API URL
const API_BASE_URL = process.env.NEXT_PUBLIC_API_URL || 'https://api.example.com';

/**
 * Example API service
 */
const ExampleApiService = {
  /**
   * Get all items
   */
  getAll: async (): Promise<ApiResponse<ExampleResponse[]>> => {
    try {
      const response = await fetch(`${API_BASE_URL}/api/examples`);
      const data = await response.json();
      
      return {
        data,
        status: response.status
      };
    } catch (error) {
      return {
        error: {
          code: 'FETCH_ERROR',
          message: error instanceof Error ? error.message : 'Unknown error',
          details: error
        },
        status: 500
      };
    }
  },
  
  /**
   * Get item by ID
   */
  getById: async (id: string): Promise<ApiResponse<ExampleResponse>> => {
    try {
      const response = await fetch(`${API_BASE_URL}/api/examples/${id}`);
      const data = await response.json();
      
      return {
        data,
        status: response.status
      };
    } catch (error) {
      return {
        error: {
          code: 'FETCH_ERROR',
          message: error instanceof Error ? error.message : 'Unknown error',
          details: error
        },
        status: 500
      };
    }
  },
  
  /**
   * Create new item
   */
  create: async (data: ExampleRequest): Promise<ApiResponse<ExampleResponse>> => {
    try {
      const response = await fetch(`${API_BASE_URL}/api/examples`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify(data)
      });
      
      const responseData = await response.json();
      
      return {
        data: responseData,
        status: response.status
      };
    } catch (error) {
      return {
        error: {
          code: 'FETCH_ERROR',
          message: error instanceof Error ? error.message : 'Unknown error',
          details: error
        },
        status: 500
      };
    }
  },
  
  /**
   * Update existing item
   */
  update: async (id: string, data: Partial<ExampleRequest>): Promise<ApiResponse<ExampleResponse>> => {
    try {
      const response = await fetch(`${API_BASE_URL}/api/examples/${id}`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify(data)
      });
      
      const responseData = await response.json();
      
      return {
        data: responseData,
        status: response.status
      };
    } catch (error) {
      return {
        error: {
          code: 'FETCH_ERROR',
          message: error instanceof Error ? error.message : 'Unknown error',
          details: error
        },
        status: 500
      };
    }
  },
  
  /**
   * Delete item
   */
  delete: async (id: string): Promise<ApiResponse<void>> => {
    try {
      const response = await fetch(`${API_BASE_URL}/api/examples/${id}`, {
        method: 'DELETE'
      });
      
      return {
        status: response.status
      };
    } catch (error) {
      return {
        error: {
          code: 'FETCH_ERROR',
          message: error instanceof Error ? error.message : 'Unknown error',
          details: error
        },
        status: 500
      };
    }
  }
};

export default ExampleApiService;