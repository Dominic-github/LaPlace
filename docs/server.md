# 🏠 LaPlace - Server API Documentation

## 📝 Tổng quan

Backend API của LaPlace được xây dựng với:
- **Node.js 22** + **Express.js 5**
- **Sequelize ORM** + **MySQL 8**
- **JWT Authentication**
- **Socket.io** (Real-time)

---

## 🗄️ Database Models

### 1. User Model

```javascript
// models/User.js
{
  id: INTEGER (PK, Auto Increment),
  firstName: STRING(50),
  lastName: STRING(50),
  email: STRING(100) UNIQUE,
  password: STRING(255),
  phone: STRING(20),
  avatar: TEXT,
  status: ENUM('active', 'inactive', 'banned'),
  emailVerified: BOOLEAN,
  createdAt: DATE,
  updatedAt: DATE
}
```

**Relationships:**
- `hasMany` → Booking
- `hasMany` → Review
- `hasMany` → Contract
- `belongsToMany` → Role (through UserRole)

---

### 2. Role Model

```javascript
// models/Role.js
{
  id: INTEGER (PK, Auto Increment),
  name: STRING(50) UNIQUE,
  description: TEXT,
  createdAt: DATE,
  updatedAt: DATE
}
```

**Relationships:**
- `belongsToMany` → User (through UserRole)
- `belongsToMany` → Permission (through RolePermission)

**Seed Roles:**
- `admin` - Quản trị viên tối cao
- `manager` - Quản lý phòng trọ
- `customer` - Khách hàng

---

### 3. Permission Model

```javascript
// models/Permission.js
{
  id: INTEGER (PK, Auto Increment),
  resource: STRING(50), // "accommodation", "booking", "contract"
  action: STRING(50),   // "create", "read", "update", "delete"
  description: TEXT,
  createdAt: DATE,
  updatedAt: DATE
}
```

**Relationships:**
- `belongsToMany` → Role (through RolePermission)

---

### 4. Accommodation Model

```javascript
// models/Accommodation.js
{
  id: INTEGER (PK, Auto Increment),
  title: STRING(255),
  description: TEXT,
  address: TEXT,
  province: STRING(100),
  district: STRING(100),
  ward: STRING(100),
  price: DECIMAL(15, 2),
  area: DECIMAL(10, 2), // m²
  bedrooms: INTEGER,
  bathrooms: INTEGER,
  maxOccupancy: INTEGER,
  status: ENUM('available', 'occupied', 'maintenance'),
  images: JSON, // Array of image URLs
  featured: BOOLEAN,
  viewCount: INTEGER,
  createdAt: DATE,
  updatedAt: DATE
}
```

**Relationships:**
- `hasMany` → Booking
- `hasMany` → Review
- `belongsToMany` → Facility (through AccommodationFacility)

---

### 5. Facility Model

```javascript
// models/Facility.js
{
  id: INTEGER (PK, Auto Increment),
  name: STRING(100),
  icon: STRING(100), // Icon class name
  category: ENUM('basic', 'furniture', 'appliance', 'security'),
  createdAt: DATE,
  updatedAt: DATE
}
```

**Relationships:**
- `belongsToMany` → Accommodation (through AccommodationFacility)

**Example Facilities:**
- WiFi, Điều hòa, Nóng lạnh, Giường, Tủ, Bếp, Camera an ninh

---

### 6. Booking Model

```javascript
// models/Booking.js
{
  id: INTEGER (PK, Auto Increment),
  userId: INTEGER (FK → User),
  accommodationId: INTEGER (FK → Accommodation),
  checkInDate: DATE,
  checkOutDate: DATE,
  guests: INTEGER,
  totalPrice: DECIMAL(15, 2),
  status: ENUM('pending', 'confirmed', 'cancelled', 'completed'),
  notes: TEXT,
  createdAt: DATE,
  updatedAt: DATE
}
```

