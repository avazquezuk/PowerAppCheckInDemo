import { Location, ApiResponse } from '@/types';
import { ILocationService } from '../interfaces/ILocationService';
import { mockLocations } from '../mockData';

// Simulated delay to mimic API calls
const delay = (ms: number) => new Promise(resolve => setTimeout(resolve, ms));

// Haversine formula to calculate distance between two points
function calculateDistance(
  lat1: number,
  lon1: number,
  lat2: number,
  lon2: number
): number {
  const R = 6371; // Earth's radius in km
  const dLat = ((lat2 - lat1) * Math.PI) / 180;
  const dLon = ((lon2 - lon1) * Math.PI) / 180;
  const a =
    Math.sin(dLat / 2) * Math.sin(dLat / 2) +
    Math.cos((lat1 * Math.PI) / 180) *
      Math.cos((lat2 * Math.PI) / 180) *
      Math.sin(dLon / 2) *
      Math.sin(dLon / 2);
  const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));
  return R * c;
}

/**
 * Mock implementation of ILocationService for local development.
 */
export class MockLocationService implements ILocationService {
  async getLocations(): Promise<ApiResponse<Location[]>> {
    await delay(300);
    return { data: mockLocations.filter(l => l.isActive), success: true };
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
        l.isActive &&
        (l.name.toLowerCase().includes(lowerQuery) ||
          l.address.toLowerCase().includes(lowerQuery))
    );
    return { data: results, success: true };
  }

  async getNearbyLocations(
    latitude: number,
    longitude: number,
    radiusKm: number = 10
  ): Promise<ApiResponse<Location[]>> {
    await delay(300);
    
    const locationsWithDistance = mockLocations
      .filter(l => l.isActive && l.latitude !== undefined && l.longitude !== undefined)
      .map(l => ({
        location: l,
        distance: calculateDistance(latitude, longitude, l.latitude!, l.longitude!),
      }))
      .filter(item => item.distance <= radiusKm)
      .sort((a, b) => a.distance - b.distance);
    
    return { data: locationsWithDistance.map(item => item.location), success: true };
  }
}
