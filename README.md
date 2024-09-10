# Backend Enpicom

This repository contains the backend service for the Enpicom project. It is built with NestJS, TypeORM, and PostgreSQL, and is containerized using Docker.

## Table of Contents

- [Project Structure](#project-structure)
- [Getting Started](#getting-started)
  - [Prerequisites for Running Application in Docker](#prerequisites-for-running-application-in-docker)
  - [Prerequisites for Running Application on Local System](#prerequisites-for-running-application-on-local-system)
  - [Setting Up the Environment](#setting-up-the-environment)
- [API Endpoints](#api-endpoints)
- [Compile and Run the Project](#compile-and-run-the-project)
- [Run Tests](#run-tests)
- [License](#license)

### Project Structure

- **`Dockerfile`**: Defines the Docker image for the Node.js application.

- **`docker-compose.yml`**: Sets up multiple services (PostgreSQL, PgAdmin, and the backend), useful for development and testing environments.

- **`src/`**:
  - **`app.module.ts`**: Main application module that consolidates other modules and global configurations.
  - **`main.ts`**: Entry point for the application, where global pipes and CORS are configured.
  - **`utils.ts`**: Contains utility functions like Levenshtein Distance, used across the application .

- **`src/dna`**:
  - **`dna.controller.ts`**: Defines routes and handlers for managing DNA records.
  - **`dna.service.ts`**: Contains business logic for managing DNA records.
  - **`dna.module.ts`**: Sets up the DNAModule with necessary imports and providers.
  - **`dna.controller.spec.ts`**: Defines unit test for routes and handlers for managing DNA records.
  - **`dna.service.spec.ts`**: Contains unit test for  business logic for managing DNA records.

- **`src/dna/entity`**:
  - **`dna.entity.ts`**: Defines the `DNA` entity with TypeORM, representing the structure of the DNA table.

- **`src/dna/dto`**:
  - **`create-dna.dto.ts`**: DTO for creating DNA records, with validation rules.
  - **`search-dna.dto.ts`**: DTO for searching DNA records.
  - **`dna.dto.ts`**: DTO for representing DNA records.
  - **`index.ts`**: Centralizes the export of DTOs to simplify imports.

- **`config`**:
  - **`typeorm.config.ts`**: Configures TypeORM for database interactions, including connection details, entity management, and schema synchronization. Uses environment variables to adapt to different environments.

- **`test/`**:
  - **`app.e2e-spec.ts`**: Defines End-to-End (E2E) test cases.
  - **`dnaTestData.ts`**: Provides mock data for testing DNA controller, service, and integration scenarios.
  - **`jest-e2e.json.ts`**: Configuration settings for running Jest in the end-to-end testing environment.
  - **testUtils.ts**: Defines utility interfaces and DTOs for structuring mock data used in testing.

## Getting Started

### Prerequisites for Running Application in Docker

- <a href="https://www.docker.com/">Docker</a> 

### Prerequisites for Running Application on Local System

- <a href="http://nodejs.org" target="_blank">Node.js</a> 
- <a href="https://www.postgresql.org" target="_blank">PostgreSQL</a>

### Setting Up the Environment

1. **Clone the Repository and Install Dependencies:**

   ```bash
   git clone https://github.com/Rabia-Riaz-SE/backend-enpicom.git
   cd backend-enpicom

2. **Configuration:**

      Create a .env file in the root of the project with the following sample data environment variables:

      ```bash

      PORT=3000
      DB_HOST=db 
      DB_PORT=5432
      DB_USER=postgres
      DB_PASS=postgres
      DB_NAME=enpicom
      DB_SYNC=true
      PGADMIN_DEFAULT_EMAIL=admin@admin.com
      PGADMIN_DEFAULT_PASSWORD=pgadmin4

      ```
      **Note:** If running the application locally without Docker, set `DB_HOST=localhost` in your environment variables.
3. **Running the Application:**

      #### Using Docker

      1. Build and start the Docker containers:
          ```bash

          docker-compose up --build

          ```
      2. Access the application at [http://localhost:3000](http://localhost:3000).

      3. Access pgAdmin at [http://localhost:5050](http://localhost:5050) with the credentials provided in the `.env` file.

    #### Without Docker

      1. Start the application locally:
          ```bash

          npm run start:dev

          ```

# API Endpoints

### 1. POST /dna

**Description**: Creates a new DNA record.

**Request Body**:
```json
{
  "dna": "ACTG"
}
```
### 2. GET /dna

**Description**: Searches for DNA records.

**Query Parameters**:
- `search`: DNA string to search for.
- `levenshtein`: Optional parameter to filter by Levenshtein distance.

**Example Request**:
```http

GET /dna?search=ACTG&levenshtein=1

```

## Compile and run the project

```bash
# development
$ npm run start

# watch mode
$ npm run start:dev

# production mode
$ npm run start:prod
```

## Run tests

```bash
# unit tests
$ npm run test

# e2e tests
$ npm run test:e2e

# test coverage
$ npm run test:cov
```
