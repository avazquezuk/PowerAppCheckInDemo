# LSC TimeRegistration API Extension

## Project Structure

```
APICheckInOut/
├── .AL-Go/
│   └── settings.json          # AL-GO for GitHub settings
├── src/
│   ├── Page50000.LSCStaffEmployeeAPI.al      # Staff Employee API (read-only)
│   ├── Page50001.LSCWorkLocationAPI.al       # Work Location API (read-only)
│   ├── Page50002.LSCTimeEntryRegAPI.al       # Time Entry Registration API (read/write)
│   └── PermissionSet50000.LSCTimeRegistrationAPI.al # Permission sets
├── app.json                   # Extension manifest
└── README.md                  # API documentation
```

## Quick Start

### Prerequisites
- Business Central with LS Central v27.0.0.0 installed
- AL Language extension for VS Code
- AL-GO for GitHub (optional, for CI/CD)

### Installation

1. **Clone or download this extension**

2. **Open in VS Code**
   ```bash
   code APICheckInOut
   ```

3. **Configure launch.json**
   Create `.vscode/launch.json`:
   ```json
   {
     "version": "0.2.0",
     "configurations": [
       {
         "type": "al",
         "request": "launch",
         "name": "Your BC Server",
         "server": "https://your-bc-instance.com",
         "serverInstance": "BC",
         "authentication": "AAD",
         "startupObjectType": "Page",
         "startupObjectId": 50000,
         "schemaUpdateMode": "Synchronize",
         "tenant": "default"
       }
     ]
   }
   ```

4. **Download symbols**
   - Press `Ctrl+Shift+P`
   - Run "AL: Download Symbols"

5. **Build and publish**
   - Press `Ctrl+Shift+B` to build
   - Press `F5` to publish and launch

## API Usage

### Authentication Setup

1. **Register Azure AD Application** (if not already done)
   - Go to Azure Portal > Azure Active Directory > App registrations
   - Create new registration
   - Add API permissions for Dynamics 365 Business Central
   - Note the Application (client) ID and create a client secret

2. **Configure Business Central**
   - Add the Azure AD application to Business Central
   - Assign appropriate permission sets:
     - `LSC TimeRegistration API - Read` (read-only access)
     - `LSC TimeRegistration API - Full` (full access including write)

### Get Access Token

```bash
curl -X POST https://login.microsoftonline.com/{tenant-id}/oauth2/v2.0/token \
  -H "Content-Type: application/x-www-form-urlencoded" \
  -d "client_id={client-id}" \
  -d "client_secret={client-secret}" \
  -d "scope=https://api.businesscentral.dynamics.com/.default" \
  -d "grant_type=client_credentials"
```

### API Examples

#### 1. Get All Staff Employees
```bash
curl -X GET \
  "https://api.businesscentral.dynamics.com/v2.0/be3fcc1f-2132-4821-95eb-5d33593096bf/LoyaltyIntegrationDev/api/lsretail/timeregistration/v2.0/companies(24f9b5d6-4895-ef11-8a6b-00224840f1d6)/staffEmployees" \
  -H "Authorization: Bearer {access-token}"
```

#### 2. Get Employee by Number
```bash
curl -X GET \
  "https://api.businesscentral.dynamics.com/v2.0/be3fcc1f-2132-4821-95eb-5d33593096bf/LoyaltyIntegrationDev/api/lsretail/timeregistration/v2.0/companies(24f9b5d6-4895-ef11-8a6b-00224840f1d6)/staffEmployees?$filter=number eq 'STAFF001'" \
  -H "Authorization: Bearer {access-token}"
```

#### 3. Get All Work Locations
```bash
curl -X GET \
  "https://api.businesscentral.dynamics.com/v2.0/be3fcc1f-2132-4821-95eb-5d33593096bf/LoyaltyIntegrationDev/api/lsretail/timeregistration/v2.0/companies(24f9b5d6-4895-ef11-8a6b-00224840f1d6)/workLocations" \
  -H "Authorization: Bearer {access-token}"
```

#### 4. Get Active Locations Only
```bash
curl -X GET \
  "https://api.businesscentral.dynamics.com/v2.0/be3fcc1f-2132-4821-95eb-5d33593096bf/LoyaltyIntegrationDev/api/lsretail/timeregistration/v2.0/companies(24f9b5d6-4895-ef11-8a6b-00224840f1d6)/workLocations?$filter=status eq 'Active'" \
  -H "Authorization: Bearer {access-token}"
```

#### 5. Get Open Time Entries for Employee
```bash
curl -X GET \
  "https://api.businesscentral.dynamics.com/v2.0/be3fcc1f-2132-4821-95eb-5d33593096bf/LoyaltyIntegrationDev/api/lsretail/timeregistration/v2.0/companies(24f9b5d6-4895-ef11-8a6b-00224840f1d6)/timeEntryRegistrations?$filter=employeeNo eq 'STAFF001' and status eq 'Open'" \
  -H "Authorization: Bearer {access-token}"
```

