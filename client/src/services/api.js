import axios from 'axios';

// Create axios instance
const api = axios.create({
  baseURL: import.meta.env.VITE_API_URL || 'http://localhost:5000/api',
  headers: {
    'Content-Type': 'application/json',
  },
});

// Request interceptor - add auth token
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

// Response interceptor - handle errors
api.interceptors.response.use(
  (response) => response.data,
  (error) => {
    const message = error.response?.data?.message || 'An error occurred';
    return Promise.reject({ message, ...error.response?.data });
  }
);

// Auth API
export const authAPI = {
  register: (data) => api.post('/auth/register', data),
  getMe: () => api.get('/auth/me'),
  updateProfile: (data) => api.put('/auth/profile', data),
  syncUser: () => api.post('/auth/sync'),
  deleteAccount: () => api.delete('/auth/account'),
};

// Assessment API
export const assessmentAPI = {
  create: (data) => api.post('/assessments', data),
  getAll: (params) => api.get('/assessments', { params }),
  getById: (id) => api.get(`/assessments/${id}`),
  update: (id, data) => api.put(`/assessments/${id}`, data),
  delete: (id) => api.delete(`/assessments/${id}`),
  getStats: () => api.get('/assessments/stats/overview'),
};

// Voice API
export const voiceAPI = {
  upload: (formData) => api.post('/voice/upload', formData, {
    headers: { 'Content-Type': 'multipart/form-data' }
  }),
  transcribe: (data) => api.post('/voice/transcribe', data),
  analyze: (data) => api.post('/voice/analyze', data),
};

// Payment API
export const paymentAPI = {
  createCheckout: (data) => api.post('/payments/create-checkout-session', data),
  getHistory: () => api.get('/payments/history'),
  cancelSubscription: () => api.post('/payments/cancel-subscription'),
};

// Patient API (for doctors)
export const patientAPI = {
  getAll: (params) => api.get('/patients', { params }),
  getById: (id) => api.get(`/patients/${id}`),
  getAssessments: (id, params) => api.get(`/patients/${id}/assessments`, { params }),
};

export default api;
