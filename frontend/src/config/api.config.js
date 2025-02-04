// src/config/api.config.js
const API_CONFIG = {
    BASE_URL: 'http://localhost:5000/',
    ENDPOINTS: {
        ANIMALS: '/api/animals',
        LOGIN: '/login',
        SIGNUP: '/signup',
        ORDERS: 'api/orders',
        USERS: 'api/users'
    },
    HEADERS: {
        'Content-Type': 'application/json'
    }
};

export const getAuthHeader = () => {
    const token = localStorage.getItem('token');
    return token ? { Authorization: `Bearer ${token}` } : {};
};

export default API_CONFIG;