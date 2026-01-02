// Employee from Business Central
export interface Employee {
  id: string;
  name: string;
  email: string;
  department: string;
  managerId: string | null;
  role: 'Employee' | 'Manager' | 'Admin';
  isActive: boolean;
}

// Work Location
export interface Location {
  id: string;
  name: string;
  address: string;
  latitude?: number;
  longitude?: number;
  isActive: boolean;
}

// Check-In/Check-Out Record
export interface CheckInOutRecord {
  id: string;
  employeeId: string;
  locationId: string;
  checkInTime: Date;
  checkOutTime: Date | null;
  durationMinutes: number | null;
  notes: string;
  createdBy: string;
  createdAt: Date;
  modifiedBy: string;
  modifiedAt: Date;
}

// Current check-in status
export type CheckInStatus = 'checked-in' | 'checked-out';

export interface CurrentStatus {
  status: CheckInStatus;
  currentRecord: CheckInOutRecord | null;
  location: Location | null;
}

// Form data types
export interface CheckInFormData {
  locationId: string;
  notes?: string;
}

export interface CheckOutFormData {
  notes?: string;
}

// Filter types for history
export interface HistoryFilters {
  startDate: Date | null;
  endDate: Date | null;
  locationId: string | null;
}

// Time summary
export interface TimeSummary {
  totalMinutes: number;
  totalHours: number;
  byLocation: {
    locationId: string;
    locationName: string;
    minutes: number;
  }[];
  byDay: {
    date: Date;
    minutes: number;
  }[];
}

// API Response types
export interface ApiResponse<T> {
  data: T;
  success: boolean;
  error?: string;
}

export interface PaginatedResponse<T> {
  data: T[];
  total: number;
  page: number;
  pageSize: number;
  hasMore: boolean;
}
