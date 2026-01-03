/**
 * Business Central API Configuration
 * 
 * These settings control how the app connects to Business Central.
 * In a real Power Apps deployment, the connection is handled by the 
 * Power Platform SDK data source.
 */

export interface BCConfig {
  /** Base URL for Business Central API */
  baseUrl: string;
  /** API version to use */
  apiVersion: string;
  /** Company ID in Business Central */
  companyId: string;
  /** Tenant ID for authentication */
  tenantId: string;
}

/**
 * Default configuration (will be overridden by Power Platform at runtime)
 */
export const bcConfig: BCConfig = {
  baseUrl: import.meta.env.VITE_BC_BASE_URL || '',
  apiVersion: import.meta.env.VITE_BC_API_VERSION || 'v2.0',
  companyId: import.meta.env.VITE_BC_COMPANY_ID || '',
  tenantId: import.meta.env.VITE_BC_TENANT_ID || '',
};

/**
 * API Endpoints for LS Central entities
 */
export const bcEndpoints = {
  /** LSC STAFF Employee (Table 10015057) */
  employees: '/lscStaffEmployees',
  /** LSC Work Location (Table 10015021) */
  locations: '/lscWorkLocations',
  /** LSC Time Entry Registration (Table 10015007) */
  timeEntryRegistrations: '/lscTimeEntryRegistrations',
  // Legacy alias
  checkInOutRecords: '/lscTimeEntryRegistrations',
} as const;

/**
 * Build the full API URL for a Business Central endpoint
 */
export function buildBCUrl(endpoint: string, params?: Record<string, string>): string {
  const base = `${bcConfig.baseUrl}/api/${bcConfig.apiVersion}/companies(${bcConfig.companyId})${endpoint}`;
  
  if (params && Object.keys(params).length > 0) {
    const queryString = Object.entries(params)
      .map(([key, value]) => `${encodeURIComponent(key)}=${encodeURIComponent(value)}`)
      .join('&');
    return `${base}?${queryString}`;
  }
  
  return base;
}

/**
 * OData filter builder for BC queries
 */
export class ODataFilterBuilder {
  private filters: string[] = [];

  equals(field: string, value: string | number | boolean): this {
    if (typeof value === 'string') {
      this.filters.push(`${field} eq '${value}'`);
    } else {
      this.filters.push(`${field} eq ${value}`);
    }
    return this;
  }

  greaterThanOrEqual(field: string, value: string | number | Date): this {
    const formattedValue = value instanceof Date ? value.toISOString() : value;
    this.filters.push(`${field} ge ${typeof formattedValue === 'string' ? `'${formattedValue}'` : formattedValue}`);
    return this;
  }

  lessThanOrEqual(field: string, value: string | number | Date): this {
    const formattedValue = value instanceof Date ? value.toISOString() : value;
    this.filters.push(`${field} le ${typeof formattedValue === 'string' ? `'${formattedValue}'` : formattedValue}`);
    return this;
  }

  contains(field: string, value: string): this {
    this.filters.push(`contains(${field}, '${value}')`);
    return this;
  }

  isNull(field: string): this {
    this.filters.push(`${field} eq null`);
    return this;
  }

  isNotNull(field: string): this {
    this.filters.push(`${field} ne null`);
    return this;
  }

  and(): this {
    // Filters are combined with AND by default
    return this;
  }

  build(): string {
    return this.filters.join(' and ');
  }
}