**Relationships:**
- `belongsTo` → User
- `belongsTo` → Accommodation
- `hasOne` → Contract
- `hasMany` → Payment

---

### 7. Contract Model

```javascript
// models/Contract.js
{
  id: INTEGER (PK, Auto Increment),
  bookingId: INTEGER (FK → Booking),
  userId: INTEGER (FK → User),
  accommodationId: INTEGER (FK → Accommodation),
  startDate: DATE,
  endDate: DATE,
  monthlyRent: DECIMAL(15, 2),
  deposit: DECIMAL(15, 2),
  terms: TEXT,
  contractFile: TEXT, // PDF URL
  status: ENUM('active', 'expired', 'terminated'),
  createdAt: DATE,
  updatedAt: DATE
}
```

**Relationships:**
- `belongsTo` → Booking
- `belongsTo` → User
- `belongsTo` → Accommodation
- `hasMany` → Payment

---

### 8. Payment Model

```javascript
// models/Payment.js
{
  id: INTEGER (PK, Auto Increment),
  bookingId: INTEGER (FK → Booking),
  contractId: INTEGER (FK → Contract),
  userId: INTEGER (FK → User),
  amount: DECIMAL(15, 2),
  paymentMethod: ENUM('cash', 'bank_transfer', 'online'),
  status: ENUM('pending', 'completed', 'failed'),
  transactionId: STRING(255),
  notes: TEXT,
  paidAt: DATE,
  createdAt: DATE,
  updatedAt: DATE
}
```

**Relationships:**
- `belongsTo` → Booking
- `belongsTo` → Contract
- `belongsTo` → User

---

### 9. Review Model

```javascript
// models/Review.js
{
  id: INTEGER (PK, Auto Increment),
  userId: INTEGER (FK → User),
  accommodationId: INTEGER (FK → Accommodation),
  rating: INTEGER, // 1-5
  comment: TEXT,
  images: JSON, // Array of image URLs
  isApproved: BOOLEAN,
  createdAt: DATE,
  updatedAt: DATE
}
```

**Relationships:**
- `belongsTo` → User
- `belongsTo` → Accommodation

---

### 10. ActivityLog Model

```javascript
// models/ActivityLog.js
{
  id: INTEGER (PK, Auto Increment),
  userId: INTEGER (FK → User),
  action: STRING(100),
  resource: STRING(100),
  resourceId: INTEGER,
  details: JSON,
  ipAddress: STRING(45),
  userAgent: TEXT,
  createdAt: DATE
}
```

---

## 🔐 Authentication

### Register

```http
POST /api/auth/register
Content-Type: application/json

{
  "firstName": "Nguyen",
  "lastName": "Van A",
  "email": "user@example.com",
  "password": "123456",
  "phone": "0912345678"
}
```

**Response:**
```json
{
  "success": true,
  "message": "Đăng ký thành công",
  "data": {
    "user": {
      "id": 1,
      "firstName": "Nguyen",
      "lastName": "Van A",
      "email": "user@example.com"
    },
    "token": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9..."
  }
}
```

---

### Login

```http
POST /api/auth/login
Content-Type: application/json

{
  "email": "admin@laplace.com",
  "password": "admin123"
}
```

**Response:**
```json
{
  "success": true,
  "data": {
    "user": {
      "id": 1,
      "email": "admin@laplace.com",
      "roles": ["admin"]
    },
    "token": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9..."
  }
}
```

---

### Get Current User

```http
GET /api/auth/me
Authorization: Bearer {token}
```

**Response:**
```json
{
  "success": true,
  "data": {
    "id": 1,
    "firstName": "Admin",
    "lastName": "User",
    "email": "admin@laplace.com",
    "roles": ["admin"],
    "permissions": ["accommodation.create", "booking.read", ...]
  }
}
```

---

## 🏠 Accommodations API

### Get All Accommodations

