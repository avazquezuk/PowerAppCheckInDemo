# LSC TimeRegistration API

This AL extension provides REST API endpoints for the LS Central Time Registration functionality.

## Overview

This extension exposes three Web API pages for accessing LS Central tables:
- **LSC Staff Employee API** (Table 10015057) - Read-only
- **LSC Work Location API** (Table 10015021) - Read-only  
- **LSC Time Entry Registration API** (Table 10015007) - Read/Write/Update

## Dependencies

- **LS Central**: v27.0.0.0 (AppID: 5ecfc871-5d82-43f1-9c54-59685e82318d)

## API Endpoints

All APIs are published under:
- **Publisher**: `lsretail`
- **Group**: `timeregistration`
- **Version**: `v2.0`
- **Environment**: `LoyaltyIntegrationDev`
- **Tenant**: `be3fcc1f-2132-4821-95eb-5d33593096bf`
- **Company**: `CRONUS - LS Central` (ID: `24f9b5d6-4895-ef11-8a6b-00224840f1d6`)

### Base URL Pattern
```
https://<bc-instance>/api/lsretail/timeregistration/v1.0/companies(<company-id>)/
```

### 1. Staff Employee API (Read-Only)

**Endpoint**: `/staffEmployees`

**Entity Name**: `staffEmployee`

**Methods**: GET

**Fields**:
- `id` (SystemId) - Primary Key
- `number` - Employee number
- `firstName` - First name
- `lastName` - Last name  
- `name` - Computed full name
- `email` - Email address
- `mobilePhoneNo` - Mobile phone number
- `jobTitle` - Job title
- `status` - Status (Active/Blocked)
- `retailStaffId` - Retail Staff ID
- `retailUserId` - Retail User ID
- `employeeNo` - BC Employee Number
- `workRegion` - Work region
- `workLocation` - Base work location
- `timeEntryId` - Time entry ID
- `workRole` - Default work role

**Example**:
```http
GET /api/lsretail/timeregistration/v1.0/companies(<company-id>)/staffEmployees
GET /api/lsretail/timeregistration/v1.0/companies(<company-id>)/staffEmployees(<id>)
```

### 2. Work Location API (Read-Only)

**Endpoint**: `/workLocations`

**Entity Name**: `workLocation`

**Methods**: GET

**Fields**:
- `id` (SystemId) - Primary Key
- `code` - Location code
- `description` - Location description
- `workRegion` - Work region
- `storeNo` - Store number
- `responsiblePerson` - Responsible person (employee number)
- `status` - Status (Active/Inactive)
- `globalDimension1Code` - Global dimension 1 code
- `globalDimension2Code` - Global dimension 2 code

**Example**:
```http
GET /api/lsretail/timeregistration/v1.0/companies(<company-id>)/workLocations
GET /api/lsretail/timeregistration/v1.0/companies(<company-id>)/workLocations(<id>)
```

### 3. Time Entry Registration API (Read/Write)

**Endpoint**: `/timeEntryRegistrations`

**Entity Name**: `timeEntryRegistration`

**Methods**: GET, POST, PATCH

**Fields**:
- `id` (SystemId) - Primary Key
- `entryNo` - Entry number (auto-increment)
- `employeeNo` - Employee number
- `workLocation` - Work location code
- `workRoleCode` - Work role code
- `systemDateEntry` - System entry date
- `systemTimeEntry` - System entry time
- `systemDateExit` - System exit date
- `systemTimeExit` - System exit time
- `userDateEntry` - User-adjusted entry date
- `userTimeEntry` - User-adjusted entry time
- `userDateExit` - User-adjusted exit date
- `userTimeExit` - User-adjusted exit time
- `noOfHours` - Number of hours (calculated)
- `status` - Status (Open/Closed/Processed)
- `entryStatus` - Entry status (OK/Early/Late/Not Scheduled)
- `leavingStatus` - Leaving status (OK/Early/Late/Not in Schedule)
- `entryMethod` - Entry method (Automatic/Manual)
- `entryEmployeeComment` - Employee comment
- `originLogon` - Origin of logon
- `checkInDateTime` - Computed check-in datetime
- `checkOutDateTime` - Computed check-out datetime
- `durationMinutes` - Computed duration in minutes

**Examples**:

