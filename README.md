# 🏠 LaPlace - Hệ Thống Quản Lý Cho Thuê Trọ Trực Tuyến

## 📋 Giới thiệu

**LaPlace** là nền tảng quản lý cho thuê trọ toàn diện, giúp chủ nhà và người thuê kết nối dễ dàng với đầy đủ tính năng:

- 🏘️ **Quản lý phòng trọ**: Đăng tin, quản lý trạng thái phòng
- 📅 **Đặt phòng online**: Hệ thống booking tự động
- 📝 **Hợp đồng điện tử**: Tạo và quản lý hợp đồng thuê
- 💰 **Thanh toán tích hợp**: Theo dõi thanh toán, tiền cọc, hóa đơn
- ⭐ **Đánh giá & Review**: Hệ thống đánh giá từ khách thuê
- 📊 **Báo cáo thống kê**: Doanh thu, công suất, khách hàng

## 🛠️ Tech Stack

| Layer | Technology | Version |
|-------|------------|---------|
| **Server** | Node.js | 22 |
| | Express.js | 5.1.0 |
| | Sequelize ORM | 6.37.7 |
| | MySQL | 8.0 |
| | JWT Auth | 9.0.2 |
| | Socket.io | 4.8.1 |
| **Admin** | React | 18 |
| | Refine Framework | 4.x |
| | Ant Design | 5.x |
| | Vite | 5.x |
| | TypeScript | 5.x |
| **Client** | Next.js | 15.x |
| | React | 19.x |
| | Tailwind CSS | 3.4.x |
| **DevOps** | Docker | Latest |
| | Docker Compose | V2 |

## 🚀 Quick Start với Docker

### Yêu cầu hệ thống

- ✅ Docker Desktop (Windows 11 + WSL)
- ✅ Docker Compose V2
- ✅ Git

### Bước 1: Clone Repository

```powershell
git clone https://github.com/dominic-github/laplace
cd laplace
```

### Bước 2: Cấu hình Environment

```powershell
# Copy file env mẫu
copy .env.example .env

# Chỉnh sửa .env theo nhu cầu
notepad .env
```

**Ví dụ `.env`:**

```env
# Application
NODE_ENV=development
APP_NAME=LaPlace
APP_URL=http://localhost:7201

# Database
DB=mysql
DB_HOST=mysql
DB_PORT=3306
DB_USERNAME=laplace
DB_PASSWORD=123456
DB_NAME=laplace_db

# Ports
SERVER_PORT=7201
ADMIN_PORT=7202
CLIENT_PORT=7203

# JWT Secret
JWT_SECRET=your-super-secret-key-change-this

# Email (Gmail)
MAIL_HOST=smtp.gmail.com
MAIL_PORT=587
MAIL_USERNAME=your-email@gmail.com
MAIL_PASSWORD=your-app-password
```

### Bước 3: Chạy Docker Compose

```powershell
# Build và start tất cả services
docker compose up -d --build

# Xem logs (real-time)
docker compose logs -f
```

### Bước 4: Setup Database

```powershell
# Vào container server
docker exec -it laplace_server sh

# Chạy migrations
yarn sequelize-cli db:migrate

# Seed dữ liệu mẫu
yarn sequelize-cli db:seed:all

# Thoát container
exit
```

### Bước 5: Truy cập ứng dụng

| Service | URL | Credentials |
|---------|-----|-------------|
| **API Server** | http://localhost:7201 | - |
| **Admin Panel** | http://localhost:7202 | admin@laplace.com / admin123 |
| **Client Website** | http://localhost:7203 | (Coming soon) |
| **phpMyAdmin** | http://localhost:7204 | Server: `mysql`, User: `root`, Pass: `rootpassword` |

## � Cấu trúc dự án

```
laplace/
├── server/                     # Backend API (Node.js + Express + Sequelize)
│   ├── src/
│   │   ├── controllers/       # API Controllers
│   │   ├── models/            # Sequelize Models
│   │   ├── routes/            # API Routes
│   │   ├── services/          # Business Logic
│   │   ├── middlewares/       # Express Middlewares
│   │   ├── migrations/        # Database Migrations
│   │   ├── seeders/           # Database Seeders
│   │   ├── config/            # Config files
│   │   └── server.js          # Entry point
│   ├── Dockerfile
│   └── package.json
│
├── admin/                      # Admin Panel (React + Refine + Vite)
│   ├── src/
│   │   ├── pages/             # Refine Resources
│   │   │   ├── accommodations/    # Quản lý phòng trọ
│   │   │   ├── bookings/          # Quản lý đặt phòng
│   │   │   ├── contracts/         # Quản lý hợp đồng
│   │   │   ├── payments/          # Quản lý thanh toán
│   │   │   ├── reviews/           # Quản lý đánh giá
│   │   │   ├── facilities/        # Quản lý tiện nghi
│   │   │   ├── users/             # Quản lý người dùng
│   │   │   ├── roles/             # Quản lý vai trò
│   │   │   ├── permissions/       # Quản lý quyền
│   │   │   └── reports/           # Báo cáo thống kê
│   │   ├── components/        # React Components
│   │   ├── providers/         # Context Providers
│   │   └── App.tsx           # Main App
│   ├── Dockerfile
│   └── package.json
│
├── client/                     # Customer Website (Next.js + React + Tailwind)
│   ├── src/
│   │   ├── app/               # Next.js App Router
│   │   │   ├── (public)/      # Public pages
│   │   │   ├── (auth)/        # Auth pages
│   │   │   └── tai-khoan/     # Protected routes
│   │   ├── components/        # React Components
│   │   ├── lib/               # Utilities
│   │   └── store/             # State management
│   ├── Dockerfile
│   └── package.json
│
├── .agent/                     # AI Agent Configuration
│   ├── identity/
│   │   └── master-identity.md
│   ├── instructions/
│   │   ├── architect.prompt
│   │   ├── coder.prompt
│   │   ├── devops.prompt
│   │   ├── security.prompt
│   │   └── tester.prompt
│   ├── knowledge_base/
│   ├── workflows/
│   ├── scripts/
│   └── tasks.md
│
├── docs/                       # Documentation
│   ├── admin.md               # Admin Panel Guide
│   ├── client.md              # Frontend Documentation
│   └── server.md              # Backend API Specs
│
├── docker-compose.yml          # Docker orchestration
├── .env.example                # Environment template
├── .gitignore
└── README.md
```

