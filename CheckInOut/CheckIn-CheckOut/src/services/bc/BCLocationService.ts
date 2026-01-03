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
        .equals('status', 'Active')
        .build();

      const url = buildBCUrl(bcEndpoints.locations, { 
        '$filter': filter,
        '$orderby': 'description asc'
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
        .contains('description', query)
        .and()
        .equals('status', 'Active')
        .build();

      const url = buildBCUrl(bcEndpoints.locations, { 
        '$filter': filter,
        '$orderby': 'description asc',
        '$top': '20'
      });
      
      const result = await withRetry(() => 
        this.fetchFromBC<BCApiResponse<BCLocation>>(url)
      );

      return result.value.map(transformBCLocation);
    }, []);
  }

  async getNearbyLocations(
    _latitude: number,
    _longitude: number,
    _radiusKm: number = 10
  ): Promise<ApiResponse<Location[]>> {
    // LS Central Work Locations don't have geo-coordinates by default
    // Return all active locations instead
    return this.getLocations();
  }
}
