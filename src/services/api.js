import axios from 'axios';

const api = axios.create({
  baseURL: import.meta.env.VITE_API_URL || '/api',
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

// Auth API
export const authApi = {
  login: (email, password) => api.post('/auth/login', { email, password }),
};

// Projects
export const projectsApi = {
  getAll: (featured = false) => api.get('/projects', { params: featured ? { featured: true } : {} }),
  getOne: (id) => api.get(`/projects/${id}`),
  create: (data) => api.post('/projects', data),
  update: (id, data) => api.put(`/projects/${id}`, data),
  remove: (id) => api.delete(`/projects/${id}`),
};

// Certificates
export const certificatesApi = {
  getAll: (category) => api.get('/certificates', { params: category ? { category } : {} }),
  create: (data) => api.post('/certificates', data),
  update: (id, data) => api.put(`/certificates/${id}`, data),
  remove: (id) => api.delete(`/certificates/${id}`),
};

// Profile
export const profileApi = {
  get: () => api.get('/profile'),
  update: (data) => api.put('/profile', data),
};

// Skills
export const skillsApi = {
  getAll: () => api.get('/skills'),
  create: (data) => api.post('/skills', data),
  update: (id, data) => api.put(`/skills/${id}`, data),
  remove: (id) => api.delete(`/skills/${id}`),
};

// Education
export const educationApi = {
  getAll: () => api.get('/education'),
  create: (data) => api.post('/education', data),
  update: (id, data) => api.put(`/education/${id}`, data),
  remove: (id) => api.delete(`/education/${id}`),
};

// Experience
export const experienceApi = {
  getAll: () => api.get('/experience'),
  create: (data) => api.post('/experience', data),
  update: (id, data) => api.put(`/experience/${id}`, data),
  remove: (id) => api.delete(`/experience/${id}`),
};

// Contact
export const contactApi = {
  send: (data) => api.post('/contact/send', data),
  getMessages: () => api.get('/contact/messages'),
  markRead: (id) => api.patch(`/contact/messages/${id}/read`),
  remove: (id) => api.delete(`/contact/messages/${id}`),
};

const PORTFOLIO_CACHE_KEY = 'portfolio-cache-v1';

export const FALLBACK_PORTFOLIO = {
  profile: {
    name: 'Samuel AKINGENEYE',
    title: 'Software Engineer',
    bio: 'I build software that creates real impact across Africa through practical product engineering, AI experiences, and data-driven platforms.',
    location: 'Kigali, Rwanda',
    email: 'freshtalent491@gmail.com',
    availability: 'Available Now',
    socialLinks: {
      github: 'https://github.com/Samuel-AKINGENEYE',
      linkedin: 'https://linkedin.com/in/samuel-akingeneye',
      twitter: 'https://x.com/TalentFres47507',
    },
    avatar: '/avatar.jpg',
  },
  skills: [
    { name: 'React', category: 'Frontend', order: 1 },
    { name: 'Next.js', category: 'Frontend', order: 2 },
    { name: 'TypeScript', category: 'Frontend', order: 3 },
    { name: 'Node.js', category: 'Backend', order: 1 },
    { name: 'Express', category: 'Backend', order: 2 },
    { name: 'MongoDB', category: 'Database', order: 2 },
    { name: 'PostgreSQL', category: 'Database', order: 1 },
    { name: 'Git', category: 'Tools', order: 1 },
  ],
  projects: [
    {
      _id: 'fallback-project-1',
      title: 'AI Language Tutor',
      description: 'An interactive English-learning platform that helps students practice speaking, pronunciation, and conversation confidence with AI-guided feedback.',
      problem: 'Learners needed practical speaking practice beyond static lessons and expensive coaching.',
      solution: 'Built a conversational learning product with guided prompts, feedback loops, and scalable learning pathways.',
      techStack: ['React', 'Node.js', 'MongoDB', 'OpenAI'],
      liveUrl: 'https://example.com/ai-tutor',
      githubUrl: 'https://github.com/Samuel-AKINGENEYE',
      imageUrl: '',
    },
    {
      _id: 'fallback-project-2',
      title: 'Civic Engagement Platform',
      description: 'A service-request and community reporting dashboard that reduces friction between citizens and local service providers.',
      problem: 'Public service requests were fragmented, difficult to track, and slow to resolve.',
      solution: 'Created a simple platform for reporting issues, monitoring progress, and improving local accountability.',
      techStack: ['React', 'Express', 'PostgreSQL', 'Tailwind'],
      liveUrl: 'https://example.com/civic-platform',
      githubUrl: 'https://github.com/Samuel-AKINGENEYE',
      imageUrl: '',
    },
    {
      _id: 'fallback-project-3',
      title: 'Portfolio CMS',
      description: 'A modular portfolio admin system with secure authentication, content management, and image upload controls.',
      problem: 'Portfolio content was difficult to update without engineering support or a custom admin flow.',
      solution: 'Built a flexible content dashboard so the portfolio can be managed quickly and securely.',
      techStack: ['React', 'Node.js', 'MongoDB', 'JWT'],
      liveUrl: 'https://example.com/portfolio-cms',
      githubUrl: 'https://github.com/Samuel-AKINGENEYE',
      imageUrl: '',
    },
  ],
  certificates: [
    {
      _id: 'fallback-cert-1',
      name: 'AI Fundamentals',
      issuer: 'Learning Platform',
      category: 'AI/ML',
      issueDate: '2025-01-15',
      credentialUrl: 'https://example.com/cert/ai-fundamentals',
      imageUrl: '',
    },
    {
      _id: 'fallback-cert-2',
      name: 'Responsive Web Design',
      issuer: 'freeCodeCamp',
      category: 'Web Dev',
      issueDate: '2024-06-20',
      credentialUrl: 'https://example.com/cert/responsive-web-design',
      imageUrl: '',
    },
    {
      _id: 'fallback-cert-3',
      name: 'Cybersecurity Essentials',
      issuer: 'Training Partner',
      category: 'Cybersecurity',
      issueDate: '2024-11-05',
      credentialUrl: 'https://example.com/cert/cybersecurity',
      imageUrl: '',
    },
  ],
  education: [
    {
      _id: 'fallback-edu-1',
      institution: 'ALX Africa',
      degree: 'Software Engineering',
      field: 'Computer Science',
      startDate: '2024-01-01',
      endDate: '2024-12-01',
      current: false,
    },
    {
      _id: 'fallback-edu-2',
      institution: 'freeCodeCamp',
      degree: 'Full-Stack Development',
      field: 'Web Development',
      startDate: '2023-01-01',
      endDate: '2023-12-01',
      current: false,
    },
  ],
  experience: [
    {
      _id: 'fallback-exp-1',
      company: 'Independent Projects',
      position: 'Full Stack Developer',
      location: 'Kigali, Rwanda',
      startDate: '2024-03-01',
      current: true,
      achievements: [
        'Built AI-powered learning tools used by 300+ learners',
        'Improved service-request workflows for civic engagement use cases',
        'Delivered production-ready software with clean architecture and maintainable code',
      ],
    },
    {
      _id: 'fallback-exp-2',
      company: 'Open Source / Freelance',
      position: 'Frontend & Backend Engineer',
      location: 'Remote',
      startDate: '2023-01-01',
      endDate: '2024-02-01',
      current: false,
      achievements: [
        'Implemented responsive interfaces for business and education products',
        'Created APIs and admin dashboards for content and data management',
      ],
    },
  ],
};

export const portfolioCache = {
  read() {
    try {
      const raw = localStorage.getItem(PORTFOLIO_CACHE_KEY);
      if (!raw) return null;
      const parsed = JSON.parse(raw);
      return parsed?.data ?? null;
    } catch {
      return null;
    }
  },
  write(data) {
    try {
      localStorage.setItem(PORTFOLIO_CACHE_KEY, JSON.stringify({ ts: Date.now(), data }));
    } catch {
      // ignore storage issues in restricted or private browser modes
    }
  },
  getInitial() {
    return this.read() ?? FALLBACK_PORTFOLIO;
  },
};

export default api;
