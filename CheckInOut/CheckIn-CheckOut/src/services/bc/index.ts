export { bcConfig, buildBCUrl, bcEndpoints, ODataFilterBuilder } from './bcConfig';
export type { BCConfig } from './bcConfig';

export { 
  transformBCEmployee, 
  transformBCLocation, 
  transformBCCheckInOutRecord 
} from './bcTypes';
export type { 
  BCEmployee, 
  BCLocation, 
  BCCheckInOutRecord,
  BCApiResponse,
  BCSingleResponse 
} from './bcTypes';

export { BCApiError, parseBCError, withErrorHandling, withRetry } from './bcErrors';
export type { BCError, BCErrorDetail, RetryConfig } from './bcErrors';

export { BCEmployeeService } from './BCEmployeeService';
export { BCLocationService } from './BCLocationService';
export { BCCheckInOutService } from './BCCheckInOutService';
