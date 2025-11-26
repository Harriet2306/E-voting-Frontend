// API Configuration
// Auto-detect production or use environment variable
function getBackendBaseUrl(): string {
  if (import.meta.env.VITE_API_URL) {
    return import.meta.env.VITE_API_URL.replace('/api', '');
  }
  
  // Auto-detect: If frontend is on production server, use production backend
  if (typeof window !== 'undefined' && window.location) {
    const currentHost = window.location.hostname;
    
    // Check for production server IP
    if (currentHost === '64.23.169.136' || currentHost.includes('64.23.169.136')) {
      return 'http://64.23.169.136:5656';
    }
    
    // Check if running on localhost
    if (currentHost === 'localhost' || currentHost === '127.0.0.1' || currentHost.startsWith('192.168.') || currentHost.startsWith('10.')) {
      return 'http://localhost:5656';
    }
  }
  
  // Default to production for safety (when deployed)
  return 'http://64.23.169.136:5656';
}

export const BACKEND_BASE_URL = getBackendBaseUrl();


