# 🏠 LaPlace Admin Panel

Admin Panel cho hệ thống quản lý cho thuê trọ **LaPlace**, được xây dựng với **Refine Framework**, **React**, **Ant Design** và **Vite**.

## 📋 Tính năng

### 🏠 Quản lý cho thuê trọ
- ✅ **Accommodations** - Quản lý phòng trọ (CRUD)
- ✅ **Facilities** - Quản lý tiện nghi
- ✅ **Bookings** - Quản lý đặt phòng
- ✅ **Contracts** - Quản lý hợp đồng thuê
- ✅ **Payments** - Quản lý thanh toán
- ✅ **Reviews** - Quản lý đánh giá

### 📊 Báo cáo thống kê
- 📈 Báo cáo doanh thu
- 🏢 Báo cáo công suất phòng
- 👥 Báo cáo khách hàng

### 👤 Quản lý người dùng
- Users (Admin, Landlord, Tenant)
- Roles & Permissions (RBAC)

### 📝 Quản lý nội dung
- Post Categories
- Posts (Bài viết/Tin tức)
- Post Tags
- Banners
- Static Pages
- Media Library
- Menus

### ⚙️ Hệ thống
- Activity Logs
- General Config
- Settings

## 🚀 Tech Stack

- **Framework**: Refine v4
- **UI Library**: Ant Design v6
- **Language**: TypeScript
- **Build Tool**: Vite v5
- **Styling**: Tailwind CSS v4
- **State Management**: Refine Core
- **Routing**: React Router v6
- **Rich Text Editor**: TipTap
- **Charts**: Recharts
- **Icons**: Tabler Icons, Lucide React

## 📦 Installation

```bash
# Install dependencies
npm install
# hoặc
yarn install
```

## 🔧 Configuration

### Environment Variables

Tạo file `.env` trong thư mục admin:

```env
VITE_API_URL=http://localhost:7201
```

### API Base URL

API endpoint được cấu hình trong `src/dataProvider.ts`:

```typescript
const API_URL = import.meta.env.VITE_API_URL || 'http://localhost:7201'
```

## 🏃 Development

```bash
# Start dev server (port 7202)
npm run dev
# hoặc
yarn dev
```

Truy cập: **http://localhost:7202/admin**

## 🏗️ Build

```bash
# Build for production
npm run build
# hoặc
yarn build
```

Files build sẽ được tạo trong thư mục `dist/`

## 🖼️ Preview Production Build

```bash
npm run preview
# hoặc
yarn preview
```

## 📁 Project Structure

```
admin/
├── src/
│   ├── components/         # Shared components
│   │   ├── layout/         # Layout components
│   │   ├── CustomHeader.tsx
│   │   └── ...
│   ├── pages/              # Page components
│   │   ├── accommodations/ # 🏠 Accommodation pages (Coming soon)
│   │   ├── bookings/       # 📅 Booking pages (Coming soon)
│   │   ├── contracts/      # 📝 Contract pages (Coming soon)
│   │   ├── payments/       # 💰 Payment pages (Coming soon)
│   │   ├── reviews/        # ⭐ Review pages (Coming soon)
│   │   ├── facilities/     # 🛋️ Facility pages (Coming soon)
│   │   ├── reports/        # 📈 Report pages (Coming soon)
│   │   ├── users/          # ✅ User management
│   │   ├── posts/          # ✅ Post management
│   │   ├── dashboard/      # ✅ Dashboard
│   │   └── ...
│   ├── providers/          # Context providers
│   ├── styles/             # Global styles
│   ├── utils/              # Utility functions
│   ├── lib/                # Libraries & helpers
│   ├── App.tsx             # Main app component
│   ├── main.tsx            # Entry point
│   ├── authProvider.ts     # Authentication logic
│   ├── dataProvider.ts     # Data fetching logic
│   └── index.css           # Global CSS
├── public/                 # Static assets
├── index.html              # HTML template
├── package.json
├── tsconfig.json
├── vite.config.ts
└── tailwind.config.js
```

## 🎨 Design System

### Colors

LaPlace sử dụng bảng màu chuyên nghiệp cho hệ thống cho thuê trọ:

- **Primary**: `#1677ff` (Blue)
- **Success**: `#52c41a` (Green)
- **Warning**: `#faad14` (Orange)
- **Error**: `#ff4d4f` (Red)
- **Info**: `#13c2c2` (Cyan)

### Icons

Sử dụng emoji và icon sets:
- 🏠 Accommodations
- 📅 Bookings
- 📝 Contracts
- 💰 Payments
- ⭐ Reviews
- 🛋️ Facilities
- 📊 Dashboard
- 👥 Users

## 🔐 Authentication

### Login

- **URL**: `/admin/login`
- **Credentials** (Development):
  - Email: `admin@laplace.com`
  - Password: `admin123`

### Auth Provider

Xem `src/authProvider.ts` để biết chi tiết về authentication flow.

## 📡 API Integration

### DataProvider

Admin sử dụng `@refinedev/simple-rest` để kết nối với backend API.

```typescript
import dataProvider from "@refinedev/simple-rest";

const API_URL = import.meta.env.VITE_API_URL;

export const dataProvider = dataProvider(API_URL);
```

### API Endpoints

Backend API endpoints:

- `GET /api/accommodations` - List accommodations
- `POST /api/accommodations` - Create accommodation
- `GET /api/accommodations/:id` - Get accommodation
- `PUT /api/accommodations/:id` - Update accommodation
- `DELETE /api/accommodations/:id` - Delete accommodation

Tương tự cho: bookings, contracts, payments, reviews, facilities, users, posts, v.v.

## 🚧 Development Status

### ✅ Completed
- [x] Project setup
- [x] Authentication
- [x] Layout & Navigation
- [x] User Management
- [x] Post Management
- [x] Settings
- [x] Roles & Permissions

### 🚧 In Progress
- [ ] Accommodation Management
- [ ] Booking Management
- [ ] Contract Management
- [ ] Payment Management
- [ ] Review Management
- [ ] Facility Management
- [ ] Reports & Analytics

### 📋 To Do
- [ ] Dashboard statistics
- [ ] Real-time notifications
- [ ] Export to Excel/PDF
- [ ] Advanced filters
- [ ] Bulk actions

## 🐳 Docker

Admin panel đã được cấu hình trong `docker-compose.yml` của project chính.

```bash
# Start admin with Docker
docker compose up -d admin
```

Port: **7202**

## 📚 Documentation

- **Refine Docs**: https://refine.dev/docs
- **Ant Design**: https://ant.design/components/overview
- **Vite**: https://vitejs.dev/guide
- **React Router**: https://reactrouter.com

## 🤝 Contributing

1. Fork the project
2. Create your feature branch (`git checkout -b feature/AmazingFeature`)
3. Commit your changes (`git commit -m 'Add some AmazingFeature'`)
4. Push to the branch (`git push origin feature/AmazingFeature`)
5. Open a Pull Request

## 📄 License

This project is **UNLICENSED** - Private project.

## 👨‍💻 Author

**Webest Group**
- Website: https://webest.asia
- Email: contact@webest.asia

---

**LaPlace Admin Panel** - Quản lý cho thuê trọ chuyên nghiệp 🏠
