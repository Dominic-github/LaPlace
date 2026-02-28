---
title: Dynamic Data Integration — Technical Plan
version: 1.0.0
created: 2026-02-27
spec: spec.md
---

## Architecture Overview

Stack hiện tại: Express + Sequelize + MySQL (Server) | Next.js (Client) | Refine + Vite (Admin)
Bảng VN address: `provinces` (34 tỉnh) + `wards` (phường/xã) — 2 cấp, dùng `code_name` làm slug.

## Phase 1: Fix Infrastructure & Expand Accommodations Model

### 1.1 Mở rộng Accommodations Model
Thêm columns: `bedrooms`, `bathrooms`, `deposit_months`, `status`, `province_code`, `ward_code`, `latitude`, `longitude`.
- Migration mới: `20260227000001-expand-accommodations.js`
- Update model `accommodations.js` → thêm fields + associations (belongsTo User as landlord, hasMany images/facilities/reviews)

### 1.2 Mở rộng Accommodation Service
- `getAllAccommodations(query)` → filter by type, price, area, province, sort, pagination
- `getAccommodationById(id)` → include: images, facilities, reviews (with user), landlord info
- `getFeaturedAccommodations()` → recent + high rating
- `getByType(type, query)` → filter by accommodation type

### 1.3 API mới cho Location
- Route: `/api/locations/provinces` — query provinces table, count accommodations per province
- Route: `/api/locations/provinces/:code_name` — get province + wards
- Route: `/api/locations/provinces/:code_name/wards` — list wards

## Phase 2: Posts/Blog System (sử dụng models CÓ SẴN nếu có, nếu chưa thì tạo mới)

### 2.1 Posts & PostCategories Models + Migrations
- `posts`: id, title, slug, excerpt, content, category_id, author_id, featured_image, views, read_time, is_featured, status, createdAt
- `post_categories`: id, name, slug, description
- Associations: Post belongsTo PostCategory, Post belongsTo User (author)

### 2.2 Posts API Routes
- `GET /api/posts` — list with filter by category, pagination
- `GET /api/posts/:slug` — single post detail
- `GET /api/posts/categories` — list categories

### 2.3 Seed Data
- 4 PostCategories: Kinh nghiệm, Phong thủy, Pháp luật, Tin thị trường
- 9 Posts với content đầy đủ

## Phase 3: Video Reviews

### 3.1 VideoReview Model + Migration
- `video_reviews`: id, title, slug, video_url, thumbnail, accommodation_id, province_code, duration, views, status, createdAt

### 3.2 API Routes
- `GET /api/video-reviews` — list with filter by province
- `GET /api/video-reviews/:slug` — single

### 3.3 Seed 6 video reviews

## Phase 4: Stats & Settings API

### 4.1 Stats Endpoint
- `GET /api/stats/overview` — aggregate: total accommodations, total provinces (with listings), satisfaction rate

### 4.2 Settings (đã có bảng settings + admin page)
- Đảm bảo settings chứa: company_name, company_address, hotline, email, working_hours, about_content
- `GET /api/settings/public` — trả public settings cho client

## Phase 5: Cập nhật Seed Data
- Mở rộng seed accommodations với fields mới (bedrooms, bathrooms, status, province_code)
- Thêm seed posts, post_categories, video_reviews
- Chạy lại seed

## Phase 6: Admin CRUD
- Admin CRUD cho Posts (list, create, edit, delete)
- Admin CRUD cho PostCategories
- Admin CRUD cho VideoReviews
- Sử dụng pattern Refine có sẵn

## Phase 7: Client Pages — Fetch Dynamic Data
Thay thế TẤT CẢ hardcoded data trên client với API calls:

| Trang | API Source |
|-------|-----------|
| `/` (Homepage) | `/api/accommodation?featured=true` + `/api/stats/overview` |
| `/tim-phong` | `/api/accommodation?type=&price_min=&...&page=&limit=` |
| `/phong-tro` | `/api/accommodation?type=phong_tro` |
| `/can-ho` | `/api/accommodation?type=can_ho` |
| `/nha-nguyen-can` | `/api/accommodation?type=nha_nguyen_can` |
| `/ky-tuc-xa` | `/api/accommodation?type=ky_tuc_xa` |
| `/[type]/[slug]` | `/api/accommodation/:id` |
| `/tin-tuc` | `/api/posts` |
| `/tin-tuc/bai-viet/[slug]` | `/api/posts/:slug` |
| `/tinh-thanh` | `/api/locations/provinces` |
| `/tinh-thanh/[slug]` | `/api/locations/provinces/:code_name` + `/api/accommodation?province=` |
| `/video-review` | `/api/video-reviews` |
| `/lien-he` | `/api/settings/public` |
| `/gioi-thieu` | `/api/settings/public` + `/api/stats/overview` |

## Constitution Compliance Check
- ✅ Docker-First: Tất cả chạy trong container
- ✅ No hardcode: Dùng ENV vars
- ✅ Ports 7201-7203: Không thay đổi
- ✅ PowerShell: Dùng `;` ngăn cách
