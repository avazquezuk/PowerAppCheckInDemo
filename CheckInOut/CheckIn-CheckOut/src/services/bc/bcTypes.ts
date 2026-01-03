import { Employee } from '@/types';

/**
 * LS Central STAFF Employee entity structure (Table 10015057)
 * Maps to the LSC STAFF Employee table in Business Central
 */
export interface BCEmployee {
  systemId: string;
  no: string;                    // Primary Key
  firstName: string;             // First Name
  lastName: string;              // Last Name
  jobTitle: string;              // Job Title
  status: 'Active' | 'Blocked';  // Status
  retailStaffID: string;         // Retail Staff ID
  retailUserID: string;          // Retail User ID
  employeeNo: string;            // BC Employee No.
  workRegion: string;            // Work Region
  workLocation: string;          // Base Work Location
  timeEntryID: string;           // Time Entry ID
  workRole: string;              // Default Work Role
  eMail: string;                 // E-Mail
  mobilePhoneNo: string;         // Mobile Phone No.
  lastModifiedDateTime: string;
}

/**
 * LS Central Work Location entity structure (Table 10015021)
 * Maps to the LSC Work Location table in Business Central
 */
export interface BCLocation {
  systemId: string;
  code: string;                  // Primary Key
  description: string;           // Description
  workRegion: string;            // Work Region
  storeNo: string;               // Store No.
  responsiblePerson: string;     // Responsible Person (Employee No.)
  status: 'Active' | 'Inactive'; // Status
  globalDimension1Code: string;  // Global Dimension 1 Code
  globalDimension2Code: string;  // Global Dimension 2 Code
  lastModifiedDateTime: string;
}

/**
 * LS Central Time Entry Registration entity structure (Table 10015007)
 * Maps to the LSC Time Entry Registration table in Business Central
 */
export interface BCTimeEntryRegistration {
  systemId: string;
  sequence: number;              // Auto-increment PK
  employeeNo: string;            // Employee No.
  workLocation: string;          // Work Location
  workRoleCode: string;          // Work Role Code
  systemDateEntry: string;       // System Date (Entry)
  systemTimeEntry: string;       // System Time (Entry)
  systemDateExit: string | null; // System Date (Exit)
  systemTimeExit: string | null; // System Time (Exit)
  userDateEntry: string | null;  // User Date (Entry)
  userTimeEntry: string | null;  // User Time (Entry)
  userDateExit: string | null;   // User Date (Exit)
  userTimeExit: string | null;   // User Time (Exit)
  noOfHours: number | null;      // No. Of Hours
  status: 'Open' | 'Closed' | 'Processed'; // Status
  entryStatus: 'OK' | 'Early' | 'Late' | 'Not Scheduled' | null;
  leavingStatus: 'OK' | 'Early' | 'Late' | 'Not in Schedule' | null;
  entryMethod: 'Automatic' | 'Manual';
  entryEmployeeComment: string;  // Entry Employee Comment
  originLogon: string;           // Origin (Logon)
  lastModifiedDateTime: string;
}

// Alias for backward compatibility
export type BCCheckInOutRecord = BCTimeEntryRegistration;

/**
 * Transform BC Employee to app Employee type
 */
export function transformBCEmployee(bc: BCEmployee): Employee {
  return {
    id: bc.no,
    firstName: bc.firstName,
    lastName: bc.lastName,
    name: `${bc.firstName} ${bc.lastName}`.trim(),
    email: bc.eMail,
    mobilePhoneNo: bc.mobilePhoneNo,
    jobTitle: bc.jobTitle,
    status: bc.status,
    retailStaffId: bc.retailStaffID || null,
    retailUserId: bc.retailUserID || null,
    employeeNo: bc.employeeNo || null,
    workRegion: bc.workRegion || null,
    workLocation: bc.workLocation || null,
    timeEntryId: bc.timeEntryID || null,
    workRole: bc.workRole || null,
  };
}

/**
 * Transform BC Location to app Location type
 */
export function transformBCLocation(bc: BCLocation): import('@/types').Location {
  return {
    id: bc.code,
    name: bc.description,
    workRegion: bc.workRegion || null,
    storeNo: bc.storeNo || null,
    responsiblePerson: bc.responsiblePerson || null,
    status: bc.status,
    globalDimension1Code: bc.globalDimension1Code || null,
    globalDimension2Code: bc.globalDimension2Code || null,
  };
}

/**
 * Helper to combine date and time strings into a Date object
 */
function combineDateAndTime(dateStr: string, timeStr: string): Date {
  const date = new Date(dateStr);
  const [hours, minutes, seconds] = timeStr.split(':').map(Number);
  date.setHours(hours || 0, minutes || 0, seconds || 0);
  return date;
}

/**
 * Transform BC Time Entry Registration to app CheckInOutRecord type
 */
export function transformBCCheckInOutRecord(
  bc: BCTimeEntryRegistration
): import('@/types').CheckInOutRecord {
  const checkInTime = combineDateAndTime(bc.systemDateEntry, bc.systemTimeEntry);
  const checkOutTime = bc.systemDateExit && bc.systemTimeExit
    ? combineDateAndTime(bc.systemDateExit, bc.systemTimeExit)
    : null;
  
  return {
    id: bc.sequence,
    employeeId: bc.employeeNo,
    locationId: bc.workLocation,
    workRoleCode: bc.workRoleCode || null,
    systemDateEntry: new Date(bc.systemDateEntry),
    systemTimeEntry: bc.systemTimeEntry,
    systemDateExit: bc.systemDateExit ? new Date(bc.systemDateExit) : null,
    systemTimeExit: bc.systemTimeExit,
    userDateEntry: bc.userDateEntry ? new Date(bc.userDateEntry) : null,
    userTimeEntry: bc.userTimeEntry,
    userDateExit: bc.userDateExit ? new Date(bc.userDateExit) : null,
    userTimeExit: bc.userTimeExit,
    noOfHours: bc.noOfHours,
    status: bc.status,
    entryStatus: bc.entryStatus,
    leavingStatus: bc.leavingStatus,
    entryMethod: bc.entryMethod,
    entryEmployeeComment: bc.entryEmployeeComment || '',
    originLogon: bc.originLogon || null,
    // Computed convenience fields
    checkInTime,
    checkOutTime,
    durationMinutes: bc.noOfHours ? Math.round(bc.noOfHours * 60) : null,
  };
}

/**
 * BC API response wrapper
 */
export interface BCApiResponse<T> {
  '@odata.context': string;
  value: T[];
}

/**
 * BC single entity response
 */
export interface BCSingleResponse<T> {
  '@odata.context': string;
  '@odata.etag': string;
  value: T;
}
