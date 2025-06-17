import axios from 'axios';

const api = axios.create({
  baseURL: 'http://localhost:8000',
  withCredentials: true, // required for Sanctum
});

// Auto-set CSRF cookie before login
export const getCsrfCookie = () => api.get('/sanctum/csrf-cookie');

// Auth endpoints
export const loginRequest = (data) => api.post('/api/login', data);
export const logoutRequest = () => api.post('/api/logout');
export const fetchUserRequest = () => api.get('/api/user');

// Example: business endpoints
export const fetchContacts = () => api.get('/api/contacts');

export default api;
