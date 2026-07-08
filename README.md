# Weekly Report Generator & Team Dashboard

A full-stack web application that allows individual team members to submit structured weekly work reports and allows managers to view and analyze those reports across the whole team through a consolidated dashboard.

## Tech Stack

- **Frontend**: React 19 + Vite + Bootstrap 5 + Recharts
- **Backend**: Spring Boot 4.1 + Spring Security + JPA
- **Database**: MySQL

## Prerequisites

- **Java 21** (JDK)
- **Node.js 18+**
- **MySQL 8+**
- **Maven** (included via wrapper)

## Setup Instructions

### 1. Database Setup

```sql
CREATE DATABASE weekly_report_db;
```

Configure database credentials in `backend/weeklyreport/src/main/resources/application.properties`:

```properties
spring.datasource.url=jdbc:mysql://localhost:3306/weekly_report_db
spring.datasource.username=root
spring.datasource.password=123456
```

### 2. Running the Backend

```bash
cd backend/weeklyreport
./mvnw spring-boot:run
```

The backend runs on `http://localhost:8080`.

### 3. Installing Frontend Dependencies

```bash
cd frontend
npm install
```

### 4. Running the Frontend

```bash
cd frontend
npm run dev
```

The frontend runs on `http://localhost:5173`.

## Features

### User Authentication & Roles
- User registration with role selection (Team Member / Manager)
- Login / Logout
- Password encryption (BCrypt)
- Role-based access control on the frontend

### Personal Weekly Report Page (Team Member)
- Fixed-structure report form:
  - Week / date range
  - Project tag
  - Tasks completed
  - Tasks planned for next week
  - Blockers / challenges
  - Hours worked (optional)
  - Notes / links (optional)
- Submit or save as draft
- Edit reports before/after submission
- View own report history

### Team Dashboard (Manager View)
- Summary metrics (total users, projects, reports, status counts)
- Visual insights with charts:
  - Pie chart: Report status distribution
  - Bar chart: Reports per team member
- Filter reports by team member and project
- Approve or reject submitted reports
- Track submission status

### Projects / Categories
- Add, edit, delete projects

### User Management (Manager)
- View all team members

## API Endpoints

| Method | Endpoint | Description |
|--------|----------|-------------|
| POST | `/api/auth/register` | Register a new user |
| POST | `/api/auth/login` | Login |
| GET | `/api/dashboard` | Get dashboard summary |
| GET | `/api/reports` | Get all reports |
| POST | `/api/reports` | Create a new report |
| PUT | `/api/reports/{id}` | Update a report |
| DELETE | `/api/reports/{id}` | Delete a report |
| PUT | `/api/reports/{id}/approve` | Approve a report |
| PUT | `/api/reports/{id}/reject` | Reject a report |
| GET | `/api/reports/user/{id}` | Get reports by user |
| GET | `/api/reports/filter` | Filter reports by date |
| GET | `/api/projects` | Get all projects |
| POST | `/api/projects` | Create a project |
| PUT | `/api/projects/{id}` | Update a project |
| DELETE | `/api/projects/{id}` | Delete a project |
| GET | `/api/users` | Get all users |

## Database Design

### Tables
- **users**: id, first_name, last_name, email, password, role, created_at
- **projects**: id, name, description, status
- **weekly_reports**: id, week_start, week_end, completed_tasks, planned_tasks, blockers, hours_worked, notes, status, submitted_at, user_id (FK), project_id (FK)

### Relationships
- User (1) → (N) WeeklyReport
- Project (1) → (N) WeeklyReport