```http
# Get all time entries
GET https://api.businesscentral.dynamics.com/v2.0/be3fcc1f-2132-4821-95eb-5d33593096bf/LoyaltyIntegrationDev/api/lsretail/timeregistration/v2.0/companies(24f9b5d6-4895-ef11-8a6b-00224840f1d6)/timeEntryRegistrations

# Get specific time entry
GET https://api.businesscentral.dynamics.com/v2.0/be3fcc1f-2132-4821-95eb-5d33593096bf/LoyaltyIntegrationDev/api/lsretail/timeregistration/v2.0/companies(24f9b5d6-4895-ef11-8a6b-00224840f1d6)/timeEntryRegistrations(<id>)

# Filter by employee
GET https://api.businesscentral.dynamics.com/v2.0/be3fcc1f-2132-4821-95eb-5d33593096bf/LoyaltyIntegrationDev/api/lsretail/timeregistration/v2.0/companies(24f9b5d6-4895-ef11-8a6b-00224840f1d6)/timeEntryRegistrations?$filter=employeeNo eq 'STAFF001'

# Filter by status
GET https://api.businesscentral.dynamics.com/v2.0/be3fcc1f-2132-4821-95eb-5d33593096bf/LoyaltyIntegrationDev/api/lsretail/timeregistration/v2.0/companies(24f9b5d6-4895-ef11-8a6b-00224840f1d6)/timeEntryRegistrations?$filter=status eq 'Open'

# Create new check-in
POST https://api.businesscentral.dynamics.com/v2.0/be3fcc1f-2132-4821-95eb-5d33593096bf/LoyaltyIntegrationDev/api/lsretail/timeregistration/v2.0/companies(24f9b5d6-4895-ef11-8a6b-00224840f1d6)/timeEntryRegistrations
Content-Type: application/json

{
  "employeeNo": "STAFF001",
  "workLocation": "LOC001",
  "workRoleCode": "SALES",
  "entryEmployeeComment": "Starting work"
}

# Update check-out
PATCH https://api.businesscentral.dynamics.com/v2.0/be3fcc1f-2132-4821-95eb-5d33593096bf/LoyaltyIntegrationDev/api/lsretail/timeregistration/v2.0/companies(24f9b5d6-4895-ef11-8a6b-00224840f1d6)/timeEntryRegistrations(<id>)
Content-Type: application/json
If-Match: *

{
  "systemDateExit": "2024-01-15",
  "systemTimeExit": "17:00:00",
  "entryEmployeeComment": "Ending work"
}
```

## Features

### Auto-Calculation
The Time Entry Registration API automatically:
- Sets current date/time for new entries
- Calculates `noOfHours` when exit time is set
- Updates status from Open to Closed when checkout occurs
- Provides computed fields: `checkInDateTime`, `checkOutDateTime`, `durationMinutes`

### Default Values
New time entries automatically receive:
- `systemDateEntry`: Current date
- `systemTimeEntry`: Current time
- `entryMethod`: Automatic
- `status`: Open
- `entryStatus`: OK
- `originLogon`: "PowerApp"

## Authentication

These APIs use Business Central's standard OAuth 2.0 authentication. Ensure proper permissions are granted:
- **Read**: Requires read permissions on the respective tables
- **Write**: Requires insert/modify permissions on LSC Time Entry Registration table

## OData Query Options

All APIs support standard OData query options:
- `$filter` - Filter results
- `$select` - Select specific fields
- `$orderby` - Sort results
- `$top` - Limit results
- `$skip` - Skip results (pagination)
- `$expand` - Expand related entities (if applicable)
- `$count` - Include total count

## Error Handling

APIs follow standard Business Central error responses:
- `400 Bad Request` - Invalid request data
- `401 Unauthorized` - Missing/invalid authentication
- `403 Forbidden` - Insufficient permissions
- `404 Not Found` - Resource not found
- `409 Conflict` - Concurrency conflict (use If-Match header)
- `500 Internal Server Error` - Server error

## Development

### Building the Extension
1. Open in VS Code with AL Language extension
2. Download symbols (LS Central dependency required)
3. Build (Ctrl+Shift+B)
4. Publish to your Business Central environment

### ID Range
- Pages: 50000-50002
- Object range: 50000-50099 (as defined in app.json)

## Version History

### v1.0.0.0
- Initial release
- Staff Employee API (read-only)
- Work Location API (read-only)
- Time Entry Registration API (read/write)
- Auto-calculation of hours and durations
- OData query support

## License

Copyright © LS Retail

## Support

For issues or questions, contact LS Retail support.
