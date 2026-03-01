import axios from 'axios';

const API_BASE_URL = import.meta.env.VITE_API_URL || 'http://localhost:5000/api';

const api = axios.create({
    baseURL: API_BASE_URL,
    headers: {
        'Content-Type': 'application/json'
    },
    withCredentials: true
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
    (error) => Promise.reject(error)
);

// Handle auth errors globally
api.interceptors.response.use(
    (response) => response,
    (error) => {
        if (error.response && error.response.status === 401) {
            // Token expired or invalid
            localStorage.removeItem('token');
            localStorage.removeItem('user');
            // Optionally redirect to login
        }
        return Promise.reject(error);
    }
);

// ======== AUTH API ========
export const authAPI = {
    register: (data) => api.post('/auth/register', data),
    login: (data) => api.post('/auth/login', data),
    getMe: () => api.get('/auth/me'),
    updateProfile: (data) => api.put('/auth/profile', data),
    forgotPassword: (data) => api.post('/auth/forgot-password', data),
    logout: () => api.get('/auth/logout')
};

// ======== CAMPS API ========
export const campsAPI = {
    getAll: (params) => api.get('/camps', { params }),
    getOne: (id) => api.get(`/camps/${id}`),
    create: (data) => api.post('/camps', data),
    update: (id, data) => api.put(`/camps/${id}`, data),
    delete: (id) => api.delete(`/camps/${id}`)
};

// ======== SAFE HOMES API ========
export const safeHomesAPI = {
    getAll: (params) => api.get('/safe-homes', { params }),
    getOne: (id) => api.get(`/safe-homes/${id}`),
    create: (data) => api.post('/safe-homes', data),
    update: (id, data) => api.put(`/safe-homes/${id}`, data),
    delete: (id) => api.delete(`/safe-homes/${id}`)
};

// ======== REFUGEES API ========
export const refugeesAPI = {
    getAll: (params) => api.get('/refugees', { params }),
    getOne: (id) => api.get(`/refugees/${id}`),
    create: (data) => api.post('/refugees', data),
    update: (id, data) => api.put(`/refugees/${id}`, data),
    delete: (id) => api.delete(`/refugees/${id}`)
};

// ======== MISSING PERSONS API ========
export const missingPersonsAPI = {
    getAll: (params) => api.get('/missing-persons', { params }),
    getOne: (id) => api.get(`/missing-persons/${id}`),
    report: (formData) => api.post('/missing-persons', formData, {
        headers: { 'Content-Type': 'multipart/form-data' }
    }),
    update: (id, data) => api.put(`/missing-persons/${id}`, data),
    delete: (id) => api.delete(`/missing-persons/${id}`)
};

// ======== VOLUNTEERS API ========
export const volunteersAPI = {
    getAll: (params) => api.get('/volunteers', { params }),
    getOne: (id) => api.get(`/volunteers/${id}`),
    register: (data) => api.post('/volunteers', data),
    update: (id, data) => api.put(`/volunteers/${id}`, data),
    delete: (id) => api.delete(`/volunteers/${id}`)
};

// ======== DONATIONS API ========
export const donationsAPI = {
    getAll: (params) => api.get('/donations', { params }),
    create: (data) => api.post('/donations', data),
    update: (id, data) => api.put(`/donations/${id}`, data)
};

// ======== DASHBOARD API ========
export const dashboardAPI = {
    getStats: () => api.get('/dashboard/stats')
};

// ======== LANDSLIDES API ========
export const landslidesAPI = {
    getAll: (params) => api.get('/landslides', { params }),
    getRiskAssessment: (params) => api.get('/landslides/risk-assessment', { params })
};

// ======== ALERTS API ========
export const alertsAPI = {
    getRiskMap: () => api.get('/alerts/risk-map'),
    getLiveMarkers: () => api.get('/alerts/live-markers'),
    getManualAlerts: () => api.get('/alerts/manual'),
    broadcastManualAlert: (data) => api.post('/alerts/manual', data)
};

export default api;
