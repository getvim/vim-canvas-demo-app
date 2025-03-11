// Environment variables configuration
// This file handles environment variables for both local and production environments

// ScribeAI API Key
export const SCRIBEAI_API_KEY = import.meta.env.VITE_SCRIBEAI_API_KEY || process.env.SCRIBEAI_API_KEY;

// Auth configuration
export const CLIENT_ID = import.meta.env.CLIENT_ID || process.env.CLIENT_ID;
export const CLIENT_SECRET = import.meta.env.CLIENT_SECRET || process.env.CLIENT_SECRET;
export const REDIRECT_URL = import.meta.env.REDIRECT_URL || process.env.REDIRECT_URL || 
  (typeof window !== 'undefined' ? `${window.location.origin}` : 'http://localhost:8788');

// API Base URL
export const API_BASE_URL = "https://api-devs-8a32c93f7e2d.herokuapp.com";

// Log environment setup in development only
if (import.meta.env.DEV) {
  console.log('Environment configuration loaded');
  console.log('REDIRECT_URL:', REDIRECT_URL);
  console.log('API_BASE_URL:', API_BASE_URL);
} 