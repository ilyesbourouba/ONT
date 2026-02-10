/**
 * Admin Panel API Service
 */

const API_BASE_URL = import.meta.env.VITE_API_URL || 'http://localhost:5000/api';

/**
 * Get auth token from localStorage
 */
const getToken = () => localStorage.getItem('ont_admin_token');

/**
 * Generic fetch wrapper with auth
 */
async function fetchAPI(endpoint, options = {}) {
  const url = `${API_BASE_URL}${endpoint}`;
  const token = getToken();
  
  const config = {
    headers: {
      'Content-Type': 'application/json',
      ...(token && { Authorization: `Bearer ${token}` }),
      ...options.headers,
    },
    ...options,
  };

  const response = await fetch(url, config);
  const data = await response.json();
  
  if (!response.ok) {
    throw new Error(data.message || 'API request failed');
  }
  
  return data;
}

// ===================
// AUTH API
// ===================

export const authAPI = {
  login: (credentials) => fetchAPI('/auth/login', {
    method: 'POST',
    body: JSON.stringify(credentials),
  }),
  getMe: () => fetchAPI('/auth/me'),
  changePassword: (data) => fetchAPI('/auth/password', {
    method: 'PUT',
    body: JSON.stringify(data),
  }),
};

// ===================
// NEWS API
// ===================

export const newsAPI = {
  getAll: (page = 1, limit = 10) => fetchAPI(`/news?page=${page}&limit=${limit}`),
  getById: (id) => fetchAPI(`/news/${id}`),
  create: (data) => fetchAPI('/news', { method: 'POST', body: JSON.stringify(data) }),
  update: (id, data) => fetchAPI(`/news/${id}`, { method: 'PUT', body: JSON.stringify(data) }),
  delete: (id) => fetchAPI(`/news/${id}`, { method: 'DELETE' }),
};

// ===================
// ACTIVITIES API
// ===================

export const activitiesAPI = {
  getAll: (page = 1, limit = 10) => fetchAPI(`/activities?page=${page}&limit=${limit}`),
  getById: (id) => fetchAPI(`/activities/${id}`),
  create: (data) => fetchAPI('/activities', { method: 'POST', body: JSON.stringify(data) }),
  update: (id, data) => fetchAPI(`/activities/${id}`, { method: 'PUT', body: JSON.stringify(data) }),
  delete: (id) => fetchAPI(`/activities/${id}`, { method: 'DELETE' }),
};

// ===================
// UNESCO API
// ===================

export const unescoAPI = {
  // Combined data (for frontend)
  getAll: () => fetchAPI('/unesco'),
  
  // Sites
  getSites: () => fetchAPI('/unesco/sites'),
  getSiteById: (id) => fetchAPI(`/unesco/sites/${id}`),
  createSite: (data) => fetchAPI('/unesco/sites', { method: 'POST', body: JSON.stringify(data) }),
  updateSite: (id, data) => fetchAPI(`/unesco/sites/${id}`, { method: 'PUT', body: JSON.stringify(data) }),
  deleteSite: (id) => fetchAPI(`/unesco/sites/${id}`, { method: 'DELETE' }),
  
  // Content
  getContent: () => fetchAPI('/unesco/content'),
  updateContent: (data) => fetchAPI('/unesco/content', { method: 'PUT', body: JSON.stringify(data) }),
};

// ===================
// DESTINATIONS API
// ===================

export const destinationsAPI = {
  getAll: () => fetchAPI('/destinations'),
  getById: (id) => fetchAPI(`/destinations/${id}`),
  create: (data) => fetchAPI('/destinations', { method: 'POST', body: JSON.stringify(data) }),
  update: (id, data) => fetchAPI(`/destinations/${id}`, { method: 'PUT', body: JSON.stringify(data) }),
  delete: (id) => fetchAPI(`/destinations/${id}`, { method: 'DELETE' }),
};

// ===================
// VIRTUAL TOURS API
// ===================

export const virtualToursAPI = {
  getAll: () => fetchAPI('/virtual-tours'),
  getById: (id) => fetchAPI(`/virtual-tours/${id}`),
  create: (data) => fetchAPI('/virtual-tours', { method: 'POST', body: JSON.stringify(data) }),
  update: (id, data) => fetchAPI(`/virtual-tours/${id}`, { method: 'PUT', body: JSON.stringify(data) }),
  delete: (id) => fetchAPI(`/virtual-tours/${id}`, { method: 'DELETE' }),
};

