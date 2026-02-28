# 📊 DATABASE SCHEMA - LAPLACE

## Overview

- **Database**: MySQL 8.0
- **ORM**: Sequelize 6
- **Models Path**: `server/src/models/`
- **Total Models**: 19 (+ index.js)

---

## Core Models

### Auth & Users (7 models)

| Model | File | Table | Description |
|-------|------|-------|-------------|
| User | `user.js` | users | Tài khoản người dùng |
| Role | `roles.js` | roles | Vai trò (Admin, Manager, Customer) |
| Permission | `permissions.js` | permissions | Quyền hạn chi tiết |
| UserRole | `user_roles.js` | user_roles | Many-to-many User ↔ Role |
| RolePermission | `role-permissions.js` | role_permissions | Many-to-many Role ↔ Permission |
| Token | `tokens.js` | tokens | JWT tokens storage |
| RefreshTokenUsed | `refresh_tokens_used.js` | refresh_tokens_used | Tracking used refresh tokens |

### Accommodations (4 models)

| Model | File | Table | Description |
|-------|------|-------|-------------|
| Accommodation | `accommodations.js` | accommodations | Phòng trọ / Nhà thuê |
| AccommodationImage | `accommodations_images.js` | accommodation_images | Ảnh phòng (1-to-many) |
| Facility | `facilities.js` | facilities | Tiện nghi (WiFi, Điều hòa, v.v.) |
| AccommodationFacility | `accommodation_facilities.js` | accommodation_facilities | Many-to-many |

### Business (2 models)

| Model | File | Table | Description |
|-------|------|-------|-------------|
| Booking | `bookings.js` | bookings | Đặt phòng |
| Contract | `contracts.js` | contracts | Hợp đồng thuê |

### Payments & Reviews (2 models)

| Model | File | Table | Description |
|-------|------|-------|-------------|
| Payment | `payments.js` | payments | Thanh toán |
| Review | `reviews.js` | reviews | Đánh giá phòng (1-5 sao) |

### Social (2 models)

| Model | File | Table | Description |
|-------|------|-------|-------------|
| Favorite | `favorites.js` | favorites | Phòng yêu thích |
| Message | `messages.js` | messages | Tin nhắn real-time |

### System (1 model)

| Model | File | Table | Description |
|-------|------|-------|-------------|
| Report | `reports.js` | reports | Báo cáo |

### Repository Pattern

| File | Description |
|------|-------------|
| `repository/` | Data access layer abstraction |

---

## Key Enums

```javascript
// Accommodation Status
status: ENUM('available', 'occupied', 'maintenance')

// Accommodation Type
type: ENUM('phong_tro', 'can_ho', 'nha_nguyen_can', 'ky_tuc_xa')

// Booking Status
status: ENUM('pending', 'confirmed', 'completed', 'cancelled')

// Contract Status
status: ENUM('active', 'expired', 'terminated')

// Payment Status
status: ENUM('pending', 'completed', 'failed')

// Payment Method
method: ENUM('cash', 'bank_transfer', 'online')

// User Status
status: ENUM('active', 'inactive', 'banned')
```

---

## Key Relationships

```
User (1) ──→ (N) Booking
User (1) ──→ (N) Review
User (1) ──→ (N) Contract (as tenant)
User (1) ──→ (N) Favorite
User (1) ──→ (N) Message (as sender)
User (1) ──→ (N) Token

Accommodation (1) ──→ (N) Booking
Accommodation (1) ──→ (N) Review
Accommodation (1) ──→ (N) AccommodationImage
Accommodation (N) ←──→ (N) Facility

Booking (1) ──→ (1) Contract
Contract (1) ──→ (N) Payment
```

---

## Common Queries

### Accommodations with Facilities & Images

```javascript
const accommodations = await Accommodation.findAll({
  where: { status: 'available' },
  include: [
    { model: Facility, as: 'facilities' },
    { model: AccommodationImage, as: 'images' },
  ],
  order: [['createdAt', 'DESC']],
});
```

### Bookings with Related Data

```javascript
const bookings = await Booking.findAll({
  include: [
    { model: User, as: 'user', attributes: ['id', 'name', 'email'] },
    { model: Accommodation, as: 'accommodation', attributes: ['id', 'title'] },
  ],
  order: [['createdAt', 'DESC']],
});
```

### Revenue Report

```javascript
const revenue = await Payment.findAll({
  where: { status: 'completed' },
  attributes: [
    [sequelize.fn('SUM', sequelize.col('amount')), 'totalRevenue'],
    [sequelize.fn('MONTH', sequelize.col('createdAt')), 'month'],
  ],
  group: [sequelize.fn('MONTH', sequelize.col('createdAt'))],
});
```

---

*Full schema: `server/src/models/`, `server/src/migrations/` (19 migration files)*  
*Updated: 2026-02-24*
