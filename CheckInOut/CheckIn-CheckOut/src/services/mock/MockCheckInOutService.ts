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
import { mockCheckInOutRecords, mockLocations } from '../mockData';
import { generateId } from '@/utils';

// Simulated delay to mimic API calls
const delay = (ms: number) => new Promise(resolve => setTimeout(resolve, ms));

/**
 * Mock implementation of ICheckInOutService for local development.
 */
export class MockCheckInOutService implements ICheckInOutService {
  // In-memory store for mock data (allows mutations)
  private records: CheckInOutRecord[] = [...mockCheckInOutRecords];

  async getCurrentStatus(employeeId: string): Promise<ApiResponse<CurrentStatus>> {
    await delay(300);
    
    // Find open check-in (no check-out time)
    const openRecord = this.records.find(
      r => r.employeeId === employeeId && r.checkOutTime === null
    );
    
    if (openRecord) {
      const location = mockLocations.find(l => l.id === openRecord.locationId) || null;
      return {
        data: {
          status: 'checked-in',
          currentRecord: openRecord,
          location,
        },
        success: true,
      };
    }
    
    return {
      data: {
        status: 'checked-out',
        currentRecord: null,
        location: null,
      },
      success: true,
    };
  }

  async checkIn(
    employeeId: string,
    data: CheckInFormData
  ): Promise<ApiResponse<CheckInOutRecord>> {
    await delay(500);
    
    // Check if already checked in
    const existingOpen = this.records.find(
      r => r.employeeId === employeeId && r.checkOutTime === null
    );
    
    if (existingOpen) {
      return {
        data: null as unknown as CheckInOutRecord,
        success: false,
        error: 'Already checked in. Please check out first.',
      };
    }
    
    const now = new Date();
    const newRecord: CheckInOutRecord = {
      id: generateId(),
      employeeId,
      locationId: data.locationId,
      checkInTime: now,
      checkOutTime: null,
      durationMinutes: null,
      notes: data.notes || '',
      createdBy: employeeId,
      createdAt: now,
      modifiedBy: employeeId,
      modifiedAt: now,
    };
    
    this.records = [newRecord, ...this.records];
    
    return { data: newRecord, success: true };
  }

  async checkOut(
    employeeId: string,
    data: CheckOutFormData
  ): Promise<ApiResponse<CheckInOutRecord>> {
    await delay(500);
    
    const recordIndex = this.records.findIndex(
      r => r.employeeId === employeeId && r.checkOutTime === null
    );
    
    if (recordIndex === -1) {
      return {
        data: null as unknown as CheckInOutRecord,
        success: false,
        error: 'No active check-in found.',
      };
    }
    
    const now = new Date();
    const record = this.records[recordIndex];
    const durationMinutes = Math.round(
      (now.getTime() - record.checkInTime.getTime()) / (1000 * 60)
    );
    
    const updatedRecord: CheckInOutRecord = {
      ...record,
      checkOutTime: now,
      durationMinutes,
      notes: data.notes ? `${record.notes} | ${data.notes}`.trim() : record.notes,
      modifiedBy: employeeId,
      modifiedAt: now,
    };
    
    this.records[recordIndex] = updatedRecord;
    
    return { data: updatedRecord, success: true };
  }

  async getHistory(
    employeeId: string,
    filters?: HistoryFilters
  ): Promise<ApiResponse<CheckInOutRecord[]>> {
    await delay(400);
    
    let records = this.records.filter(r => r.employeeId === employeeId);
    
    if (filters) {
      if (filters.startDate) {
        records = records.filter(r => r.checkInTime >= filters.startDate!);
      }
      if (filters.endDate) {
        records = records.filter(r => r.checkInTime <= filters.endDate!);
      }
      if (filters.locationId) {
        records = records.filter(r => r.locationId === filters.locationId);
      }
    }
    
    // Sort by check-in time descending
    records.sort((a, b) => b.checkInTime.getTime() - a.checkInTime.getTime());
    
    return { data: records, success: true };
  }

