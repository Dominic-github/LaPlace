---
title: Dynamic Data Integration — Loại bỏ Hardcoded Data trên Client
status: DRAFT
version: 1.0.0
created: 2026-02-27
---

## 1. Overview

Toàn bộ trang client hiện đang sử dụng dữ liệu hardcoded (mock data, skeleton tĩnh, nội dung fix cứng). Feature này yêu cầu chuyển đổi TẤT CẢ các trang client sang sử dụng dữ liệu thực từ Server API. Nếu server thiếu API/data cần thiết, phải bổ sung model, migration, seed, API endpoint, và CRUD admin tương ứng.

## 2. User Scenarios

- **US1**: As a Guest, I want to browse accommodation listings (phòng trọ, căn hộ, nhà nguyên căn, ký túc xá) with real data so that I can see actual availability and pricing.
- **US2**: As a Guest, I want to view accommodation detail page with real images, facilities, reviews, landlord info, and pricing so that I can make an informed decision.
- **US3**: As a Guest, I want to search/filter accommodations by type, price range, area, location so that I can find relevant results.
- **US4**: As a Guest, I want to browse news/blog articles fetched from API so that I can read helpful rental tips and market info.
- **US5**: As a Guest, I want to see provinces/cities with real accommodation counts so that I can explore listings by location.
- **US6**: As a Guest, I want to view video reviews fetched from API so that I can see real property walkthroughs.
- **US7**: As a Guest, I want to see the homepage with real featured listings, real stats from API.
- **US8**: As a Guest, I want to view About/Contact pages with info pulled from site settings (not hardcoded).
- **US9**: As a Registered User, I want to see my dashboard, bookings, contracts, payments, reviews, favorites, notifications with real data from API.
- **US10**: As a Landlord, I want to manage my listings, booking requests, contracts, finances, and stats with real data from API.
- **US11**: As an Admin, I want to manage any new entities (posts/blogs, provinces, video reviews, site settings/pages) via the Admin panel CRUD.

## 3. Functional Requirements

### 3.1 Server-side (Backend API)

- **FR01**: API `GET /api/accommodation` phải hỗ trợ filter: `type`, `price_min`, `price_max`, `area_min`, `area_max`, `province`, `district`, `sort`, `page`, `limit`. Trả về pagination metadata.
- **FR02**: API `GET /api/accommodation/:id` phải include: images, facilities, reviews (with user info), landlord info. Trả about đầy đủ chi tiết.
- **FR03**: Tạo model + migration + API cho **Posts** (tin tức/blog): title, slug, excerpt, content, category, author, featured_image, views, read_time, is_featured, status, createdAt.
- **FR04**: Tạo model + migration + API cho **PostCategories**: name, slug, description.
- **FR05**: Tạo model + migration + API cho **VideoReview**: title, slug, video_url, thumbnail, accommodation_id, province, duration, views, status.
- **FR06**: API `GET /api/locations/provinces` trả về danh sách tỉnh thành kèm `accommodation_count`.
- **FR07**: API `GET /api/locations/provinces/:slug/districts` trả về danh sách quận/huyện kèm `accommodation_count`.
- **FR08**: API `GET /api/settings` phải trả về site settings (company info, contact, social links) dùng cho trang Liên hệ, Giới thiệu.
- **FR09**: API `GET /api/accommodation/featured` trả về danh sách accommodation nổi bật (cho trang chủ).
- **FR10**: API `GET /api/stats/overview` trả về thống kê tổng quan: total_accommodations, total_provinces, satisfaction_rate.

### 3.2 Seed Data

- **FR11**: Seed ≥ 9 bài viết (Posts) với đủ categories, featured flag.
- **FR12**: Seed ≥ 4 PostCategories: Kinh nghiệm, Phong thủy, Pháp luật, Tin thị trường.
- **FR13**: Seed ≥ 6 VideoReview records.
- **FR14**: Seed provinces với `slug` field (cho URL routing) — sử dụng bảng address_vietnam có sẵn.
- **FR15**: Seed site settings (nếu chưa có): company_name, company_address, hotline, email, working_hours.

### 3.3 Admin Panel CRUD

