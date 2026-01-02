import { Location, ApiResponse } from '@/types';

/**
 * Interface for Location service operations.
 * Implementations can use mock data or connect to Business Central.
 */
export interface ILocationService {
  /**
   * Get all active locations
   */
  getLocations(): Promise<ApiResponse<Location[]>>;

  /**
   * Get a location by its ID
   */
  getLocationById(id: string): Promise<ApiResponse<Location>>;

  /**
   * Search locations by name or address
   */
  searchLocations(query: string): Promise<ApiResponse<Location[]>>;

  /**
   * Get nearby locations based on coordinates
   */
  getNearbyLocations(
    latitude: number,
    longitude: number,
    radiusKm?: number
  ): Promise<ApiResponse<Location[]>>;
}
