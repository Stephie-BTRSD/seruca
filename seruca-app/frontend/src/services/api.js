import axios from 'axios';

const API = axios.create({ baseURL: '/api' });

API.interceptors.request.use(config => {
  const token = localStorage.getItem('token');
  if (token) config.headers.Authorization = `Bearer ${token}`;
  return config;
});

// ── Auth ──
export const login    = (data) => API.post('/auth/login', data);
export const register = (data) => API.post('/auth/register', data);

// ── Users ──
export const getUsers        = ()           => API.get('/users');
export const getUser         = (id)         => API.get(`/users/${id}`);
export const updateUserRole  = (id, role)   => API.put(`/users/${id}/role`, { role });
export const updateUserProfile = (id, data) => API.put(`/users/${id}/profile`, data);
export const toggleUserActive  = (id, active) => API.put(`/users/${id}/active`, { active });
export const deleteUser      = (id)         => API.delete(`/users/${id}`);

// ── Courses ──
export const getCourses         = ()        => API.get('/courses');
export const getPublishedCourses = ()       => API.get('/courses/published');
export const createCourse       = (data)   => API.post('/courses', data);
export const updateCourse       = (id, data) => API.put(`/courses/${id}`, data);
export const deleteCourse       = (id)     => API.delete(`/courses/${id}`);

// ── Taxonomy ──
export const getTaxonomy         = ()      => API.get('/taxonomy');
export const getTaxonomyChildren = (id)   => API.get(`/taxonomy/${id}/children`);
export const createCategory      = (data) => API.post('/taxonomy', data);

// ── Search ──
export const search = (q) => API.get(`/search?q=${encodeURIComponent(q)}`);

// ── AI Assistant ──
export const askAssistant = (question) => API.post('/assistant/ask', { question });