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

// Simulated delay to mimic API calls
const delay = (ms: number) => new Promise(resolve => setTimeout(resolve, ms));

// Auto-increment sequence for mock records
let nextSequence = Math.max(...mockCheckInOutRecords.map(r => r.id)) + 1;

/**
 * Mock implementation of ICheckInOutService for local development.
 * Uses LSC Time Entry Registration structure.
 */
export class MockCheckInOutService implements ICheckInOutService {
  // In-memory store for mock data (allows mutations)
  private records: CheckInOutRecord[] = [...mockCheckInOutRecords];

  async getCurrentStatus(employeeId: string): Promise<ApiResponse<CurrentStatus>> {
    await delay(300);
    
    // Find open time entry (status = 'Open')
    const openRecord = this.records.find(
      r => r.employeeId === employeeId && r.status === 'Open'
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
      r => r.employeeId === employeeId && r.status === 'Open'
    );
    
    if (existingOpen) {
      return {
        data: null as unknown as CheckInOutRecord,
        success: false,
        error: 'Already checked in. Please check out first.',
      };
    }
    
    const now = new Date();
    const timeStr = now.toTimeString().split(' ')[0];
    
    const newRecord: CheckInOutRecord = {
      id: nextSequence++,
      employeeId,
      locationId: data.locationId,
      workRoleCode: null,
      systemDateEntry: now,
      systemTimeEntry: timeStr,
      systemDateExit: null,
      systemTimeExit: null,
      userDateEntry: null,
      userTimeEntry: null,
      userDateExit: null,
      userTimeExit: null,
      noOfHours: null,
      status: 'Open',
      entryStatus: 'OK',
      leavingStatus: null,
      entryMethod: 'Automatic',
      entryEmployeeComment: data.notes || '',
      originLogon: 'PowerApp',
      checkInTime: now,
      checkOutTime: null,
      durationMinutes: null,
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
      r => r.employeeId === employeeId && r.status === 'Open'
    );
    
    if (recordIndex === -1) {
      return {
        data: null as unknown as CheckInOutRecord,
        success: false,
        error: 'No active check-in found.',
      };
    }
    
    const now = new Date();
    const timeStr = now.toTimeString().split(' ')[0];
    const record = this.records[recordIndex];
    const hoursWorked = (now.getTime() - record.checkInTime.getTime()) / (1000 * 60 * 60);
    const durationMinutes = Math.round(hoursWorked * 60);
    
    const updatedRecord: CheckInOutRecord = {
      ...record,
      systemDateExit: now,
      systemTimeExit: timeStr,
      noOfHours: Math.round(hoursWorked * 100) / 100,
      status: 'Closed',
      leavingStatus: 'OK',
      entryEmployeeComment: data.notes 
        ? `${record.entryEmployeeComment} | ${data.notes}`.trim() 
        : record.entryEmployeeComment,
      checkOutTime: now,
      durationMinutes,
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
    const record = this.records.find(r => r.id === Number(recordId));
    
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
    
    const recordIndex = this.records.findIndex(r => r.id === Number(recordId));
    
    if (recordIndex === -1) {
      return { data: null as unknown as CheckInOutRecord, success: false, error: 'Record not found' };
    }
    
    const updatedRecord: CheckInOutRecord = {
      ...this.records[recordIndex],
      ...updates,
    };
    
    // Recalculate duration and noOfHours if times changed
    if (updatedRecord.checkOutTime && updatedRecord.checkInTime) {
      const hours = (updatedRecord.checkOutTime.getTime() - updatedRecord.checkInTime.getTime()) / (1000 * 60 * 60);
      updatedRecord.noOfHours = Math.round(hours * 100) / 100;
      updatedRecord.durationMinutes = Math.round(hours * 60);
    }
    
    this.records[recordIndex] = updatedRecord;
    
    return { data: updatedRecord, success: true };
  }

  async addMissingEntry(
    employeeId: string,
    record: Omit<CheckInOutRecord, 'id'> & { checkInTime: Date; checkOutTime?: Date | null },
    _reason: string
  ): Promise<ApiResponse<CheckInOutRecord>> {
    await delay(500);
    
    const checkInTime = record.checkInTime;
    const checkOutTime = record.checkOutTime;
    let noOfHours: number | null = null;
    let durationMinutes: number | null = null;
    
    if (checkOutTime) {
      const hours = (checkOutTime.getTime() - checkInTime.getTime()) / (1000 * 60 * 60);
      noOfHours = Math.round(hours * 100) / 100;
      durationMinutes = Math.round(hours * 60);
    }
    
    const newRecord: CheckInOutRecord = {
      id: nextSequence++,
      employeeId,
      locationId: record.locationId,
      workRoleCode: record.workRoleCode || null,
      systemDateEntry: checkInTime,
      systemTimeEntry: checkInTime.toTimeString().split(' ')[0],
      systemDateExit: checkOutTime || null,
      systemTimeExit: checkOutTime?.toTimeString().split(' ')[0] || null,
      userDateEntry: null,
      userTimeEntry: null,
      userDateExit: null,
      userTimeExit: null,
      noOfHours,
      status: checkOutTime ? 'Closed' : 'Open',
      entryStatus: record.entryStatus || 'OK',
      leavingStatus: record.leavingStatus || null,
      entryMethod: 'Manual',
      entryEmployeeComment: record.entryEmployeeComment || '',
      originLogon: 'PowerApp',
      checkInTime,
      checkOutTime: checkOutTime || null,
      durationMinutes,
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
