import axios from "axios";

const API_URL = import.meta.env.PROD
    ? 'https://vehicle-tracker-backend.onrender.com/api'
    : 'http://localhost:5000/api';

// Create axios instance
const api = axios.create({
    baseURL: API_URL,
    headers: {
        'Content-Type': 'application/json'
    }
});

// Add auth token to requests
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

// Auth API
export const authAPI = {
    login: (credentials) => api.post('/auth/login', credentials),
    register: (userData) => api.post('/auth/register', userData),
    forgotPassword: (email) => api.post('/auth/forgot-password', { email }),
    resetPassword: (token, password) => api.put(`/auth/reset-password/${token}`, { password }),
    getMe: () => api.get('/auth/me')
};

// Vehicle API
export const vehicleAPI = {
    getAll: () => api.get('/vehicles'),
    getOne: (id) => api.get(`/vehicles/${id}`),
    create: (data) => api.post('/vehicles', data),
    update: (id, data) => api.put(`/vehicles/${id}`, data),
    delete: (id) => api.delete(`/vehicles/${id}`),
    updateLocation: (id, location) => api.put(`/vehicles/${id}/location`, location),
    getByDriver: (driverId) => api.get(`/vehicles/driver/${driverId}`)
};

// Trip API
export const tripAPI = {
    getAll: () => api.get('/trips'),
    getOne: (id) => api.get(`/trips/${id}`),
    create: (data) => api.post('/trips', data),
    update: (id, data) => api.put(`/trips/${id}`, data),
    delete: (id) => api.delete(`/trips/${id}`),
    addLocation: (id, location) => api.post(`/trips/${id}/location`, location),
    complete: (id, data) => api.put(`/trips/${id}/complete`, data)
};

// Driver API
export const driverAPI = {
    getAll: () => api.get('/drivers'),
    getOne: (id) => api.get(`/drivers/${id}`),
    create: (data) => api.post('/drivers', data),
    update: (id, data) => api.put(`/drivers/${id}`, data),
    delete: (id) => api.delete(`/drivers/${id}`)
};

export default api;
