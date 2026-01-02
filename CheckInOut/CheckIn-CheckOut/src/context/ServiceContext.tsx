import React, { createContext, useContext, useMemo } from 'react';
import { IEmployeeService } from '@/services/interfaces/IEmployeeService';
import { ILocationService } from '@/services/interfaces/ILocationService';
import { ICheckInOutService } from '@/services/interfaces/ICheckInOutService';
import { 
  serviceFactory, 
  getEmployeeService, 
  getLocationService, 
  getCheckInOutService,
  ServiceProvider
} from '@/services/ServiceFactory';

/**
 * Service context value
 */
interface ServiceContextValue {
  employeeService: IEmployeeService;
  locationService: ILocationService;
  checkInOutService: ICheckInOutService;
  provider: ServiceProvider;
}

const ServiceContext = createContext<ServiceContextValue | null>(null);

/**
 * Service Provider Props
 */
interface ServiceProviderProps {
  children: React.ReactNode;
  /** Override the default provider (useful for testing) */
  provider?: ServiceProvider;
}

/**
 * Service Provider Component
 * 
 * Provides service instances to the entire app via React context.
 * This allows components to easily access services without prop drilling.
 */
export const ServiceProvider: React.FC<ServiceProviderProps> = ({ 
  children, 
  provider 
}) => {
  const value = useMemo(() => {
    // Configure factory if provider override is specified
    if (provider) {
      serviceFactory.configure({ provider });
    }

    return {
      employeeService: getEmployeeService(),
      locationService: getLocationService(),
      checkInOutService: getCheckInOutService(),
      provider: serviceFactory.getProvider(),
    };
  }, [provider]);

  return (
    <ServiceContext.Provider value={value}>
      {children}
    </ServiceContext.Provider>
  );
};

/**
 * Hook to access services from context
 */
export function useServices(): ServiceContextValue {
  const context = useContext(ServiceContext);
  if (!context) {
    throw new Error('useServices must be used within a ServiceProvider');
  }
  return context;
}

/**
 * Hook to access employee service
 */
export function useEmployeeService(): IEmployeeService {
  return useServices().employeeService;
}

/**
 * Hook to access location service
 */
export function useLocationService(): ILocationService {
  return useServices().locationService;
}

/**
 * Hook to access check-in/out service
 */
export function useCheckInOutService(): ICheckInOutService {
  return useServices().checkInOutService;
}

/**
 * Hook to get current service provider
 */
export function useServiceProvider(): ServiceProvider {
  return useServices().provider;
}