## 🎯 Chức năng chính

### 1️⃣ **Quản lý Phòng trọ (Accommodations)**

- ✅ Danh sách phòng với filter & search
- ✅ Thêm/Sửa/Xóa phòng
- ✅ Upload ảnh phòng (multiple)
- ✅ Quản lý tiện nghi (Facilities)
- ✅ Trạng thái: Available, Occupied, Maintenance
- ✅ Thông tin: Tiêu đề, Mô tả, Địa chỉ, Giá, Diện tích, Số phòng

### 2️⃣ **Quản lý Đặt phòng (Bookings)**

- ✅ Danh sách booking với status filter
- ✅ Xem chi tiết booking
- ✅ Cập nhật trạng thái: Pending → Confirmed → Completed / Cancelled
- ✅ Thông báo email tự động
- ✅ Kiểm tra tính khả dụng (availability check)

### 3️⃣ **Quản lý Hợp đồng (Contracts)**

- ✅ Tạo hợp đồng thuê từ booking
- ✅ Quản lý thông tin: Người thuê, Thời hạn, Giá thuê, Tiền cọc
- ✅ Upload file hợp đồng PDF
- ✅ Điều khoản & điều kiện
- ✅ Trạng thái: Active, Expired, Terminated

### 4️⃣ **Quản lý Thanh toán (Payments)**

- ✅ Danh sách giao dịch
- ✅ Theo dõi thanh toán theo booking/contract
- ✅ Phương thức: Cash, Bank Transfer, Online
- ✅ Trạng thái: Pending, Completed, Failed
- ✅ Lịch sử thanh toán chi tiết

### 5️⃣ **Quản lý Đánh giá (Reviews)**

- ✅ Danh sách review từ khách thuê
- ✅ Rating 1-5 sao
- ✅ Bình luận (comment)
- ✅ Xóa đánh giá không phù hợp
- ✅ Hiển thị trên chi tiết phòng

### 6️⃣ **Quản lý Người dùng (Users)**

- ✅ Danh sách người dùng
- ✅ Phân quyền: Admin, Manager, Customer
- ✅ Quản lý thông tin cá nhân
- ✅ Lịch sử hoạt động (Activity Logs)

### 7️⃣ **Phân quyền (Roles & Permissions)**

- ✅ Quản lý vai trò (Roles)
- ✅ Quản lý quyền (Permissions)
- ✅ Gán quyền cho vai trò
- ✅ RBAC (Role-Based Access Control)

### 8️⃣ **Báo cáo & Thống kê (Reports)**

- 📊 **Báo cáo Doanh thu**
  - Tổng doanh thu
  - Doanh thu theo tháng/năm
  - Tăng trưởng (%)
  
- 📊 **Báo cáo Công suất**
  - Tổng số phòng
  - Phòng đã thuê / Phòng trống
  - Tỷ lệ lấp đầy (%)
  
- 📊 **Báo cáo Khách hàng**
  - Tổng khách hàng
  - Khách hàng hoạt động
  - Khách hàng mới
  - Top khách hàng VIP

## 🗄️ phpMyAdmin - Quản lý Database

### Truy cập

URL: **http://localhost:7204**

### Login

1. Truy cập http://localhost:7204
2. Nhập thông tin:
   - **Server:** `mysql` (hoặc để trống)
   - **Username:** `root`
   - **Password:** `rootpassword`
3. Click **Go**

### Hoặc sử dụng user laplace:

- **Username:** `laplace`
- **Password:** `123456`
- **Database:** `laplace_db`

### Chức năng chính

✅ **Browse Tables** - Xem dữ liệu  
✅ **SQL Query** - Chạy SQL trực tiếp  
✅ **Import/Export** - Backup & Restore database  
✅ **User Management** - Quản lý users MySQL  
✅ **Structure** - Xem cấu trúc tables  

