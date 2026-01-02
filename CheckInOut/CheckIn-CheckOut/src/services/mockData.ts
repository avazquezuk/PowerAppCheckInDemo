import { Employee, Location, CheckInOutRecord } from '@/types';

// Mock Employees
export const mockEmployees: Employee[] = [
  {
    id: 'EMP001',
    name: 'John Smith',
    email: 'john.smith@company.com',
    department: 'Engineering',
    managerId: 'EMP005',
    role: 'Employee',
    isActive: true,
  },
  {
    id: 'EMP002',
    name: 'Sarah Johnson',
    email: 'sarah.johnson@company.com',
    department: 'Engineering',
    managerId: 'EMP005',
    role: 'Employee',
    isActive: true,
  },
  {
    id: 'EMP003',
    name: 'Michael Brown',
    email: 'michael.brown@company.com',
    department: 'Sales',
    managerId: 'EMP006',
    role: 'Employee',
    isActive: true,
  },
  {
    id: 'EMP004',
    name: 'Emily Davis',
    email: 'emily.davis@company.com',
    department: 'HR',
    managerId: 'EMP006',
    role: 'Employee',
    isActive: true,
  },
  {
    id: 'EMP005',
    name: 'Robert Wilson',
    email: 'robert.wilson@company.com',
    department: 'Engineering',
    managerId: null,
    role: 'Manager',
    isActive: true,
  },
  {
    id: 'EMP006',
    name: 'Jennifer Martinez',
    email: 'jennifer.martinez@company.com',
    department: 'Operations',
    managerId: null,
    role: 'Manager',
    isActive: true,
  },
];

// Mock Locations
export const mockLocations: Location[] = [
  {
    id: 'LOC001',
    name: 'Headquarters',
    address: '123 Main Street, Seattle, WA 98101',
    latitude: 47.6062,
    longitude: -122.3321,
    isActive: true,
  },
  {
    id: 'LOC002',
    name: 'Downtown Office',
    address: '456 Commerce Ave, Seattle, WA 98104',
    latitude: 47.6097,
    longitude: -122.3331,
    isActive: true,
  },
  {
    id: 'LOC003',
    name: 'Eastside Campus',
    address: '789 Tech Parkway, Bellevue, WA 98004',
    latitude: 47.6101,
    longitude: -122.2015,
    isActive: true,
  },
  {
    id: 'LOC004',
    name: 'South Distribution Center',
    address: '321 Industrial Blvd, Tukwila, WA 98188',
    latitude: 47.4740,
    longitude: -122.2610,
    isActive: true,
  },
  {
    id: 'LOC005',
    name: 'North Service Hub',
    address: '555 Northgate Way, Seattle, WA 98125',
    latitude: 47.7076,
    longitude: -122.3254,
    isActive: true,
  },
];

// Helper to create dates relative to now
const hoursAgo = (hours: number): Date => {
  const date = new Date();
  date.setHours(date.getHours() - hours);
  return date;
};

const daysAgo = (days: number, hour: number = 9): Date => {
  const date = new Date();
  date.setDate(date.getDate() - days);
  date.setHours(hour, 0, 0, 0);
  return date;
};

// Mock Check-In/Out Records
export const mockCheckInOutRecords: CheckInOutRecord[] = [
  // Current open check-in for EMP001
  {
    id: 'REC001',
    employeeId: 'EMP001',
    locationId: 'LOC001',
    checkInTime: hoursAgo(2),
    checkOutTime: null,
    durationMinutes: null,
    notes: '',
    createdBy: 'EMP001',
    createdAt: hoursAgo(2),
    modifiedBy: 'EMP001',
    modifiedAt: hoursAgo(2),
  },
  // Yesterday's record for EMP001
  {
    id: 'REC002',
    employeeId: 'EMP001',
    locationId: 'LOC001',
    checkInTime: daysAgo(1, 9),
    checkOutTime: daysAgo(1, 17),
    durationMinutes: 480,
    notes: 'Regular workday',
    createdBy: 'EMP001',
    createdAt: daysAgo(1, 9),
    modifiedBy: 'EMP001',
    modifiedAt: daysAgo(1, 17),
  },
  // Two days ago - different location
  {
    id: 'REC003',
    employeeId: 'EMP001',
    locationId: 'LOC003',
    checkInTime: daysAgo(2, 10),
    checkOutTime: daysAgo(2, 16),
    durationMinutes: 360,
    notes: 'Client meeting at Eastside Campus',
    createdBy: 'EMP001',
    createdAt: daysAgo(2, 10),
    modifiedBy: 'EMP001',
    modifiedAt: daysAgo(2, 16),
  },
  // Three days ago
  {
    id: 'REC004',
    employeeId: 'EMP001',
    locationId: 'LOC001',
    checkInTime: daysAgo(3, 8),
    checkOutTime: daysAgo(3, 18),
    durationMinutes: 600,
    notes: '',
    createdBy: 'EMP001',
    createdAt: daysAgo(3, 8),
    modifiedBy: 'EMP001',
    modifiedAt: daysAgo(3, 18),
  },
  // Four days ago
  {
    id: 'REC005',
    employeeId: 'EMP001',
    locationId: 'LOC002',
    checkInTime: daysAgo(4, 9),
    checkOutTime: daysAgo(4, 17),
    durationMinutes: 480,
    notes: 'Downtown office training',
    createdBy: 'EMP001',
    createdAt: daysAgo(4, 9),
    modifiedBy: 'EMP001',
    modifiedAt: daysAgo(4, 17),
  },
  // Records for other employees
  {
    id: 'REC006',
    employeeId: 'EMP002',
    locationId: 'LOC001',
    checkInTime: hoursAgo(3),
    checkOutTime: null,
    durationMinutes: null,
    notes: '',
    createdBy: 'EMP002',
    createdAt: hoursAgo(3),
    modifiedBy: 'EMP002',
    modifiedAt: hoursAgo(3),
  },
  {
    id: 'REC007',
    employeeId: 'EMP003',
    locationId: 'LOC002',
    checkInTime: hoursAgo(4),
    checkOutTime: null,
    durationMinutes: null,
    notes: 'Sales meeting',
    createdBy: 'EMP003',
    createdAt: hoursAgo(4),
    modifiedBy: 'EMP003',
    modifiedAt: hoursAgo(4),
  },
];

// Current logged-in user (for development)
export const currentUserId = 'EMP001';