#### 6. Create New Check-In
```bash
curl -X POST \
  "https://api.businesscentral.dynamics.com/v2.0/be3fcc1f-2132-4821-95eb-5d33593096bf/LoyaltyIntegrationDev/api/lsretail/timeregistration/v2.0/companies(24f9b5d6-4895-ef11-8a6b-00224840f1d6)/timeEntryRegistrations" \
  -H "Authorization: Bearer {access-token}" \
  -H "Content-Type: application/json" \
  -d '{
    "employeeNo": "STAFF001",
    "workLocation": "LOC001",
    "workRoleCode": "SALES",
    "entryEmployeeComment": "Starting morning shift"
  }'
```

#### 7. Update Check-Out (Close Entry)
```bash
curl -X PATCH \
  "https://api.businesscentral.dynamics.com/v2.0/be3fcc1f-2132-4821-95eb-5d33593096bf/LoyaltyIntegrationDev/api/lsretail/timeregistration/v2.0/companies(24f9b5d6-4895-ef11-8a6b-00224840f1d6)/timeEntryRegistrations({entry-id})" \
  -H "Authorization: Bearer {access-token}" \
  -H "Content-Type: application/json" \
  -H "If-Match: *" \
  -d '{
    "systemDateExit": "2024-01-15",
    "systemTimeExit": "17:30:00",
    "entryEmployeeComment": "Completed shift"
  }'
```

#### 8. Get Time Entries with Pagination
```bash
curl -X GET \
  "https://api.businesscentral.dynamics.com/v2.0/be3fcc1f-2132-4821-95eb-5d33593096bf/LoyaltyIntegrationDev/api/lsretail/timeregistration/v2.0/companies(24f9b5d6-4895-ef11-8a6b-00224840f1d6)/timeEntryRegistrations?$top=10&$skip=0&$orderby=systemDateEntry desc" \
  -H "Authorization: Bearer {access-token}"
```

## Integration with Power Apps

### Add as Data Source

1. In Power Apps Studio, go to **Data** > **Add data**
2. Select **Business Central**
3. Connect to your BC instance
4. Search for and add:
   - `staffEmployees`
   - `workLocations`
   - `timeEntryRegistrations`

### Example Power Fx Formulas

**Get current user's employee record:**
```powerfx
LookUp(staffEmployees, retailUserId = User().Email)
```

**Get active locations:**
```powerfx
Filter(workLocations, status = "Active")
```

**Check if user is currently checked in:**
```powerfx
!IsEmpty(
    Filter(
        timeEntryRegistrations,
        employeeNo = CurrentEmployee.number && 
        status = "Open"
    )
)
```

**Create check-in:**
```powerfx
Patch(
    timeEntryRegistrations,
    Defaults(timeEntryRegistrations),
    {
        employeeNo: CurrentEmployee.number,
        workLocation: SelectedLocation.code,
        workRoleCode: CurrentEmployee.workRole,
        entryEmployeeComment: txtNotes.Text
    }
)
```

**Create check-out:**
```powerfx
Patch(
    timeEntryRegistrations,
    CurrentCheckIn,
    {
        systemDateExit: Today(),
        systemTimeExit: Text(Now(), "hh:mm:ss"),
        entryEmployeeComment: txtNotes.Text
    }
)
```

## Testing

### Using Postman

1. Import the collection from the examples above
2. Set up environment variables:
   - `bc_instance`: Your BC URL
   - `company_id`: Company GUID
   - `access_token`: OAuth token
3. Run requests

### Using PowerShell

```powershell
# Set variables
$tenant = "be3fcc1f-2132-4821-95eb-5d33593096bf"
$environment = "LoyaltyIntegrationDev"
$companyId = "24f9b5d6-4895-ef11-8a6b-00224840f1d6"
$token = "your-access-token"

# Get staff employees
$headers = @{
    "Authorization" = "Bearer $token"
}
$baseUrl = "https://api.businesscentral.dynamics.com/v2.0/$tenant/$environment"
$response = Invoke-RestMethod -Uri "$baseUrl/api/lsretail/timeregistration/v2.0/companies($companyId)/staffEmployees" -Headers $headers -Method Get
$response.value | Format-Table
```

## Troubleshooting

### Common Issues

**"Table 'LSC Staff Employee' not found"**
- Ensure LS Central v27.0.0.0 is installed
- Verify table IDs match your LS Central version

**"Insufficient permissions"**
- Assign proper permission sets to the user/app
- Verify OAuth scopes include Business Central API access

**"Cannot modify read-only field"**
- Remove computed fields (`name`, `checkInDateTime`, etc.) from POST/PATCH requests
- Only include writable fields

**"Concurrency conflict"**
- Include `If-Match: *` header in PATCH requests
- Or use the specific ETag from the GET response

## AL-GO for GitHub Integration

This extension is ready for AL-GO for GitHub CI/CD:

1. **Initialize AL-GO**
   ```bash
   # In GitHub, create workflow from AL-GO template
   ```

2. **Configure secrets**
   - `AZURE_CREDENTIALS`: Azure service principal
   - `BC_AUTH_CONTEXT`: BC authentication context

3. **Automatic builds on push**
   - Commits to main branch trigger build
   - Creates .app file as artifact

4. **Deployment**
   - Configure environments in `.AL-Go/settings.json`
   - Automatic deployment on release

## Support

For issues or questions:
- Check README.md for API documentation
- Review LS Central documentation for table structures
- Contact LS Retail support

## License

Copyright © LS Retail
