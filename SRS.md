# ResQ-DMS: Integrated Disaster Management & Relief System
## SOFTWARE REQUIREMENTS SPECIFICATION (SRS)

---

### i. Declaration
We, **MIDHUN SHA** (03SU23RA053) and **AHAMMED MUJUTHABA** (03SU23RA015), hereby declare that this project titled **"ResQ-DMS: Integrated Disaster Management & Relief System"** is a result of our own work and has been carried out under the guidance of our project guide. All sources of information and data used have been duly acknowledged.

### ii. Acknowledgement
We express our sincere gratitude to our guide and the department for providing the resources and support necessary to complete this project. Their insights were invaluable in shaping the proactive safety features of ResQ-DMS.

### iii. Abstract
**ResQ-DMS** is a comprehensive web-based platform developed using the MERN Stack aimed at bridging the gap in disaster coordination. Unlike traditional systems that focus on post-disaster relief, ResQ-DMS integrates proactive safety features like **Weather Forecasting** and **Real-time Seismic Alerts**. It centralizes resources, manages relief camps, and provides a platform for community-driven "Safe-Home" networks, ensuring efficient rescue operations and data-driven disaster response.

### iv. List Of Figures
1. **Landing Page** - `/` (Live Disaster Status)
2. **Admin Dashboard** - `/admin/dashboard`
3. **Disaster Alerts Panel** - `/admin/alerts`
4. **Risk Zone Map** - `/admin/map`
5. **Camp Management** - `/admin/camps`
6. **Safe-Home Listing** - `/admin/safe-homes`
7. **Refugee Registration** - `/admin/refugees/register`
8. **Missing Person Finder** - `/admin/missing-persons`
9. **Donation Pledge Portal** - `/donate`
10. **Volunteer Dashboard** - `/volunteer`

---

## 1. Synopsis
The synopsis details the motivation behind ResQ-DMS, focusing on the recent natural calamities in Kerala and Karnataka. It highlights the shift from reactive to proactive disaster management through API integrations and data-driven risk assessment.

---

## CHAPTER 1

### 1.1 Title of the Project
**ResQ-DMS: Integrated Disaster Management & Relief System**

### 1.2 Introduction of the Project
ResQ-DMS is an integrated solution for disaster management. It uses real-time data from OpenWeatherMap and USGS to provide early warnings for floods, landslides, and earthquakes. The system connects victims, volunteers, and administrators on a single platform to streamline relief and rescue.

### 1.3 Objective of the Project
- Integrate Weather APIs for 3-5 day forecasts.
- Implement real-time seismic alerts for earthquakes.
- Generate landslide risk warnings using topography data.
- Create a community-driven "Safe-Home" shelter network.
- Centralize refugee registration and donation management.

### 1.4 Category
Web Application (Disaster Management & Social Welfare).

### 1.5 Language to be used
- **Front-End:** JavaScript (React.js), HTML5, CSS3 (Tailwind CSS).
- **Back-End:** JavaScript (Node.js, Express.js).
- **Database:** MongoDB (NoSQL).

### 1.6 Hardware Interface
- **Processor:** Intel Core i3 or higher.
- **RAM:** 4GB minimum.
- **Storage:** 256GB SSD/HDD.
- **Network:** Active internet connection for API feeds.

### 1.7 Software Interface
- **Operating System:** Windows/Linux/MacOS.
- **Web Browser:** Chrome, Firefox, Safari (Modern versions).
- **Development Tools:** VS Code, Postman, Git.

### 1.8 Description
The system operates on a "Prediction & Response" mechanism. It fetches weather and seismic data, correlates it with local risk factors (like terrain stability), and triggers alerts. Once a disaster is active, it enables resource allocation and victim tracking via camps and safe homes.

### 1.9 Module Description
1. **Authentication:** Secure login/signup for Admins, Volunteers, and Safe-Home Hosts.
2. **Disaster Prediction & Alert:** Weather forecasting and real-time seismic monitoring.
3. **Camp Management:** Setup and occupancy tracking for official relief camps.
4. **Safe-Home & Shelter:** Public listing and searching for temporary private shelters.
5. **Refugee Registration:** Digital entry for victim tracking and compensation.
6. **Resource & Donation:** Inventory management for food and medicine.
7. **Missing Person Finder:** Cross-referencing search engine for lost individuals.
8. **Admin Dashboard:** Centralized analytics and visualization of risk zones.

### 1.10 Future Scope
- Integration of Drone-based surveillance data.
- AI-driven resource demand prediction.
- Mobile Application for offline emergency access.
- Integration with government rescue dispatch systems.

---

## CHAPTER 2: Software Requirement Specification

