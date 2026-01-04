/**
 * Power Apps Business Central Employee Service
 * 
 * This implementation uses the Power Apps Business Central connector
 * to access employee data from LS Central.
 */

import { Employee, ApiResponse } from '@/types';
import { IEmployeeService } from '../interfaces/IEmployeeService';
import { PowerAppsBCService } from './PowerAppsBCService';

export class PowerAppsBCEmployeeService implements IEmployeeService {
  private bcService: PowerAppsBCService;
  private currentUserId: string = '';

  constructor() {
    this.bcService = new PowerAppsBCService();
  }

  setCurrentUserId(userId: string): void {
    this.currentUserId = userId;
  }

  getCurrentUserId(): string {
    return this.currentUserId;
  }

  async getCurrentEmployee(): Promise<ApiResponse<Employee>> {
    if (!this.currentUserId) {
      return { success: false, data: null as any, error: 'No current user ID set' };
    }

    try {
      // Try to find employee by email or retailUserId
      const filter = `email eq '${this.currentUserId}' or retailUserId eq '${this.currentUserId}'`;
      const employees = await this.bcService.listRecords<any>('staffEmployees', filter, 1);

      if (employees && employees.length > 0) {
        const emp = employees[0];
        const employee: Employee = {
          id: emp.number || '',
          firstName: emp.firstName || '',
          lastName: emp.lastName || '',
          name: `${emp.firstName || ''} ${emp.lastName || ''}`.trim(),
          email: emp.email || '',
          mobilePhoneNo: emp.phoneNumber || '',
          jobTitle: emp.jobTitle || '',
          status: emp.status || 'Active',
          retailStaffId: emp.retailStaffId || null,
          retailUserId: emp.retailUserId || null,
          employeeNo: emp.employeeNo || null,
          workRegion: emp.workRegion || null,
          workLocation: emp.workLocation || null,
          timeEntryId: emp.timeEntryId || null,
          workRole: emp.workRole || null,
        };
        return { success: true, data: employee };
      }

      return { success: false, data: null as any, error: `Employee not found for user: ${this.currentUserId}` };
    } catch (error) {
      console.error('Failed to get current employee:', error);
      return { success: false, data: null as any, error: error instanceof Error ? error.message : 'Unknown error' };
    }
  }

  async getEmployeeById(id: string): Promise<ApiResponse<Employee>> {
    try {
      const emp = await this.bcService.getRecord<any>('staffEmployees', id);
      const employee: Employee = {
        id: emp.number || '',
        firstName: emp.firstName || '',
        lastName: emp.lastName || '',
        name: `${emp.firstName || ''} ${emp.lastName || ''}`.trim(),
        email: emp.email || '',
        mobilePhoneNo: emp.phoneNumber || '',
        jobTitle: emp.jobTitle || '',
        status: emp.status || 'Active',
        retailStaffId: emp.retailStaffId || null,
        retailUserId: emp.retailUserId || null,
        employeeNo: emp.employeeNo || null,
        workRegion: emp.workRegion || null,
        workLocation: emp.workLocation || null,
        timeEntryId: emp.timeEntryId || null,
        workRole: emp.workRole || null,
      };
      return { success: true, data: employee };
    } catch (error) {
      console.error(`Failed to get employee ${id}:`, error);
      return { success: false, data: null as any, error: error instanceof Error ? error.message : 'Unknown error' };
    }
  }

  async getAllEmployees(): Promise<ApiResponse<Employee[]>> {
    try {
      const employees = await this.bcService.listRecords<any>('staffEmployees');
      const data = employees.map((emp: any): Employee => ({
        id: emp.number || '',
        firstName: emp.firstName || '',
        lastName: emp.lastName || '',
        name: `${emp.firstName || ''} ${emp.lastName || ''}`.trim(),
        email: emp.email || '',
        mobilePhoneNo: emp.phoneNumber || '',
        jobTitle: emp.jobTitle || '',
        status: emp.status || 'Active',
        retailStaffId: emp.retailStaffId || null,
        retailUserId: emp.retailUserId || null,
        employeeNo: emp.employeeNo || null,
        workRegion: emp.workRegion || null,
        workLocation: emp.workLocation || null,
        timeEntryId: emp.timeEntryId || null,
        workRole: emp.workRole || null,
      }));
      return { success: true, data };
    } catch (error) {
      console.error('Failed to get all employees:', error);
      return { success: false, data: [], error: error instanceof Error ? error.message : 'Unknown error' };
    }
  }

  async getDirectReports(_managerId: string): Promise<ApiResponse<Employee[]>> {
    // Not implemented yet
    return { success: true, data: [] };
  }

  async searchEmployees(query: string): Promise<ApiResponse<Employee[]>> {
    try {
      const filter = `contains(tolower(firstName), '${query.toLowerCase()}') or contains(tolower(lastName), '${query.toLowerCase()}') or contains(tolower(email), '${query.toLowerCase()}')`;
      const employees = await this.bcService.listRecords<any>('staffEmployees', filter);
      const data = employees.map((emp: any): Employee => ({
        id: emp.number || '',
        firstName: emp.firstName || '',
        lastName: emp.lastName || '',
        name: `${emp.firstName || ''} ${emp.lastName || ''}`.trim(),
        email: emp.email || '',
        mobilePhoneNo: emp.phoneNumber || '',
        jobTitle: emp.jobTitle || '',
        status: emp.status || 'Active',
        retailStaffId: emp.retailStaffId || null,
        retailUserId: emp.retailUserId || null,
        employeeNo: emp.employeeNo || null,
        workRegion: emp.workRegion || null,
        workLocation: emp.workLocation || null,
        timeEntryId: emp.timeEntryId || null,
        workRole: emp.workRole || null,
      }));
      return { success: true, data };
    } catch (error) {
      console.error('Failed to search employees:', error);
      return { success: false, data: [], error: error instanceof Error ? error.message : 'Unknown error' };
    }
  }
}
