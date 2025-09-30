import { 
  RegisterType, 
  LoginType, 
  CreateProjectType, 
  CreateTransactionType,
  CarbonCalculatorType,
  UpdateProjectType,
  ApiResponse,
  UserType,
  ProjectType,
  TransactionType,
  CarbonCalculationResult
} from '@/shared/types';

const API_BASE = 'http://localhost:3001/api';

class ApiClient {
  private getAuthHeaders(): HeadersInit {
    const token = localStorage.getItem('token');
    return {
      'Content-Type': 'application/json',
      ...(token && { 'Authorization': `Bearer ${token}` })
    };
  }

  private getFormHeaders(): HeadersInit {
    const token = localStorage.getItem('token');
    return {
      ...(token && { 'Authorization': `Bearer ${token}` })
    };
  }

  async request<T>(url: string, options: RequestInit = {}): Promise<T> {
    const response = await fetch(`${API_BASE}${url}`, {
      ...options,
      headers: {
        ...this.getAuthHeaders(),
        ...options.headers,
      },
    });

    if (!response.ok) {
      const error = await response.json().catch(() => ({ error: 'Network error' }));
      throw new Error(error.error || `HTTP ${response.status}`);
    }

    return response.json();
  }

  // Auth methods
  async register(data: RegisterType): Promise<ApiResponse<{ token: string; user: UserType }>> {
    return this.request('/auth/register', {
      method: 'POST',
      body: JSON.stringify(data),
    });
  }

  async login(data: LoginType): Promise<ApiResponse<{ token: string; user: UserType }>> {
    return this.request('/auth/login', {
      method: 'POST',
      body: JSON.stringify(data),
    });
  }

  // Project methods (NGO)
  async createProject(data: CreateProjectType): Promise<ApiResponse<{ id: number }>> {
    return this.request('/projects', {
      method: 'POST',
      body: JSON.stringify(data),
    });
  }

  async getMyProjects(): Promise<ApiResponse<ProjectType[]>> {
    return this.request('/projects/my');
  }

  async uploadProjectPhoto(projectId: number, file: File): Promise<ApiResponse<{ id: number; url: string; filename: string }>> {
    const formData = new FormData();
    formData.append('photo', file);

    const response = await fetch(`${API_BASE}/projects/${projectId}/photos`, {
      method: 'POST',
      headers: this.getFormHeaders(),
      body: formData,
    });

    if (!response.ok) {
      const error = await response.json().catch(() => ({ error: 'Upload failed' }));
      throw new Error(error.error || `HTTP ${response.status}`);
    }

    return response.json();
  }

  async getProjectPhotos(projectId: number): Promise<ApiResponse<any[]>> {
    return this.request(`/projects/${projectId}/photos`);
  }

  // Admin methods
  async getAllProjects(): Promise<ApiResponse<ProjectType[]>> {
    return this.request('/admin/projects');
  }

  async updateProject(projectId: number, updates: UpdateProjectType): Promise<ApiResponse> {
    return this.request(`/admin/projects/${projectId}`, {
      method: 'PUT',
      body: JSON.stringify(updates),
    });
  }

  // Buyer methods
  async getVerifiedProjects(): Promise<ApiResponse<ProjectType[]>> {
    return this.request('/projects/verified');
  }

  async createTransaction(data: CreateTransactionType): Promise<ApiResponse<{ transactionId: string; certificateId: string; totalAmount: number }>> {
    return this.request('/transactions', {
      method: 'POST',
      body: JSON.stringify(data),
    });
  }

  async getMyTransactions(): Promise<ApiResponse<TransactionType[]>> {
    return this.request('/transactions/my');
  }

  // Carbon calculator
  async calculateEmissions(data: CarbonCalculatorType): Promise<ApiResponse<CarbonCalculationResult>> {
    return this.request('/calculator/emissions', {
      method: 'POST',
      body: JSON.stringify(data),
    });
  }

  // Certificate download
  getCertificateUrl(transactionId: string): string {
    return `${API_BASE}/transactions/${transactionId}/certificate`;
  }

  // Setup admin (for demo)
  async setupAdmin(): Promise<ApiResponse> {
    return this.request('/admin/setup');
  }
}

export const api = new ApiClient();

// Auth helpers
export const auth = {
  setToken(token: string): void {
    localStorage.setItem('token', token);
  },

  removeToken(): void {
    localStorage.removeItem('token');
  },

  getToken(): string | null {
    return localStorage.getItem('token');
  },

  setUser(user: UserType): void {
    localStorage.setItem('user', JSON.stringify(user));
  },

  getUser(): UserType | null {
    const user = localStorage.getItem('user');
    return user ? JSON.parse(user) : null;
  },

  removeUser(): void {
    localStorage.removeItem('user');
  },

  logout(): void {
    this.removeToken();
    this.removeUser();
  },

  isAuthenticated(): boolean {
    return !!this.getToken();
  }
};
