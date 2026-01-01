# Check In / Check Out App - Database Schema

## Entity Relationship Diagram

```mermaid
erDiagram
    Employee ||--o{ CheckInOut : "records"
    Location ||--o{ CheckInOut : "at"
    Employee ||--o{ Employee : "manages"

    Employee {
        string Id PK "Employee ID from BC"
        string Name "Full name"
        string Email "Email address"
        string Department "Department name"
        string ManagerId FK "Reports to"
        string Role "Employee|Manager|Admin"
        boolean IsActive "Active status"
    }

    Location {
        string Id PK "Location code"
        string Name "Display name"
        string Address "Physical address"
        decimal Latitude "GPS latitude"
        decimal Longitude "GPS longitude"
        boolean IsActive "Active status"
    }

    CheckInOut {
        guid Id PK "Unique identifier"
        string EmployeeId FK "Employee ID"
        string LocationId FK "Location ID"
        datetime CheckInTime "Check-in timestamp"
        datetime CheckOutTime "Check-out timestamp (nullable)"
        string Notes "Optional notes"
        string CreatedBy "Created by user"
        datetime CreatedAt "Creation timestamp"
        string ModifiedBy "Last modified by"
        datetime ModifiedAt "Last modification"
    }
```

## Data Flow Diagram

```mermaid
flowchart TD
    subgraph PowerApp["Power Apps Code App"]
        UI[React UI]
        SDK[Power SDK]
    end

    subgraph BusinessCentral["Business Central"]
        EMP[(Employees)]
        LOC[(Locations)]
        CIO[(CheckInOut Records)]
    end

    UI --> SDK
    SDK -->|"GET Employees"| EMP
    SDK -->|"GET Locations"| LOC
    SDK -->|"GET/POST/PATCH"| CIO

    EMP -->|"Employee Data"| SDK
    LOC -->|"Location Data"| SDK
    CIO -->|"Check-in Records"| SDK
```

## State Diagram - Check-In/Check-Out Flow

```mermaid
stateDiagram-v2
    [*] --> CheckedOut: App Load

    CheckedOut --> SelectingLocation: Click Check In
    SelectingLocation --> CheckedOut: Cancel
    SelectingLocation --> CheckingIn: Confirm Location

    CheckingIn --> CheckedIn: Success
    CheckingIn --> SelectingLocation: Error

    CheckedIn --> CheckingOut: Click Check Out
    CheckingOut --> CheckedOut: Success
    CheckingOut --> CheckedIn: Error

    CheckedOut --> [*]: Close App
    CheckedIn --> [*]: Close App
```

## Sequence Diagram - Check-In Process

```mermaid
sequenceDiagram
    actor User
    participant App as React App
    participant SDK as Power SDK
    participant BC as Business Central

    User->>App: Open App
    App->>SDK: Get Current Employee
    SDK->>BC: GET /employees/{id}
    BC-->>SDK: Employee Data
    SDK-->>App: Employee Info

    App->>SDK: Get Open Check-In
    SDK->>BC: GET /checkinout?filter=open
    BC-->>SDK: Current Status
    SDK-->>App: Checked Out

    User->>App: Click Check In
    App->>SDK: Get Locations
    SDK->>BC: GET /locations
    BC-->>SDK: Location List
    SDK-->>App: Display Locations

    User->>App: Select Location + Confirm
    App->>SDK: Create Check-In Record
    SDK->>BC: POST /checkinout
    BC-->>SDK: Created Record
    SDK-->>App: Success
    App-->>User: Show Confirmation
```

## Business Central Table Specifications

### Employee Table (Standard BC Entity)
Uses the standard Business Central Employee entity with the following key fields:

| BC Field | App Field | Usage |
|----------|-----------|-------|
| No. | Id | Primary identifier |
| First Name + Last Name | Name | Display name |
| Company E-Mail | Email | User identification |
| Department Code | Department | Department grouping |
| Manager No. | ManagerId | Reporting hierarchy |

### Location Table (Custom BC Entity)
Custom table to be created in Business Central:

| Field No. | Field Name | Type | Length | Description |
|-----------|------------|------|--------|-------------|
| 1 | Code | Code | 20 | Primary Key |
| 2 | Name | Text | 100 | Display name |
| 3 | Address | Text | 250 | Full address |
| 4 | Latitude | Decimal | - | GPS coordinate |
| 5 | Longitude | Decimal | - | GPS coordinate |
| 6 | Active | Boolean | - | Is location active |

### CheckInOut Table (Custom BC Entity)
Custom table to be created in Business Central:

| Field No. | Field Name | Type | Length | Description |
|-----------|------------|------|--------|-------------|
| 1 | Entry No. | Integer | - | Auto-increment PK |
| 2 | Employee No. | Code | 20 | FK to Employee |
| 3 | Location Code | Code | 20 | FK to Location |
| 4 | Check-In DateTime | DateTime | - | Check-in time |
| 5 | Check-Out DateTime | DateTime | - | Check-out time |
| 6 | Duration (Minutes) | Integer | - | Calculated field |
| 7 | Notes | Text | 500 | Optional notes |
| 8 | Created By | Code | 50 | User ID |
| 9 | Created At | DateTime | - | Creation time |
| 10 | Modified By | Code | 50 | Last modifier |
| 11 | Modified At | DateTime | - | Last modified |

---

## Version History

| Version | Date | Author | Changes |
|---------|------|--------|---------|
| 1.0 | 2026-01-02 | - | Initial database schema |
