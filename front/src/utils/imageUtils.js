/**
 * Utility functions for handling images
 */

const API_BASE_URL = import.meta.env.VITE_API_URL || 'http://localhost:5000';

/**
 * Get full image URL from relative or absolute path
 * @param {string} url - The image URL (can be relative like /uploads/... or absolute)
 * @returns {string} - Full URL that can be used in img src
 */
export const getImageUrl = (url) => {
  if (!url) return '';
  
  // If it's already a full URL or base64, return as-is
  if (url.startsWith('http') || url.startsWith('data:')) {
    return url;
  }
  
  // If it's a relative path like /uploads/..., prepend API base URL
  if (url.startsWith('/')) {
    return `${API_BASE_URL}${url}`;
  }
  
  return url;
};

export default { getImageUrl };