### 2.1 Introduction
This section provides a detailed breakdown of the requirements for ResQ-DMS.

### 2.2 Purpose
The purpose of this SRS is to define the functional and non-functional requirements of ResQ-DMS to ensure the system meets the needs of disaster management authorities and the public.

### 2.3 Scope
The scope includes real-time alerting, relief management, and community-driven resource sharing within a web-based environment.

### 2.4 Definitions, Acronyms, Abbreviation
- **MERN:** MongoDB, Express, React, Node.
- **USGS:** United States Geological Survey.
- **API:** Application Programming Interface.
- **DMS:** Disaster Management System.

### 2.5 Overview
ResQ-DMS follows an Iterative Waterfall Model, ensuring core modules are stable before integrating complex third-party data feeds.

### 2.6 Overall Description
The system provides a responsive web interface for various user classes to interact with disaster data and relief resources.

### 2.7 Product Perspective
ResQ-DMS is a standalone web application that interacts with external APIs (OpenWeatherMap, USGS) for real-time data.

### 2.8 Product Function
- Real-time Alerting (Weather/Seismic).
- Landslide Risk Calculation.
- Resource Inventory Tracking.
- Refugee and Missing Person Database Management.

### 2.9 User Classes and Characteristics
- **Administrators:** Full access to manage camps, alerts, and system users.
- **Volunteers:** Field access for refugee registration and camp updates.
- **Public/Victims:** Access to search for shelters, report missing persons, and view alerts.

### 2.10 General Constraints
- Requires consistent internet for live API updates.
- Data accuracy depends on third-party API providers.

### 2.11 Assumptions and Dependencies
- Users have basic smartphone/PC knowledge.
- Regional topography dataset is available and accurate.

### 2.12 Specific Requirements
#### 2.12.1 Software Requirements
- Node.js environment.
- MongoDB database instance.
- React-compatible browser.
#### 2.12.2 Hardware Requirements
- Server with 2GHz+ CPU and 8GB+ RAM for hosting.
#### 2.12.3 Communication Interface
- HTTP/HTTPS for web traffic.
- RESTful API communication for data exchange.

### 2.13 Functional Requirements
- **FR1:** System must fetch weather data every 6 hours.
- **FR2:** Earthquake alerts must be triggered within 30 seconds of USGS detection.
- **FR3:** Admins must be able to create camps with capacity limits.
- **FR4:** Missing person search must filter by age and gender.

### 2.14 Performance Requirements
- Dashboard should load within 2 seconds on a standard connection.
- Alert notifications must reach all active users within 5 seconds of trigger.

### 2.15 Design Constraints
- Must be mobile-responsive (using Tailwind CSS).
- Must adhere to accessible design principles.

### 2.16 System Attributes
- **Availability:** 99.9% uptime required during disaster periods.
- **Security:** JWT-based authentication for protected routes.

---

## CHAPTER 3: System Design

### 3.1 Introduction
The design focuses on data flow between users and the centralized database/APIs.

### 3.2 Context Flow Design
Users interact with the UI -> React Router handles navigation -> Backend API processes requests -> Database/External APIs provide data.

### 3.3 Data Flow Diagram (DFD) - Overview
- **Level 0:** User/Admin -> ResQ-DMS -> External Data Sources.
- **Level 1:** Module-specific flows (Auth, Alerts, Resource Management).

### 3.4 Rules Regarding DFD Constraints
- No direct database access from the client.
- All external API calls must be proxied or handled securely.

### 3.5 DFD Symbols
Standard Gane-Sarson or Yourdon & Coad symbols (Process, Data Store, External Entity, Data Flow).

### 3.6 DFD for Admin
1. **Login:** Admin provides credentials -> Auth service validates -> Token issued.
2. **Camp Management:** Admin creates/updates camp -> Database updated -> Camp list refreshed.
3. **Disaster Alerts:** System receives API data -> Logic triggers alert -> Notification sent to users.
4. **Refugee Tracking:** Admin views refugee list -> System queries database -> Results displayed with analytics.

### 3.7 DFD for Volunteer
1. **Login:** Volunteer authenticates via secure portal.
2. **Refugee Entry:** Volunteer submits victim details -> API validates -> Entry stored in database.
3. **Missing Person Update:** Volunteer updates status of missing individuals -> Real-time update to public search.

### 3.8 DFD for User (Public)
1. **Register/Login:** Public user creates profile for Safe-Home hosting.
2. **Search Shelter:** User inputs location -> System filters camps/safe-homes -> Results displayed on map.
3. **Donate:** User selects resource to pledge -> Pledge recorded -> Admin notified.
4. **Missing Person Search:** User searches name -> System queries refugee/missing database -> Match results shown.
