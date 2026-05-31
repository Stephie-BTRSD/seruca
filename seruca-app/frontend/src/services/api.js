import axios from 'axios';

const API = axios.create({ baseURL: '/api' });

API.interceptors.request.use(config => {
  const token = localStorage.getItem('token');
  if (token) config.headers.Authorization = `Bearer ${token}`;
  return config;
});

export const login = (data) => API.post('/auth/login', data);
export const register = (data) => API.post('/auth/register', data);

export const getUsers = () => API.get('/users');
export const updateUserRole = (id, role) => API.put(`/users/${id}/role`, { role });
export const deleteUser = (id) => API.delete(`/users/${id}`);

export const getCourses = () => API.get('/courses');
export const getPublishedCourses = () => API.get('/courses/published');
export const createCourse = (data) => API.post('/courses', data);
export const updateCourse = (id, data) => API.put(`/courses/${id}`, data);
export const deleteCourse = (id) => API.delete(`/courses/${id}`);

export const getTaxonomy = () => API.get('/taxonomy');
export const getTaxonomyChildren = (id) => API.get(`/taxonomy/${id}/children`);
export const createCategory = (data) => API.post('/taxonomy', data);

export const search = (q) => API.get(`/search?q=${encodeURIComponent(q)}`);

export const askAssistant = (question) => API.post('/assistant/ask', { question });
