/**
 * Power Apps Business Central Connector Service
 * 
 * This service uses the Business Central connector through Power Apps connection reference.
 */

import { PowerAppsConnector } from './PowerAppsConnector';

export interface PowerAppsBCConfig {
  connectionReference: string;
  environment: string;
  company: string;
}

export class PowerAppsBCService extends PowerAppsConnector {
  private environment: string;
  private company: string;

  constructor(config?: Partial<PowerAppsBCConfig>) {
    super({
      connectionReference: config?.connectionReference || 
                          import.meta.env.VITE_BC_CONNECTION_REF || 
                          'BusinessCentral'
    });
    
    this.environment = config?.environment || 'LoyaltyIntegrationDev';
    this.company = config?.company || 'CRONUS - LS Central';
  }

  /**
   * List records from a Business Central entity
   */
  async listRecords<T>(entityName: string, filter?: string, top?: number): Promise<T[]> {
    try {
      const params: any = {
        environment: this.environment,
        company: this.company,
        table: entityName,
      };

      if (filter) {
        params.$filter = filter;
      }

      if (top) {
        params.$top = top;
      }

      const result: any = await this.executeAction('ListRecords', params);
      return (result?.value || []) as T[];
    } catch (error) {
      console.error(`Failed to list records from ${entityName}:`, error);
      throw error;
    }
  }

  /**
   * Get a single record from Business Central
   */
  async getRecord<T>(entityName: string, id: string): Promise<T> {
    try {
      const result = await this.executeAction('GetRecord', {
        environment: this.environment,
        company: this.company,
        table: entityName,
        id: id,
      });
      return result as T;
    } catch (error) {
      console.error(`Failed to get record ${id} from ${entityName}:`, error);
      throw error;
    }
  }

  /**
   * Create a record in Business Central
   */
  async createRecord<T>(entityName: string, data: any): Promise<T> {
    try {
      const result = await this.executeAction('CreateRecord', {
        environment: this.environment,
        company: this.company,
        table: entityName,
        item: data,
      });
      return result as T;
    } catch (error) {
      console.error(`Failed to create record in ${entityName}:`, error);
      throw error;
    }
  }

  /**
   * Update a record in Business Central
   */
  async updateRecord<T>(entityName: string, id: string, data: any): Promise<T> {
    try {
      const result = await this.executeAction('UpdateRecord', {
        environment: this.environment,
        company: this.company,
        table: entityName,
        id: id,
        item: data,
      });
      return result as T;
    } catch (error) {
      console.error(`Failed to update record ${id} in ${entityName}:`, error);
      throw error;
    }
  }

  /**
   * Delete a record from Business Central
   */
  async deleteRecord(entityName: string, id: string): Promise<void> {
    try {
      await this.executeAction('DeleteRecord', {
        environment: this.environment,
        company: this.company,
        table: entityName,
        id: id,
      });
    } catch (error) {
      console.error(`Failed to delete record ${id} from ${entityName}:`, error);
      throw error;
    }
  }
}
