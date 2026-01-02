import { Employee } from '@/types';

/**
 * Business Central Employee entity structure
 * Maps to the Employee table in BC
 */
export interface BCEmployee {
  systemId: string;
  no: string;
  displayName: string;
  email: string;
  department: string;
  managerId: string;
  status: 'Active' | 'Inactive' | 'Terminated';
  jobTitle: string;
  phoneNumber: string;
  lastModifiedDateTime: string;
}

/**
 * Business Central Location entity structure
 * Maps to the Location table in BC
 */
export interface BCLocation {
  systemId: string;
  code: string;
  name: string;
  address: string;
  address2: string;
  city: string;
  state: string;
  postCode: string;
  country: string;
  latitude: number;
  longitude: number;
  isActive: boolean;
  lastModifiedDateTime: string;
}

/**
 * Business Central Check-In/Out Record entity structure
 */
export interface BCCheckInOutRecord {
  systemId: string;
  entryNo: number;
  employeeNo: string;
  locationCode: string;
  checkInDateTime: string;
  checkOutDateTime: string | null;
  durationMinutes: number | null;
  notes: string;
  createdBy: string;
  createdDateTime: string;
  modifiedBy: string;
  modifiedDateTime: string;
}

/**
 * Transform BC Employee to app Employee type
 */
export function transformBCEmployee(bc: BCEmployee): Employee {
  return {
    id: bc.no,
    name: bc.displayName,
    email: bc.email,
    department: bc.department,
    managerId: bc.managerId || null,
    role: bc.jobTitle?.toLowerCase().includes('manager') ? 'Manager' : 'Employee',
    isActive: bc.status === 'Active',
  };
}

/**
 * Transform BC Location to app Location type
 */
export function transformBCLocation(bc: BCLocation): import('@/types').Location {
  return {
    id: bc.code,
    name: bc.name,
    address: [bc.address, bc.address2, bc.city, bc.state, bc.postCode]
      .filter(Boolean)
      .join(', '),
    latitude: bc.latitude,
    longitude: bc.longitude,
    isActive: bc.isActive,
  };
}

/**
 * Transform BC CheckInOutRecord to app CheckInOutRecord type
 */
export function transformBCCheckInOutRecord(
  bc: BCCheckInOutRecord
): import('@/types').CheckInOutRecord {
  return {
    id: bc.systemId,
    employeeId: bc.employeeNo,
    locationId: bc.locationCode,
    checkInTime: new Date(bc.checkInDateTime),
    checkOutTime: bc.checkOutDateTime ? new Date(bc.checkOutDateTime) : null,
    durationMinutes: bc.durationMinutes,
    notes: bc.notes || '',
    createdBy: bc.createdBy,
    createdAt: new Date(bc.createdDateTime),
    modifiedBy: bc.modifiedBy,
    modifiedAt: new Date(bc.modifiedDateTime),
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
