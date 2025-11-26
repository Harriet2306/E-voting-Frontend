import axios from 'axios';

// API Base URL - Vite exposes env variables through import.meta.env
// For production: Set VITE_API_URL=http://64.23.169.136:5656/api in .env.production
// For development: Uses fallback to http://64.23.169.136:5656/api
// Using type-safe access to Vite's environment variables
type ViteEnv = {
  readonly VITE_API_URL?: string;
};

const env = (import.meta as { env?: ViteEnv }).env;
const API_BASE_URL = env?.VITE_API_URL || 'http://64.23.169.136:5656/api';

const api = axios.create({
  baseURL: API_BASE_URL,
  headers: {
    'Content-Type': 'application/json',
  },
  timeout: 10000, // 10 second timeout for all requests
});

// Add token to requests if available
api.interceptors.request.use(
  (config) => {
    const token = localStorage.getItem('token');
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
  },
  (error) => {
    return Promise.reject(error);
  }
);

// Handle token expiration and account deactivation
api.interceptors.response.use(
  (response) => response,
  (error) => {
    // Log actual API errors (not extension errors) for debugging
    if (error.config && !error.config.url?.includes('chrome-extension')) {
      console.error('API Error:', {
        url: error.config?.url,
        method: error.config?.method,
        status: error.response?.status,
        message: error.response?.data?.error || error.message,
        data: error.response?.data
      });
    }

    if (error.response?.status === 401) {
      const errorMessage = error.response?.data?.error || '';
      // Don't redirect if it's an account deactivation - let the component handle it
      if (errorMessage.includes('inactive') || errorMessage.includes('deactivated')) {
        // Keep user in localStorage so ProtectedRoute can show deactivation message
        return Promise.reject(error);
      }
      localStorage.removeItem('token');
      localStorage.removeItem('user');
      window.location.href = '/admin/login';
    }
    return Promise.reject(error);
  }
);

export default api;

// Auth API
export const authAPI = {
  login: async (email: string, password: string) => {
    const response = await api.post('/auth/login', { email, password });
    return response.data;
  },
  register: async (data: any) => {
    const response = await api.post('/auth/register', data);
    return response.data;
  },
  getCurrentUser: async () => {
    const response = await api.get('/auth/me');
    return response.data;
  },
  forgotPassword: async (email: string) => {
    const response = await api.post('/auth/forgot-password', { email });
    return response.data;
  },
  verifyResetOTP: async (email: string, otp: string) => {
    const response = await api.post('/auth/verify-reset-otp', { email, otp });
    return response.data;
  },
  resetPassword: async (resetToken: string, newPassword: string) => {
    const response = await api.post('/auth/reset-password', { resetToken, newPassword });
    return response.data;
  },
};

// Positions API
export const positionsAPI = {
  getAll: async () => {
    const response = await api.get('/positions');
    return response.data;
  },
  getOpenPositions: async () => {
    const response = await api.get('/positions/open');
    return response.data;
  },
  create: async (data: any) => {
    const response = await api.post('/positions', data);
    return response.data;
  },
  update: async (id: string, data: any) => {
    const response = await api.put(`/positions/${id}`, data);
    return response.data;
  },
  extendTime: async (id: string, data: { extendNominationHours?: number; extendVotingHours?: number }) => {
    const response = await api.patch(`/positions/${id}/extend`, data);
    return response.data;
  },
  delete: async (id: string) => {
    const response = await api.delete(`/positions/${id}`);
    return response.data;
  },
};

// Candidates API
export const candidatesAPI = {
  getAll: async () => {
    const response = await api.get('/candidates');
    return response.data;
  },
  getMyNominations: async () => {
    const response = await api.get('/candidates/my');
    return response.data;
  },
  submitNomination: async (formData: FormData) => {
    const response = await api.post('/candidates', formData, {
      headers: {
        'Content-Type': 'multipart/form-data',
      },
    });
    return response.data;
  },
  approve: async (id: string, reason?: string) => {
    const response = await api.patch(`/candidates/${id}/approve`, { reason });
    return response.data;
  },
  reject: async (id: string, reason: string) => {
    const response = await api.patch(`/candidates/${id}/reject`, { reason });
    return response.data;
  },
  delete: async (id: string) => {
    const response = await api.delete(`/candidates/${id}`);
    return response.data;
  },
  deleteAll: async () => {
    const response = await api.delete('/candidates/all');
    return response.data;
  },
};

// Verification API
export const verificationAPI = {
  requestOTP: async (regNo: string) => {
    const response = await api.post('/verify/request-otp', { reg_no: regNo });
    return response.data;
  },
  confirmOTP: async (regNo: string, otp: string) => {
    const response = await api.post('/verify/confirm', { reg_no: regNo, otp });
    return response.data;
  },
};

// Votes API
export const votesAPI = {
  getBallot: async (token: string) => {
    const response = await api.get('/vote/ballot', {
      params: { token },
    });
    return response.data;
  },
  castVote: async (token: string, votes: any[]) => {
    const response = await api.post('/vote', { token, votes });
    return response.data;
  },
};

// Users API (Admin only)
export const usersAPI = {
  getAll: async () => {
    const response = await api.get('/users');
    return response.data;
  },
  getById: async (id: string) => {
    const response = await api.get(`/users/${id}`);
    return response.data;
  },
  create: async (data: {
    email: string;
    password: string;
    name: string;
    role: 'ADMIN' | 'OFFICER' | 'CANDIDATE';
    regNo?: string;
    program?: string;
    staffId?: string;
  }) => {
    const response = await api.post('/users', data);
    return response.data;
  },
  update: async (id: string, data: any) => {
    const response = await api.put(`/users/${id}`, data);
    return response.data;
  },
  delete: async (id: string) => {
    const response = await api.delete(`/users/${id}`);
    return response.data;
  },
  activate: async (id: string) => {
    const response = await api.patch(`/users/${id}/activate`);
    return response.data;
  },
  deactivate: async (id: string) => {
    const response = await api.patch(`/users/${id}/deactivate`);
    return response.data;
  },
};

// Voters API
export const votersAPI = {
  importCSV: async (formData: FormData) => {
    const response = await api.post('/voters/import', formData, {
      headers: {
        'Content-Type': 'multipart/form-data',
      },
    });
    return response.data;
  },
  getAll: async (params?: { page?: number; limit?: number; search?: string }) => {
    const response = await api.get('/voters', { params });
    return response.data;
  },
  deleteAll: async () => {
    const response = await api.delete('/voters/all');
    return response.data;
  },
};

// Reports API
export const reportsAPI = {
  getTurnout: async () => {
    const response = await api.get('/reports/turnout');
    return response.data;
  },
  getResults: async () => {
    const response = await api.get('/reports/results');
    return response.data;
  },
  getAuditLog: async (filters?: any) => {
    const response = await api.get('/reports/audit', { params: filters });
    return response.data;
  },
  export: async (type: string) => {
    const response = await api.get(`/reports/export/${type}`, {
      responseType: 'blob',
    });
    return response.data;
  },
};