- **FR16**: Admin CRUD cho Posts (tin tức): list, create, edit, delete, toggle featured.
- **FR17**: Admin CRUD cho PostCategories.
- **FR18**: Admin CRUD cho VideoReviews.
- **FR19**: Admin page quản lý Settings nếu chưa có (contact info, about page content).

### 3.4 Client Pages (Frontend)

- **FR20**: Trang chủ (`/`): Featured listings, stats từ API. KHÔNG có dữ liệu hardcoded.
- **FR21**: Trang tìm phòng (`/tim-phong`): Kết quả từ API với filter/sort/pagination thực.
- **FR22**: Trang danh sách theo loại (`/phong-tro`, `/can-ho`, `/nha-nguyen-can`, `/ky-tuc-xa`): Fetch API filtered by type.
- **FR23**: Trang chi tiết (`/[type]/[slug]`): Fetch full detail từ API, bao gồm images, facilities, reviews, landlord.
- **FR24**: Trang tin tức (`/tin-tuc`): Fetch posts từ API, filter by category.
- **FR25**: Trang chi tiết bài viết (`/tin-tuc/bai-viet/[slug]`): Fetch single post.
- **FR26**: Trang tỉnh thành (`/tinh-thanh`): Fetch provinces + accommodation count từ API.
- **FR27**: Trang tỉnh thành chi tiết (`/tinh-thanh/[slug]`): Fetch accommodations filtered by province.
- **FR28**: Trang video review (`/video-review`): Fetch video reviews từ API.
- **FR29**: Trang liên hệ (`/lien-he`): Contact info từ settings API. Form gửi message qua API.
- **FR30**: Trang giới thiệu (`/gioi-thieu`): Stats và content từ API/settings.

## 4. Non-Functional Requirements

- **NFR01**: API response time < 2s cho tất cả public endpoints.
- **NFR02**: Client phải show loading skeleton trong khi chờ API response (hiện tại đã có skeleton, giữ nguyên pattern).
- **NFR03**: Client phải xử lý error states (API down, empty results) — hiển thị thông báo phù hợp.
- **NFR04**: Pagination mặc định 12 items/trang cho danh sách accommodations, 9 items/trang cho posts.
- **NFR05**: SEO metadata phải dynamic (từ API data), không hardcoded.
- **NFR06**: KHÔNG có bất kỳ string nội dung nào hardcode trên client ngoại trừ UI labels cố định (button text, menu items).

## 5. Success Criteria

- [ ] SC01: Tất cả 45 page files trong client đều fetch data từ API — KHÔNG còn MOCK_DATA, fake arrays, hardcoded content.
- [ ] SC02: Server có ≥ 6 API route groups mới hoặc mở rộng (accommodation+filter, posts, post-categories, video-reviews, locations, stats).
- [ ] SC03: Seed data chạy thành công với ≥ 9 posts, ≥ 4 post categories, ≥ 6 video reviews.
- [ ] SC04: Admin panel có CRUD cho Posts, PostCategories, VideoReviews.
- [ ] SC05: Trang chủ hiển thị featured listings và stats thực từ API.
- [ ] SC06: Tất cả trang danh sách có filter/sort/pagination hoạt động thực.
- [ ] SC07: Trang chi tiết accommodation hiển thị images, facilities, reviews, landlord info từ API.
- [ ] SC08: Không có lỗi runtime trên bất kỳ trang client nào khi API trả về dữ liệu.

## 6. Error Handling

- Khi API lỗi 500: Client hiển thị "Đã xảy ra lỗi, vui lòng thử lại sau" với nút retry.
- Khi API trả empty: Client hiển thị "Không tìm thấy kết quả" với gợi ý tìm kiếm.
- Khi network timeout: Client hiển thị thông báo mất kết nối.

## 7. Scope Exclusions

- Auth flow (đăng nhập, đăng ký) — đã hoạt động.
- Policy pages (điều khoản, bảo mật, hoàn tiền) — static content, chấp nhận hardcode vì là legal text.
- App download page (`/ung-dung`) — static marketing page, chấp nhận.
- So sánh page — chưa cần dynamic.
