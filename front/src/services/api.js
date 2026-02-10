/**
 * API Service for ONT Backend
 * Handles all HTTP requests to the REST API
 */

const API_BASE_URL = import.meta.env.VITE_API_URL || 'http://localhost:5000/api';

/**
 * Generic fetch wrapper with error handling
 */
async function fetchAPI(endpoint, options = {}) {
  const url = `${API_BASE_URL}${endpoint}`;
  
  const config = {
    headers: {
      'Content-Type': 'application/json',
      ...options.headers,
    },
    ...options,
  };

  try {
    const response = await fetch(url, config);
    const data = await response.json();
    
    if (!response.ok) {
      throw new Error(data.message || 'API request failed');
    }
    
    return data;
  } catch (error) {
    console.error(`API Error [${endpoint}]:`, error);
    throw error;
  }
}

// ===================
// NEWS API
// ===================

export const newsAPI = {
  getAll: (page = 1, limit = 10, category) => {
    let endpoint = `/news?page=${page}&limit=${limit}`;
    if (category && category !== 'All' && category !== 'الكل') {
      endpoint += `&category=${category}`;
    }
    return fetchAPI(endpoint);
  },
  
  getById: (id) => fetchAPI(`/news/${id}`),
  
  like: (id) => fetchAPI(`/news/${id}/like`, { method: 'POST' }),
};

// ===================
// ACTIVITIES API
// ===================

export const activitiesAPI = {
  getAll: (page = 1, limit = 10) => fetchAPI(`/activities?page=${page}&limit=${limit}`),
  getById: (id) => fetchAPI(`/activities/${id}`),
};

// ===================
// UNESCO SITES API
// ===================

export const unescoAPI = {
  getAll: () => fetchAPI('/unesco'),
  getById: (id) => fetchAPI(`/unesco/${id}`),
};

// ===================
// DESTINATIONS API
// ===================

export const destinationsAPI = {
  getAll: () => fetchAPI('/destinations'),
  getById: (id) => fetchAPI(`/destinations/${id}`),
};

// ===================
// CONTACT API
// ===================

export const contactAPI = {
  submit: (formData) => fetchAPI('/contact', {
    method: 'POST',
    body: JSON.stringify(formData),
  }),
};

// ===================
// VIRTUAL TOURS API
// ===================

export const virtualToursAPI = {
  getAll: () => fetchAPI('/virtual-tours'),
  getById: (id) => fetchAPI(`/virtual-tours/${id}`),
};

// ===================
// TRANSLATIONS API
// ===================

export const translationsAPI = {
  get: (lang) => fetchAPI(`/translations/${lang}`),
  getAvailable: () => fetchAPI('/translations'),
};

// ===================
// HERO API
// ===================

export const heroAPI = {
  getActive: () => fetchAPI('/hero/active'),
};

// ===================
// ABOUT API
// ===================

export const aboutAPI = {
  getAll: () => fetchAPI('/about'),
};

// ===================
// VISIT ALGERIA API
// ===================

export const visitAlgeriaAPI = {
  getContent: () => fetchAPI('/visit-algeria'),
};

// Default export for convenience
export default {
  news: newsAPI,
  activities: activitiesAPI,
  unesco: unescoAPI,
  destinations: destinationsAPI,
  contact: contactAPI,
  virtualTours: virtualToursAPI,
  translations: translationsAPI,
  hero: heroAPI,
  about: aboutAPI,
  visitAlgeria: visitAlgeriaAPI,
};
