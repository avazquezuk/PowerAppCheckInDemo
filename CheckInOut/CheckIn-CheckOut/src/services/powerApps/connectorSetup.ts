/**
 * Power Apps Connector Setup
 * 
 * This module initializes and exposes Power Apps connectors to the application.
 * It checks for connector availability and sets up the global connector references.
 */

interface PowerAppsConnection {
  [key: string]: any;
}

interface PowerAppsWindow extends Window {
  powerAppsConnections?: PowerAppsConnection;
}

declare const window: PowerAppsWindow;

/**
 * Initialize Power Apps connectors
 * This should be called early in the app lifecycle
 */
export function initializePowerAppsConnectors(): void {
  try {
    if (typeof window === 'undefined') {
      return;
    }

    // Initialize empty connections object if not present
    if (!window.powerAppsConnections) {
      window.powerAppsConnections = {};
    }
  } catch (error) {
    console.warn('Failed to initialize Power Apps connectors:', error);
  }
}

/**
 * Check if running in Power Apps environment
 */
export function isPowerAppsEnvironment(): boolean {
  try {
    return typeof window !== 'undefined' && 
           window.powerAppsConnections !== undefined;
  } catch {
    return false;
  }
}

/**
 * Get a specific connector by reference name
 */
export function getConnector(connectionReference: string): any {
  try {
    if (!isPowerAppsEnvironment()) {
      throw new Error('Not running in Power Apps environment');
    }

    const connector = window.powerAppsConnections![connectionReference];
    if (!connector) {
      const available = Object.keys(window.powerAppsConnections || {}).join(', ') || 'none';
      throw new Error(`Connector '${connectionReference}' not found. Available: ${available}`);
    }

    return connector;
  } catch (error) {
    console.error('Error getting connector:', error);
    throw error;
  }
}

/**
 * List all available connectors
 */
export function listAvailableConnectors(): string[] {
  try {
    if (!isPowerAppsEnvironment()) {
      return [];
    }

    return Object.keys(window.powerAppsConnections || {});
  } catch {
    return [];
  }
}

/**
 * Check if a specific connector is available
 */
export function isConnectorAvailable(connectionReference: string): boolean {
  try {
    if (!isPowerAppsEnvironment()) {
      return false;
    }

    return window.powerAppsConnections![connectionReference] !== undefined;
  } catch {
    return false;
  }
}
