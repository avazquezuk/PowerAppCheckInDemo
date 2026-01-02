import { Employee, Location, CheckInOutRecord } from '@/types';

/**
 * Format employee name for display
 */
export function formatEmployeeName(employee: Employee): string {
  return employee.name;
}

/**
 * Format location for display
 */
export function formatLocationDisplay(location: Location): string {
  return `${location.name} - ${location.address}`;
}

/**
 * Get initials from name (e.g., "John Doe" -> "JD")
 */
export function getInitials(name: string): string {
  return name
    .split(' ')
    .map(part => part.charAt(0).toUpperCase())
    .slice(0, 2)
    .join('');
}

/**
 * Format check-in record summary
 */
export function formatRecordSummary(record: CheckInOutRecord, location?: Location): string {
  const locationName = location?.name || 'Unknown Location';
  if (record.checkOutTime) {
    return `${locationName} - Completed`;
  }
  return `${locationName} - In Progress`;
}

/**
 * Get status color for UI
 */
export function getStatusColor(status: 'checked-in' | 'checked-out'): 'success' | 'warning' {
  return status === 'checked-in' ? 'success' : 'warning';
}

/**
 * Get status label for display
 */
export function getStatusLabel(status: 'checked-in' | 'checked-out'): string {
  return status === 'checked-in' ? 'Checked In' : 'Checked Out';
}

/**
 * Sort locations with recently used first
 */
export function sortLocationsByRecent(
  locations: Location[],
  recentLocationIds: string[]
): Location[] {
  return [...locations].sort((a, b) => {
    const aIndex = recentLocationIds.indexOf(a.id);
    const bIndex = recentLocationIds.indexOf(b.id);
    
    // If both are recent, sort by recency
    if (aIndex !== -1 && bIndex !== -1) {
      return aIndex - bIndex;
    }
    
    // Recent locations come first
    if (aIndex !== -1) return -1;
    if (bIndex !== -1) return 1;
    
    // Otherwise sort alphabetically
    return a.name.localeCompare(b.name);
  });
}

/**
 * Filter locations by search term
 */
export function filterLocations(locations: Location[], searchTerm: string): Location[] {
  if (!searchTerm.trim()) return locations;
  
  const term = searchTerm.toLowerCase();
  return locations.filter(
    location =>
      location.name.toLowerCase().includes(term) ||
      location.address.toLowerCase().includes(term) ||
      location.id.toLowerCase().includes(term)
  );
}

/**
 * Generate unique ID
 */
export function generateId(): string {
  return `${Date.now()}-${Math.random().toString(36).substr(2, 9)}`;
}