```http
GET /api/accommodations
Query Params:
  - page (default: 1)
  - limit (default: 10)
  - search (tìm theo title, address)
  - status (available, occupied, maintenance)
  - minPrice, maxPrice
  - minArea, maxArea
  - bedrooms
  - province, district
  - facilities (comma-separated IDs: "1,2,3")
```

**Response:**
```json
{
  "success": true,
  "data": {
    "items": [
      {
        "id": 1,
        "title": "Phòng trọ cao cấp quận 1",
        "price": 5000000,
        "area": 25,
        "bedrooms": 1,
        "bathrooms": 1,
        "status": "available",
        "images": ["url1.jpg", "url2.jpg"],
        "facilities": [
          { "id": 1, "name": "WiFi" },
          { "id": 2, "name": "Điều hòa" }
        ]
      }
    ],
    "pagination": {
      "total": 50,
      "page": 1,
      "limit": 10,
      "totalPages": 5
    }
  }
}
```

---

### Get Accommodation By ID

```http
GET /api/accommodations/:id
```

**Response:**
```json
{
  "success": true,
  "data": {
    "id": 1,
    "title": "Phòng trọ cao cấp quận 1",
    "description": "Phòng đầy đủ tiện nghi...",
    "address": "123 Nguyễn Huệ, Quận 1, TP.HCM",
    "price": 5000000,
    "area": 25,
    "bedrooms": 1,
    "bathrooms": 1,
    "maxOccupancy": 2,
    "status": "available",
    "images": ["url1.jpg", "url2.jpg"],
    "facilities": [...],
    "reviews": [
      {
        "id": 1,
        "user": { "firstName": "Nguyen", "lastName": "Van A" },
        "rating": 5,
        "comment": "Phòng đẹp, sạch sẽ"
      }
    ],
    "averageRating": 4.5,
    "totalReviews": 10
  }
}
```

---

### Create Accommodation (Admin Only)

```http
POST /api/accommodations
Authorization: Bearer {token}
Content-Type: application/json

{
  "title": "Phòng trọ mới",
  "description": "Mô tả chi tiết...",
  "address": "123 ABC",
  "province": "TP.HCM",
  "district": "Quận 1",
  "ward": "Phường Bến Nghé",
  "price": 3000000,
  "area": 20,
  "bedrooms": 1,
  "bathrooms": 1,
  "maxOccupancy": 2,
  "facilityIds": [1, 2, 3]
}
```

---

### Update Accommodation

```http
PUT /api/accommodations/:id
Authorization: Bearer {token}
Content-Type: application/json

{
  "title": "Phòng trọ đã cập nhật",
  "price": 3500000,
  "status": "occupied"
}
```

---

### Delete Accommodation

```http
DELETE /api/accommodations/:id
Authorization: Bearer {token}
```

---

## 📅 Bookings API

### Get All Bookings

```http
GET /api/bookings
Authorization: Bearer {token}
Query Params:
  - page, limit
  - status (pending, confirmed, cancelled, completed)
  - userId (filter by user)
  - accommodationId (filter by accommodation)
```

---

### Get Booking By ID

```http
GET /api/bookings/:id
Authorization: Bearer {token}
```

**Response:**
```json
{
  "success": true,
  "data": {
    "id": 1,
    "user": {
      "id": 2,
      "firstName": "Nguyen",
      "lastName": "Van A",
      "email": "user@example.com"
    },
    "accommodation": {
      "id": 1,
      "title": "Phòng trọ cao cấp",
      "price": 5000000
    },
    "checkInDate": "2026-03-01",
    "checkOutDate": "2026-03-31",
    "guests": 2,
    "totalPrice": 5000000,
    "status": "confirmed",
    "notes": "Cần phòng yên tĩnh"
  }
}
```

---

### Create Booking

```http
POST /api/bookings
Authorization: Bearer {token}
Content-Type: application/json

{
  "accommodationId": 1,
  "checkInDate": "2026-03-01",
  "checkOutDate": "2026-03-31",
  "guests": 2,
  "notes": "Cần phòng yên tĩnh"
}
```

