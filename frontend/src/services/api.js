import axios from 'axios';

const api = axios.create({
  baseURL: import.meta.env.VITE_API_URL || 'https://samuel-ak-portfolio-api.onrender.com/api',
  timeout: 15000,
});

api.interceptors.request.use((config) => {
  const token = localStorage.getItem('adminToken');
  if (token) config.headers.Authorization = `Bearer ${token}`;
  return config;
});

api.interceptors.response.use(
  (res) => res,
  (err) => {
    if (err.response?.status === 401 && window.location.pathname.startsWith('/admin')) {
      localStorage.removeItem('adminToken');
      window.location.href = '/admin/login';
    }
    return Promise.reject(err);
  }
);

export const authApi = {
  login: (email, password) => api.post('/auth/login', { email, password }),
};

export const projectsApi = {
  getAll: (featured = false) => api.get('/projects', { params: featured ? { featured: true } : {} }),
  getOne: (id) => api.get(`/projects/${id}`),
  create: (data) => api.post('/projects', data),
  update: (id, data) => api.put(`/projects/${id}`, data),
  remove: (id) => api.delete(`/projects/${id}`),
};

export const certificatesApi = {
  getAll: (category) => api.get('/certificates', { params: category ? { category } : {} }),
  create: (data) => api.post('/certificates', data),
  update: (id, data) => api.put(`/certificates/${id}`, data),
  remove: (id) => api.delete(`/certificates/${id}`),
};

export const profileApi = {
  get: () => api.get('/profile'),
  update: (data) => api.put('/profile', data),
};

export const skillsApi = {
  getAll: () => api.get('/skills'),
  create: (data) => api.post('/skills', data),
  update: (id, data) => api.put(`/skills/${id}`, data),
  remove: (id) => api.delete(`/skills/${id}`),
};

export const educationApi = {
  getAll: () => api.get('/education'),
  create: (data) => api.post('/education', data),
  update: (id, data) => api.put(`/education/${id}`, data),
  remove: (id) => api.delete(`/education/${id}`),
};

export const experienceApi = {
  getAll: () => api.get('/experience'),
  create: (data) => api.post('/experience', data),
  update: (id, data) => api.put(`/experience/${id}`, data),
  remove: (id) => api.delete(`/experience/${id}`),
};

function fileToBase64(file) {
  return new Promise((resolve, reject) => {
    const reader = new FileReader();
    reader.onload = () => resolve(reader.result.split(',')[1]);
    reader.onerror = reject;
    reader.readAsDataURL(file);
  });
}

export const uploadApi = {
  uploadAvatar: async (file) => {
    const data = await fileToBase64(file);
    return api.post('/upload/avatar', { data, mimeType: file.type });
  },
  uploadResume: async (file) => {
    const data = await fileToBase64(file);
    return api.post('/upload/resume', { data });
  },
};

export const analyticsApi = {
  track: (data) => api.post('/analytics/track', data),
  getStats: (days = 30) => api.get('/analytics/stats', { params: { days } }),
};

export const contactApi = {
  send: (data) => api.post('/contact/send', data),
};

export default api;
