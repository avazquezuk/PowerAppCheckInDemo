import {
  Employee,
  Location,
  CheckInOutRecord,
  CurrentStatus,
  CheckInFormData,
  CheckOutFormData,
  HistoryFilters,
  TimeSummary,
  ApiResponse,
} from '@/types';
import {
  mockEmployees,
  mockLocations,
  mockCheckInOutRecords,
  currentUserId,
} from './mockData';
import { generateId } from '@/utils';

// Simulated delay to mimic API calls
const delay = (ms: number) => new Promise(resolve => setTimeout(resolve, ms));

// In-memory store for mock data (allows mutations)
let checkInOutRecords = [...mockCheckInOutRecords];

/**
 * Get current employee
 */
export async function getCurrentEmployee(): Promise<ApiResponse<Employee>> {
  await delay(300);
  const employee = mockEmployees.find(e => e.id === currentUserId);
  
  if (!employee) {
    return { data: null as unknown as Employee, success: false, error: 'Employee not found' };
  }
  
  return { data: employee, success: true };
}

/**
 * Get employee by ID
 */
export async function getEmployeeById(id: string): Promise<ApiResponse<Employee>> {
  await delay(200);
  const employee = mockEmployees.find(e => e.id === id);
  
  if (!employee) {
    return { data: null as unknown as Employee, success: false, error: 'Employee not found' };
  }
  
  return { data: employee, success: true };
}

/**
 * Get all employees (for manager view)
 */
export async function getAllEmployees(): Promise<ApiResponse<Employee[]>> {
  await delay(300);
  return { data: mockEmployees.filter(e => e.isActive), success: true };
}

/**
 * Get direct reports for a manager
 */
export async function getDirectReports(managerId: string): Promise<ApiResponse<Employee[]>> {
  await delay(300);
  const reports = mockEmployees.filter(e => e.managerId === managerId && e.isActive);
  return { data: reports, success: true };
}

/**
 * Get all locations
 */
export async function getLocations(): Promise<ApiResponse<Location[]>> {
  await delay(300);
  return { data: mockLocations.filter(l => l.isActive), success: true };
}

/**
 * Get location by ID
 */
export async function getLocationById(id: string): Promise<ApiResponse<Location>> {
  await delay(200);
  const location = mockLocations.find(l => l.id === id);
  
  if (!location) {
    return { data: null as unknown as Location, success: false, error: 'Location not found' };
  }
  
  return { data: location, success: true };
}

/**
 * Get current check-in status for an employee
 */
export async function getCurrentStatus(employeeId: string): Promise<ApiResponse<CurrentStatus>> {
  await delay(300);
  
  // Find open check-in (no check-out time)
  const openRecord = checkInOutRecords.find(
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

/**
 * Check in to a location
 */
export async function checkIn(
  employeeId: string,
  data: CheckInFormData
): Promise<ApiResponse<CheckInOutRecord>> {
  await delay(500);
  
  // Check if already checked in
  const existingOpen = checkInOutRecords.find(
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
  
  checkInOutRecords = [newRecord, ...checkInOutRecords];
  
  return { data: newRecord, success: true };
}

/**
 * Check out from current location
 */
export async function checkOut(
  employeeId: string,
  data: CheckOutFormData
): Promise<ApiResponse<CheckInOutRecord>> {
  await delay(500);
  
  const recordIndex = checkInOutRecords.findIndex(
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
  const record = checkInOutRecords[recordIndex];
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
  
  checkInOutRecords[recordIndex] = updatedRecord;
  
  return { data: updatedRecord, success: true };
}

/**
 * Get check-in/out history for an employee
 */
export async function getHistory(
  employeeId: string,
  filters?: HistoryFilters
): Promise<ApiResponse<CheckInOutRecord[]>> {
  await delay(400);
  
  let records = checkInOutRecords.filter(r => r.employeeId === employeeId);
  
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

/**
 * Get time summary for an employee
 */
export async function getTimeSummary(
  employeeId: string,
  startDate: Date,
  endDate: Date,
  locationId?: string | null
): Promise<ApiResponse<TimeSummary>> {
  await delay(400);
  
  const records = checkInOutRecords.filter(
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
  
  const byLocation = Array.from(byLocationMap.entries()).map(([locationId, minutes]) => {
    const location = mockLocations.find(l => l.id === locationId);
    return {
      locationId,
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

/**
 * Reset mock data (for testing)
 */
export function resetMockData(): void {
  checkInOutRecords = [...mockCheckInOutRecords];
}