**Business Logic:**
- Kiểm tra accommodation có `status = 'available'`
- Kiểm tra không có booking trùng ngày
- Tự động tính `totalPrice`
- Gửi email xác nhận

---

### Update Booking Status

```http
PUT /api/bookings/:id/status
Authorization: Bearer {token}
Content-Type: application/json

{
  "status": "confirmed"
}
```

**Allowed Transitions:**
- `pending` → `confirmed` / `cancelled`
- `confirmed` → `completed` / `cancelled`

---

### Cancel Booking

```http
DELETE /api/bookings/:id
Authorization: Bearer {token}
```

---

## 📝 Contracts API

### Get All Contracts

```http
GET /api/contracts
Authorization: Bearer {token}
Query Params:
  - page, limit
  - status (active, expired, terminated)
  - userId
```

---

### Get Contract By ID

```http
GET /api/contracts/:id
Authorization: Bearer {token}
```

---

### Create Contract (From Booking)

```http
POST /api/contracts
Authorization: Bearer {token}
Content-Type: application/json

{
  "bookingId": 1,
  "startDate": "2026-03-01",
  "endDate": "2027-03-01",
  "monthlyRent": 5000000,
  "deposit": 10000000,
  "terms": "Điều khoản hợp đồng..."
}
```

**Business Logic:**
- Booking phải có `status = 'confirmed'`
- Tạo Contract với `status = 'active'`
- Cập nhật Booking `status = 'completed'`
- Cập nhật Accommodation `status = 'occupied'`

---

### Upload Contract File

```http
POST /api/contracts/:id/upload
Authorization: Bearer {token}
Content-Type: multipart/form-data

{
  "file": (PDF file)
}
```

---

### Terminate Contract

```http
PUT /api/contracts/:id/terminate
Authorization: Bearer {token}
```

**Business Logic:**
- Cập nhật Contract `status = 'terminated'`
- Cập nhật Accommodation `status = 'available'`

---

## 💰 Payments API

### Get All Payments

```http
GET /api/payments
Authorization: Bearer {token}
Query Params:
  - page, limit
  - status (pending, completed, failed)
  - bookingId
  - contractId
  - userId
```

---

### Get Payment By ID

```http
GET /api/payments/:id
Authorization: Bearer {token}
```

---

### Create Payment

```http
POST /api/payments
Authorization: Bearer {token}
Content-Type: application/json

{
  "bookingId": 1,
  "amount": 5000000,
  "paymentMethod": "bank_transfer",
  "transactionId": "TXN123456",
  "notes": "Thanh toán tháng 3"
}
```

---

### Update Payment Status

```http
PUT /api/payments/:id/status
Authorization: Bearer {token}
Content-Type: application/json

{
  "status": "completed",
  "paidAt": "2026-03-01T10:00:00Z"
}
```

---

## ⭐ Reviews API

### Get Reviews By Accommodation

```http
GET /api/accommodations/:id/reviews
Query Params:
  - page, limit
```

---

### Create Review

```http
POST /api/reviews
Authorization: Bearer {token}
Content-Type: application/json

{
  "accommodationId": 1,
  "rating": 5,
  "comment": "Phòng đẹp, sạch sẽ, chủ nhà thân thiện"
}
```

**Business Logic:**
- User phải có Booking `status = 'completed'` cho accommodation này
- Một user chỉ review 1 lần cho 1 accommodation

---

### Delete Review

```http
DELETE /api/reviews/:id
Authorization: Bearer {token}
```

---

## 📊 Reports API (Admin Only)

### Revenue Report

```http
GET /api/reports/revenue
Authorization: Bearer {token}
Query Params:
  - startDate
  - endDate
  - groupBy (day, month, year)
```

