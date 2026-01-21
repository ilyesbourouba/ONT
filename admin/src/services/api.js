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
  getAll: () => fetchAPI('/unesco'),
  getById: (id) => fetchAPI(`/unesco/${id}`),
  create: (data) => fetchAPI('/unesco', { method: 'POST', body: JSON.stringify(data) }),
  update: (id, data) => fetchAPI(`/unesco/${id}`, { method: 'PUT', body: JSON.stringify(data) }),
  delete: (id) => fetchAPI(`/unesco/${id}`, { method: 'DELETE' }),
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

export default {
  auth: authAPI,
  news: newsAPI,
  activities: activitiesAPI,
  unesco: unescoAPI,
  destinations: destinationsAPI,
  virtualTours: virtualToursAPI,
  contact: contactAPI,
};
