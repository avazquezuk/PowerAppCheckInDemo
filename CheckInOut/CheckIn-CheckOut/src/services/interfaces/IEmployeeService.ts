import { Employee, ApiResponse } from '@/types';

/**
 * Interface for Employee service operations.
 * Implementations can use mock data or connect to Business Central.
 */
export interface IEmployeeService {
  /**
   * Get the currently logged-in employee
   */
  getCurrentEmployee(): Promise<ApiResponse<Employee>>;

  /**
   * Get an employee by their ID
   */
  getEmployeeById(id: string): Promise<ApiResponse<Employee>>;

  /**
   * Get all active employees (for manager/admin views)
   */
  getAllEmployees(): Promise<ApiResponse<Employee[]>>;

  /**
   * Get direct reports for a manager
   */
  getDirectReports(managerId: string): Promise<ApiResponse<Employee[]>>;

  /**
   * Search employees by name or email
   */
  searchEmployees(query: string): Promise<ApiResponse<Employee[]>>;
}
