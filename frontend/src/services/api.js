
import axios from 'axios';

// Create base API instance
const api = axios.create({
    baseURL: 'http://127.0.0.1:5000',
    withCredentials: true,
    headers: {
        'Content-Type': 'application/json',
    }
});

// Request interceptor for adding auth token
api.interceptors.request.use(
    (config) => {
        const token = localStorage.getItem('accessToken');
        if (token) {
            config.headers.Authorization = `Bearer ${token}`;
        }
        return config;
    },
    (error) => {
        return Promise.reject(error);
    }
);

// Response interceptor for handling errors
api.interceptors.response.use(
    (response) => response,
    (error) => {
        if (error.response?.status === 401) {
            localStorage.removeItem('accessToken');
            // Redirect to login if needed
        }
        return Promise.reject(error);
    }
);

// Auth API
export const authAPI = {
    login: (credentials) => api.post('/api/login', credentials),
    signup: (userData) => api.post('/api/signup', userData),
};

// Animals API
export const animalsAPI = {
    getAll: () => api.get('/api/animals'),
    getOne: (id) => api.get(`/api/animals/${id}`),
    create: (data) => api.post('/api/animals', data),
    update: (id, data) => api.put(`/api/animals/${id}`, data),
    delete: (id) => api.delete(`/api/animals/${id}`),
};

export const orderAPI = {
    create: (orderData) => api.post('/api/orders/', orderData),
    getAll: () => api.get('/api/orders/'),
    getOne: (id) => api.get(`/api/orders/${id}/`),
    update: (id, data) => api.put(`/api/orders/${id}/`, data),
    delete: (id) => api.delete(`/api/orders/${id}/`),
};

export default api;