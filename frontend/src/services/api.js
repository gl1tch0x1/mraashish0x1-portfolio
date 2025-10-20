import axios from 'axios';

const API_URL = import.meta.env.VITE_API_URL || 'http://localhost:5000/api';

const api = axios.create({
  baseURL: API_URL,
  headers: {
    'Content-Type': 'application/json',
  },
});

// Request interceptor
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

// Response interceptor
api.interceptors.response.use(
  (response) => response,
  (error) => {
    if (error.response?.status === 401) {
      localStorage.removeItem('token');
      // Optionally redirect to login
    }
    return Promise.reject(error);
  }
);

// API methods
export const projectsAPI = {
  getAll: (params) => api.get('/projects', { params }),
  getOne: (id) => api.get(`/projects/${id}`),
  create: (data) => api.post('/projects', data),
  update: (id, data) => api.put(`/projects/${id}`, data),
  delete: (id) => api.delete(`/projects/${id}`),
};

export const skillsAPI = {
  getAll: (params) => api.get('/skills', { params }),
  getOne: (id) => api.get(`/skills/${id}`),
  create: (data) => api.post('/skills', data),
  update: (id, data) => api.put(`/skills/${id}`, data),
  delete: (id) => api.delete(`/skills/${id}`),
};

export const servicesAPI = {
  getAll: (params) => api.get('/services', { params }),
  getOne: (id) => api.get(`/services/${id}`),
  create: (data) => api.post('/services', data),
  update: (id, data) => api.put(`/services/${id}`, data),
  delete: (id) => api.delete(`/services/${id}`),
};

export const timelineAPI = {
  getAll: () => api.get('/timeline'),
  getOne: (id) => api.get(`/timeline/${id}`),
  create: (data) => api.post('/timeline', data),
  update: (id, data) => api.put(`/timeline/${id}`, data),
  delete: (id) => api.delete(`/timeline/${id}`),
};

export const aboutAPI = {
  get: () => api.get('/about'),
  update: (data) => api.put('/about', data),
};

export const approachAPI = {
  getAll: (params) => api.get('/approach', { params }),
  getOne: (id) => api.get(`/approach/${id}`),
  create: (data) => api.post('/approach', data),
  update: (id, data) => api.put(`/approach/${id}`, data),
  delete: (id) => api.delete(`/approach/${id}`),
};

export const contactAPI = {
  submit: (data) => api.post('/contact', data),
  getAll: (params) => api.get('/contact', { params }),
  getOne: (id) => api.get(`/contact/${id}`),
  updateStatus: (id, status) => api.put(`/contact/${id}`, { status }),
  delete: (id) => api.delete(`/contact/${id}`),
};

export const cvAPI = {
  getCurrent: () => api.get('/cv'),
  download: () => api.get('/cv/download'),
  upload: (data) => api.post('/cv/upload', data),
  delete: (id) => api.delete(`/cv/${id}`),
  getAll: () => api.get('/cv/all'),
};

export const uploadAPI = {
  uploadImage: (file) => {
    const formData = new FormData();
    formData.append('image', file);

    const token = localStorage.getItem('adminToken');
    return axios.post(`${API_URL}/upload/image`, formData, {
      headers: {
        'Content-Type': 'multipart/form-data',
        'Authorization': `Bearer ${token}`
      }
    });
  }
};

export default api;