// ===================
// CONTACT API
// ===================

export const contactAPI = {
  getAll: (page = 1, limit = 20) => fetchAPI(`/contact?page=${page}&limit=${limit}`),
  getById: (id) => fetchAPI(`/contact/${id}`),
  delete: (id) => fetchAPI(`/contact/${id}`, { method: 'DELETE' }),
};

// ===================
// UPLOAD API
// ===================

export const uploadAPI = {
  // Upload base64 image and get back URL
  uploadBase64: (image) => fetchAPI('/upload/base64', { 
    method: 'POST', 
    body: JSON.stringify({ image }) 
  }),
};

// ===================
// HERO API
// ===================

export const heroAPI = {
  getAll: () => fetchAPI('/hero'),
  getActive: () => fetchAPI('/hero/active'),
  getById: (id) => fetchAPI(`/hero/${id}`),
  create: (data) => fetchAPI('/hero', { method: 'POST', body: JSON.stringify(data) }),
  update: (id, data) => fetchAPI(`/hero/${id}`, { method: 'PUT', body: JSON.stringify(data) }),
  delete: (id) => fetchAPI(`/hero/${id}`, { method: 'DELETE' }),
};

// ===================
// ABOUT API
// ===================

export const aboutAPI = {
  // All data (for frontend)
  getAll: () => fetchAPI('/about'),
  
  // Content
  getContent: () => fetchAPI('/about/content'),
  updateContent: (data) => fetchAPI('/about/content', { method: 'PUT', body: JSON.stringify(data) }),
  
  // Missions
  getMissions: () => fetchAPI('/about/missions'),
  createMission: (data) => fetchAPI('/about/missions', { method: 'POST', body: JSON.stringify(data) }),
  updateMission: (id, data) => fetchAPI(`/about/missions/${id}`, { method: 'PUT', body: JSON.stringify(data) }),
  deleteMission: (id) => fetchAPI(`/about/missions/${id}`, { method: 'DELETE' }),
  
  // Stats
  getStats: (type) => fetchAPI(`/about/stats${type ? `?type=${type}` : ''}`),
  createStat: (data) => fetchAPI('/about/stats', { method: 'POST', body: JSON.stringify(data) }),
  updateStat: (id, data) => fetchAPI(`/about/stats/${id}`, { method: 'PUT', body: JSON.stringify(data) }),
  deleteStat: (id) => fetchAPI(`/about/stats/${id}`, { method: 'DELETE' }),
  
  // Pillars
  getPillars: () => fetchAPI('/about/pillars'),
  createPillar: (data) => fetchAPI('/about/pillars', { method: 'POST', body: JSON.stringify(data) }),
  updatePillar: (id, data) => fetchAPI(`/about/pillars/${id}`, { method: 'PUT', body: JSON.stringify(data) }),
  deletePillar: (id) => fetchAPI(`/about/pillars/${id}`, { method: 'DELETE' }),
  
  // FAQs
  getFaqs: () => fetchAPI('/about/faqs'),
  createFaq: (data) => fetchAPI('/about/faqs', { method: 'POST', body: JSON.stringify(data) }),
  updateFaq: (id, data) => fetchAPI(`/about/faqs/${id}`, { method: 'PUT', body: JSON.stringify(data) }),
  deleteFaq: (id) => fetchAPI(`/about/faqs/${id}`, { method: 'DELETE' }),
};

// ===================
// VISIT ALGERIA API
// ===================

export const visitAlgeriaAPI = {
  getContent: () => fetchAPI('/visit-algeria'),
  updateContent: (data) => fetchAPI('/visit-algeria', { method: 'PUT', body: JSON.stringify(data) }),
};

export default {
  auth: authAPI,
  news: newsAPI,
  activities: activitiesAPI,
  unesco: unescoAPI,
  destinations: destinationsAPI,
  virtualTours: virtualToursAPI,
  contact: contactAPI,
  upload: uploadAPI,
  hero: heroAPI,
  about: aboutAPI,
  visitAlgeria: visitAlgeriaAPI,
};