### Sau khi login

1. Chọn database **`laplace_db`** từ sidebar bên trái
2. Bạn sẽ thấy các tables sau khi chạy migrations:
   - Users
   - Roles
   - Permissions
   - Accommodations
   - Facilities
   - Bookings
   - Contracts
   - Payments
   - Reviews
   - ActivityLogs

## 🐳 Docker Commands

### Development

```powershell
# Start tất cả services
docker compose up -d

# Stop tất cả services
docker compose down

# Rebuild một service cụ thể
docker compose up -d --build server

# Xem logs
docker compose logs -f server
docker compose logs -f admin

# Restart service
docker compose restart server
```

### Maintenance

```powershell
# Vào container
docker exec -it laplace_server sh
docker exec -it laplace_admin sh
docker exec -it laplace_mysql bash

# Deep clean (⚠️ XÓA DATA)
docker compose down -v
docker volume prune -f
```

### Database

```powershell
# Chạy migrations
docker exec -it laplace_server yarn sequelize-cli db:migrate

# Rollback migration
docker exec -it laplace_server yarn sequelize-cli db:migrate:undo

# Seed data
docker exec -it laplace_server yarn sequelize-cli db:seed:all

# Database backup
docker exec laplace_mysql mysqldump -u laplace -p123456 laplace_db > backup.sql
```

## 🔧 Development (Không dùng Docker)

### Server

```powershell
cd server
yarn install
yarn dev
```

### Admin

```powershell
cd admin
npm install
npm run dev
```

### Client (Coming soon)

```powershell
cd client
npm install
npm run dev
```

## 📝 API Endpoints Overview

### Authentication

- `POST /api/auth/register` - Đăng ký tài khoản
- `POST /api/auth/login` - Đăng nhập
- `POST /api/auth/logout` - Đăng xuất
- `GET /api/auth/me` - Lấy thông tin user hiện tại

### Accommodations

- `GET /api/accommodations` - Danh sách phòng (filter, search, pagination)
- `GET /api/accommodations/:id` - Chi tiết phòng
- `POST /api/accommodations` - Tạo phòng mới
- `PUT /api/accommodations/:id` - Cập nhật phòng
- `DELETE /api/accommodations/:id` - Xóa phòng

### Bookings

- `GET /api/bookings` - Danh sách đặt phòng
- `GET /api/bookings/:id` - Chi tiết đặt phòng
- `POST /api/bookings` - Tạo đặt phòng mới
- `PUT /api/bookings/:id` - Cập nhật trạng thái

### Contracts

- `GET /api/contracts` - Danh sách hợp đồng
- `GET /api/contracts/:id` - Chi tiết hợp đồng
- `POST /api/contracts` - Tạo hợp đồng
- `PUT /api/contracts/:id` - Cập nhật hợp đồng

### Payments

- `GET /api/payments` - Danh sách thanh toán
- `GET /api/payments/:id` - Chi tiết thanh toán
- `POST /api/payments` - Tạo thanh toán mới

### Reviews

- `GET /api/reviews` - Danh sách đánh giá
- `GET /api/reviews/:id` - Chi tiết đánh giá
- `POST /api/reviews` - Tạo đánh giá mới
- `DELETE /api/reviews/:id` - Xóa đánh giá

**Chi tiết đầy đủ:** Xem file `docs/server.md`

## 🔐 Credentials (Development)

| Role | Email | Password | Description |
|------|-------|----------|-------------|
| **Admin** | admin@laplace.com | admin123 | Quyền quản trị tối cao |
| **Manager** | manager@laplace.com | manager123 | Quản lý phòng trọ |
| **User** | user@laplace.com | user123 | Khách hàng thông thường |

## 🚢 Ports Configuration

| Service | Port | URL |
|---------|------|-----|
| **API Server** | 7201 | http://localhost:7201 |
| **Admin Panel** | 7202 | http://localhost:7202 |
| **Client Website** | 7203 | http://localhost:7203 |
| **phpMyAdmin** | 7204 | http://localhost:7204 |
| **MySQL** | 7205 | Internal (Docker network) |

> 📌 **Port Range:** 7200-7299  
> 📌 **Strategy:** Server → Admin → Client → phpMyAdmin → MySQL

## 📚 Documentation

| Document | Path | Mô tả |
|----------|------|-------|
| **Admin Guide** | `docs/admin.md` | Hướng dẫn sử dụng Admin Panel |
| **Frontend Blueprint** | `docs/client.md` | Tài liệu Frontend (Pages, Components) |
| **Backend API** | `docs/server.md` | API Documentation (Endpoints, Models) |

## 🤝 Contributing

Pull requests are welcome! For major changes, please open an issue first to discuss what you would like to change.

## 📄 License

MIT License - Copyright (c) 2026 Webest Group

## 👥 Contributors

- **Dominic** - [@dominic-github](https://github.com/dominic-github)

## 📞 Support

Nếu gặp vấn đề, vui lòng:
- Tạo issue trên GitHub
- Email: support@laplace.com

---

**Last Updated:** 2026-02-11  
**Version:** 1.0.0
