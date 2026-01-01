# Check In / Check Out App - Implementation Plan

## Overview

This document outlines the phased implementation approach for the Check In / Check Out Power Apps Code App. The plan is organized into sprints, with each phase building upon the previous one.

**Estimated Total Duration:** 6-8 weeks  
**Team Size:** 1-2 developers

---

## Phase 1: Project Setup & Foundation (Week 1)

### 1.1 Initialize Project Structure
- [ ] Create React app with Vite (TypeScript template)
- [ ] Downgrade to React 18 for Fluent UI v9 compatibility
- [ ] Configure Vite for Power Apps Code App (port 3000, base path)
- [ ] Update TypeScript configuration (`verbatimModuleSyntax: false`)
- [ ] Install Power Platform SDK

**Files to Create:**
```
CheckInOut/
├── src/
│   ├── main.tsx
│   ├── App.tsx
│   ├── PowerProvider.tsx
│   ├── index.css
│   └── vite-env.d.ts
├── package.json
├── vite.config.ts
├── tsconfig.json
└── tsconfig.app.json
```

### 1.2 Install Dependencies
- [ ] Install Fluent UI v9 (`@fluentui/react-components`)
- [ ] Install Fluent UI icons (`@fluentui/react-icons`)
- [ ] Install date utilities (date-fns or dayjs)
- [ ] Install any routing library if needed (react-router-dom)

### 1.3 Configure Power Apps Integration
- [ ] Create PowerProvider wrapper component
- [ ] Update main.tsx with PowerProvider
- [ ] Configure package.json scripts for dev and build
- [ ] Test local development environment

**Deliverables:**
- Working local development environment
- App runs with mocked data
- Power Apps SDK integrated

---

## Phase 2: Core UI Components (Week 2)

### 2.1 Create Component Structure
```
src/
├── components/
│   ├── common/
│   │   ├── Header.tsx
│   │   ├── StatusBadge.tsx
│   │   ├── LoadingSpinner.tsx
│   │   └── ErrorMessage.tsx
│   ├── checkin/
│   │   ├── CheckInButton.tsx
│   │   ├── CheckOutButton.tsx
│   │   ├── CurrentStatus.tsx
│   │   └── LocationSelector.tsx
│   ├── history/
│   │   ├── HistoryList.tsx
│   │   ├── HistoryItem.tsx
│   │   ├── DateFilter.tsx
│   │   └── LocationFilter.tsx
│   └── dashboard/
│       ├── Dashboard.tsx
│       ├── QuickActions.tsx
│       └── TimeSummary.tsx
├── hooks/
│   ├── useCheckIn.ts
│   ├── useLocations.ts
│   ├── useEmployee.ts
│   └── useHistory.ts
├── types/
│   └── index.ts
└── utils/
    ├── dateUtils.ts
    └── formatters.ts
```

### 2.2 Implement Type Definitions (US-012, US-013)
- [ ] Define Employee interface
- [ ] Define Location interface
- [ ] Define CheckInOut record interface
- [ ] Define API response types

### 2.3 Create Mock Data Service
- [ ] Create mock employee data
- [ ] Create mock location data
- [ ] Create mock check-in/check-out records
- [ ] Implement mock API functions

**Deliverables:**
- Complete type definitions
- Reusable UI components
- Mock data for local development

---

## Phase 3: Employee Check-In/Check-Out (Week 3)

### 3.1 Dashboard & Status Display (US-002)
- [ ] Create main Dashboard component
- [ ] Implement CurrentStatus component showing checked in/out state
- [ ] Display current location and check-in time when checked in
- [ ] Show duration timer (time since check-in)

### 3.2 Location Selection (US-007)
- [ ] Create LocationSelector dropdown component
- [ ] Implement location search functionality
- [ ] Show recently used locations at top
- [ ] Display location details (address, site code)

### 3.3 Check-In Flow (US-001, US-015)
- [ ] Implement CheckInButton component
- [ ] Create check-in form with location selection
- [ ] Add optional notes field
- [ ] Show confirmation message on success
- [ ] Implement quick one-tap check-in

### 3.4 Check-Out Flow (US-003)
- [ ] Implement CheckOutButton component
- [ ] Add optional notes field for check-out
- [ ] Calculate and display total time spent
- [ ] Show confirmation message on success

**User Stories Covered:** US-001, US-002, US-003, US-007, US-015

**Deliverables:**
- Functional check-in/check-out with mock data
- Dashboard with current status
- Location selection working

---

## Phase 4: History & Time Tracking (Week 4)

### 4.1 History List View (US-005)
- [ ] Create HistoryList component
- [ ] Display date, time, location, duration for each record
- [ ] Implement pagination or infinite scroll
- [ ] Add empty state handling

### 4.2 Filtering & Search
- [ ] Implement DateFilter component (date range picker)
- [ ] Implement LocationFilter component
- [ ] Add filter state management
- [ ] Combine filters with history query

### 4.3 Weekly/Monthly Summary (US-006)
- [ ] Create TimeSummary component
- [ ] Calculate total hours by day/week/month
- [ ] Implement simple chart/visualization
- [ ] Show breakdown by location

**User Stories Covered:** US-005, US-006

**Deliverables:**
- History view with filtering
- Time summaries and basic visualizations
- Export functionality (if time permits)

---

## Phase 5: Business Central Integration (Week 5)

### 5.1 Configure Business Central Connection
- [ ] Add Business Central data source via PAC CLI
  ```bash
  pac code add-data-source -a "shared_dynamicssmbsaas" -c <connectionId>
  ```
- [ ] Generate service classes for Business Central
- [ ] Configure authentication and permissions

