/**
 * Power Apps Business Central Location Service
 * 
 * This implementation uses the Power Apps Business Central connector
 * to access work location data from LS Central.
 */

import { Location, ApiResponse } from '@/types';
import { ILocationService } from '../interfaces/ILocationService';
import { PowerAppsBCService } from './PowerAppsBCService';

export class PowerAppsBCLocationService implements ILocationService {
  private bcService: PowerAppsBCService;

  constructor() {
    this.bcService = new PowerAppsBCService();
  }

  async getLocations(): Promise<ApiResponse<Location[]>> {
    try {
      const filter = "status eq 'Active'";
      const locations = await this.bcService.listRecords<any>('workLocations', filter);
      const data = locations.map((loc: any): Location => ({
        id: loc.code || '',
        name: loc.name || '',
        workRegion: loc.workRegion || null,
        storeNo: loc.storeNo || null,
        responsiblePerson: loc.responsiblePerson || null,
        status: loc.status || 'Active',
        globalDimension1Code: loc.globalDimension1Code || null,
        globalDimension2Code: loc.globalDimension2Code || null,
      }));
      return { success: true, data };
    } catch (error) {
      console.error('Failed to get locations:', error);
      return { success: false, data: [], error: error instanceof Error ? error.message : 'Unknown error' };
    }
  }

  async getLocationById(id: string): Promise<ApiResponse<Location>> {
    try {
      const loc = await this.bcService.getRecord<any>('workLocations', id);
      const location: Location = {
        id: loc.code || '',
        name: loc.name || '',
        workRegion: loc.workRegion || null,
        storeNo: loc.storeNo || null,
        responsiblePerson: loc.responsiblePerson || null,
        status: loc.status || 'Active',
        globalDimension1Code: loc.globalDimension1Code || null,
        globalDimension2Code: loc.globalDimension2Code || null,
      };
      return { success: true, data: location };
    } catch (error) {
      console.error(`Failed to get location ${id}:`, error);
      return { success: false, data: null as any, error: error instanceof Error ? error.message : 'Unknown error' };
    }
  }

  async searchLocations(query: string): Promise<ApiResponse<Location[]>> {
    try {
      const filter = `contains(tolower(name), '${query.toLowerCase()}')`;
      const locations = await this.bcService.listRecords<any>('workLocations', filter);
      const data = locations.map((loc: any): Location => ({
        id: loc.code || '',
        name: loc.name || '',
        workRegion: loc.workRegion || null,
        storeNo: loc.storeNo || null,
        responsiblePerson: loc.responsiblePerson || null,
        status: loc.status || 'Active',
        globalDimension1Code: loc.globalDimension1Code || null,
        globalDimension2Code: loc.globalDimension2Code || null,
      }));
      return { success: true, data };
    } catch (error) {
      console.error('Failed to search locations:', error);
      return { success: false, data: [], error: error instanceof Error ? error.message : 'Unknown error' };
    }
  }

  async getNearbyLocations(
    _latitude: number,
    _longitude: number,
    _radiusKm?: number
  ): Promise<ApiResponse<Location[]>> {
    // Not implemented - requires geocoding data
    return { success: true, data: [] };
  }
}
