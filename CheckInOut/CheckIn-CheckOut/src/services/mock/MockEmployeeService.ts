import { Employee, ApiResponse } from '@/types';
import { IEmployeeService } from '../interfaces/IEmployeeService';
import { mockEmployees, currentUserId } from '../mockData';

// Simulated delay to mimic API calls
const delay = (ms: number) => new Promise(resolve => setTimeout(resolve, ms));

/**
 * Mock implementation of IEmployeeService for local development.
 */
export class MockEmployeeService implements IEmployeeService {
  async getCurrentEmployee(): Promise<ApiResponse<Employee>> {
    await delay(300);
    const employee = mockEmployees.find(e => e.id === currentUserId);
    
    if (!employee) {
      return { data: null as unknown as Employee, success: false, error: 'Employee not found' };
    }
    
    return { data: employee, success: true };
  }

  async getEmployeeById(id: string): Promise<ApiResponse<Employee>> {
    await delay(200);
    const employee = mockEmployees.find(e => e.id === id);
    
    if (!employee) {
      return { data: null as unknown as Employee, success: false, error: 'Employee not found' };
    }
    
    return { data: employee, success: true };
  }

  async getAllEmployees(): Promise<ApiResponse<Employee[]>> {
    await delay(300);
    return { data: mockEmployees.filter(e => e.isActive), success: true };
  }

  async getDirectReports(managerId: string): Promise<ApiResponse<Employee[]>> {
    await delay(300);
    const reports = mockEmployees.filter(e => e.managerId === managerId && e.isActive);
    return { data: reports, success: true };
  }

  async searchEmployees(query: string): Promise<ApiResponse<Employee[]>> {
    await delay(200);
    const lowerQuery = query.toLowerCase();
    const results = mockEmployees.filter(
      e =>
        e.isActive &&
        (e.name.toLowerCase().includes(lowerQuery) ||
          e.email.toLowerCase().includes(lowerQuery) ||
          e.department.toLowerCase().includes(lowerQuery))
    );
    return { data: results, success: true };
  }
}
