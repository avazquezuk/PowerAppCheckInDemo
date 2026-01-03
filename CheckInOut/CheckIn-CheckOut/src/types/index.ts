// LSC STAFF Employee from LS Central (Table 10015057)
export interface Employee {
  id: string;                    // No. - Primary Key
  firstName: string;             // First Name
  lastName: string;              // Last Name
  name: string;                  // Computed: FirstName + LastName
  email: string;                 // E-Mail
  mobilePhoneNo: string;         // Mobile Phone No.
  jobTitle: string;              // Job Title
  status: 'Active' | 'Blocked';  // Status
  retailStaffId: string | null;  // Retail Staff ID
  retailUserId: string | null;   // Retail User ID
  employeeNo: string | null;     // BC Employee No.
  workRegion: string | null;     // Work Region
  workLocation: string | null;   // Base Work Location
  timeEntryId: string | null;    // Time Entry ID
  workRole: string | null;       // Default Work Role
}

// LSC Work Location from LS Central (Table 10015021)
export interface Location {
  id: string;                    // Code - Primary Key
  name: string;                  // Description
  workRegion: string | null;     // Work Region
  storeNo: string | null;        // Store No.
  responsiblePerson: string | null; // Responsible Person (Employee No.)
  status: 'Active' | 'Inactive'; // Status
  globalDimension1Code: string | null; // Global Dimension 1 Code
  globalDimension2Code: string | null; // Global Dimension 2 Code
}

// LSC Time Entry Registration from LS Central (Table 10015007)
export interface CheckInOutRecord {
  id: number;                    // Sequence - Auto-increment PK
  employeeId: string;            // Employee No.
  locationId: string;            // Work Location
  workRoleCode: string | null;   // Work Role Code
  // System timestamps (captured automatically)
  systemDateEntry: Date;         // System Date (Entry)
  systemTimeEntry: string;       // System Time (Entry)
  systemDateExit: Date | null;   // System Date (Exit)
  systemTimeExit: string | null; // System Time (Exit)
  // User-adjusted timestamps
  userDateEntry: Date | null;    // User Date (Entry)
  userTimeEntry: string | null;  // User Time (Entry)
  userDateExit: Date | null;     // User Date (Exit)
  userTimeExit: string | null;   // User Time (Exit)
  // Calculated and status fields
  noOfHours: number | null;      // No. Of Hours
  status: 'Open' | 'Closed' | 'Processed'; // Status
  entryStatus: 'OK' | 'Early' | 'Late' | 'Not Scheduled' | null; // Entry Status
  leavingStatus: 'OK' | 'Early' | 'Late' | 'Not in Schedule' | null; // Leaving Status
  entryMethod: 'Automatic' | 'Manual'; // Entry Method
  entryEmployeeComment: string;  // Entry Employee Comment
  originLogon: string | null;    // Origin (Logon)
  // Convenience computed fields for app
  checkInTime: Date;             // Computed from systemDateEntry + systemTimeEntry
  checkOutTime: Date | null;     // Computed from systemDateExit + systemTimeExit
  durationMinutes: number | null; // Computed from noOfHours
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
