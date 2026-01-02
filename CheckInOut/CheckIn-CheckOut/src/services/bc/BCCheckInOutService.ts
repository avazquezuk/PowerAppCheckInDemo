import {
  CheckInOutRecord,
  CurrentStatus,
  CheckInFormData,
  CheckOutFormData,
  HistoryFilters,
  TimeSummary,
  ApiResponse,
} from '@/types';
import { ICheckInOutService } from '../interfaces/ICheckInOutService';
import { 
  BCCheckInOutRecord, 
  BCApiResponse,
  transformBCCheckInOutRecord 
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
import { BCLocationService } from './BCLocationService';

/**
 * Business Central implementation of ICheckInOutService.
 * 
 * Handles all check-in/out operations against Business Central.
 */
export class BCCheckInOutService implements ICheckInOutService {
  private locationService = new BCLocationService();

  private async fetchFromBC<T>(url: string, options?: RequestInit): Promise<T> {
    const response = await fetch(url, {
      method: 'GET',
      headers: {
        'Accept': 'application/json',
        'Content-Type': 'application/json',
      },
      ...options,
    });

    if (!response.ok) {
      const body = await response.json().catch(() => ({}));
      throw parseBCError(response, body);
    }

    return response.json();
  }

  private async postToBC<T>(url: string, data: object): Promise<T> {
    const response = await fetch(url, {
      method: 'POST',
      headers: {
        'Accept': 'application/json',
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(data),
    });

    if (!response.ok) {
      const body = await response.json().catch(() => ({}));
      throw parseBCError(response, body);
    }

    return response.json();
  }

  private async patchBC<T>(url: string, data: object, etag: string): Promise<T> {
    const response = await fetch(url, {
      method: 'PATCH',
      headers: {
        'Accept': 'application/json',
        'Content-Type': 'application/json',
        'If-Match': etag,
      },
      body: JSON.stringify(data),
    });

    if (!response.ok) {
      const body = await response.json().catch(() => ({}));
      throw parseBCError(response, body);
    }

    return response.json();
  }

  async getCurrentStatus(employeeId: string): Promise<ApiResponse<CurrentStatus>> {
    return withErrorHandling(async () => {
      const filter = new ODataFilterBuilder()
        .equals('employeeNo', employeeId)
        .and()
        .isNull('checkOutDateTime')
        .build();

      const url = buildBCUrl(bcEndpoints.checkInOutRecords, { 
        '$filter': filter,
        '$top': '1'
      });
      
      const result = await withRetry(() => 
        this.fetchFromBC<BCApiResponse<BCCheckInOutRecord>>(url)
      );

      if (result.value.length > 0) {
        const record = transformBCCheckInOutRecord(result.value[0]);
        const locationResult = await this.locationService.getLocationById(record.locationId);
        
        return {
          status: 'checked-in' as const,
          currentRecord: record,
          location: locationResult.success ? locationResult.data : null,
        };
      }

      return {
        status: 'checked-out' as const,
        currentRecord: null,
        location: null,
      };
    }, { status: 'checked-out', currentRecord: null, location: null });
  }

  async checkIn(
    employeeId: string,
    data: CheckInFormData
  ): Promise<ApiResponse<CheckInOutRecord>> {
    return withErrorHandling(async () => {
      // First check if already checked in
      const currentStatus = await this.getCurrentStatus(employeeId);
      if (currentStatus.data.status === 'checked-in') {
        throw new Error('Already checked in. Please check out first.');
      }

      const now = new Date();
      const bcRecord = {
        employeeNo: employeeId,
        locationCode: data.locationId,
        checkInDateTime: now.toISOString(),
        notes: data.notes || '',
      };

      const url = buildBCUrl(bcEndpoints.checkInOutRecords);
      const result = await withRetry(() => 
        this.postToBC<BCCheckInOutRecord>(url, bcRecord)
      );

      return transformBCCheckInOutRecord(result);
    }, null as unknown as CheckInOutRecord);
  }

  async checkOut(
    employeeId: string,
    data: CheckOutFormData
  ): Promise<ApiResponse<CheckInOutRecord>> {
    return withErrorHandling(async () => {
      // Find open check-in
      const filter = new ODataFilterBuilder()
        .equals('employeeNo', employeeId)
        .and()
        .isNull('checkOutDateTime')
        .build();

      const url = buildBCUrl(bcEndpoints.checkInOutRecords, { '$filter': filter });
      const result = await withRetry(() => 
        this.fetchFromBC<BCApiResponse<BCCheckInOutRecord>>(url)
      );

      if (result.value.length === 0) {
        throw new Error('No active check-in found.');
      }

      const record = result.value[0];
      const now = new Date();
      const checkInTime = new Date(record.checkInDateTime);
      const durationMinutes = Math.round(
        (now.getTime() - checkInTime.getTime()) / (1000 * 60)
      );

      const updateData = {
        checkOutDateTime: now.toISOString(),
        durationMinutes,
        notes: data.notes 
          ? `${record.notes} | ${data.notes}`.trim() 
          : record.notes,
      };

      // Note: In real BC, you'd need to get the etag from the record
      const etag = '*'; // Simplified for demo
      const updateUrl = `${buildBCUrl(bcEndpoints.checkInOutRecords)}(${record.systemId})`;
      const updated = await this.patchBC<BCCheckInOutRecord>(updateUrl, updateData, etag);

      return transformBCCheckInOutRecord(updated);
    }, null as unknown as CheckInOutRecord);
  }

  async getHistory(
    employeeId: string,
    filters?: HistoryFilters
  ): Promise<ApiResponse<CheckInOutRecord[]>> {
    return withErrorHandling(async () => {
      const filterBuilder = new ODataFilterBuilder()
        .equals('employeeNo', employeeId);

      if (filters?.startDate) {
        filterBuilder.and().greaterThanOrEqual('checkInDateTime', filters.startDate);
      }
      if (filters?.endDate) {
        filterBuilder.and().lessThanOrEqual('checkInDateTime', filters.endDate);
      }
      if (filters?.locationId) {
        filterBuilder.and().equals('locationCode', filters.locationId);
      }

      const url = buildBCUrl(bcEndpoints.checkInOutRecords, { 
        '$filter': filterBuilder.build(),
        '$orderby': 'checkInDateTime desc'
      });
      
      const result = await withRetry(() => 
        this.fetchFromBC<BCApiResponse<BCCheckInOutRecord>>(url)
      );

      return result.value.map(transformBCCheckInOutRecord);
    }, []);
  }

  async getTimeSummary(
    employeeId: string,
    startDate: Date,
    endDate: Date,
    locationId?: string | null
  ): Promise<ApiResponse<TimeSummary>> {
    return withErrorHandling(async () => {
      const filterBuilder = new ODataFilterBuilder()
        .equals('employeeNo', employeeId)
        .and()
        .greaterThanOrEqual('checkInDateTime', startDate)
        .and()
        .lessThanOrEqual('checkInDateTime', endDate)
        .and()
        .isNotNull('durationMinutes');

      if (locationId) {
        filterBuilder.and().equals('locationCode', locationId);
      }

      const url = buildBCUrl(bcEndpoints.checkInOutRecords, { 
        '$filter': filterBuilder.build()
      });
      
      const result = await withRetry(() => 
        this.fetchFromBC<BCApiResponse<BCCheckInOutRecord>>(url)
      );

      const records = result.value.map(transformBCCheckInOutRecord);
      const totalMinutes = records.reduce((sum, r) => sum + (r.durationMinutes || 0), 0);

      // Group by location
      const byLocationMap = new Map<string, number>();
      for (const r of records) {
        const current = byLocationMap.get(r.locationId) || 0;
        byLocationMap.set(r.locationId, current + (r.durationMinutes || 0));
      }

      // Fetch location names
      const locationIds = Array.from(byLocationMap.keys());
      const byLocation = await Promise.all(
        locationIds.map(async (locId) => {
          const locResult = await this.locationService.getLocationById(locId);
          return {
            locationId: locId,
            locationName: locResult.success ? locResult.data.name : 'Unknown',
            minutes: byLocationMap.get(locId) || 0,
          };
        })
      );

      // Group by day
      const byDayMap = new Map<string, number>();
      for (const r of records) {
        const dateKey = r.checkInTime.toDateString();
        const current = byDayMap.get(dateKey) || 0;
        byDayMap.set(dateKey, current + (r.durationMinutes || 0));
      }

      const byDay = Array.from(byDayMap.entries()).map(([dateStr, minutes]) => ({
        date: new Date(dateStr),
        minutes,
      }));

      return {
        totalMinutes,
        totalHours: Math.round((totalMinutes / 60) * 10) / 10,
        byLocation,
        byDay,
      };
    }, { totalMinutes: 0, totalHours: 0, byLocation: [], byDay: [] });
  }

  async getRecordById(recordId: string): Promise<ApiResponse<CheckInOutRecord>> {
    return withErrorHandling(async () => {
      const url = `${buildBCUrl(bcEndpoints.checkInOutRecords)}(${recordId})`;
      const result = await withRetry(() => 
        this.fetchFromBC<BCCheckInOutRecord>(url)
      );

      return transformBCCheckInOutRecord(result);
    }, null as unknown as CheckInOutRecord);
  }

  async updateRecord(
    recordId: string,
    updates: Partial<CheckInOutRecord>,
    _reason: string
  ): Promise<ApiResponse<CheckInOutRecord>> {
    return withErrorHandling(async () => {
      const bcUpdates: Partial<BCCheckInOutRecord> = {};
      
      if (updates.checkInTime) {
        bcUpdates.checkInDateTime = updates.checkInTime.toISOString();
      }
      if (updates.checkOutTime) {
        bcUpdates.checkOutDateTime = updates.checkOutTime.toISOString();
      }
      if (updates.locationId) {
        bcUpdates.locationCode = updates.locationId;
      }
      if (updates.notes !== undefined) {
        bcUpdates.notes = updates.notes;
      }

      // Recalculate duration if times changed
      if (updates.checkInTime || updates.checkOutTime) {
        const current = await this.getRecordById(recordId);
        if (current.success) {
          const checkIn = updates.checkInTime || current.data.checkInTime;
          const checkOut = updates.checkOutTime || current.data.checkOutTime;
          if (checkOut) {
            bcUpdates.durationMinutes = Math.round(
              (checkOut.getTime() - checkIn.getTime()) / (1000 * 60)
            );
          }
        }
      }

      const etag = '*';
      const url = `${buildBCUrl(bcEndpoints.checkInOutRecords)}(${recordId})`;
      const result = await this.patchBC<BCCheckInOutRecord>(url, bcUpdates, etag);

      return transformBCCheckInOutRecord(result);
    }, null as unknown as CheckInOutRecord);
  }

  async addMissingEntry(
    employeeId: string,
    record: Omit<CheckInOutRecord, 'id' | 'createdAt' | 'modifiedAt' | 'createdBy' | 'modifiedBy'>,
    _reason: string
  ): Promise<ApiResponse<CheckInOutRecord>> {
    return withErrorHandling(async () => {
      const bcRecord = {
        employeeNo: employeeId,
        locationCode: record.locationId,
        checkInDateTime: record.checkInTime.toISOString(),
        checkOutDateTime: record.checkOutTime?.toISOString() || null,
        durationMinutes: record.durationMinutes,
        notes: record.notes,
      };

      const url = buildBCUrl(bcEndpoints.checkInOutRecords);
      const result = await withRetry(() => 
        this.postToBC<BCCheckInOutRecord>(url, bcRecord)
      );

      return transformBCCheckInOutRecord(result);
    }, null as unknown as CheckInOutRecord);
  }
}
