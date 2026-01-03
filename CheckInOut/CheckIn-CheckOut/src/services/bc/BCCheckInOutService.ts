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
  BCTimeEntryRegistration, 
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
 * Handles all time entry operations against LS Central Time Entry Registration table.
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
      // Find open time entry (status = 'Open' means not clocked out yet)
      const filter = new ODataFilterBuilder()
        .equals('employeeNo', employeeId)
        .and()
        .equals('status', 'Open')
        .build();

      const url = buildBCUrl(bcEndpoints.timeEntryRegistrations, { 
        '$filter': filter,
        '$top': '1'
      });
      
      const result = await withRetry(() => 
        this.fetchFromBC<BCApiResponse<BCTimeEntryRegistration>>(url)
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
      const dateStr = now.toISOString().split('T')[0];
      const timeStr = now.toTimeString().split(' ')[0];
      
      // Create LSC Time Entry Registration record
      const bcRecord = {
        employeeNo: employeeId,
        workLocation: data.locationId,
        systemDateEntry: dateStr,
        systemTimeEntry: timeStr,
        status: 'Open',
        entryMethod: 'Automatic',
        entryEmployeeComment: data.notes || '',
        originLogon: 'PowerApp',
      };

      const url = buildBCUrl(bcEndpoints.timeEntryRegistrations);
      const result = await withRetry(() => 
        this.postToBC<BCTimeEntryRegistration>(url, bcRecord)
      );

      return transformBCCheckInOutRecord(result);
    }, null as unknown as CheckInOutRecord);
  }

  async checkOut(
    employeeId: string,
    data: CheckOutFormData
  ): Promise<ApiResponse<CheckInOutRecord>> {
    return withErrorHandling(async () => {
      // Find open time entry
      const filter = new ODataFilterBuilder()
        .equals('employeeNo', employeeId)
        .and()
        .equals('status', 'Open')
        .build();

      const url = buildBCUrl(bcEndpoints.timeEntryRegistrations, { '$filter': filter });
      const result = await withRetry(() => 
        this.fetchFromBC<BCApiResponse<BCTimeEntryRegistration>>(url)
      );

      if (result.value.length === 0) {
        throw new Error('No active check-in found.');
      }

      const record = result.value[0];
      const now = new Date();
      const dateStr = now.toISOString().split('T')[0];
      const timeStr = now.toTimeString().split(' ')[0];
      
      // Calculate hours worked
      const checkInDate = new Date(record.systemDateEntry);
      const [inHours, inMinutes] = record.systemTimeEntry.split(':').map(Number);
      checkInDate.setHours(inHours, inMinutes);
      const hoursWorked = (now.getTime() - checkInDate.getTime()) / (1000 * 60 * 60);

      const updateData = {
        systemDateExit: dateStr,
        systemTimeExit: timeStr,
        noOfHours: Math.round(hoursWorked * 100) / 100,
        status: 'Closed',
        entryEmployeeComment: data.notes 
          ? `${record.entryEmployeeComment} | ${data.notes}`.trim() 
          : record.entryEmployeeComment,
      };

      const etag = '*';
      const updateUrl = `${buildBCUrl(bcEndpoints.timeEntryRegistrations)}(${record.systemId})`;
      const updated = await this.patchBC<BCTimeEntryRegistration>(updateUrl, updateData, etag);

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
        filterBuilder.and().greaterThanOrEqual('systemDateEntry', filters.startDate);
      }
      if (filters?.endDate) {
        filterBuilder.and().lessThanOrEqual('systemDateEntry', filters.endDate);
      }
      if (filters?.locationId) {
        filterBuilder.and().equals('workLocation', filters.locationId);
      }

      const url = buildBCUrl(bcEndpoints.timeEntryRegistrations, { 
        '$filter': filterBuilder.build(),
        '$orderby': 'systemDateEntry desc, systemTimeEntry desc'
      });
      
      const result = await withRetry(() => 
        this.fetchFromBC<BCApiResponse<BCTimeEntryRegistration>>(url)
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
        .greaterThanOrEqual('systemDateEntry', startDate)
        .and()
        .lessThanOrEqual('systemDateEntry', endDate)
        .and()
        .isNotNull('noOfHours');

      if (locationId) {
        filterBuilder.and().equals('workLocation', locationId);
      }

      const url = buildBCUrl(bcEndpoints.timeEntryRegistrations, { 
        '$filter': filterBuilder.build()
      });
      
      const result = await withRetry(() => 
        this.fetchFromBC<BCApiResponse<BCTimeEntryRegistration>>(url)
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
      const url = `${buildBCUrl(bcEndpoints.timeEntryRegistrations)}(${recordId})`;
      const result = await withRetry(() => 
        this.fetchFromBC<BCTimeEntryRegistration>(url)
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
      const bcUpdates: Partial<BCTimeEntryRegistration> = {};
      
      // Map app fields to LS Central fields
      if (updates.checkInTime) {
        bcUpdates.userDateEntry = updates.checkInTime.toISOString().split('T')[0];
        bcUpdates.userTimeEntry = updates.checkInTime.toTimeString().split(' ')[0];
      }
      if (updates.checkOutTime) {
        bcUpdates.userDateExit = updates.checkOutTime.toISOString().split('T')[0];
        bcUpdates.userTimeExit = updates.checkOutTime.toTimeString().split(' ')[0];
      }
      if (updates.locationId) {
        bcUpdates.workLocation = updates.locationId;
      }
      if (updates.entryEmployeeComment !== undefined) {
        bcUpdates.entryEmployeeComment = updates.entryEmployeeComment;
      }

      // Recalculate hours if times changed
      if (updates.checkInTime || updates.checkOutTime) {
        const current = await this.getRecordById(recordId);
        if (current.success) {
          const checkIn = updates.checkInTime || current.data.checkInTime;
          const checkOut = updates.checkOutTime || current.data.checkOutTime;
          if (checkOut) {
            const hours = (checkOut.getTime() - checkIn.getTime()) / (1000 * 60 * 60);
            bcUpdates.noOfHours = Math.round(hours * 100) / 100;
          }
        }
      }

      const etag = '*';
      const url = `${buildBCUrl(bcEndpoints.timeEntryRegistrations)}(${recordId})`;
      const result = await this.patchBC<BCTimeEntryRegistration>(url, bcUpdates, etag);

      return transformBCCheckInOutRecord(result);
    }, null as unknown as CheckInOutRecord);
  }

  async addMissingEntry(
    employeeId: string,
    record: Omit<CheckInOutRecord, 'id' | 'systemDateEntry' | 'systemTimeEntry' | 'systemDateExit' | 'systemTimeExit' | 'checkInTime' | 'checkOutTime' | 'durationMinutes'> & { checkInTime: Date; checkOutTime?: Date | null },
    _reason: string
  ): Promise<ApiResponse<CheckInOutRecord>> {
    return withErrorHandling(async () => {
      const checkInDate = record.checkInTime;
      const checkOutDate = record.checkOutTime;
      
      let noOfHours: number | null = null;
      if (checkOutDate) {
        noOfHours = Math.round(((checkOutDate.getTime() - checkInDate.getTime()) / (1000 * 60 * 60)) * 100) / 100;
      }

      const bcRecord = {
        employeeNo: employeeId,
        workLocation: record.locationId,
        workRoleCode: record.workRoleCode || '',
        systemDateEntry: checkInDate.toISOString().split('T')[0],
        systemTimeEntry: checkInDate.toTimeString().split(' ')[0],
        systemDateExit: checkOutDate?.toISOString().split('T')[0] || null,
        systemTimeExit: checkOutDate?.toTimeString().split(' ')[0] || null,
        noOfHours,
        status: checkOutDate ? 'Closed' : 'Open',
        entryMethod: 'Manual',
        entryEmployeeComment: record.entryEmployeeComment || '',
        originLogon: 'PowerApp',
      };

      const url = buildBCUrl(bcEndpoints.timeEntryRegistrations);
      const result = await withRetry(() => 
        this.postToBC<BCTimeEntryRegistration>(url, bcRecord)
      );

      return transformBCCheckInOutRecord(result);
    }, null as unknown as CheckInOutRecord);
  }
}
