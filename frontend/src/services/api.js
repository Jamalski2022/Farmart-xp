// api.js
import axios from 'axios';

const api = axios.create({
    baseURL: 'http://127.0.0.1:5000',
    withCredentials: true,
    headers: {
        'Content-Type': 'application/json',
    }
});

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

api.interceptors.response.use(
    (response) => response,
    (error) => {
        if (error.response?.status === 401) {
            localStorage.removeItem('accessToken');
            // Redirect to login if needed
            window.location.href = '/login';
        }
        return Promise.reject(error);
    }
);

export const authAPI = {
    login: (credentials) => api.post('/api/login', credentials),
    signup: (userData) => api.post('/api/signup', userData),
};

export const animalsAPI = {
    getAll: () => api.get('/api/animals'),
    getOne: (id) => api.get(`/api/animals/${id}`),
    create: (data) => api.post('/api/animals', data),
    update: (id, data) => api.put(`/api/animals/${id}`, data),
    delete: (id) => api.delete(`/api/animals/${id}`),
};

export const orderAPI = {
    create: (orderData) => api.post('/api/orders', orderData),
    getAll: () => api.get('/api/orders'),
    getOne: (id) => api.get(`/api/orders/${id}`),
    update: (id, data) => api.put(`/api/orders/${id}`, data),
    delete: (id) => api.delete(`/api/orders/${id}`),
    updateStatus: (id, status) => api.put(`/api/orders/${id}/status`, { status }),
};

// const animalsAPI = {
//     create: (formData) => {
//       return axios.post('/api/animals', formData, {
//         headers: {
//           'Content-Type': 'multipart/form-data'
//         }
//       });
//     },
//     update: (id, formData) => {
//       return axios.put(`/api/animals/${id}`, formData, {
//         headers: {
//           'Content-Type': 'multipart/form-data'
//         }
//       });
//     },
// };

export default api;