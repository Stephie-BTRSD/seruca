# SERUCA — Academic Event Management System

Cloud-based system with LTR and RAG AI integration.

## Tech Stack
- **Backend**: Java 17 + Spring Boot 3.2 + PostgreSQL
- **Frontend**: React 18 + React Router + Axios

## Modules
1. User Management (Admin/Lecturer/Student roles, JWT auth)
2. Content Management System (Course creation and management)
3. Taxonomy Management (Category hierarchy for content classification)
4. Search Engine (BM25 document retrieval)
5. AI Assistant (RAG-based question answering over documents)

## Setup

### Prerequisites
- Java 17+
- Maven 3.8+
- Node.js 18+
- PostgreSQL 14+

### Database
```sql
CREATE DATABASE seruca_db;
CREATE USER seruca_user WITH PASSWORD 'seruca_pass';
GRANT ALL PRIVILEGES ON DATABASE seruca_db TO seruca_user;
```

### Backend
```bash
cd backend
mvn spring-boot:run
```
Runs on http://localhost:8080

### Frontend
```bash
cd frontend
npm install
npm start
```
Runs on http://localhost:3000

## API Endpoints

### Auth
- POST /api/auth/login
- POST /api/auth/register

### Users (Admin only)
- GET /api/users
- PUT /api/users/{id}/role
- DELETE /api/users/{id}

### Courses
- GET /api/courses
- POST /api/courses
- PUT /api/courses/{id}
- DELETE /api/courses/{id}

### Taxonomy
- GET /api/taxonomy
- POST /api/taxonomy

### Search
- GET /api/search?q={query}

### AI Assistant
- POST /api/assistant/ask

## Team Task Division
| Member | Module |
|--------|--------|
| You (Stephie) | AI Assistant + Search Engine |
| Weber | User Management |
| Ndinga | Content Management |
| Elsa | Taxonomy |
| Gloria | Database setup + Spring Boot base |
