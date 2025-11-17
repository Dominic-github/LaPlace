# LaPlace API Server

This is the backend server for the LaPlace application, built using Node.js and Express.js. It provides RESTful APIs for user authentication, accommodations, payments, bookings, contacts and reviews.

## Features

- User Registration and Login with JWT Authentication
- Role-Based Access Control
- Accommodation Management (CRUD operations)
- Booking System
- Payment Processing
- Contact Form Handling
- Review System
- Messaging

## Getting Started

### Prerequisites

- Node.js (v22 or higher)
- npm or yarn
- A running instance of a SQL database (e.g., PostgreSQL, MySQL)

### Installation

1. Clone the repository:

   ```
    git clone https://github.com/dominic-github/LaPlace
   ```

2. Navigate to the project directory:

   ```
    cd server
   ```

3. Install dependencies:

   ```
    yarn install
   ```

4. Create a `.env` file in the root directory and configure your environment variables (e.g., database connection details, JWT secret).

5. Run database migrations to set up the database schema:

   ```
   npx sequelize-cli db:migrate
   or
   yarn sequelize-cli db:migrate
   ```

6. Seed the database with initial data (optional):

   ```
   npx sequelize-cli db:seed:all
   or
   yarn sequelize-cli db:seed:all
   ```

7. Start the server:

   ```
   npm dev
   or
   yarn dev
   ```