  async getTimeSummary(
    employeeId: string,
    startDate: Date,
    endDate: Date,
    locationId?: string | null
  ): Promise<ApiResponse<TimeSummary>> {
    await delay(400);
    
    const records = this.records.filter(
      r =>
        r.employeeId === employeeId &&
        r.checkInTime >= startDate &&
        r.checkInTime <= endDate &&
        r.durationMinutes !== null &&
        (locationId ? r.locationId === locationId : true)
    );
    
    const totalMinutes = records.reduce((sum, r) => sum + (r.durationMinutes || 0), 0);
    
    // Group by location
    const byLocationMap = new Map<string, number>();
    records.forEach(r => {
      const current = byLocationMap.get(r.locationId) || 0;
      byLocationMap.set(r.locationId, current + (r.durationMinutes || 0));
    });
    
    const byLocation = Array.from(byLocationMap.entries()).map(([locId, minutes]) => {
      const location = mockLocations.find(l => l.id === locId);
      return {
        locationId: locId,
        locationName: location?.name || 'Unknown',
        minutes,
      };
    });
    
    // Group by day
    const byDayMap = new Map<string, number>();
    records.forEach(r => {
      const dateKey = r.checkInTime.toDateString();
      const current = byDayMap.get(dateKey) || 0;
      byDayMap.set(dateKey, current + (r.durationMinutes || 0));
    });
    
    const byDay = Array.from(byDayMap.entries()).map(([dateStr, minutes]) => ({
      date: new Date(dateStr),
      minutes,
    }));
    
    return {
      data: {
        totalMinutes,
        totalHours: Math.round((totalMinutes / 60) * 10) / 10,
        byLocation,
        byDay,
      },
      success: true,
    };
  }

  async getRecordById(recordId: string): Promise<ApiResponse<CheckInOutRecord>> {
    await delay(200);
    const record = this.records.find(r => r.id === recordId);
    
    if (!record) {
      return { data: null as unknown as CheckInOutRecord, success: false, error: 'Record not found' };
    }
    
    return { data: record, success: true };
  }

  async updateRecord(
    recordId: string,
    updates: Partial<CheckInOutRecord>,
    _reason: string
  ): Promise<ApiResponse<CheckInOutRecord>> {
    await delay(500);
    
    const recordIndex = this.records.findIndex(r => r.id === recordId);
    
    if (recordIndex === -1) {
      return { data: null as unknown as CheckInOutRecord, success: false, error: 'Record not found' };
    }
    
    const now = new Date();
    const updatedRecord: CheckInOutRecord = {
      ...this.records[recordIndex],
      ...updates,
      modifiedAt: now,
    };
    
    // Recalculate duration if times changed
    if (updatedRecord.checkOutTime && updatedRecord.checkInTime) {
      updatedRecord.durationMinutes = Math.round(
        (updatedRecord.checkOutTime.getTime() - updatedRecord.checkInTime.getTime()) / (1000 * 60)
      );
    }
    
    this.records[recordIndex] = updatedRecord;
    
    return { data: updatedRecord, success: true };
  }

  async addMissingEntry(
    employeeId: string,
    record: Omit<CheckInOutRecord, 'id' | 'createdAt' | 'modifiedAt' | 'createdBy' | 'modifiedBy'>,
    _reason: string
  ): Promise<ApiResponse<CheckInOutRecord>> {
    await delay(500);
    
    const now = new Date();
    const newRecord: CheckInOutRecord = {
      ...record,
      id: generateId(),
      employeeId,
      createdBy: employeeId,
      createdAt: now,
      modifiedBy: employeeId,
      modifiedAt: now,
    };
    
    this.records = [newRecord, ...this.records];
    this.records.sort((a, b) => b.checkInTime.getTime() - a.checkInTime.getTime());
    
    return { data: newRecord, success: true };
  }

  /**
   * Reset mock data (for testing)
   */
  reset(): void {
    this.records = [...mockCheckInOutRecords];
  }
}
