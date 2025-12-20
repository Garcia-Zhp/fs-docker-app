# Portfolio Application

Full-stack portfolio with blog, authentication, and admin panel.

## Tech Stack
- **Backend:** Spring Boot 3, PostgreSQL, OAuth2, JWT
- **Frontend:** Angular 20, Markdown editor
- **Deployment:** Docker, GitHub Actions, Render

## Local Development

### Prerequisites
- Docker & Docker Compose
- Java 17
- Node.js 20+

### Setup

1. Clone the repository
2. Copy `.env.example` to `.env` and fill in values
3. Run with Docker:
```bash
   cd infra
   docker-compose up --build
```

4. Access:
   - Frontend: http://localhost
   - Backend: http://localhost:8080
   - Database: localhost:5432

## Deployment

See deployment documentation in `/docs/DEPLOYMENT.md`