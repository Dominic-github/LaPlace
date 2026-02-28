# 🌱 LaPlace Database Seeders

Hướng dẫn sử dụng seeders cho database LaPlace.

## 📋 Seeders hiện có

1. **`20251113000000-address-vietnam.js`** - Dữ liệu địa chỉ Việt Nam (Tỉnh/Thành, Quận/Huyện, Phường/Xã)
2. **`20251113092915-role-permission.js`** - Roles và Permissions (Admin, Landlord, User, Broker)

## 🚀 Cách sử dụng

### Chạy tất cả seeders (có xác nhận)

```bash
npm run seed:all
# hoặc
yarn seed:all
```

Bạn sẽ được hỏi xác nhận trước khi chạy.

### Chạy tất cả seeders (tự động, không hỏi)

```bash
npm run seed:all:yes
# hoặc
yarn seed:all:yes
```

### Chạy từng seeder riêng lẻ

```bash
# Dùng sequelize-cli
npx sequelize-cli db:seed --seed 20251113000000-address-vietnam.js
npx sequelize-cli db:seed --seed 20251113092915-role-permission.js
```

### Chạy tất cả seeders (sequelize-cli)

```bash
npm run db:seed
# hoặc
yarn sequelize-cli db:seed:all
```

## 🔄 Reset Database

Reset hoàn toàn database (undo migrations, chạy lại migrations, chạy seeders):

```bash
npm run db:reset
# hoặc
yarn db:reset
```

**⚠️ Cảnh báo:** Lệnh này sẽ XÓA tất cả dữ liệu!

## 📝 Tạo seeder mới

```bash
npx sequelize-cli seed:generate --name your-seed-name
```

Ví dụ:

```bash
npx sequelize-cli seed:generate --name demo-users
npx sequelize-cli seed:generate --name demo-accommodations
npx sequelize-cli seed:generate --name demo-bookings
```

## 🏗️ Cấu trúc seeder

```javascript
'use strict'

module.exports = {
  async up(queryInterface, Sequelize) {
    // Insert seed data
    await queryInterface.bulkInsert('table_name', [
      {
        column1: 'value1',
        column2: 'value2',
        createdAt: new Date(),
        updatedAt: new Date()
      }
    ])
  },

  async down(queryInterface, Sequelize) {
    // Remove seed data (rollback)
    await queryInterface.bulkDelete('table_name', null, {})
  }
}
```

## 📊 Database Commands Cheat Sheet

| Command | Description |
|---------|-------------|
| `npm run db:migrate` | Chạy migrations |
| `npm run db:migrate:undo` | Rollback migration cuối |
| `npm run db:seed` | Chạy tất cả seeders (sequelize-cli) |
| `npm run seed:all` | Chạy tất cả seeders (custom script) |
| `npm run seed:all:yes` | Chạy tất cả seeders (không hỏi) |
| `npm run db:reset` | Reset database hoàn toàn |

## 🎯 Workflow đầy đủ

### Development setup từ đầu:

```bash
# 1. Chạy migrations
npm run db:migrate

# 2. Chạy seeders
npm run seed:all

# 3. Kiểm tra database
# Vào phpMyAdmin: http://localhost:7204
```

### Khi có thay đổi schema:

```bash
# 1. Rollback migrations
npm run db:migrate:undo

# 2. Chỉnh sửa migration file

# 3. Chạy lại migration
npm run db:migrate

# 4. Chạy lại seeders (nếu cần)
npm run seed:all:yes
```

## 📂 Dữ liệu Address Vietnam

Seeders sử dụng file SQL có sẵn trong `src/database/address/`:

- `mysql_CreateTables_vn_units.sql` - Tạo tables (vn_provinces, vn_districts, vn_wards)
- `mysql_ImportData_vn_units.sql` - Import dữ liệu (63 tỉnh/thành, ~700 quận/huyện, ~11000 phường/xã)

### Sử dụng trong code:

```javascript
// Get provinces
const provinces = await sequelize.query(
  'SELECT * FROM vn_provinces ORDER BY name',
  { type: QueryTypes.SELECT }
)

// Get districts by province
const districts = await sequelize.query(
  'SELECT * FROM vn_districts WHERE province_code = ?',
  { replacements: [provinceCode], type: QueryTypes.SELECT }
)

// Get wards by district
const wards = await sequelize.query(
  'SELECT * FROM vn_wards WHERE district_code = ?',
  { replacements: [districtCode], type: QueryTypes.SELECT }
)
```

## 🔍 Troubleshooting

### Lỗi "Table already exists"

```bash
# Xóa seeder cụ thể
npx sequelize-cli db:seed:undo --seed 20251113000000-address-vietnam.js

# Hoặc xóa tất cả seeders
npx sequelize-cli db:seed:undo:all
```

### Lỗi "Cannot find module"

Đảm bảo bạn đã cài dependencies:

```bash
npm install
# hoặc
yarn install
```

### Lỗi database connection

Kiểm tra file `.env`:

```env
DB_HOST=mysql
DB_PORT=3306
DB_USERNAME=laplace
DB_PASSWORD=123456
DB_NAME=laplace_db
```

---

**Last Updated:** 2026-02-11  
**Version:** 1.0.0
