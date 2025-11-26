// API Configuration
// Use environment variable or default to localhost for development
export const BACKEND_BASE_URL = import.meta.env.VITE_API_URL?.replace('/api', '') || 'http://localhost:5656';


