// API Configuration
// Centralized configuration for API base URL

const getBackendBaseURL = (): string => {
  // Check for environment variable first
  const envUrl = import.meta.env.VITE_API_URL;
  if (envUrl) {
    // Remove /api suffix if present, we'll add it in api.ts
    return envUrl.replace(/\/api$/, '');
  }
  // Default to hosted backend
  return 'http://64.23.169.136:5656';
};

export const BACKEND_BASE_URL = getBackendBaseURL();


