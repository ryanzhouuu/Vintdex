export const API_BASE_URL = process.env.NEXT_PUBLIC_API_BASE_URL || 'http://localhost:3000/api';

export const API_ENDPOINTS = {
  items: '/items',
  search: '/search',
  recentSearches: '/recent-searches'
} as const;