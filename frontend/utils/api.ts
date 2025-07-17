import { LoginRequest, RegisterRequest, AuthResponse, ApiResponse, User } from '@/types/auth';

// Use relative URLs to leverage Next.js proxy instead of direct backend URLs
const API_BASE_URL = '';

class ApiClient {
  private baseURL: string;

  constructor(baseURL: string = API_BASE_URL) {
    this.baseURL = baseURL;
  }

  private getAuthHeaders(): HeadersInit {
    const token = typeof window !== 'undefined' ? localStorage.getItem('authToken') : null;
    return {
      'Content-Type': 'application/json',
      ...(token && { Authorization: `Bearer ${token}` }),
    };
  }

  private async request<T>(
    endpoint: string,
    options: RequestInit = {}
  ): Promise<T> {
    const url = `${this.baseURL}${endpoint}`;
    const response = await fetch(url, {
      headers: this.getAuthHeaders(),
      ...options,
    });

    if (!response.ok) {
      throw new Error(`HTTP error! status: ${response.status}`);
    }

    return response.json();
  }

  // Auth endpoints
  async login(data: LoginRequest): Promise<AuthResponse> {
    return this.request<AuthResponse>('/api/auth/login', {
      method: 'POST',
      body: JSON.stringify(data),
    });
  }

  async register(data: RegisterRequest): Promise<AuthResponse> {
    return this.request<AuthResponse>('/api/auth/register', {
      method: 'POST',
      body: JSON.stringify(data),
    });
  }

  async getProfile(): Promise<ApiResponse<{ user: User; organization: any }>> {
    return this.request<ApiResponse<{ user: User; organization: any }>>('/api/auth/profile');
  }

  async getOrganizationUsers(): Promise<ApiResponse<{ users: User[]; total: number }>> {
    return this.request<ApiResponse<{ users: User[]; total: number }>>('/api/organization/users');
  }
}

export const apiClient = new ApiClient();

// Auth utilities
export const auth = {
  login: async (data: LoginRequest) => {
    const response = await apiClient.login(data);
    if (response.success && response.token) {
      localStorage.setItem('authToken', response.token);
      if (response.user) {
        localStorage.setItem('user', JSON.stringify(response.user));
      }
    }
    return response;
  },

  register: async (data: RegisterRequest) => {
    const response = await apiClient.register(data);
    if (response.success && response.token) {
      localStorage.setItem('authToken', response.token);
      if (response.user) {
        localStorage.setItem('user', JSON.stringify(response.user));
      }
    }
    return response;
  },

  logout: () => {
    localStorage.removeItem('authToken');
    localStorage.removeItem('user');
    window.location.href = '/';
  },

  getToken: () => {
    return typeof window !== 'undefined' ? localStorage.getItem('authToken') : null;
  },

  getUser: (): User | null => {
    if (typeof window !== 'undefined') {
      const userStr = localStorage.getItem('user');
      return userStr ? JSON.parse(userStr) : null;
    }
    return null;
  },

  isAuthenticated: () => {
    return !!auth.getToken();
  }
};
