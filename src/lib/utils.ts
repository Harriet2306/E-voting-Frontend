import { type ClassValue, clsx } from "clsx"
import { twMerge } from "tailwind-merge"

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs))
}

/**
 * Format a date string consistently without timezone conversion
 * This ensures dates display the same regardless of browser timezone
 * Parses the ISO string directly to avoid timezone conversion
 */
export function formatDate(dateString: string | Date): string {
  let date: Date;
  
  if (typeof dateString === 'string') {
    // Parse ISO string directly to avoid timezone conversion
    // If it's an ISO string with timezone, extract the date parts directly
    if (dateString.includes('T') && dateString.includes('Z')) {
      // UTC ISO string: "2025-11-26T22:22:00.000Z"
      const isoMatch = dateString.match(/^(\d{4})-(\d{2})-(\d{2})T(\d{2}):(\d{2}):(\d{2})/);
      if (isoMatch) {
        const [, year, month, day, hour, minute, second] = isoMatch;
        const hours = parseInt(hour, 10);
        const ampm = hours >= 12 ? 'PM' : 'AM';
        const displayHours = hours % 12 || 12;
        return `${month}/${day}/${year}, ${displayHours}:${minute}:${second} ${ampm}`;
      }
    }
    date = new Date(dateString);
  } else {
    date = dateString;
  }
  
  // Fallback: Format as: MM/DD/YYYY, HH:MM:SS AM/PM
  // Use UTC methods to avoid timezone conversion
  const year = date.getUTCFullYear();
  const month = String(date.getUTCMonth() + 1).padStart(2, '0');
  const day = String(date.getUTCDate()).padStart(2, '0');
  const hours = date.getUTCHours();
  const minutes = String(date.getUTCMinutes()).padStart(2, '0');
  const seconds = String(date.getUTCSeconds()).padStart(2, '0');
  const ampm = hours >= 12 ? 'PM' : 'AM';
  const displayHours = hours % 12 || 12;
  
  return `${month}/${day}/${year}, ${displayHours}:${minutes}:${seconds} ${ampm}`;
}
