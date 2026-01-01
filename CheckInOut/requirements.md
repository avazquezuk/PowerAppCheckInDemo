# Check In / Check Out App - Requirements

## Overview

A Power Apps Code App that enables employees to check in and check out of work locations, tracking attendance and time spent at various sites. The app integrates with Business Central for employee data, locations, and check-in/check-out records.

---

## User Stories

### Epic 1: Employee Check-In

#### US-001: Check In to Work Location
**As an** employee  
**I want to** check in when I arrive at a work location  
**So that** my attendance is recorded and my work hours can be tracked

**Acceptance Criteria:**
- [ ] Employee can select or confirm their current location
- [ ] System captures the check-in timestamp automatically
- [ ] Employee can add optional notes for the check-in
- [ ] Confirmation message is displayed upon successful check-in
- [ ] Check-in is stored in the database with employee ID, location, and timestamp

---

#### US-002: View Current Check-In Status
**As an** employee  
**I want to** see my current check-in status  
**So that** I know whether I'm currently checked in or out

**Acceptance Criteria:**
- [ ] Dashboard displays current status (Checked In / Checked Out)
- [ ] If checked in, shows location and check-in time
- [ ] If checked in, shows duration since check-in
- [ ] Status updates in real-time without page refresh

---

### Epic 2: Employee Check-Out

#### US-003: Check Out from Work Location
**As an** employee  
**I want to** check out when I leave a work location  
**So that** my departure time is recorded

**Acceptance Criteria:**
- [ ] Check-out button is available when employee is checked in
- [ ] System captures the check-out timestamp automatically
- [ ] Employee can add optional notes for the check-out
- [ ] Total time spent at location is calculated and displayed
- [ ] Confirmation message is displayed upon successful check-out

---

#### US-004: Automatic Check-Out Reminder
**As an** employee  
**I want to** receive a reminder if I forget to check out  
**So that** my records remain accurate

**Acceptance Criteria:**
- [ ] System sends notification after configurable hours without check-out
- [ ] Notification includes option to check out immediately
- [ ] Notification includes option to dismiss/snooze

---

### Epic 3: Time Tracking & History

#### US-005: View Check-In/Check-Out History
**As an** employee  
**I want to** view my check-in/check-out history  
**So that** I can review my attendance records

**Acceptance Criteria:**
- [ ] List view shows all past check-ins and check-outs
- [ ] Each record displays date, time, location, and duration
- [ ] Records can be filtered by date range
- [ ] Records can be filtered by location
- [ ] Export functionality for personal records

---

#### US-006: View Weekly/Monthly Summary
**As an** employee  
**I want to** see a summary of my hours worked  
**So that** I can track my time across periods

**Acceptance Criteria:**
- [ ] Summary view shows total hours by day/week/month
- [ ] Visual chart displays hours worked over time
- [ ] Breakdown by location is available
- [ ] Comparison to expected hours (if applicable)

---

### Epic 4: Location Management

#### US-007: Select Work Location
**As an** employee  
**I want to** select from a list of available work locations  
**So that** I can check in to the correct site

**Acceptance Criteria:**
- [ ] Dropdown/list of available locations
- [ ] Search functionality for locations
- [ ] Recently used locations appear at top
- [ ] Location details are displayed (address, site code)

---

#### US-008: GPS-Based Location Suggestion
**As an** employee  
**I want to** have my location auto-detected when checking in  
**So that** the check-in process is faster and more accurate

**Acceptance Criteria:**
- [ ] App requests location permission (optional)
- [ ] Nearby locations are suggested based on GPS
- [ ] Employee can override suggested location
- [ ] Works without GPS if permission denied

---

### Epic 5: Manager Features

#### US-009: View Team Check-In Status
**As a** manager  
**I want to** see the current check-in status of my team members  
**So that** I know who is on-site

**Acceptance Criteria:**
- [ ] Dashboard shows list of direct reports
- [ ] Each team member shows current status (In/Out)
- [ ] If checked in, shows location and time
- [ ] Filter by location
- [ ] Search by employee name

---

#### US-010: View Team Attendance Reports
**As a** manager  
**I want to** view attendance reports for my team  
**So that** I can monitor attendance patterns

**Acceptance Criteria:**
- [ ] Report shows hours worked per employee
- [ ] Configurable date range selection
- [ ] Export to Excel/CSV functionality
- [ ] Summary statistics (average hours, total hours)

---

#### US-011: Edit Check-In/Check-Out Records
**As a** manager  
**I want to** correct check-in/check-out records for my team  
**So that** errors can be fixed when employees forget to check in/out

