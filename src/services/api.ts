import { API_CONFIG } from '../config/api.config';

interface ApiResponse<T> {
  data: T;
  status: number;
}

interface ApiError {
  message: string;
  statusCode: number;
  error?: string;
}

class Api {
  private baseURL = API_CONFIG.baseURL;
  private token: string | null = null;

  setToken(token: string) {
    this.token = token;
  }

  clearToken() {
    this.token = null;
  }

  private getHeaders(): HeadersInit {
    const headers: HeadersInit = {
      'Content-Type': 'application/json',
    };

    if (this.token) {
      headers['Authorization'] = `Bearer ${this.token}`;
    }

    return headers;
  }

  private async handleResponse<T>(response: Response): Promise<ApiResponse<T>> {
    if (!response.ok) {
      let errorMessage = 'An error occurred';
      try {
        const errorData: ApiError = await response.json();
        errorMessage = errorData.message || `HTTP error ${response.status}: ${response.statusText}`;
        throw new Error(errorMessage);
      } catch (parseError) {
        // If we can't parse the error response, throw a generic error with the status
        throw new Error(`HTTP error ${response.status}: ${response.statusText}`);
      }
    }

    const data = await response.json();
    return {
      data,
      status: response.status,
    };
  }

  async get<T>(endpoint: string): Promise<ApiResponse<T>> {
    try {
      const response = await fetch(`${this.baseURL}${endpoint}`, {
        method: 'GET',
        headers: this.getHeaders(),
      });
      return this.handleResponse<T>(response);
    } catch (error) {
      console.error(`GET ${endpoint} failed:`, error);
      throw error;
    }
  }

  async post<T>(endpoint: string, data?: unknown): Promise<ApiResponse<T>> {
    try {
      const response = await fetch(`${this.baseURL}${endpoint}`, {
        method: 'POST',
        headers: this.getHeaders(),
        body: data ? JSON.stringify(data) : undefined,
      });
      return this.handleResponse<T>(response);
    } catch (error) {
      console.error(`POST ${endpoint} failed:`, error);
      throw error;
    }
  }

  async patch<T>(endpoint: string, data?: unknown): Promise<ApiResponse<T>> {
    try {
      const response = await fetch(`${this.baseURL}${endpoint}`, {
        method: 'PATCH',
        headers: this.getHeaders(),
        body: data ? JSON.stringify(data) : undefined,
      });
      return this.handleResponse<T>(response);
    } catch (error) {
      console.error(`PATCH ${endpoint} failed:`, error);
      throw error;
    }
  }

  async delete(endpoint: string): Promise<void> {
    try {
      const response = await fetch(`${this.baseURL}${endpoint}`, {
        method: 'DELETE',
        headers: this.getHeaders(),
      });

      if (!response.ok) {
        let errorMessage = 'An error occurred';
        try {
          const errorData: ApiError = await response.json();
          errorMessage = errorData.message || `HTTP error ${response.status}: ${response.statusText}`;
        } catch {
          errorMessage = `HTTP error ${response.status}: ${response.statusText}`;
        }
        throw new Error(errorMessage);
      }
    } catch (error) {
      console.error(`DELETE ${endpoint} failed:`, error);
      throw error;
    }
  }

  // SPECIFIC ENDPOINTS
  async getPrivacyOptionsAndAvailableActivitiesMetaDataFromBackend() {
    const availableActivities = await this.get('/metadata/activities');
    const privacyOptions = await this.get('/metadata/privacy');
    return {
      availableActivities,
      privacyOptions
    };
  }

  async getRentalTypesOptionsMetaDataFromBackend() {
    return await this.get('/metadata/rental-types');
  }

  async getAccessibilityOptionsMetaDataFromBackend() {
    return await this.get('/metadata/accessibility');
  }

  async getRooftopFeaturesOptionsMetaDataFromBackend() {
    return await this.get('/metadata/features');
  }

  async getRooftopViewTypesMetaDataFromBackend() {
    return await this.get('/metadata/view-types');
  }

  async getGuidelinesOptionsFromBackend() {
    return await this.get('/metadata/guidelines');
  }

  async getCancellationPoliciesOptionsFromBackend() {
    return await this.get('/metadata/cancellation-policies');
  }
}

export const api = new Api(); 