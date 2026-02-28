---
title: Dynamic Data Integration — Tasks
version: 1.0.0
created: 2026-02-27
plan: plan.md
---

## Phase 1: Foundation — Server Models & Migrations

- [ ] T001 [P] Tạo migration mở rộng accommodations: bedrooms, bathrooms, deposit_months, status, province_code, ward_code
  - `server/src/migrations/20260227000001-expand-accommodations.js`
- [ ] T002 [P] Cập nhật model accommodations.js: thêm fields + associations (hasMany images/facilities/reviews, belongsTo User)
  - `server/src/models/accommodations.js`
- [ ] T003 [P] Tạo migration + model PostCategories
  - `server/src/migrations/20260227000002-create-post-categories.js`
  - `server/src/models/post_categories.js`
- [ ] T004 [P] Tạo migration + model Posts
  - `server/src/migrations/20260227000003-create-posts.js`
  - `server/src/models/posts.js`
- [ ] T005 [P] Tạo migration + model VideoReviews
  - `server/src/migrations/20260227000004-create-video-reviews.js`
  - `server/src/models/video_reviews.js`

## Phase 2: Foundation — Seed Data

- [ ] T006 [P] Cập nhật seed accommodations: thêm values cho fields mới (bedrooms, bathrooms, status, province_code)
  - `server/src/seeders/20260225000000-seed-demo-data.js`
- [ ] T007 [P] Thêm seed PostCategories + Posts (9 bài viết)
  - `server/src/seeders/20260227000001-seed-posts.js`
- [ ] T008 [P] Thêm seed VideoReviews (6 records)
  - `server/src/seeders/20260227000002-seed-video-reviews.js`
- [ ] T009 [P] Chạy migrations + seed trên Docker container
  - Docker exec commands

## Phase 3: Server API — Accommodation

- [ ] T010 [P] [US1,US3] Mở rộng AccommodationService: getAllAccommodations(query) với filter/sort/pagination, include associations
  - `server/src/services/accommodation.js`
- [ ] T011 [P] [US2] Mở rộng AccommodationService: getAccommodationById với include images/facilities/reviews/landlord
  - `server/src/services/accommodation.js`
- [ ] T012 [P] [US7] Thêm AccommodationService: getFeatured()
  - `server/src/services/accommodation.js`
- [ ] T013 [P] Cập nhật AccommodationController + Routes: thêm endpoints filter, featured
  - `server/src/controlers/accommodation.js`
  - `server/src/routes/accommodation/index.js`

## Phase 4: Server API — Posts, VideoReviews, Locations, Stats

- [ ] T014 [P] [US4] Tạo PostService + PostController + Routes
  - `server/src/services/post.js`
  - `server/src/controlers/post.js`
  - `server/src/routes/post/index.js`
- [ ] T015 [P] [US6] Tạo VideoReviewService + Controller + Routes
  - `server/src/services/videoReview.js`
  - `server/src/controlers/videoReview.js`
  - `server/src/routes/videoReview/index.js`
- [ ] T016 [P] [US5] Tạo LocationService + Controller + Routes (dùng bảng provinces + wards)
  - `server/src/services/location.js`
  - `server/src/controlers/location.js`
  - `server/src/routes/location/index.js`
- [ ] T017 [P] [US7] Tạo StatsController + Route: /api/stats/overview
  - `server/src/controlers/stats.js`
  - `server/src/routes/stats/index.js`
- [ ] T018 [P] Đăng ký tất cả routes mới vào routes/index.js
  - `server/src/routes/index.js`

## Phase 5: Client — Cập nhật API Service

- [ ] T019 [P] Mở rộng client api.ts: thêm locationApi, postApi, videoReviewApi, statsApi endpoints
  - `client/src/lib/api.ts`

## Phase 6: Client — Trang chủ & Tìm kiếm

- [ ] T020 [US7] Trang chủ: fetch featured listings + stats từ API
  - `client/src/app/(public)/page.tsx`
- [ ] T021 [US1,US3] Trang tìm phòng: fetch accommodations với filter/sort/pagination thực
  - `client/src/app/(public)/tim-phong/page.tsx`

## Phase 7: Client — Trang danh sách theo loại

- [ ] T022 [US1] Trang phòng trọ: fetch API type=phong_tro
  - `client/src/app/(public)/phong-tro/page.tsx`
- [ ] T023 [US1] Trang căn hộ: fetch API type=can_ho
  - `client/src/app/(public)/can-ho/page.tsx`
- [ ] T024 [US1] Trang nhà nguyên căn: fetch API type=nha_nguyen_can
  - `client/src/app/(public)/nha-nguyen-can/page.tsx`
- [ ] T025 [US1] Trang ký túc xá: fetch API type=ky_tuc_xa
  - `client/src/app/(public)/ky-tuc-xa/page.tsx`

## Phase 8: Client — Trang chi tiết

- [ ] T026 [US2] Trang chi tiết phòng trọ: fetch accommodation detail + images/facilities/reviews/landlord
  - `client/src/app/(public)/phong-tro/[slug]/page.tsx`
- [ ] T027 [US2] Trang chi tiết căn hộ/nhà nguyên căn/KTX (reuse component pattern)
  - `client/src/app/(public)/can-ho/[slug]/page.tsx`
  - `client/src/app/(public)/nha-nguyen-can/[slug]/page.tsx`
  - `client/src/app/(public)/ky-tuc-xa/[slug]/page.tsx`

## Phase 9: Client — Tin tức & Video Review

- [ ] T028 [US4] Trang tin tức: fetch posts từ API, filter by category
  - `client/src/app/(public)/tin-tuc/page.tsx`
- [ ] T029 [US4] Trang chi tiết bài viết: fetch single post
  - `client/src/app/(public)/tin-tuc/bai-viet/[slug]/page.tsx`
- [ ] T030 [US4] Trang tin tức theo category
  - `client/src/app/(public)/tin-tuc/[category]/page.tsx`
- [ ] T031 [US6] Trang video review: fetch từ API
  - `client/src/app/(public)/video-review/page.tsx`
  - `client/src/app/(public)/video-review/[slug]/page.tsx`

## Phase 10: Client — Tỉnh thành & Contact & About

- [ ] T032 [US5] Trang tỉnh thành: fetch provinces + accommodation count
  - `client/src/app/(public)/tinh-thanh/page.tsx`
- [ ] T033 [US5] Trang tỉnh thành chi tiết: fetch accommodations by province
  - `client/src/app/(public)/tinh-thanh/[slug]/page.tsx`
  - `client/src/app/(public)/tinh-thanh/[slug]/[district]/page.tsx`
- [ ] T034 [US8] Trang liên hệ: fetch contact info từ settings + form submit
  - `client/src/app/(public)/lien-he/page.tsx`
- [ ] T035 [US8] Trang giới thiệu: fetch stats + about content từ API
  - `client/src/app/(public)/gioi-thieu/page.tsx`

## Phase 11: Admin CRUD

- [ ] T036 [US11] Admin CRUD Posts: list, create, edit, delete
  - `admin/src/pages/posts/`
- [ ] T037 [US11] Admin CRUD PostCategories
  - `admin/src/pages/post-categories/`
- [ ] T038 [US11] Admin CRUD VideoReviews
  - `admin/src/pages/video-reviews/`
- [ ] T039 [US11] Đăng ký routes mới trong admin App.tsx
  - `admin/src/App.tsx`

## Phase 12: Polish

- [ ] T040 Client error handling & empty states cho tất cả pages
- [ ] T041 Verify: Không còn hardcoded data trên bất kỳ trang client nào
- [ ] T042 Test end-to-end: API → Client → Admin flow
