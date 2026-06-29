# ABOUT ZIP

# SoulCare - Your Daily Companion

**This package will include directories:**
SoulCare is a comprehensive mental health application designed to be a daily companion for users. It provides features like a personal diary, AI-powered chat assistance, mental health self-assessment tests, and the ability to book sessions with specialists.

### CRA VERSION (Contact support)

## Tech Stack

- Using Create React App.

* **Backend**: Java, Spring Boot, Maven, PostgreSQL
* **Frontend**: React, TypeScript, Vite, Material-UI (MUI)
* **AI**: Google Gemini API

### NEXT VERSION

## Prerequisites

- Using for Next.js
  Before you begin, ensure you have the following installed on your system:

### VITE VERSION

- **Java Development Kit (JDK)**: Version 17 or newer.
- **Apache Maven**: To build and run the backend. Can also be run with the included Maven Wrapper.
- **Node.js**: Version 16.x or 18.x.
- **Yarn**: Recommended for frontend package management. You can also use `npm`.
- **PostgreSQL**: The database for the application.

* Using for Vite.js

## Project Setup and Configuration

### STARTER VERSION

### 1. Backend Setup

- To remove unnecessary components. This is a simplified version ([https://starter.minimals.cc/](https://starter.minimals.cc/))
- Good to start a new project. You can copy components from the full version.
- Make sure to install the dependencies exactly as compared to the full version
  The backend is a Spring Boot application.

a. **Database Setup**:

- Create a new PostgreSQL database for the project.
- The application uses Flyway for database migrations, which will set up the schema automatically on the first run.

b. **Application Configuration**:

- Navigate to `backend/soulcare/src/main/resources/`.
- Create or update the `application.properties` or `application.yml` file.
- Add the configuration for your PostgreSQL database connection:
  ```properties
  # Example for application.properties
  spring.datasource.url=jdbc:postgresql://localhost:5432/your_database_name
  spring.datasource.username=your_postgres_username
  spring.datasource.password=your_postgres_password
  spring.jpa.hibernate.ddl-auto=validate
  ```
- The application uses the Google Gemini API. You need to add your API key to the configuration:
  ```properties
  gemini.api.key=YOUR_GEMINI_API_KEY
  ```

c. **Run the Backend**:

- Open a terminal in the `backend/soulcare` directory.
- Run the application using the Maven wrapper:

  ```bash
  # For Windows
  mvnw.cmd spring-boot:run

  # For macOS/Linux
  ./mvnw spring-boot:run
  ```

- The backend server will start, typically on port `8080`.

### 2. Frontend Setup

The frontend is a React application built with Vite.

a. **Install Dependencies**:

- Open a terminal in the `frontend` directory.
- Install the required packages using Yarn (recommended) or npm:

  ```bash
  # Using Yarn
  yarn install

  # Using NPM
  npm install --legacy-peer-deps
  ```

b. **Run the Frontend**:

- In the same `frontend` directory, start the development server:

  ```bash
  # Using Yarn
  yarn dev

  # Using NPM
  npm run dev
  ```

- The frontend application will be available at `http://localhost:3000` (or another port if 3000 is in use).

---

**Learn more:** [https://docs.minimals.cc/quick-start](https://docs.minimals.cc/quick-start)
Once both the backend and frontend are running, you can open your browser to the frontend URL to use the SoulCare application.
