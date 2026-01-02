import { Employee, ApiResponse } from '@/types';
import { IEmployeeService } from '../interfaces/IEmployeeService';
import { 
  BCEmployee, 
  BCApiResponse,
  transformBCEmployee 
} from './bcTypes';
import { 
  buildBCUrl, 
  bcEndpoints, 
  ODataFilterBuilder 
} from './bcConfig';
import { 
  withErrorHandling, 
  withRetry, 
  parseBCError 
} from './bcErrors';

/**
 * Business Central implementation of IEmployeeService.
 * 
 * This service connects to Business Central's Employee API to fetch
 * employee data. In a Power Apps Code App, this would use the 
 * Power Platform SDK's data source connection.
 * 
 * Note: For Power Apps deployment, you need to:
 * 1. Add the BC data source via PAC CLI:
 *    pac code add-data-source -a "shared_dynamicssmbsaas" -c <connectionId>
 * 2. Use the generated service classes instead of direct fetch calls
 */
export class BCEmployeeService implements IEmployeeService {
  private currentUserId: string | null = null;

  /**
   * Set the current user ID (from Power Platform context)
   */
  setCurrentUserId(userId: string): void {
    this.currentUserId = userId;
  }

  private async fetchFromBC<T>(url: string): Promise<T> {
    const response = await fetch(url, {
      method: 'GET',
      headers: {
        'Accept': 'application/json',
        'Content-Type': 'application/json',
      },
    });

    if (!response.ok) {
      const body = await response.json().catch(() => ({}));
      throw parseBCError(response, body);
    }

    return response.json();
  }

  async getCurrentEmployee(): Promise<ApiResponse<Employee>> {
    return withErrorHandling(async () => {
      if (!this.currentUserId) {
        throw new Error('Current user ID not set');
      }

      return this.getEmployeeById(this.currentUserId).then(r => {
        if (!r.success) throw new Error(r.error);
        return r.data;
      });
    }, null as unknown as Employee);
  }

  async getEmployeeById(id: string): Promise<ApiResponse<Employee>> {
    return withErrorHandling(async () => {
      const filter = new ODataFilterBuilder()
        .equals('no', id)
        .build();

      const url = buildBCUrl(bcEndpoints.employees, { '$filter': filter });
      
      const result = await withRetry(() => 
        this.fetchFromBC<BCApiResponse<BCEmployee>>(url)
      );

      if (result.value.length === 0) {
        throw new Error('Employee not found');
      }

      return transformBCEmployee(result.value[0]);
    }, null as unknown as Employee);
  }

  async getAllEmployees(): Promise<ApiResponse<Employee[]>> {
    return withErrorHandling(async () => {
      const filter = new ODataFilterBuilder()
        .equals('status', 'Active')
        .build();

      const url = buildBCUrl(bcEndpoints.employees, { 
        '$filter': filter,
        '$orderby': 'displayName asc'
      });
      
      const result = await withRetry(() => 
        this.fetchFromBC<BCApiResponse<BCEmployee>>(url)
      );

      return result.value.map(transformBCEmployee);
    }, []);
  }

  async getDirectReports(managerId: string): Promise<ApiResponse<Employee[]>> {
    return withErrorHandling(async () => {
      const filter = new ODataFilterBuilder()
        .equals('managerId', managerId)
        .and()
        .equals('status', 'Active')
        .build();

      const url = buildBCUrl(bcEndpoints.employees, { 
        '$filter': filter,
        '$orderby': 'displayName asc'
      });
      
      const result = await withRetry(() => 
        this.fetchFromBC<BCApiResponse<BCEmployee>>(url)
      );

      return result.value.map(transformBCEmployee);
    }, []);
  }

  async searchEmployees(query: string): Promise<ApiResponse<Employee[]>> {
    return withErrorHandling(async () => {
      const filter = new ODataFilterBuilder()
        .contains('displayName', query)
        .and()
        .equals('status', 'Active')
        .build();

      const url = buildBCUrl(bcEndpoints.employees, { 
        '$filter': filter,
        '$orderby': 'displayName asc',
        '$top': '20'
      });
      
      const result = await withRetry(() => 
        this.fetchFromBC<BCApiResponse<BCEmployee>>(url)
      );

      return result.value.map(transformBCEmployee);
    }, []);
  }
}
