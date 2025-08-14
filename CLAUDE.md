# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## Development Commands

### Core Development
- `npm run start:dev` - Start development server with hot reload
- `npm run start:debug` - Start with debug mode (port 9229)
- `npm run build` - Build the application
- `npm run start:prod` - Run production build

### Database Operations
- `npm run db:setup` - Setup database structure
- `npm run db:seed` - Seed database with initial data
- `npm run db:init` - Complete database initialization (setup + seed)
- `npm run migration:generate` - Generate new TypeORM migration
- `npm run migration:run` - Run pending migrations
- `npm run migration:revert` - Revert last migration

### Code Quality
- `npm run lint` - Run ESLint with auto-fix
- `npm run format` - Format code with Prettier

### Testing
- `npm run test` - Run unit tests
- `npm run test:watch` - Run tests in watch mode
- `npm run test:cov` - Run tests with coverage report
- `npm run test:e2e` - Run end-to-end tests
- `npm run test:debug` - Run tests in debug mode

## Architecture Overview

### Technology Stack
- **Framework**: NestJS with TypeScript
- **Database**: PostgreSQL with TypeORM ORM
- **Authentication**: JWT with Passport strategies
- **Validation**: class-validator and class-transformer
- **Documentation**: Swagger/OpenAPI
- **File Upload**: Multer configuration
- **Security**: Helmet, CORS, bcrypt password hashing

### Project Structure
- `src/main.ts` - Application entry point with Swagger setup
- `src/app.module.ts` - Root module importing all feature modules
- `src/config/` - Configuration files (database, JWT, multer)
- `src/entities/` - TypeORM entities with relationships
- `src/dto/` - Data Transfer Objects with validation decorators
- `src/controllers/` - REST API endpoints
- `src/services/` - Business logic implementation
- `src/modulos/` - NestJS feature modules
- `src/auth/` - Authentication guards and strategies
- `src/database/seeders/` - Database seeding scripts

### Key Domain Entities
- **Usuario** - Users with company association
- **Caso** - Main business entity (cases) with status tracking
- **Empresa** - Multi-tenant company structure
- **Colaborador** - Users who can be assigned to cases
- **Comentario** - Comments on cases with file attachments
- **EstadoCaso** - Case status change history
- **Archivo** - File attachments for cases and comments

### Database Configuration
- Uses PostgreSQL (configured in `database.config.ts`)
- All entities exported from `src/entities/index.ts`
- Logging enabled in development mode
- Migrations stored in `src/database/migrations/`

### API Structure
- Base path: `/api/v1`
- Swagger documentation: `/api-docs`
- JWT Bearer token authentication
- Global validation pipe with transformation
- Static file serving for uploads at `/uploads/`

### Authentication Flow
- Local strategy for login with email/password
- JWT strategy for protected routes
- Guards: `JwtAuthGuard` and `LocalAuthGuard`
- Password hashing with bcrypt

### Development Environment
- Hot reload enabled in development
- CORS enabled for development (origin: true)
- Comprehensive logging in development mode
- Environment variables loaded from `.env` file