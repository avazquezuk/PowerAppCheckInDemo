/**
 * Power Apps Connector Base Class
 * 
 * Provides a base class for accessing Power Apps connectors through the connection references.
 * This allows JavaScript code to interact with Power Apps data sources.
 */

import { getConnector, isPowerAppsEnvironment, isConnectorAvailable } from './connectorSetup';

export interface PowerAppsConnectionConfig {
  connectionReference: string;
}

export class PowerAppsConnector {
  protected connectionReference: string;

  constructor(config: PowerAppsConnectionConfig) {
    this.connectionReference = config.connectionReference;
  }

  /**
   * Check if running in Power Apps environment
   */
  protected isPowerAppsEnvironment(): boolean {
    return isPowerAppsEnvironment();
  }

  /**
   * Check if this connector is available
   */
  protected isConnectorAvailable(): boolean {
    return isConnectorAvailable(this.connectionReference);
  }

  /**
   * Get the connector instance from Power Apps
   */
  protected getConnector(): any {
    return getConnector(this.connectionReference);
  }

  /**
   * Execute a connector action
   */
  protected async executeAction<T>(actionName: string, parameters?: any): Promise<T> {
    if (!this.isPowerAppsEnvironment()) {
      throw new Error('Cannot execute connector actions outside Power Apps environment');
    }

    if (!this.isConnectorAvailable()) {
      throw new Error(`Connector '${this.connectionReference}' is not available`);
    }

    try {
      const connector = this.getConnector();
      const action = connector[actionName];

      if (typeof action !== 'function') {
        throw new Error(`Action '${actionName}' not found on connector '${this.connectionReference}'`);
      }

      const result = await action.call(connector, parameters);
      return result;
    } catch (error) {
      console.error(`Error executing action '${actionName}' on connector '${this.connectionReference}':`, error);
      throw error;
    }
  }
}
