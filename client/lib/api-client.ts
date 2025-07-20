/**
 * API Client for ZLC Administrator Frontend
 * Handles all HTTP requests to the backend with authentication
 */

import { API_CONFIG, ApiResponse, LoginRequest, LoginResponse, User, HealthResponse } from '../../shared/api';

class ApiClient {
  private baseURL: string;
  private accessToken: string | null = null;
  private refreshToken: string | null = null;

  constructor() {
    this.baseURL = API_CONFIG.BASE_URL;
    this.loadTokensFromStorage();
  }

  /**
   * Load tokens from localStorage
   */
  private loadTokensFromStorage() {
    if (typeof window !== 'undefined') {
      this.accessToken = localStorage.getItem('accessToken');
      this.refreshToken = localStorage.getItem('refreshToken');
    }
  }

  /**
   * Save tokens to localStorage
   */
  private saveTokensToStorage(accessToken: string, refreshToken: string) {
    if (typeof window !== 'undefined') {
      localStorage.setItem('accessToken', accessToken);
      localStorage.setItem('refreshToken', refreshToken);
      this.accessToken = accessToken;
      this.refreshToken = refreshToken;
    }
  }

  /**
   * Clear tokens from storage
   */
  private clearTokensFromStorage() {
    if (typeof window !== 'undefined') {
      localStorage.removeItem('accessToken');
      localStorage.removeItem('refreshToken');
      this.accessToken = null;
      this.refreshToken = null;
    }
  }

  /**
   * Get authorization headers
   */
  private getHeaders(includeAuth = true): HeadersInit {
    const headers: HeadersInit = {
      'Content-Type': 'application/json',
    };

    if (includeAuth && this.accessToken) {
      headers.Authorization = `Bearer ${this.accessToken}`;
    }

    return headers;
  }

  /**
   * Make HTTP request with automatic token refresh
   */
  private async request<T>(
    endpoint: string, 
    options: RequestInit = {}
  ): Promise<ApiResponse<T>> {
    const url = `${this.baseURL}${endpoint}`;
    
    console.log('🔵 API Request:', { 
      method: options.method || 'GET',
      url,
      baseURL: this.baseURL,
      endpoint,
      hasToken: !!this.accessToken 
    });
    
    try {
      const response = await fetch(url, {
        ...options,
        headers: {
          ...this.getHeaders(),
          ...options.headers,
        },
      });

      console.log('🔵 API Response:', { 
        status: response.status,
        statusText: response.statusText,
        url: response.url
      });

      const data = await response.json();
      console.log('🔵 API Data:', data);

      // If token expired, try to refresh
      if (response.status === 401 && this.refreshToken && endpoint !== API_CONFIG.ENDPOINTS.AUTH.REFRESH) {
        const refreshed = await this.refreshAccessToken();
        if (refreshed) {
          // Retry the original request with new token
          return this.request<T>(endpoint, options);
        } else {
          // Refresh failed, redirect to login
          this.clearTokensFromStorage();
          window.location.href = '/login';
          throw new Error('Session expired');
        }
      }

      if (!response.ok) {
        throw data;
      }

      return data;
    } catch (error) {
      console.error('🔥 API Request failed:', { 
        error: error.message || error,
        endpoint,
        url,
        type: error.name || 'Unknown',
        stack: error.stack
      });
      
      // Si es un error de red (Failed to fetch), dar más información
      if (error instanceof TypeError && error.message.includes('fetch')) {
        throw new Error(`Error de conexión: No se puede conectar al servidor en ${url}. Verifique que el backend esté ejecutándose.`);
      }
      
      throw error;
    }
  }

  /**
   * Refresh access token
   */
  private async refreshAccessToken(): Promise<boolean> {
    if (!this.refreshToken) return false;

    try {
      const response = await fetch(`${this.baseURL}${API_CONFIG.ENDPOINTS.AUTH.REFRESH}`, {
        method: 'POST',
        headers: this.getHeaders(false),
        body: JSON.stringify({ refreshToken: this.refreshToken }),
      });

      if (response.ok) {
        const data = await response.json();
        if (data.status === 'success' && data.data?.tokens) {
          this.saveTokensToStorage(data.data.tokens.accessToken, data.data.tokens.refreshToken);
          return true;
        }
      }
    } catch (error) {
      console.error('Token refresh failed:', error);
    }

    return false;
  }

  // Authentication Methods
  async login(credentials: LoginRequest): Promise<LoginResponse> {
    const response = await this.request<LoginResponse['data']>(
      API_CONFIG.ENDPOINTS.AUTH.LOGIN,
      {
        method: 'POST',
        body: JSON.stringify(credentials),
      }
    );

    if (response.status === 'success' && response.data?.tokens) {
      this.saveTokensToStorage(
        response.data.tokens.accessToken, 
        response.data.tokens.refreshToken
      );
    }

    return response as LoginResponse;
  }

  async register(userData: any): Promise<ApiResponse> {
    return this.request(API_CONFIG.ENDPOINTS.AUTH.REGISTER, {
      method: 'POST',
      body: JSON.stringify(userData),
    });
  }

  async logout(): Promise<void> {
    try {
      await this.request(API_CONFIG.ENDPOINTS.AUTH.LOGOUT, {
        method: 'POST',
        body: JSON.stringify({ refreshToken: this.refreshToken }),
      });
    } catch (error) {
      console.warn('Logout request failed:', error);
    } finally {
      this.clearTokensFromStorage();
    }
  }

  async forgotPassword(email: string): Promise<ApiResponse> {
    return this.request(API_CONFIG.ENDPOINTS.AUTH.FORGOT_PASSWORD, {
      method: 'POST',
      body: JSON.stringify({ email }),
    });
  }

  // User Methods
  async getProfile(): Promise<ApiResponse<User>> {
    return this.request<User>(API_CONFIG.ENDPOINTS.USERS.PROFILE);
  }

  async updateProfile(userData: Partial<User>): Promise<ApiResponse<User>> {
    return this.request<User>(API_CONFIG.ENDPOINTS.USERS.UPDATE_PROFILE, {
      method: 'PUT',
      body: JSON.stringify(userData),
    });
  }

  // System Methods
  async getHealth(): Promise<ApiResponse<HealthResponse>> {
    return this.request<HealthResponse>(API_CONFIG.ENDPOINTS.HEALTH);
  }

  // Module Methods
  async getAduanaData(): Promise<ApiResponse> {
    return this.request(`${API_CONFIG.ENDPOINTS.ADUANA}/documents`);
  }

  async getCalidadData(): Promise<ApiResponse> {
    return this.request(`${API_CONFIG.ENDPOINTS.CALIDAD}/inspections`);
  }

  async getLogisticaData(): Promise<ApiResponse> {
    return this.request(`${API_CONFIG.ENDPOINTS.LOGISTICA}/shipments`);
  }

  async getSoporteData(): Promise<ApiResponse> {
    return this.request(`${API_CONFIG.ENDPOINTS.SOPORTE}/tickets`);
  }

  async getVeracidadData(): Promise<ApiResponse> {
    return this.request(`${API_CONFIG.ENDPOINTS.VERACIDAD}/verifications`);
  }

  // Utility Methods
  isAuthenticated(): boolean {
    return !!this.accessToken;
  }

  getAccessToken(): string | null {
    return this.accessToken;
  }
}

// Export singleton instance
export const apiClient = new ApiClient();
export default apiClient;
