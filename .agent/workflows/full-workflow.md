---
description: Registry trang và chức năng - LaPlace Rental Platform
---

# 📋 FEATURE REGISTRY - LAPLACE

---

## 🛠️ TECH STACK

| Layer | Technology | Port |
|-------|------------|------|
| Server | Express.js + Sequelize + MySQL | 7201 |
| Admin | Refine + Ant Design + Vite | 7202 |
| Client | Next.js 15 + Tailwind CSS | 7203 |

---

## 📁 DIRECTORY

```
laplace/
├── server/       # Express API ✅ (19 models, 10 controllers, 13 services)
├── admin/        # Refine Admin 🚧 (34 pages, 13 legacy cần dọn)
└── client/       # Next.js Client 🚧 (34 pages scaffolded)
```

---

## 🏠 CLIENT PUBLIC PAGES (14 groups)

| Route | Page | Status |
|-------|------|--------|
| `/` | Homepage | 🚧 Design matching |
| `/tim-phong` | Tìm phòng | 🔄 Scaffolded |
| `/phong-tro/[slug]` | Chi tiết phòng trọ | 🔄 Scaffolded |
| `/can-ho/[slug]` | Căn hộ | 🔄 Scaffolded |
| `/nha-nguyen-can/[slug]` | Nhà nguyên căn | 🔄 Scaffolded |
| `/ky-tuc-xa/[slug]` | Ký túc xá | 🔄 Scaffolded |
| `/tinh-thanh/[slug]` | Theo tỉnh thành | 🔄 Scaffolded |
| `/tin-tuc` | Tin tức | 🔄 Scaffolded |
| `/tin-tuc/[slug]` | Chi tiết tin tức | 🔄 Scaffolded |
| `/video-review` | Video review | 🔄 Scaffolded |
| `/gioi-thieu` | Giới thiệu | 🔄 Scaffolded |
| `/lien-he` | Liên hệ | 🔄 Scaffolded |
| `/so-sanh` | So sánh phòng | 🔄 Scaffolded |
| `/ung-dung` | Tải ứng dụng | 🔄 Scaffolded |
| `/chinh-sach/*` | Chính sách (3 trang) | 🔄 Scaffolded |

---

## 🔐 AUTH PAGES (5 pages)

| Route | Page | Status |
|-------|------|--------|
| `/dang-nhap` | Đăng nhập | 🔄 Scaffolded |
| `/dang-ky` | Đăng ký | 🔄 Scaffolded |
| `/quen-mat-khau` | Quên mật khẩu | 🔄 Scaffolded |
| `/dat-lai-mat-khau` | Đặt lại mật khẩu | 🔄 Scaffolded |
| `/xac-thuc` | Xác thực OTP | 🔄 Scaffolded |

---

## 👤 ACCOUNT PAGES (8 pages - Protected)

| Route | Page | Status |
|-------|------|--------|
| `/tai-khoan` | Dashboard | 🔄 Scaffolded |
| `/tai-khoan/dat-phong` | Đặt phòng | 🔄 Scaffolded |
| `/tai-khoan/hop-dong` | Hợp đồng | 🔄 Scaffolded |
| `/tai-khoan/thanh-toan` | Thanh toán | 🔄 Scaffolded |
| `/tai-khoan/danh-gia` | Đánh giá | 🔄 Scaffolded |
| `/tai-khoan/yeu-thich` | Yêu thích | 🔄 Scaffolded |
| `/tai-khoan/thong-bao` | Thông báo | 🔄 Scaffolded |
| `/tai-khoan/thong-tin` | Thông tin cá nhân | 🚧 Refactoring |

---

## 🏠 LANDLORD PAGES (7 pages - Protected)

| Route | Page | Status |
|-------|------|--------|
| `/chu-tro` | Dashboard chủ trọ | 🔄 Scaffolded |
| `/chu-tro/dang-tin` | Đăng tin | 🔄 Scaffolded |
| `/chu-tro/tin-dang` | Tin đã đăng | 🔄 Scaffolded |
| `/chu-tro/yeu-cau-dat-phong` | Yêu cầu đặt phòng | 🔄 Scaffolded |
| `/chu-tro/hop-dong` | Hợp đồng | 🔄 Scaffolded |
| `/chu-tro/thu-chi` | Thu chi | 🔄 Scaffolded |
| `/chu-tro/thong-ke` | Thống kê | 🔄 Scaffolded |

---

## 🖥️ ADMIN PAGES (34 dirs, 13 legacy)

### Active Resources

| Resource | CRUD | Status |
|----------|------|--------|
| listings | ✅ Full | ✅ Active |
| users | ✅ Full | ✅ Active |
| roles | ✅ Full | ✅ Active |
| permissions | ✅ Full | ✅ Active |
| dashboard | View | ✅ Active |
| reports | ✅ Full | ✅ Active |
| posts | ✅ Full | ✅ Active |
| post-categories | ✅ Full | ✅ Active |
| post-tags | ✅ Full | ✅ Active |
| banners | ✅ Full | ✅ Active |
| media | View | ✅ Active |
| menus | ✅ Full | ✅ Active |
| settings | ✅ Full | ✅ Active |
| activity-logs | View | ✅ Active |
| locations | View | ✅ Active |
| brokers | ✅ Full | ✅ Active |
| projects | ✅ Full | ✅ Active |
| staticPages | ✅ Full | ✅ Active |
| policy-widgets | ✅ Full | ✅ Active |

### Legacy (Cần xóa)

| Resource | Status |
|----------|--------|
| products, product-categories, product-reviews | ⚠️ E-commerce legacy |
| orders, transactions | ⚠️ E-commerce legacy |
| flash-sales, coupons | ⚠️ E-commerce legacy |
| currencies, warehouses, showrooms | ⚠️ E-commerce legacy |
| categories, vip-packages, settings-user | ⚠️ E-commerce legacy |

---

## 🧩 CLIENT COMPONENTS (Thực tế)

| Directory | Components |
|-----------|------------|
| `components/accommodation/` | AccommodationCard (+ variants) |
| `components/layout/` | Header, Footer |
| `components/shared/` | 3 shared components |

---

## 📊 STATUS LEGEND

| Icon | Meaning |
|------|---------|
| ⬜ | Todo |
| 🔄 | Scaffolded (chưa implement logic) |
| 🚧 | In Progress |
| ✅ | Done |
| ⚠️ | Legacy / Cần xóa |

---

## 📚 REFERENCES

| Type | Path |
|------|------|
| Schema | `server/src/models/` (19 models) |
| API | `server/src/routes/` (8 modules) |
| Admin Pages | `admin/src/pages/` (34 dirs) |
| Client Pages | `client/src/app/` (34+ pages) |
| Tasks | `.agent/tasks.md` |

---

*Updated: 2026-02-24*
