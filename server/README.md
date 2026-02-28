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

6. Seed the database with initial data:

   **Option 1: Chạy tất cả seeders (Recommended)**
   ```bash
   npm run seed:all
   # hoặc
   yarn seed:all
   ```

   **Option 2: Chạy tự động (không hỏi xác nhận)**
   ```bash
   npm run seed:all:yes
   # hoặc
   yarn seed:all:yes
   ```

   **Option 3: Dùng sequelize-cli (cách cũ)**
   ```bash
   npm run db:seed
   # hoặc
   yarn sequelize-cli db:seed:all
   ```

7. Start the server:

   ```bash
   npm dev
   # hoặc
   yarn dev
   ```

## Database Commands

| Command | Description |
|---------|-------------|
| `npm run db:migrate` | Chạy migrations |
| `npm run db:migrate:undo` | Rollback migration cuối |
| `npm run seed:all` | Chạy tất cả seeders (có xác nhận) |
| `npm run seed:all:yes` | Chạy tất cả seeders (tự động) |
| `npm run db:seed` | Chạy seeders (sequelize-cli) |
| `npm run db:reset` | Reset database hoàn toàn |

### Full Setup từ đầu

```bash
# 1. Install dependencies
yarn install

# 2. Run migrations
yarn db:migrate

# 3. Run seeders
yarn seed:all

# 4. Start server
yarn dev
```

### Reset Database

```bash
# Xóa tất cả data, chạy lại migrations và seeders
yarn db:reset
```

## Seeders Available

1. **Address Vietnam** - Tỉnh/Thành, Quận/Huyện, Phường/Xã (63 tỉnh, ~11000 xã)
2. **Roles & Permissions** - Admin, Landlord, User, Broker với đầy đủ quyền

Xem chi tiết: `src/seeders/README.md`
