// API Configuration
// Auto-detect production or use environment variable
function getBackendBaseUrl(): string {
  if (import.meta.env.VITE_API_URL) {
    return import.meta.env.VITE_API_URL.replace('/api', '');
  }
  
  // Auto-detect: If frontend is on production server, use production backend
  if (typeof window !== 'undefined') {
    const currentHost = window.location.hostname;
    if (currentHost === '64.23.169.136' || currentHost.includes('64.23.169.136')) {
      return 'http://64.23.169.136:5656';
    }
  }
  
  // Default to localhost for local development
  return 'http://localhost:5656';
}

export const BACKEND_BASE_URL = getBackendBaseUrl();


