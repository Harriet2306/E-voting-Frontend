/**
 * Get the backend base URL for serving static files (images, PDFs, etc.)
 * Detects if we're running on production server and uses production backend URL
 */
export function getBackendBaseUrl(): string {
  // Check if VITE_API_URL is explicitly set
  if (import.meta.env.VITE_API_URL) {
    return import.meta.env.VITE_API_URL.replace('/api', '');
  }
  
  // Auto-detect: If frontend is on production server, use production backend
  const currentHost = window.location.hostname;
  if (currentHost === '64.23.169.136' || currentHost.includes('64.23.169.136')) {
    return 'http://64.23.169.136:5656';
  }
  
  // Default to localhost for local development
  return 'http://localhost:5656';
}

/**
 * Get the full URL for an uploaded file (photo, manifesto, etc.)
 */
export function getFileUrl(filePath: string | null | undefined): string | null {
  if (!filePath) return null;
  
  // If filePath already includes http, return as-is
  if (filePath.startsWith('http://') || filePath.startsWith('https://')) {
    return filePath;
  }
  
  // Ensure filePath starts with /
  const normalizedPath = filePath.startsWith('/') ? filePath : `/${filePath}`;
  
  return `${getBackendBaseUrl()}${normalizedPath}`;
}

