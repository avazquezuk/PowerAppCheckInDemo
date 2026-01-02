import { Location, ApiResponse } from '@/types';
import { ILocationService } from '../interfaces/ILocationService';
import { 
  BCLocation, 
  BCApiResponse,
  transformBCLocation 
} from './bcTypes';
import { 
  buildBCUrl, 
  bcEndpoints, 
  ODataFilterBuilder 
} from './bcConfig';
import { 
  withErrorHandling, 
  withRetry, 
  parseBCError 
} from './bcErrors';

/**
 * Business Central implementation of ILocationService.
 * 
 * Connects to Business Central's Location API to fetch work locations.
 */
export class BCLocationService implements ILocationService {
  private async fetchFromBC<T>(url: string): Promise<T> {
    const response = await fetch(url, {
      method: 'GET',
      headers: {
        'Accept': 'application/json',
        'Content-Type': 'application/json',
      },
    });

    if (!response.ok) {
      const body = await response.json().catch(() => ({}));
      throw parseBCError(response, body);
    }

    return response.json();
  }

  async getLocations(): Promise<ApiResponse<Location[]>> {
    return withErrorHandling(async () => {
      const filter = new ODataFilterBuilder()
        .equals('isActive', true)
        .build();

      const url = buildBCUrl(bcEndpoints.locations, { 
        '$filter': filter,
        '$orderby': 'name asc'
      });
      
      const result = await withRetry(() => 
        this.fetchFromBC<BCApiResponse<BCLocation>>(url)
      );

      return result.value.map(transformBCLocation);
    }, []);
  }

  async getLocationById(id: string): Promise<ApiResponse<Location>> {
    return withErrorHandling(async () => {
      const filter = new ODataFilterBuilder()
        .equals('code', id)
        .build();

      const url = buildBCUrl(bcEndpoints.locations, { '$filter': filter });
      
      const result = await withRetry(() => 
        this.fetchFromBC<BCApiResponse<BCLocation>>(url)
      );

      if (result.value.length === 0) {
        throw new Error('Location not found');
      }

      return transformBCLocation(result.value[0]);
    }, null as unknown as Location);
  }

  async searchLocations(query: string): Promise<ApiResponse<Location[]>> {
    return withErrorHandling(async () => {
      const filter = new ODataFilterBuilder()
        .contains('name', query)
        .and()
        .equals('isActive', true)
        .build();

      const url = buildBCUrl(bcEndpoints.locations, { 
        '$filter': filter,
        '$orderby': 'name asc',
        '$top': '20'
      });
      
      const result = await withRetry(() => 
        this.fetchFromBC<BCApiResponse<BCLocation>>(url)
      );

      return result.value.map(transformBCLocation);
    }, []);
  }

  async getNearbyLocations(
    latitude: number,
    longitude: number,
    radiusKm: number = 10
  ): Promise<ApiResponse<Location[]>> {
    // Business Central doesn't have native geo-queries, so we fetch all
    // and filter client-side. For production, consider a custom BC function.
    return withErrorHandling(async () => {
      const filter = new ODataFilterBuilder()
        .equals('isActive', true)
        .build();

      const url = buildBCUrl(bcEndpoints.locations, { 
        '$filter': filter 
      });
      
      const result = await withRetry(() => 
        this.fetchFromBC<BCApiResponse<BCLocation>>(url)
      );

      // Calculate distances and filter
      const locationsWithDistance = result.value
        .filter(l => l.latitude && l.longitude)
        .map(l => ({
          location: transformBCLocation(l),
          distance: this.calculateDistance(latitude, longitude, l.latitude, l.longitude),
        }))
        .filter(item => item.distance <= radiusKm)
        .sort((a, b) => a.distance - b.distance);

      return locationsWithDistance.map(item => item.location);
    }, []);
  }

  private calculateDistance(
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
}
