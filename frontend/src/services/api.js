import { supabase, getProfile, getProjects, getCertificates, getSkills, getEducation, getExperience } from './supabase.js';

// Re-export Supabase functions
export const profileApi = {
  get: async () => ({ data: { data: await getProfile() } }),
  update: async (data) => ({ data: { data: await updateProfile(data) } }),
};

export const projectsApi = {
  getAll: async (featured = false) => ({ data: { data: await getProjects(featured) } }),
  getOne: async (id) => ({ data: { data: await getProject(id) } }),
  create: async (data) => ({ data: { data: await createProject(data) } }),
  update: async (id, data) => ({ data: { data: await updateProject(id, data) } }),
  remove: async (id) => ({ data: await deleteProject(id) }),
};

export const certificatesApi = {
  getAll: async () => ({ data: { data: await getCertificates() } }),
  create: async (data) => ({ data: { data: await createCertificate(data) } }),
  update: async (id, data) => ({ data: { data: await updateCertificate(id, data) } }),
  remove: async (id) => ({ data: await deleteCertificate(id) }),
};

export const skillsApi = {
  getAll: async () => ({ data: { data: await getSkills() } }),
  create: async (data) => ({ data: { data: await createSkill(data) } }),
  update: async (id, data) => ({ data: { data: await updateSkill(id, data) } }),
  remove: async (id) => ({ data: await deleteSkill(id) }),
};

export const educationApi = {
  getAll: async () => ({ data: { data: await getEducation() } }),
  create: async (data) => ({ data: { data: await createEducation(data) } }),
  update: async (id, data) => ({ data: { data: await updateEducation(id, data) } }),
  remove: async (id) => ({ data: await deleteEducation(id) }),
};

export const experienceApi = {
  getAll: async () => ({ data: { data: await getExperience() } }),
  create: async (data) => ({ data: { data: await createExperience(data) } }),
  update: async (id, data) => ({ data: { data: await updateExperience(id, data) } }),
  remove: async (id) => ({ data: await deleteExperience(id) }),
};

// Keep existing auth and contact APIs (they still use your backend)
export const authApi = {
  login: (email, password) => api.post('/auth/login', { email, password }),
};

export const contactApi = {
  send: (data) => api.post('/contact/send', data),
};

export const analyticsApi = {
  track: (data) => api.post('/analytics/track', data),
  getStats: (days = 30) => api.get('/analytics/stats', { params: { days } }),
};

export const uploadApi = {
  uploadAvatar: (file) => {
    const formData = new FormData();
    formData.append('avatar', file);
    return api.post('/upload/avatar', formData, {
      headers: { 'Content-Type': 'multipart/form-data' },
    });
  },
  uploadResume: (file) => {
    const formData = new FormData();
    formData.append('resume', file);
    return api.post('/upload/resume', formData, {
      headers: { 'Content-Type': 'multipart/form-data' },
    });
  },
};
