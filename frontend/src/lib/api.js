import axios from 'axios';

const API_URL = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:5000/api';

const apiClient = axios.create({
  baseURL: API_URL,
  headers: {
    'Content-Type': 'application/json',
  },
});

// Add token to requests
apiClient.interceptors.request.use((config) => {
  const token = localStorage.getItem('token');
  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
  }
  return config;
});

// Auth API
export const authAPI = {
  register: (email, password, firstName, lastName, role) =>
    apiClient.post('/auth/register', { email, password, firstName, lastName, role }),
  login: (email, password) => apiClient.post('/auth/login', { email, password }),
  verify: () => apiClient.get('/auth/verify'),
};

// Internship API
export const internshipAPI = {
  getAll: (search, location, workMode) =>
    apiClient.get('/internships', { params: { search, location, workMode } }),
  getById: (id) => apiClient.get(`/internships/${id}`),
  create: (data) => apiClient.post('/internships', data),
  update: (id, data) => apiClient.put(`/internships/${id}`, data),
};

// Application API
export const applicationAPI = {
  getAll: (role) => apiClient.get('/applications', { params: { role } }),
  submit: (internshipId, coverLetter) =>
    apiClient.post('/applications/submit', { internshipId, coverLetter }),
  accept: (applicationId) => apiClient.post('/applications/accept', { applicationId }),
  reject: (applicationId, reason) =>
    apiClient.post('/applications/reject', { applicationId, reason }),
  verify: (verificationCode) => apiClient.post('/applications/verify', { verificationCode }),
  confirm: (acceptanceId) => apiClient.post('/applications/confirm', { acceptanceId }),
};

// Placement API
export const placementAPI = {
  markComplete: (placementId) => apiClient.post('/placements/mark-complete', { placementId }),
};

export default apiClient;
