// Legacy API exports (for backward compatibility)
export * from './api';
export * from './mockData';

// Service interfaces
export type { IEmployeeService } from './interfaces/IEmployeeService';
export type { ILocationService } from './interfaces/ILocationService';
export type { ICheckInOutService } from './interfaces/ICheckInOutService';

// Mock implementations
export { MockEmployeeService } from './mock/MockEmployeeService';
export { MockLocationService } from './mock/MockLocationService';
export { MockCheckInOutService } from './mock/MockCheckInOutService';

// Business Central implementations
export { BCEmployeeService } from './bc/BCEmployeeService';
export { BCLocationService } from './bc/BCLocationService';
export { BCCheckInOutService } from './bc/BCCheckInOutService';
export { bcConfig, buildBCUrl, bcEndpoints } from './bc/bcConfig';
export { BCApiError, withErrorHandling, withRetry } from './bc/bcErrors';

// Service factory
export { 
  serviceFactory, 
  getEmployeeService, 
  getLocationService, 
  getCheckInOutService 
} from './ServiceFactory';
export type { ServiceProvider, ServiceFactoryConfig } from './ServiceFactory';
