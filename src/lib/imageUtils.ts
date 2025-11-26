/**
 * Get the backend base URL for serving static files (images, PDFs, etc.)
 * Detects if we're running on production server and uses production backend URL
 */
export function getBackendBaseUrl(): string {
  // Check if VITE_API_URL is explicitly set
  if (import.meta.env.VITE_API_URL) {
    const url = import.meta.env.VITE_API_URL.replace('/api', '');
    console.log('[imageUtils] Using VITE_API_URL:', url);
    return url;
  }
  
  // Auto-detect: If frontend is on production server, use production backend
  if (typeof window !== 'undefined' && window.location) {
    const currentHost = window.location.hostname;
    const currentOrigin = window.location.origin;
    
    console.log('[imageUtils] Detecting environment:', { currentHost, currentOrigin });
    
    // Check for production server IP
    if (currentHost === '64.23.169.136' || currentHost.includes('64.23.169.136')) {
      const prodUrl = 'http://64.23.169.136:5656';
      console.log('[imageUtils] Production detected, using:', prodUrl);
      return prodUrl;
    }
    
    // Check if running on localhost
    if (currentHost === 'localhost' || currentHost === '127.0.0.1' || currentHost.startsWith('192.168.') || currentHost.startsWith('10.')) {
      const localUrl = 'http://localhost:5656';
      console.log('[imageUtils] Local development detected, using:', localUrl);
      return localUrl;
    }
  }
  
  // Default to production for safety (when deployed)
  const defaultUrl = 'http://64.23.169.136:5656';
  console.log('[imageUtils] Using default production URL:', defaultUrl);
  return defaultUrl;
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