### 5.2 Implement Data Services (US-012, US-013)
- [ ] Create EmployeeService for BC employee data
- [ ] Create LocationService for BC location data
- [ ] Create CheckInOutService for BC records
- [ ] Replace mock data with real BC calls

### 5.3 API Integration
- [ ] Implement GET employees endpoint
- [ ] Implement GET locations endpoint
- [ ] Implement GET/POST check-in records
- [ ] Implement PATCH for check-out updates
- [ ] Handle API errors gracefully

**User Stories Covered:** US-012, US-013

**Deliverables:**
- Working Business Central integration
- Real data flowing through the app
- Error handling for API failures

---

## Phase 6: Manager Features (Week 6)

### 6.1 Role-Based Access (US-016)
- [ ] Implement role detection (Employee vs Manager)
- [ ] Create role-based navigation
- [ ] Conditionally render manager features

### 6.2 Team Status View (US-009)
- [ ] Create TeamStatus component
- [ ] Fetch and display direct reports
- [ ] Show each team member's current status
- [ ] Implement location and name filters

### 6.3 Team Reports (US-010)
- [ ] Create TeamReports component
- [ ] Implement date range selector
- [ ] Calculate hours per employee
- [ ] Add export to CSV functionality

### 6.4 Edit Records (US-011)
- [ ] Create EditRecord dialog/form
- [ ] Implement add missing entry functionality
- [ ] Require justification for edits
- [ ] Log all changes for audit trail

**User Stories Covered:** US-009, US-010, US-011, US-016

**Deliverables:**
- Manager dashboard with team view
- Team attendance reports
- Record editing capability

---

## Phase 7: Polish & Advanced Features (Week 7)

### 7.1 Mobile Responsiveness (US-014)
- [ ] Test and adjust layouts for mobile
- [ ] Ensure touch-friendly button sizes
- [ ] Optimize for mobile networks (lazy loading)
- [ ] Test in Power Apps mobile container

### 7.2 GPS Location (US-008) - Optional
- [ ] Implement geolocation API integration
- [ ] Match GPS coordinates to nearby locations
- [ ] Auto-suggest location on check-in
- [ ] Handle permission denial gracefully

### 7.3 Accessibility (NFR-005)
- [ ] Add ARIA labels to components
- [ ] Test with screen reader
- [ ] Ensure keyboard navigation works
- [ ] Verify color contrast ratios

### 7.4 Performance Optimization (NFR-001)
- [ ] Implement code splitting
- [ ] Add loading states
- [ ] Optimize API calls (caching)
- [ ] Test load times

**User Stories Covered:** US-008, US-014, NFR-001, NFR-005

**Deliverables:**
- Mobile-optimized app
- Accessibility compliance
- Performance targets met

---

## Phase 8: Testing & Deployment (Week 8)

### 8.1 Testing
- [ ] Unit tests for utility functions
- [ ] Component tests for critical flows
- [ ] Integration tests with BC connection
- [ ] User acceptance testing

### 8.2 Audit Logging (US-017)
- [ ] Implement client-side logging
- [ ] Ensure BC records all changes
- [ ] Verify audit trail completeness

### 8.3 Deployment
- [ ] Build production bundle
- [ ] Deploy to Power Apps environment
- [ ] Configure production BC connection
- [ ] Verify in production environment

### 8.4 Documentation
- [ ] Update README with setup instructions
- [ ] Document BC entity requirements
- [ ] Create user guide (if needed)

**User Stories Covered:** US-017

**Deliverables:**
- Deployed application
- All tests passing
- Documentation complete

---

## Deferred / Future Enhancements

The following items are lower priority and can be addressed in future iterations:

| Feature | User Story | Reason for Deferral |
|---------|------------|---------------------|
| Automatic Check-Out Reminder | US-004 | Requires notification infrastructure |
| Export to Excel | US-005, US-010 | Nice-to-have, not MVP |
| Hours vs Expected Comparison | US-006 | Requires additional BC configuration |

---

## Dependencies & Prerequisites

### Business Central Requirements
- [ ] Employee table/API accessible
- [ ] Location table/API configured
- [ ] CheckInOut custom table created in BC
- [ ] API permissions granted for Power Platform

### Power Platform Requirements
- [ ] Power Apps environment provisioned
- [ ] Business Central connector configured
- [ ] User licenses assigned
- [ ] Security roles defined

### Development Environment
- [ ] Node.js 18+ installed
- [ ] PAC CLI installed and authenticated
- [ ] Access to development BC environment
- [ ] VS Code with recommended extensions

---

## Risk Assessment

| Risk | Impact | Likelihood | Mitigation |
|------|--------|------------|------------|
| BC API limitations | High | Medium | Early API exploration, fallback designs |
| Performance with large datasets | Medium | Low | Pagination, caching, lazy loading |
| Mobile compatibility issues | Medium | Low | Early mobile testing, Fluent UI responsive |
| Authentication complexity | Medium | Low | Use Power Platform built-in auth |

---

## Success Criteria

### MVP (Minimum Viable Product)
- [ ] Employee can check in to a location
- [ ] Employee can check out from a location
- [ ] Employee can view current status
- [ ] Employee can view history
- [ ] Data persists in Business Central

### Full Release
- [ ] All employee user stories complete (US-001 to US-008)
- [ ] Manager features working (US-009 to US-011)
- [ ] Mobile responsive
- [ ] Accessibility compliant
- [ ] Performance targets met

---

## Version History

| Version | Date | Author | Changes |
|---------|------|--------|---------|
| 1.0 | 2026-01-02 | - | Initial implementation plan |
