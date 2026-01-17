/**
 * Authentication helper functions for token and user management
 * Provides secure storage and retrieval of auth data
 */

import { User } from './api';

// Storage keys
const STORAGE_KEYS = {
  ACCESS_TOKEN: 'access_token',
  REFRESH_TOKEN: 'refresh_token',
  USER: 'user',
} as const;

/**
 * Save authentication data to localStorage
 */
export const setAuth = (token: string, refreshToken: string, user: User): void => {
  try {
    localStorage.setItem(STORAGE_KEYS.ACCESS_TOKEN, token);
    localStorage.setItem(STORAGE_KEYS.REFRESH_TOKEN, refreshToken);
    localStorage.setItem(STORAGE_KEYS.USER, JSON.stringify(user));
  } catch (error) {
    console.error('Failed to save auth data:', error);
    throw new Error('Failed to save authentication data');
  }
};

/**
 * Get access token from localStorage
 */
export const getToken = (): string | null => {
  try {
    return localStorage.getItem(STORAGE_KEYS.ACCESS_TOKEN);
  } catch (error) {
    console.error('Failed to get access token:', error);
    return null;
  }
};

/**
 * Get refresh token from localStorage
 */
export const getRefreshToken = (): string | null => {
  try {
    return localStorage.getItem(STORAGE_KEYS.REFRESH_TOKEN);
  } catch (error) {
    console.error('Failed to get refresh token:', error);
    return null;
  }
};

/**
 * Get user data from localStorage
 */
export const getUser = (): User | null => {
  try {
    const userStr = localStorage.getItem(STORAGE_KEYS.USER);
    if (!userStr) return null;
    return JSON.parse(userStr) as User;
  } catch (error) {
    console.error('Failed to parse user data:', error);
    return null;
  }
};

/**
 * Update user data in localStorage
 */
export const updateUser = (userData: Partial<User>): void => {
  try {
    const currentUser = getUser();
    if (currentUser) {
      const updatedUser = { ...currentUser, ...userData };
      localStorage.setItem(STORAGE_KEYS.USER, JSON.stringify(updatedUser));
    }
  } catch (error) {
    console.error('Failed to update user data:', error);
  }
};

/**
 * Clear all authentication data from localStorage
 */
export const clearAuth = (): void => {
  try {
    localStorage.removeItem(STORAGE_KEYS.ACCESS_TOKEN);
    localStorage.removeItem(STORAGE_KEYS.REFRESH_TOKEN);
    localStorage.removeItem(STORAGE_KEYS.USER);
  } catch (error) {
    console.error('Failed to clear auth data:', error);
  }
};

/**
 * Check if user is logged in
 */
export const isLoggedIn = (): boolean => {
  const token = getToken();
  const user = getUser();
  return !!(token && user);
};

/**
 * Update only the access token (used during refresh)
 */
export const updateToken = (token: string): void => {
  try {
    localStorage.setItem(STORAGE_KEYS.ACCESS_TOKEN, token);
  } catch (error) {
    console.error('Failed to update access token:', error);
  }
};
