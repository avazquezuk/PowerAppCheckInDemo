import { format, formatDistanceToNow, differenceInMinutes, parseISO } from 'date-fns';

/**
 * Format a date for display (e.g., "Jan 2, 2026")
 */
export function formatDate(date: Date | string): string {
  const d = typeof date === 'string' ? parseISO(date) : date;
  return format(d, 'MMM d, yyyy');
}

/**
 * Format a time for display (e.g., "9:30 AM")
 */
export function formatTime(date: Date | string): string {
  const d = typeof date === 'string' ? parseISO(date) : date;
  return format(d, 'h:mm a');
}

/**
 * Format a date and time together (e.g., "Jan 2, 2026 at 9:30 AM")
 */
export function formatDateTime(date: Date | string): string {
  const d = typeof date === 'string' ? parseISO(date) : date;
  return format(d, "MMM d, yyyy 'at' h:mm a");
}

/**
 * Get relative time (e.g., "2 hours ago")
 */
export function getRelativeTime(date: Date | string): string {
  const d = typeof date === 'string' ? parseISO(date) : date;
  return formatDistanceToNow(d, { addSuffix: true });
}

/**
 * Calculate duration between two dates in minutes
 */
export function calculateDurationMinutes(start: Date | string, end: Date | string | null): number {
  if (!end) return 0;
  const startDate = typeof start === 'string' ? parseISO(start) : start;
  const endDate = typeof end === 'string' ? parseISO(end) : end;
  return differenceInMinutes(endDate, startDate);
}

/**
 * Format duration in minutes to human readable (e.g., "2h 30m")
 */
export function formatDuration(minutes: number): string {
  if (minutes < 0) return '0m';
  
  const hours = Math.floor(minutes / 60);
  const mins = minutes % 60;
  
  if (hours === 0) {
    return `${mins}m`;
  }
  
  if (mins === 0) {
    return `${hours}h`;
  }
  
  return `${hours}h ${mins}m`;
}

/**
 * Format duration in minutes to hours with decimal (e.g., "2.5")
 */
export function formatDurationDecimal(minutes: number): string {
  const hours = minutes / 60;
  return hours.toFixed(1);
}

/**
 * Get start of day
 */
export function startOfDay(date: Date): Date {
  const d = new Date(date);
  d.setHours(0, 0, 0, 0);
  return d;
}

/**
 * Get end of day
 */
export function endOfDay(date: Date): Date {
  const d = new Date(date);
  d.setHours(23, 59, 59, 999);
  return d;
}

/**
 * Check if date is today
 */
export function isToday(date: Date | string): boolean {
  const d = typeof date === 'string' ? parseISO(date) : date;
  const today = new Date();
  return d.toDateString() === today.toDateString();
}
