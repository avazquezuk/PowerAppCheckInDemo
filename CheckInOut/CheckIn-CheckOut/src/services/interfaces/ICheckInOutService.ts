import {
  CheckInOutRecord,
  CurrentStatus,
  CheckInFormData,
  CheckOutFormData,
  HistoryFilters,
  TimeSummary,
  ApiResponse,
} from '@/types';

/**
 * Interface for Check-In/Check-Out service operations.
 * Implementations can use mock data or connect to Business Central.
 */
export interface ICheckInOutService {
  /**
   * Get current check-in status for an employee
   */
  getCurrentStatus(employeeId: string): Promise<ApiResponse<CurrentStatus>>;

  /**
   * Check in to a location
   */
  checkIn(
    employeeId: string,
    data: CheckInFormData
  ): Promise<ApiResponse<CheckInOutRecord>>;

  /**
   * Check out from current location
   */
  checkOut(
    employeeId: string,
    data: CheckOutFormData
  ): Promise<ApiResponse<CheckInOutRecord>>;

  /**
   * Get check-in/out history for an employee
   */
  getHistory(
    employeeId: string,
    filters?: HistoryFilters
  ): Promise<ApiResponse<CheckInOutRecord[]>>;

  /**
   * Get time summary for an employee
   */
  getTimeSummary(
    employeeId: string,
    startDate: Date,
    endDate: Date,
    locationId?: string | null
  ): Promise<ApiResponse<TimeSummary>>;

  /**
   * Get a single record by ID
   */
  getRecordById(recordId: string): Promise<ApiResponse<CheckInOutRecord>>;

  /**
   * Update an existing record (for managers/corrections)
   */
  updateRecord(
    recordId: string,
    updates: Partial<CheckInOutRecord>,
    reason: string
  ): Promise<ApiResponse<CheckInOutRecord>>;

  /**
   * Add a missing entry (for managers)
   */
  addMissingEntry(
    employeeId: string,
    record: Omit<CheckInOutRecord, 'id' | 'createdAt' | 'modifiedAt' | 'createdBy' | 'modifiedBy'>,
    reason: string
  ): Promise<ApiResponse<CheckInOutRecord>>;
}
