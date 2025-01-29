// src/services/api.js
import axios from 'axios';

const API_URL = 'http://localhost:5000/api';

// Create axios instance with default config
const api = axios.create({
    baseURL: API_URL,
    headers: {
        'Content-Type': 'application/json'
    }
});

// Add token to requests if available
api.interceptors.request.use((config) => {
    const token = localStorage.getItem('token');
    if (token) {
        config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
});

// Add an interceptor to handle errors
api.interceptors.response.use(
    response => response,
    error => {
        console.error('API Error:', error);
        return Promise.reject(error);
    }
);

export const authAPI = {
    login: async (credentials) => {
        const response = await api.post('/login', credentials);
        if (response.data.access_token) {
            localStorage.setItem('token', response.data.access_token);
            localStorage.setItem('user', JSON.stringify(response.data.user));
        }
        return response.data;
    },
    
    signup: async (userData) => {
        const response = await api.post('/signup', userData);
        return response.data;
    },
    
    logout: () => {
        localStorage.removeItem('token');
        localStorage.removeItem('user');
    }
};

export const animalAPI = {
    getAllAnimals: () => api.get('/animals'),
    getAnimal: (id) => api.get(`/animals/${id}`),
    addAnimal: (animalData) => api.post('/animals', animalData),
    updateAnimal: (id, animalData) => api.put(`/animals/${id}`, animalData),
    deleteAnimal: (id) => api.delete(`/animals/${id}`)
};

export const orderAPI = {
    createOrder: (orderData) => api.post('/orders', orderData),
    getUserOrders: () => api.get('/orders'),
    getOrder: (id) => api.get(`/orders/${id}`)
};

export const userAPI = {
    getProfile: () => api.get('/profile'),
    updateProfile: (userData) => api.put('/users/profile', userData),
    getOrders: () => api.get('/orders')
};