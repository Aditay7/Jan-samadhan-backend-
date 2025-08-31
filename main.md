# Research Report: CrowdÂ­sourced Civic Issue Reporting and Resolution System

**Problem Statement ID:** 25031  
**Title:** Crowdsourced Civic Issue Reporting and Resolution System

## 1. Introduction

Local governments face challenges in timely identification and resolution of civic issues like potholes, malfunctioning streetlights, and overflowing trash bins. A mobile-first, crowdsourced reporting system can empower citizens to submit real-time reports, enhancing municipal responsiveness and fostering accountability.

## 2. System Overview

- **Citizen App:** Allows submission of reports with photos, GPS location, and text/voice descriptions.
- **Automated Routing Engine:** Classifies and directs issues to relevant municipal departments (e.g., PWD, sanitation).
- **Department Dashboard:** Enables Department Officers to view, filter, and manage incoming reports, register supervisors/contractors, and monitor progress.
- **Supervisor/Contractor App:** Registered supervisors and contractors receive assignments, allocate tasks offline to field workers, and update progress stages (30%, 70%, 90%, 100%) with photo verification.
- **Admin Dashboard:** Provides city-wide analytics, SLA breach alerts, performance monitoring, and trend reporting.

## 3. Real-Life Workflow Analysis

### 3.1 Complaint Routing and Department Assignment

- Citizen reports (e.g., pothole) submitted via mobile app or web portal.
- Automated system uses location and issue type to route to PWD department.
- Department Officer (Assistant Engineer level) receives routed issues in dashboard.

### 3.2 Supervisor/Contractor Assignment

- Department Officer decides assignment(Cna AI based auto assignment according to available JE/Contractor) to government Supervisor (Junior Engineer) or Private Contractor.
- Supervisor/Contractor are pre-registered entities(THey are registered under Particular Department); they receive task details via mobile app.

### 3.3 Field Execution and Monitoring

- Supervisors/Contractors manage field worker teams offline; field workers are _not_ individually registered in the system.
- Progress updates recorded at supervisor level with geo-tagged photos at each completion milestone.
- Department Officer conducts spot inspections and closes or reassigns tasks based on quality.
- Citizen receives status updates and can rate or reopen issues.

## 4. Worker Registration and Accountability

- **Field Worker Registration Not Required:** Real-world PWD and municipal models (Mumbai BMC, Delhi PWD) operate via supervisory chains without digitizing individual field workers.
- **Supervisor/Contractor Registration:** Ensures accountability; contractors handle their workforce management and legal compliance.
- **Legal Compliance:** Contractor-level worker registers satisfy labor laws; municipal system avoids personal data compliance burdens.

## 5. Conclusion and Recommendations

1. **Maintain Three-Tier Structure:** Admin (dept creation and monitoring) â†’ Department Officer (assignment and supervisor registration) â†’ Supervisor/Contractor (task management).
2. **Avoid Field Worker Digitization:** Simplifies system, aligns with real municipal operations, and reduces legal complexity.
3. **Implement Automated Routing and Assignment:** Leverage load-balancing algorithms to optimize workload distribution and response times.
4. **Use Photo and GPS Verification:** Ensure progress authenticity and quality control.
5. **Integrate Analytics and Feedback Loops:** Track departmental performance, SLA breaches, and incorporate citizen satisfaction into continuous improvement.
