# Power Apps Data Sources

This document describes the Power Apps data source implementations for accessing Office 365 and Business Central connectors from the Code App.

## Overview

The app now supports three service provider modes:

1. **`mock`** - Uses mock/sample data for local development
2. **`bc`** - Direct Business Central API calls (not supported in Power Apps Code Apps)
3. **`powerApps`** - Uses Power Apps connectors through connection references (**recommended for production**)

## Architecture

### Power Apps Connector Base Class

`PowerAppsConnector` provides the foundation for accessing Power Apps connectors:

```typescript
import { PowerAppsConnector } from '@/services/powerApps';

class MyService extends PowerAppsConnector {
  constructor() {
    super({ connectionReference: 'MyConnection' });
  }

  async callAction() {
    return await this.executeAction('ActionName', parameters);
  }
}
```

### Office 365 Users Data Source

**Service**: `PowerAppsOffice365Service`
**Connection Reference**: `Office365Users`
**Configuration**: `VITE_OFFICE365_CONNECTION_REF`

Methods:
- `getMyProfile()` - Get current user's Office 365 profile
- `getUserPhoto(userPrincipalName?)` - Get user's photo
- `getPhotoUrl(userPrincipalName?)` - Get photo as data URL

### Business Central Data Source

**Service**: `PowerAppsBCService`
**Connection Reference**: `BusinessCentral`
**Configuration**: `VITE_BC_CONNECTION_REF`

Base service for BC operations:
- `listRecords<T>(entityName, filter?, top?)` - List records with OData filtering
- `getRecord<T>(entityName, id)` - Get single record by ID
- `createRecord<T>(entityName, data)` - Create new record
- `updateRecord<T>(entityName, id, data)` - Update existing record
- `deleteRecord(entityName, id)` - Delete record

Specialized BC Services:
- `PowerAppsBCEmployeeService` - Employee/Staff operations
- `PowerAppsBCLocationService` - Work Location operations

## Configuration

### Environment Variables

**.env.local** (Local Development):
```env
VITE_SERVICE_PROVIDER=mock
VITE_OFFICE365_CONNECTION_REF=Office365Users
VITE_BC_CONNECTION_REF=BusinessCentral
```

**.env.production** (Power Apps):
```env
VITE_SERVICE_PROVIDER=powerApps
VITE_OFFICE365_CONNECTION_REF=Office365Users
VITE_BC_CONNECTION_REF=BusinessCentral
```

### Power Apps Configuration

**power.config.json**:
```json
{
  "connectionReferences": {
    "Office365Users": {
      "connectionId": "11c05e32de1c43698d0f5342e60c5d6d",
      "apiId": "/providers/Microsoft.PowerApps/apis/shared_office365users"
    },
    "BusinessCentral": {
      "connectionId": "4d350ad4b57943a98ac35a0682a58a01",
      "apiId": "/providers/Microsoft.PowerApps/apis/shared_dynamicssmbsaas"
    }
  }
}
```

## Usage

### Service Factory

The `ServiceFactory` automatically detects the environment and uses the appropriate provider:

```typescript
import { serviceFactory } from '@/services/ServiceFactory';

// Get service instances
const employeeService = serviceFactory.getEmployeeService();
const locationService = serviceFactory.getLocationService();
const checkInOutService = serviceFactory.getCheckInOutService();

// Use services
const employee = await employeeService.getCurrentEmployee();
const locations = await locationService.getLocations();
```

### Direct Service Usage

For Office 365:
```typescript
import { office365UserService } from '@/services/Office365UserService';

const profile = await office365UserService.getMyProfile();
const photo = await office365UserService.getPhotoUrl();
```

For Business Central (Power Apps):
```typescript
import { PowerAppsBCService } from '@/services/powerApps';

const bcService = new PowerAppsBCService();
const employees = await bcService.listRecords('staffEmployees', "status eq 'Active'");
```

## How It Works

### Local Development
- Uses `mock` provider by default
- No connection to external services
- Fast development with sample data

### Power Apps Deployment
1. App detects Power Apps environment through `window.powerAppsConnections`
2. Service provider automatically switches to `powerApps` if configured
3. Connector actions are executed through Power Apps SDK
4. Authentication handled automatically by Power Apps

### Connection Flow

```
User Opens App
    ↓
ServiceFactory.getDefaultProvider()
    ↓
Detect Power Apps Environment?
    ├─ Yes → Check VITE_SERVICE_PROVIDER === 'powerApps'
    │         ↓
    │      Use PowerAppsBCService / PowerAppsOffice365Service
    │         ↓
    │      executeAction() through window.powerAppsConnections
    │         ↓
    │      Power Apps handles authentication & API calls
    │
    └─ No → Use 'mock' provider
              ↓
           MockEmployeeService / MockLocationService
```

## Important Notes

1. **JavaScript Limitations**: Power Apps Code Apps can access connectors through the connection reference mechanism, but not through direct HTTP fetch calls.

2. **Authentication**: All authentication is handled by Power Apps. You don't need to manage OAuth tokens or credentials in your code.

3. **Connection References**: Must be configured in both:
   - `power.config.json` (for deployment)
   - Environment variables (for runtime detection)

4. **Error Handling**: All Power Apps service methods include try-catch blocks and return `ApiResponse<T>` format with success/error information.

5. **Type Safety**: All services use TypeScript generics for type-safe data access.

## Testing

### Local Testing
```bash
# Uses mock data
npm run dev
```

### Power Apps Testing
```bash
# Build with production config (.env.production)
npm run build

# Deploy to Power Apps
pac code push
```

The app will automatically use Power Apps connectors when running in the Power Apps environment.

## Troubleshooting

### Connection Not Found
**Error**: "Connector 'BusinessCentral' not found in Power Apps"
**Solution**: Verify connection exists in `power.config.json` and connection is active in Power Apps portal

### Service Provider Not Switching
**Problem**: App uses mock data in Power Apps
**Solution**: Check that:
1. `VITE_SERVICE_PROVIDER=powerApps` in `.env.production`
2. Build includes production environment variables
3. `window.powerAppsConnections` is available at runtime

### Type Errors
**Problem**: TypeScript errors with Power Apps services
**Solution**: Ensure all services properly implement their interfaces (`IEmployeeService`, `ILocationService`) and return `ApiResponse<T>` types

## Future Enhancements

- [ ] Implement `PowerAppsBCCheckInOutService` for time entry operations
- [ ] Add caching layer for frequently accessed data
- [ ] Implement offline support with local storage
- [ ] Add retry logic for failed connector calls
- [ ] Create unit tests for Power Apps services