**Response:**
```json
{
  "success": true,
  "data": {
    "totalRevenue": 50000000,
    "growthRate": 15.5,
    "byMonth": [
      { "month": "2026-01", "revenue": 10000000 },
      { "month": "2026-02", "revenue": 15000000 }
    ]
  }
}
```

---

### Occupancy Report

```http
GET /api/reports/occupancy
Authorization: Bearer {token}
```

**Response:**
```json
{
  "success": true,
  "data": {
    "totalAccommodations": 50,
    "occupied": 35,
    "available": 10,
    "maintenance": 5,
    "occupancyRate": 70
  }
}
```

---

### Customer Report

```http
GET /api/reports/customers
Authorization: Bearer {token}
```

**Response:**
```json
{
  "success": true,
  "data": {
    "totalCustomers": 200,
    "activeCustomers": 150,
    "newCustomers": 20,
    "topCustomers": [
      {
        "user": { "firstName": "Nguyen", "lastName": "Van A" },
        "totalBookings": 5,
        "totalSpent": 25000000
      }
    ]
  }
}
```

---

## 🔧 Middleware

### authMiddleware

Kiểm tra JWT token và gắn `req.user`

```javascript
const authMiddleware = (req, res, next) => {
  const token = req.headers.authorization?.split(' ')[1];
  // Verify JWT
  // Set req.user
  next();
}
```

---

### roleMiddleware

Kiểm tra quyền truy cập

```javascript
const roleMiddleware = (roles) => {
  return (req, res, next) => {
    if (!req.user || !roles.includes(req.user.role)) {
      return res.status(403).json({ message: 'Forbidden' });
    }
    next();
  }
}
```

**Usage:**
```javascript
router.delete('/accommodations/:id', 
  authMiddleware, 
  roleMiddleware(['admin', 'manager']), 
  deleteAccommodation
);
```

---

## 📧 Email Service

### Send Booking Confirmation

```javascript
// services/emailService.js
sendBookingConfirmation(booking, user, accommodation) {
  // Template: booking-confirmation.html
  // To: user.email
  // Subject: "Xác nhận đặt phòng - LaPlace"
}
```

---

### Send Contract Reminder

```javascript
sendContractReminder(contract, user) {
  // Template: contract-reminder.html
  // To: user.email
  // Subject: "Nhắc nhở gia hạn hợp đồng"
}
```

---

## 🔌 Socket.io Events

### Real-time Notifications

```javascript
// server.js
io.on('connection', (socket) => {
  socket.on('join-room', (userId) => {
    socket.join(`user-${userId}`);
  });
});

// Emit to specific user
io.to(`user-${userId}`).emit('booking-confirmed', booking);
```

---

## 🛡️ Security

### Password Hashing

```javascript
const bcrypt = require('bcrypt');
const hashedPassword = await bcrypt.hash(password, 10);
```

### JWT Configuration

```javascript
const jwt = require('jsonwebtoken');
const token = jwt.sign(
  { userId: user.id, role: user.role },
  process.env.JWT_SECRET,
  { expiresIn: '7d' }
);
```

---

## 📝 Error Handling

### Standard Error Response

```json
{
  "success": false,
  "message": "Error message",
  "errors": [
    {
      "field": "email",
      "message": "Email đã tồn tại"
    }
  ]
}
```

### HTTP Status Codes

- `200` - OK
- `201` - Created
- `400` - Bad Request (validation error)
- `401` - Unauthorized
- `403` - Forbidden
- `404` - Not Found
- `500` - Internal Server Error

---

## 🧪 Testing

### Example Unit Test

```javascript
// tests/accommodation.test.js
describe('Accommodation API', () => {
  it('should get all accommodations', async () => {
    const res = await request(app).get('/api/accommodations');
    expect(res.status).toBe(200);
    expect(res.body.success).toBe(true);
  });
});
```

---

*Last Updated: 2026-02-11*  
*Version: 1.0.0*
