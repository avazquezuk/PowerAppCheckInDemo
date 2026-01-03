import { Location, ApiResponse } from '@/types';
import { ILocationService } from '../interfaces/ILocationService';
import { mockLocations } from '../mockData';

// Simulated delay to mimic API calls
const delay = (ms: number) => new Promise(resolve => setTimeout(resolve, ms));

/**
 * Mock implementation of ILocationService for local development.
 * Uses LSC Work Location structure.
 */
export class MockLocationService implements ILocationService {
  async getLocations(): Promise<ApiResponse<Location[]>> {
    await delay(300);
    return { data: mockLocations.filter(l => l.status === 'Active'), success: true };
  }

  async getLocationById(id: string): Promise<ApiResponse<Location>> {
    await delay(200);
    const location = mockLocations.find(l => l.id === id);
    
    if (!location) {
      return { data: null as unknown as Location, success: false, error: 'Location not found' };
    }
    
    return { data: location, success: true };
  }

  async searchLocations(query: string): Promise<ApiResponse<Location[]>> {
    await delay(200);
    const lowerQuery = query.toLowerCase();
    const results = mockLocations.filter(
      l =>
        l.status === 'Active' &&
        (l.name.toLowerCase().includes(lowerQuery) ||
          l.id.toLowerCase().includes(lowerQuery) ||
          (l.workRegion && l.workRegion.toLowerCase().includes(lowerQuery)))
    );
    return { data: results, success: true };
  }

  async getNearbyLocations(
    _latitude: number,
    _longitude: number,
    _radiusKm: number = 10
  ): Promise<ApiResponse<Location[]>> {
    // LS Central Work Locations don't have geo-coordinates by default
    // Return all active locations
    await delay(300);
    return { data: mockLocations.filter(l => l.status === 'Active'), success: true };
  }
}
