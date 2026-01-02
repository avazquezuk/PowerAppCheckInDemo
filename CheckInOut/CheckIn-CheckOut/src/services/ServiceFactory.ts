import { IEmployeeService } from './interfaces/IEmployeeService';
import { ILocationService } from './interfaces/ILocationService';
import { ICheckInOutService } from './interfaces/ICheckInOutService';
import { MockEmployeeService } from './mock/MockEmployeeService';
import { MockLocationService } from './mock/MockLocationService';
import { MockCheckInOutService } from './mock/MockCheckInOutService';
import { BCEmployeeService } from './bc/BCEmployeeService';
import { BCLocationService } from './bc/BCLocationService';
import { BCCheckInOutService } from './bc/BCCheckInOutService';

/**
 * Service provider type - determines which implementation to use
 */
export type ServiceProvider = 'mock' | 'bc';

/**
 * Service factory configuration
 */
export interface ServiceFactoryConfig {
  provider: ServiceProvider;
  currentUserId?: string;
}

/**
 * Get the configured service provider from environment
 */
function getDefaultProvider(): ServiceProvider {
  const envProvider = import.meta.env.VITE_SERVICE_PROVIDER;
  if (envProvider === 'bc') {
    return 'bc';
  }
  // Default to mock in development
  return import.meta.env.DEV ? 'mock' : 'bc';
}

/**
 * Service Factory
 * 
 * Creates service instances based on configuration.
 * In local development, uses mock services.
 * In Power Apps deployment, uses Business Central services.
 */
class ServiceFactory {
  private config: ServiceFactoryConfig;
  
  // Singleton instances
  private employeeService: IEmployeeService | null = null;
  private locationService: ILocationService | null = null;
  private checkInOutService: ICheckInOutService | null = null;

  constructor() {
    this.config = {
      provider: getDefaultProvider(),
    };
  }

  /**
   * Configure the service factory
   */
  configure(config: Partial<ServiceFactoryConfig>): void {
    this.config = { ...this.config, ...config };
    // Reset singleton instances when config changes
    this.employeeService = null;
    this.locationService = null;
    this.checkInOutService = null;
  }

  /**
   * Get the current provider
   */
  getProvider(): ServiceProvider {
    return this.config.provider;
  }

  /**
   * Set the current user ID (for BC services)
   */
  setCurrentUserId(userId: string): void {
    this.config.currentUserId = userId;
    if (this.employeeService instanceof BCEmployeeService) {
      this.employeeService.setCurrentUserId(userId);
    }
  }

  /**
   * Get Employee service instance
   */
  getEmployeeService(): IEmployeeService {
    if (!this.employeeService) {
      if (this.config.provider === 'bc') {
        const service = new BCEmployeeService();
        if (this.config.currentUserId) {
          service.setCurrentUserId(this.config.currentUserId);
        }
        this.employeeService = service;
      } else {
        this.employeeService = new MockEmployeeService();
      }
    }
    return this.employeeService;
  }

  /**
   * Get Location service instance
   */
  getLocationService(): ILocationService {
    if (!this.locationService) {
      if (this.config.provider === 'bc') {
        this.locationService = new BCLocationService();
      } else {
        this.locationService = new MockLocationService();
      }
    }
    return this.locationService;
  }

  /**
   * Get CheckInOut service instance
   */
  getCheckInOutService(): ICheckInOutService {
    if (!this.checkInOutService) {
      if (this.config.provider === 'bc') {
        this.checkInOutService = new BCCheckInOutService();
      } else {
        this.checkInOutService = new MockCheckInOutService();
      }
    }
    return this.checkInOutService;
  }

  /**
   * Reset all service instances (useful for testing)
   */
  reset(): void {
    this.employeeService = null;
    this.locationService = null;
    this.checkInOutService = null;
  }

  /**
   * Reset mock data (only works with mock services)
   */
  resetMockData(): void {
    if (this.checkInOutService instanceof MockCheckInOutService) {
      this.checkInOutService.reset();
    }
  }
}

// Export singleton instance
export const serviceFactory = new ServiceFactory();

// Convenience exports for direct service access
export const getEmployeeService = () => serviceFactory.getEmployeeService();
export const getLocationService = () => serviceFactory.getLocationService();
export const getCheckInOutService = () => serviceFactory.getCheckInOutService();