**Acceptance Criteria:**
- [ ] Manager can add missing check-in/check-out entries
- [ ] Manager can edit existing entries with justification
- [ ] Audit trail is maintained for all changes
- [ ] Employee is notified of changes to their records

---

### Epic 6: Integration & Data

#### US-012: Business Central Integration
**As the** system  
**I want to** integrate with Business Central for all data  
**So that** employee and attendance data is consistent across systems

**Acceptance Criteria:**
- [ ] Employee list retrieved from Business Central
- [ ] Employee details include: ID, name, department, manager
- [ ] Location data managed in Business Central
- [ ] Check-in/check-out records stored in Business Central
- [ ] Handles new employees and terminations

---

#### US-013: Store Records in Business Central
**As the** system  
**I want to** store check-in/check-out records in Business Central  
**So that** data is persistent and integrated with other business processes

**Acceptance Criteria:**
- [ ] Check-in/check-out records stored via Business Central APIs
- [ ] Records include: employee ID, timestamp, location, notes
- [ ] Data available for Business Central reporting
- [ ] Integration with Business Central workflows and approvals
- [ ] Data retention policy applied

---

### Epic 7: User Experience

#### US-014: Mobile-Responsive Design
**As an** employee  
**I want to** use the app on my mobile device  
**So that** I can check in/out from anywhere

**Acceptance Criteria:**
- [ ] App is fully functional on mobile browsers
- [ ] Touch-friendly interface elements
- [ ] Fast loading on mobile networks
- [ ] Works in Power Apps mobile container

---

#### US-015: Quick Check-In from Dashboard
**As an** employee  
**I want to** check in with minimal taps  
**So that** the process is quick and easy

**Acceptance Criteria:**
- [ ] One-tap check-in if location is known
- [ ] Quick check-in widget on main dashboard
- [ ] Remember last used location preference
- [ ] Streamlined check-out process

---

### Epic 8: Security & Compliance

#### US-016: Authentication via Power Platform
**As the** system  
**I want to** authenticate users via Power Platform identity  
**So that** only authorized employees can access the app

**Acceptance Criteria:**
- [ ] Single sign-on with Microsoft 365 account
- [ ] Role-based access (Employee, Manager, Admin)
- [ ] Session management and timeout
- [ ] Integration with Power Apps security model

---

#### US-017: Audit Logging
**As an** administrator  
**I want to** have all actions logged  
**So that** changes can be audited for compliance

**Acceptance Criteria:**
- [ ] All check-in/check-out events logged
- [ ] All edits and corrections logged
- [ ] Logs include user, timestamp, action, details
- [ ] Logs are immutable and retained per policy

---

## Non-Functional Requirements

### NFR-001: Performance
- App should load within 3 seconds on standard connection
- Check-in/check-out operations complete within 2 seconds
- History queries return within 5 seconds for 1 year of data

### NFR-002: Availability
- App should be available 99.5% of the time during business hours
- Graceful degradation when backend services are unavailable

### NFR-003: Scalability
- Support up to 1,000 concurrent users
- Handle up to 10,000 check-in/check-out events per day

### NFR-004: Security
- All data transmitted over HTTPS
- Sensitive data encrypted at rest
- Compliance with company data protection policies

### NFR-005: Accessibility
- WCAG 2.1 Level AA compliance
- Screen reader compatible
- Keyboard navigation support

---

## Data Model

### CheckInOut Record
| Field | Type | Description |
|-------|------|-------------|
| Id | GUID | Unique identifier |
| EmployeeId | String | Employee ID from Business Central |
| LocationId | String | Work location identifier |
| CheckInTime | DateTime | Timestamp of check-in |
| CheckOutTime | DateTime | Timestamp of check-out (nullable) |
| Notes | String | Optional notes |
| CreatedBy | String | User who created record |
| ModifiedBy | String | User who last modified record |
| ModifiedAt | DateTime | Last modification timestamp |

### Location
| Field | Type | Description |
|-------|------|-------------|
| Id | String | Unique location code |
| Name | String | Location display name |
| Address | String | Physical address |
| Latitude | Decimal | GPS latitude (optional) |
| Longitude | Decimal | GPS longitude (optional) |
| IsActive | Boolean | Whether location is active |

---

## Technical Stack

- **Frontend**: React with TypeScript (Vite)
- **UI Framework**: Fluent UI v9
- **Platform**: Power Apps Code Apps
- **Data Source**: Business Central (employees, locations, check-in/check-out records)
- **Authentication**: Power Platform / Microsoft 365

---

## Version History

| Version | Date | Author | Changes |
|---------|------|--------|---------|
| 1.0 | 2026-01-02 | - | Initial requirements document |
