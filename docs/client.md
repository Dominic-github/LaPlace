# 🏠 LaPlace - Client Website Documentation

## 📝 Tổng quan

Client Website của LaPlace được xây dựng với:
- **Next.js 15** - React framework với App Router
- **React 19** - Latest stable
- **Tailwind CSS 3.4** - Utility-first CSS
- **Zustand 4.5** - State management
- **TypeScript 5** - Type safety

> **Tham khảo:** [tromoi.com](https://tromoi.com) - Chuẩn UX/UI cho website thuê trọ Việt Nam

---

## 🚀 Quick Start

### Installation

```powershell
cd client
npm install
```

### Development

```powershell
npm run dev
# Client: http://localhost:7203
```

### Build Production

```powershell
npm run build
npm start
```

---

## 📂 Cấu trúc Project

```
client/
├── src/
│   ├── app/                          # Next.js App Router
│   │   ├── (public)/                 # Public pages
│   │   │   ├── page.tsx              # 🏠 Homepage
│   │   │   │
│   │   │   ├── tim-phong/
│   │   │   │   └── page.tsx          # 🔍 Tìm phòng (Search all)
│   │   │   │
│   │   │   ├── phong-tro/            # Danh mục: Nhà trọ, phòng trọ
│   │   │   │   ├── page.tsx          # 📋 Listing phòng trọ
│   │   │   │   └── [slug]/
│   │   │   │       └── page.tsx      # 📄 Chi tiết phòng trọ
│   │   │   │
│   │   │   ├── nha-nguyen-can/       # Danh mục: Nhà nguyên căn
│   │   │   │   ├── page.tsx          # 📋 Listing nhà nguyên căn
│   │   │   │   └── [slug]/
│   │   │   │       └── page.tsx      # 📄 Chi tiết nhà nguyên căn
│   │   │   │
│   │   │   ├── can-ho/               # Danh mục: Căn hộ
│   │   │   │   ├── page.tsx          # 📋 Listing căn hộ
│   │   │   │   └── [slug]/
│   │   │   │       └── page.tsx      # 📄 Chi tiết căn hộ
│   │   │   │
│   │   │   ├── ky-tuc-xa/            # Danh mục: Ký túc xá
│   │   │   │   ├── page.tsx          # 📋 Listing KTX
│   │   │   │   └── [slug]/
│   │   │   │       └── page.tsx      # 📄 Chi tiết KTX
│   │   │   │
│   │   │   ├── tinh-thanh/           # Trang theo khu vực
│   │   │   │   ├── page.tsx          # 🗺️ Tất cả tỉnh thành
│   │   │   │   └── [slug]/
│   │   │   │       ├── page.tsx      # 📍 Listing theo tỉnh/thành
│   │   │   │       └── [district]/
│   │   │   │           └── page.tsx  # 📍 Listing theo quận/huyện
│   │   │   │
│   │   │   ├── video-review/         # Video Review thực tế
│   │   │   │   ├── page.tsx          # 🎬 Tất cả video review
│   │   │   │   └── [slug]/
│   │   │   │       └── page.tsx      # ▶️ Chi tiết video
│   │   │   │
│   │   │   ├── so-sanh/
│   │   │   │   └── page.tsx          # ⚖️ So sánh phòng
│   │   │   │
│   │   │   ├── tin-tuc/
│   │   │   │   ├── page.tsx          # 📰 Blog / Tin tức
│   │   │   │   ├── [category]/
│   │   │   │   │   └── page.tsx      # 📁 Blog theo danh mục
│   │   │   │   └── bai-viet/
│   │   │   │       └── [slug]/
│   │   │   │           └── page.tsx  # 📄 Chi tiết bài viết
│   │   │   │
│   │   │   ├── gioi-thieu/
│   │   │   │   └── page.tsx          # ℹ️ Giới thiệu
│   │   │   ├── lien-he/
│   │   │   │   └── page.tsx          # 📞 Liên hệ
│   │   │   ├── ung-dung/
│   │   │   │   └── page.tsx          # 📱 Tải ứng dụng
│   │   │   │
│   │   │   ├── chinh-sach/           # Chính sách & pháp lý
│   │   │   │   ├── page.tsx          # 📜 Tổng quan chính sách
│   │   │   │   ├── dieu-khoan/
│   │   │   │   │   └── page.tsx      # Điều khoản sử dụng
│   │   │   │   ├── bao-mat/
│   │   │   │   │   └── page.tsx      # Chính sách bảo mật
│   │   │   │   └── hoan-tien/
│   │   │   │       └── page.tsx      # Chính sách hoàn tiền
│   │   │   │
│   │   │   └── layout.tsx            # Public layout
│   │   │
│   │   ├── (auth)/                   # Auth pages
│   │   │   ├── dang-nhap/
│   │   │   │   └── page.tsx          # 🔐 Đăng nhập
│   │   │   ├── dang-ky/
│   │   │   │   └── page.tsx          # 📝 Đăng ký
│   │   │   ├── quen-mat-khau/
│   │   │   │   └── page.tsx          # 🔑 Quên mật khẩu
│   │   │   ├── dat-lai-mat-khau/
│   │   │   │   └── page.tsx          # 🔑 Đặt lại mật khẩu
│   │   │   ├── xac-thuc/
│   │   │   │   └── page.tsx          # ✅ Xác thực OTP/Email
│   │   │   └── layout.tsx            # Auth layout
│   │   │
│   │   ├── tai-khoan/                # 👤 Protected: Người thuê
│   │   │   ├── page.tsx              # Dashboard tổng quan
│   │   │   ├── dat-phong/
│   │   │   │   └── page.tsx          # 📅 Đặt phòng của tôi
│   │   │   ├── hop-dong/
│   │   │   │   └── page.tsx          # 📝 Hợp đồng
│   │   │   ├── thanh-toan/
│   │   │   │   └── page.tsx          # 💰 Thanh toán
│   │   │   ├── danh-gia/
│   │   │   │   └── page.tsx          # ⭐ Đánh giá
│   │   │   ├── yeu-thich/
│   │   │   │   └── page.tsx          # ❤️ Phòng yêu thích
│   │   │   ├── thong-bao/
│   │   │   │   └── page.tsx          # 🔔 Thông báo
│   │   │   ├── thong-tin/
│   │   │   │   └── page.tsx          # 👤 Thông tin cá nhân
│   │   │   └── layout.tsx            # Account layout
│   │   │
│   │   ├── chu-tro/                  # 🏠 Protected: Chủ trọ
│   │   │   ├── page.tsx              # Dashboard chủ trọ
│   │   │   ├── dang-tin/
│   │   │   │   ├── page.tsx          # ✏️ Đăng tin mới
│   │   │   │   └── [id]/
│   │   │   │       └── page.tsx      # ✏️ Sửa tin đăng
│   │   │   ├── tin-dang/
│   │   │   │   └── page.tsx          # 📋 Quản lý tin đăng
│   │   │   ├── yeu-cau-dat-phong/
│   │   │   │   └── page.tsx          # 📥 Yêu cầu đặt phòng
│   │   │   ├── hop-dong/
│   │   │   │   └── page.tsx          # 📝 Hợp đồng cho thuê
│   │   │   ├── thu-chi/
│   │   │   │   └── page.tsx          # 💵 Quản lý thu chi
│   │   │   ├── thong-ke/
│   │   │   │   └── page.tsx          # 📊 Thống kê
│   │   │   └── layout.tsx            # Landlord layout
│   │   │
│   │   ├── not-found.tsx             # 404 Page
│   │   ├── error.tsx                 # Error Page
│   │   ├── loading.tsx               # Loading Page
│   │   ├── sitemap.ts                # Dynamic Sitemap
│   │   ├── robots.ts                 # Robots.txt
│   │   ├── layout.tsx                # Root layout
│   │   └── globals.css               # Global styles
│   │
│   ├── components/
│   │   ├── ui/                       # UI primitives
│   │   │   ├── Button.tsx
│   │   │   ├── Input.tsx
│   │   │   ├── Select.tsx
│   │   │   ├── Card.tsx
│   │   │   ├── Badge.tsx
│   │   │   ├── Modal.tsx
│   │   │   ├── Tabs.tsx
│   │   │   ├── Slider.tsx
│   │   │   ├── Tooltip.tsx
│   │   │   ├── Toast.tsx
│   │   │   └── Pagination.tsx
│   │   ├── layout/                   # Layout
│   │   │   ├── Header.tsx
│   │   │   ├── Footer.tsx
│   │   │   ├── MobileNav.tsx
│   │   │   ├── CategoryNav.tsx       # Nav danh mục (Phòng trọ, Nhà NC, Căn hộ, KTX)
│   │   │   ├── AccountSidebar.tsx
│   │   │   └── LandlordSidebar.tsx   # Sidebar chủ trọ
│   │   ├── accommodation/            # Accommodation components
│   │   │   ├── AccommodationCard.tsx
│   │   │   ├── AccommodationGrid.tsx
│   │   │   ├── AccommodationFilter.tsx
│   │   │   ├── AccommodationGallery.tsx
│   │   │   ├── AccommodationSpecs.tsx
│   │   │   ├── AccommodationMap.tsx
│   │   │   └── AccommodationCompare.tsx  # So sánh
│   │   ├── booking/                  # Booking components
│   │   │   ├── BookingForm.tsx
│   │   │   ├── BookingCard.tsx
│   │   │   └── BookingStatus.tsx
│   │   ├── review/                   # Review components
│   │   │   ├── ReviewCard.tsx
│   │   │   ├── ReviewForm.tsx
│   │   │   ├── RatingStars.tsx
│   │   │   └── VideoReviewCard.tsx
│   │   ├── landlord/                 # Landlord components
│   │   │   ├── ListingForm.tsx       # Form đăng/sửa tin
│   │   │   ├── ListingCard.tsx
│   │   │   ├── RevenueChart.tsx
│   │   │   └── BookingRequestCard.tsx
│   │   └── shared/                   # Shared components
│   │       ├── SearchBar.tsx
│   │       ├── Breadcrumbs.tsx
│   │       ├── LoadingSpinner.tsx
│   │       ├── EmptyState.tsx
│   │       ├── ShareButtons.tsx
│   │       ├── FavoriteButton.tsx
│   │       ├── NotificationBell.tsx
│   │       ├── ProvinceSelector.tsx  # Chọn tỉnh/quận/phường
│   │       └── ImageUploader.tsx
│   ├── lib/
│   │   ├── api.ts                    # API client
│   │   ├── utils.ts                  # Utility functions
│   │   ├── constants.ts              # Constants
│   │   ├── validators.ts             # Form validation
│   │   └── seo.ts                    # SEO helpers
│   ├── hooks/
│   │   ├── useAuth.ts
│   │   ├── useAccommodations.ts
│   │   ├── useBooking.ts
│   │   ├── useFavorites.ts
│   │   ├── useNotifications.ts
│   │   ├── useCompare.ts
│   │   └── useDebounce.ts
│   └── store/
│       ├── authStore.ts              # Auth state
│       ├── bookingStore.ts           # Booking state
│       ├── filterStore.ts            # Filter state
│       ├── favoriteStore.ts          # Favorites state
│       ├── compareStore.ts           # Compare state
│       └── notificationStore.ts      # Notification state
├── public/
│   ├── images/
│   └── icons/
├── tailwind.config.ts
├── next.config.js
├── tsconfig.json
└── package.json
```

---

## 🎯 Pages & Features

### 1️⃣ **Homepage** (`/`)

**Sections:**

1. **Hero Section**
   - Background image/video
   - Main heading: "Tìm phòng trọ lý tưởng"
   - Search bar (Location, Price range, Date)
   - CTA button: "Tìm ngay"

2. **Featured Accommodations**
   - Title: "Phòng trọ nổi bật"
   - Grid 3-4 cards
   - Button: "Xem tất cả"

3. **How It Works**
   - Step 1: Tìm phòng
   - Step 2: Đặt phòng
   - Step 3: Nhận phòng

4. **Why Choose Us**
   - Icon cards (4 items):
     - ✅ Xác minh chủ nhà
     - ✅ Hợp đồng rõ ràng
     - ✅ Thanh toán an toàn
     - ✅ Hỗ trợ 24/7

5. **Latest News**
   - 3 bài viết mới nhất
   - Button: "Xem tất cả tin tức"

6. **Testimonials**
   - Slider với đánh giá từ khách hàng

---

### 2️⃣ **Search Page** (`/tim-phong`)

**Layout:**

```
┌────────────────────────────────────┐
│ Breadcrumbs                        │
├──────────┬─────────────────────────┤
│          │ Sort Bar (Price, Area)  │
│ Filter   ├─────────────────────────┤
│ Sidebar  │                         │
│          │  Accommodation Grid     │
│ - Price  │  (3 columns)            │
│ - Area   │                         │
│ - Rooms  │                         │
│ - Facil. │                         │
│          │                         │
│          ├─────────────────────────┤
│          │ Pagination              │
└──────────┴─────────────────────────┘
```

**Filter Options:**

- **Giá:** Slider (0 - 20M)
- **Diện tích:** Slider (0 - 100m²)
- **Số phòng ngủ:** Checkboxes (1, 2, 3, 4+)
- **Số phòng tắm:** Checkboxes (1, 2, 3+)
- **Tiện nghi:** Checkboxes (WiFi, Điều hòa, Bếp, ...)
- **Tỉnh/Thành:** Select dropdown

**Sort Options:**

- Mới nhất
- Giá thấp đến cao
- Giá cao đến thấp
- Diện tích tăng dần
- Diện tích giảm dần

**Accommodation Grid:**

- Responsive: 3 cols (desktop), 2 cols (tablet), 1 col (mobile)
- AccommodationCard for each item

---

### 3️⃣ **Accommodation Detail** (`/phong-tro/[slug]`)

**Layout:**

1. **Image Gallery**
   - Main image (large)
   - Thumbnails (4-5 images)
   - Lightbox on click

2. **Accommodation Info**
   - Title (H1)
   - Address (with map icon)
   - Price (large, bold)
   - Area, Bedrooms, Bathrooms (icons)
   - Status badge (Available, Occupied)

3. **Action Buttons**
   - **Đặt phòng ngay** (Primary button)
   - **Liên hệ chủ nhà** (Secondary button)
   - **Yêu thích** (Heart icon)

4. **Tabs Section**
   - **Mô tả** - Rich text description
   - **Tiện nghi** - Facilities list with icons
   - **Vị trí** - Google Maps embed
   - **Đánh giá** - Reviews list

5. **Booking Form (Sticky Sidebar)**
   - Check-in / Check-out date picker
   - Number of guests
   - Total price calculation
   - "Đặt phòng" button

6. **Reviews Section**
   - Average rating (stars + number)
   - Review list (5 latest)
   - "Xem tất cả đánh giá" link

7. **Related Accommodations**
   - Carousel/Grid (4 items)
   - Same province or similar price

---

### 4️⃣ **Booking Flow** (`/dat-phong`)

**Step 1: Accommodation Selection**
- Already done on detail page

**Step 2: Booking Form**
- Accommodation summary (image, title, price)
- Date selection (Check-in, Check-out)
- Number of guests
- Special requests (textarea)

**Step 3: User Info**
- If logged in: Auto-fill
- If guest: Form (Name, Email, Phone)

**Step 4: Review & Confirm**
- Accommodation summary
- Booking details
- Total price
- Terms & conditions checkbox
- "Xác nhận đặt phòng" button

**Step 5: Success**
- Success message
- Booking ID
- Next steps
- "Xem đặt phòng" button → `/tai-khoan/dat-phong`

---

### 5️⃣ **News List** (`/tin-tuc`)

**Layout:**

- Breadcrumbs
- Filter by category (tabs)
- Grid 3 columns (responsive)
- Each card:
  - Thumbnail image
  - Category badge
  - Title
  - Excerpt (2 lines)
  - Date
  - "Đọc thêm" link
- Pagination

---

### 6️⃣ **News Detail** (`/tin-tuc/[slug]`)

**Layout:**

1. **Header**
   - Title (H1)
   - Category badge
   - Date, Author
   - Share buttons (Facebook, Twitter)

2. **Featured Image**

3. **Content**
   - Rich text (HTML)
   - Table of contents (sticky sidebar)

4. **Related Posts**
   - 3 posts (same category)

---

### 7️⃣ **About Page** (`/gioi-thieu`)

**Sections:**

- Company intro
- Mission & Vision
- Team members
- Contact info

---

### 8️⃣ **Contact Page** (`/lien-he`)

**Layout:**

1. **Contact Form**
   - Name, Email, Phone
   - Subject
   - Message
   - Submit button

2. **Contact Info**
   - Address
   - Phone
   - Email
   - Working hours

3. **Map**
   - Google Maps embed

---

### 9️⃣ **Auth Pages**

#### Login (`/dang-nhap`)

**Form:**

- Email
- Password
- "Ghi nhớ đăng nhập" checkbox
- "Quên mật khẩu?" link
- "Đăng nhập" button
- "Hoặc đăng nhập bằng" - Social buttons (Google, Facebook)
- "Chưa có tài khoản? Đăng ký" link

---

#### Register (`/dang-ky`)

**Form:**

- First Name
- Last Name
- Email
- Phone
- Password
- Confirm Password
- Chọn loại tài khoản: "Người thuê" / "Chủ trọ"
- "Tôi đồng ý với Điều khoản" checkbox
- "Đăng ký" button
- "Đã có tài khoản? Đăng nhập" link

---

#### Quên mật khẩu (`/quen-mat-khau`)

**Form:**

- Email
- "Gửi link đặt lại mật khẩu" button
- Success: "Vui lòng kiểm tra email"
- Link: "Quay về đăng nhập"

---

#### Đặt lại mật khẩu (`/dat-lai-mat-khau`)

- Token validation từ URL params
- New password
- Confirm password
- "Đặt lại mật khẩu" button
- Redirect to login on success

---

#### Xác thực OTP (`/xac-thuc`)

- 6 digit OTP input (ref tromoi.com)
- Timer countdown (60s)
- "Gửi lại mã" button
- Auto-verify on complete

---

### 🔟 **Account Pages - Người thuê** (Protected)

**Sidebar Navigation:**

- 📊 Tổng quan
- 📅 Đặt phòng của tôi
- 📝 Hợp đồng
- 💰 Thanh toán
- ⭐ Đánh giá
- ❤️ Phòng yêu thích
- � Thông báo
- �👤 Thông tin cá nhân
- 🚪 Đăng xuất

---

#### Account Dashboard (`/tai-khoan`)

**Widgets:**

1. **User Info Card**
   - Avatar
   - Name
   - Email
   - "Chỉnh sửa" button

2. **Quick Stats** (4 cards)
   - Tổng đặt phòng
   - Hợp đồng đang hoạt động
   - Đánh giá đã viết
   - Phòng yêu thích

3. **Recent Bookings** (Table)
   - 5 latest bookings
   - Status badges
   - "Xem tất cả" link

4. **Upcoming Payments** (List)
   - Due dates
   - Amounts

---

#### My Bookings (`/tai-khoan/dat-phong`)

**Features:**

- **Filter Tabs:** All / Pending / Confirmed / Completed / Cancelled
- **Table Columns:**
  - Booking ID
  - Accommodation (image + title)
  - Check-in / Check-out
  - Total price
  - Status
  - Actions (View, Cancel)

**Booking Detail Modal:**

- Full booking info
- Accommodation details
- Payment info
- Action buttons:
  - Cancel booking (if status = Pending/Confirmed)
  - Write review (if status = Completed)

---

#### My Contracts (`/tai-khoan/hop-dong`)

**Features:**

- **Filter:** Active / Expired / Terminated
- **Table Columns:**
  - Contract ID
  - Accommodation
  - Start / End date
  - Monthly rent
  - Status
  - Actions (View, Download)

**Contract Detail Modal:**

- Contract info
- Terms
- PDF preview/download

---

#### My Payments (`/tai-khoan/thanh-toan`)

**Features:**

- **Filter:** Pending / Completed / Failed
- **Table Columns:**
  - Payment ID
  - Booking/Contract
  - Amount
  - Method
  - Status
  - Date
  - Actions (View, Receipt)

---

#### My Reviews (`/tai-khoan/danh-gia`)

**Features:**

- List of reviews written by user
- Each review card:
  - Accommodation (image + title)
  - Rating (stars)
  - Comment
  - Date
  - Edit/Delete buttons

---

#### My Favorites (`/tai-khoan/yeu-thich`)

**Features:**

- Grid 3 cols (responsive)
- Accommodation cards (same as listing)
- Remove from favorites (heart toggle)
- Empty state: "Bạn chưa lưu phòng nào"
- Link: "Tìm phòng ngay →"

---

#### Notifications (`/tai-khoan/thong-bao`)

**Features:**

- **Filter Tabs:** Tất cả / Chưa đọc / Đặt phòng / Thanh toán / Hệ thống
- Notification list:
  - Icon (by type)
  - Title
  - Message
  - Time (relative: "2 giờ trước")
  - Read/Unread indicator
  - Click → navigate to detail
- "Đánh dấu tất cả đã đọc" button
- Real-time updates (Socket.io / SSE)

---

#### Profile Settings (`/tai-khoan/thong-tin`)

**Tabs:**

1. **Thông tin cá nhân**
   - Avatar upload
   - First Name, Last Name
   - Email (readonly)
   - Phone
   - CCCD/CMND (xác thực danh tính)
   - "Cập nhật" button

2. **Đổi mật khẩu**
   - Current password
   - New password
   - Confirm password
   - "Đổi mật khẩu" button

3. **Thông báo**
   - Email notifications (checkboxes):
     - Booking confirmation
     - Payment reminders
     - Promotions
   - Push notifications (toggle)
   - "Lưu" button

---

### 1️⃣1️⃣ **Landlord/Chủ trọ Pages** (Protected - Role: Landlord)

**Sidebar Navigation:**

- 📊 Tổng quan
- ✏️ Đăng tin mới
- 📋 Tin đăng của tôi
- 📥 Yêu cầu đặt phòng
- 📝 Hợp đồng cho thuê
- 💵 Quản lý thu chi
- 📊 Thống kê
- 👤 Thông tin cá nhân
- 🚪 Đăng xuất

---

#### Landlord Dashboard (`/chu-tro`)

**Widgets:**

1. **Quick Stats** (4 cards)
   - Tổng phòng đang cho thuê
   - Phòng trống
   - Yêu cầu đặt phòng mới
   - Doanh thu tháng này

2. **Revenue Chart**
   - Line chart (6 months)
   - Monthly breakdown

3. **Recent Booking Requests**
   - 5 latest requests
   - Status: Pending / Approved / Rejected
   - Quick action: Approve / Reject

4. **Occupancy Rate**
   - Donut chart
   - Occupied vs Available

---

#### Đăng tin mới (`/chu-tro/dang-tin`)

**Form Steps:**

**Step 1: Loại hình**
- Chọn loại: Phòng trọ / Nhà nguyên căn / Căn hộ / KTX
- Tiêu đề tin đăng

**Step 2: Thông tin cơ bản**
- Diện tích (m²)
- Số phòng ngủ
- Số phòng tắm
- Giá thuê (VNĐ/tháng)
- Đặt cọc (VNĐ)
- Hướng nhà (Đông/Tây/Nam/Bắc)

**Step 3: Địa chỉ**
- Tỉnh/Thành phố (Select - linked)
- Quận/Huyện (Select - linked)
- Phường/Xã (Select - linked)
- Số nhà, đường (Text input)
- Pin vị trí trên bản đồ (Google Maps)

**Step 4: Tiện nghi**
- Checkboxes grid:
  - WiFi, Điều hòa, Nóng lạnh, Giường, Tủ, Bàn ghế
  - Bếp, Máy giặt, Tủ lạnh, Ban công, Thang máy
  - Gác lửng, Chỗ để xe, Camera an ninh, Thú cưng OK
  - Tự do giờ giấc, Chính chủ, Có video review

**Step 5: Hình ảnh & Video**
- Upload ảnh (tối đa 10, kéo thả, reorder)
- Upload video review (tối đa 1, dưới 60s)
- Ảnh đại diện (chọn từ ảnh đã upload)

**Step 6: Mô tả**
- Rich text editor (bold, italic, list)
- Template gợi ý mô tả

**Step 7: Xem trước & Đăng**
- Preview tin đăng (giống giao diện thật)
- "Đăng tin" / "Lưu nháp" button

---

#### Quản lý tin đăng (`/chu-tro/tin-dang`)

**Features:**

- **Filter Tabs:** Tất cả / Đang hiển thị / Hết hạn / Nháp / Bị ẩn
- **Table/Cards:**
  - Image thumbnail
  - Title
  - Giá
  - Lượt xem
  - Lượt liên hệ
  - Trạng thái
  - Ngày đăng / Ngày hết hạn
  - Actions: Sửa / Ẩn / Gia hạn / Xóa

---

#### Yêu cầu đặt phòng (`/chu-tro/yeu-cau-dat-phong`)

**Features:**

- **Filter:** Pending / Approved / Rejected / All
- **Request Cards:**
  - Thông tin người thuê (avatar, name, phone)
  - Phòng yêu cầu
  - Ngày muốn vào ở
  - Tin nhắn
  - Actions: Duyệt / Từ chối / Liên hệ

---

#### Hợp đồng cho thuê (`/chu-tro/hop-dong`)

**Features:**

- Danh sách hợp đồng
- Tạo hợp đồng mới (từ booking đã duyệt)
- Template hợp đồng
- Trạng thái: Active / Expired / Terminated
- Xuất PDF

---

#### Quản lý thu chi (`/chu-tro/thu-chi`)

**Features:**

- **Income (Thu):**
  - Tiền thuê hàng tháng
  - Tiền cọc
  - Chi phí dịch vụ
- **Expense (Chi):**
  - Sửa chữa
  - Bảo trì
  - Thuế
- **Summary:** Lãi/lỗ tháng
- **Export:** CSV / Excel

---

#### Thống kê chủ trọ (`/chu-tro/thong-ke`)

**Charts:**

1. **Doanh thu** - Line chart (12 tháng)
2. **Công suất thuê** - Donut chart
3. **Nguồn khách** - Pie chart
4. **Top phòng được xem nhiều** - Bar chart
5. **Tổng quan:** Tổng doanh thu, Phòng trống, Khách thuê

---

### 1️⃣2️⃣ **Category Listing Pages** (Tham khảo TroMoi)

#### Nhà trọ, phòng trọ (`/phong-tro`)

**Layout giống tromoi.com/phong-tro:**

- **Header:** "Tìm nhà trọ, phòng trọ giá rẻ"
- **Filter Bar (horizontal):**
  - Tỉnh/Thành phố (dropdown)
  - Quận/Huyện (dropdown)
  - Mức giá: Dưới 1tr / 1-3tr / 3-5tr / 5-10tr / Trên 10tr
  - Diện tích: Dưới 20m² / 20-40m² / 40-60m² / Trên 60m²
- **Listing Grid:**
  - Card with: Image, Title, Address, Price, Area, Facilities icons
  - Badges: "Mới", "Video Review", "Chính chủ"
- **Pagination**
- **SEO Content:** Bottom section mô tả về thuê phòng trọ

---

#### Nhà nguyên căn (`/nha-nguyen-can`)

**Tương tự `/phong-tro` nhưng filter thêm:**
- Số tầng
- Diện tích đất
- Mặt tiền / Hẻm

---

#### Căn hộ (`/can-ho`)

**Tương tự `/phong-tro` nhưng filter thêm:**
- Tên tòa nhà / Chung cư
- Tầng
- Full nội thất / Nội thất cơ bản / Không nội thất

---

#### Ký túc xá (`/ky-tuc-xa`)

**Tương tự `/phong-tro` nhưng filter thêm:**
- Giới tính: Nam / Nữ / Chung
- Gần trường: Dropdown trường ĐH
- Loại giường: Giường tầng / Giường đơn

---

### 1️⃣3️⃣ **Location Pages** (Tham khảo TroMoi)

#### Tất cả tỉnh thành (`/tinh-thanh`)

**Sections:**

1. **Tỉnh thành nổi bật** (Grid cards)
   - Hồ Chí Minh, Hà Nội, Đà Nẵng, Bình Dương, Huế, Cần Thơ
   - Mỗi card: Image, Name, Số lượng phòng

2. **Tất cả tỉnh thành** (Alphabetical list, grouped)
   - Link tới `/tinh-thanh/[slug]`

---

#### Listing theo tỉnh (`/tinh-thanh/[slug]`)

**Layout:**

- **Header:** "Cho thuê phòng trọ tại {Tỉnh/Thành phố}"
- **Sub-navigation:** Tabs theo loại hình (Tất cả / Phòng trọ / Nhà NC / Căn hộ / KTX)
- **Quận/Huyện Hot:** Tags/chips
- **Listing Grid:** Same as category pages
- **SEO Content:** Bottom section

---

#### Listing theo quận (`/tinh-thanh/[tinh]/[quan]`)

- **Header:** "Cho thuê phòng trọ tại {Quận}, {Tỉnh}"
- **Phường/Xã Hot:** Tags/chips  
- **Listing Grid**
- **Related:** Quận lân cận

---

### 1️⃣4️⃣ **Video Review** (`/video-review`) - Tham khảo TroMoi

**Layout:**

- **Header:** "Trải nghiệm trọ mới tại các tỉnh thành"
- **Filter Tabs:** Tất cả / HCM / Hà Nội / Đà Nẵng / ...
- **Video Grid:**
  - Thumbnail with play icon overlay
  - Duration badge
  - Title
  - Address
  - Price
  - View count
- **Pagination**

---

#### Video Detail (`/video-review/[slug]`)

- Video player (embed YouTube/Vimeo hoặc self-hosted)
- Accommodation info (link to detail page)
- Gallery ảnh bổ sung
- Related videos
- "Liên hệ chủ nhà" CTA

---

### 1️⃣5️⃣ **So sánh phòng** (`/so-sanh`)

**Features:**

- Tối đa 3 phòng so sánh
- Table comparison:
  - Ảnh
  - Tên phòng
  - Giá
  - Diện tích
  - Số phòng ngủ / phòng tắm
  - Tiện nghi (tick/cross)
  - Đánh giá
  - Link chi tiết
- "Thêm phòng để so sánh" button
- Floating compare bar (bottom)

---

### 1️⃣6️⃣ **Policy / Legal Pages**

#### Điều khoản sử dụng (`/chinh-sach/dieu-khoan`)
- Rich text content
- Table of contents (sidebar)

#### Chính sách bảo mật (`/chinh-sach/bao-mat`)
- Data collection
- Data usage
- Cookies
- User rights

#### Chính sách hoàn tiền (`/chinh-sach/hoan-tien`)
- Refund conditions
- Process & timeline

---

### 1️⃣7️⃣ **Trang Ứng dụng** (`/ung-dung`)

**Sections (tham khảo tromoi.com/ung-dung):**

1. **Hero:** App screenshot + "Tải ứng dụng ngay"
2. **Features:**
   - Kết nối người thuê và chủ trọ
   - Quản lý hợp đồng online
   - Nhận hóa đơn điện tử
   - Báo cáo sự cố
   - Nhắn tin trực tiếp
3. **Download buttons:** App Store + Google Play
4. **QR Code**

---

### 1️⃣8️⃣ **Error Pages**

#### 404 Not Found (`not-found.tsx`)

- Illustration
- "Trang bạn tìm không tồn tại"
- Search bar
- "Về trang chủ" button
- Suggested links

#### Error Page (`error.tsx`)

- "Đã xảy ra lỗi"
- "Thử lại" button
- "Về trang chủ" link

---

## 🎨 UI Components

### AccommodationCard

```tsx
interface AccommodationCardProps {
  id: number;
  title: string;
  address: string;
  price: number;
  area: number;
  bedrooms: number;
  bathrooms: number;
  image: string;
  status: 'available' | 'occupied';
  featured?: boolean;
}
```

**Render:**

```tsx
<div className="accommodation-card">
  <img src={image} alt={title} />
  {featured && <Badge>Nổi bật</Badge>}
  <h3>{title}</h3>
  <p>{address}</p>
  <div className="specs">
    <span>{area} m²</span>
    <span>{bedrooms} PN</span>
    <span>{bathrooms} PT</span>
  </div>
  <div className="price">{price.toLocaleString()} VNĐ/tháng</div>
  <Link href={`/phong-tro/${id}`}>Xem chi tiết</Link>
</div>
```

---

### BookingForm

```tsx
interface BookingFormProps {
  accommodationId: number;
  price: number;
  onSubmit: (data: BookingData) => void;
}
```

**Fields:**

- Check-in date (DatePicker)
- Check-out date (DatePicker)
- Number of guests (Number input)
- Special requests (Textarea)

**Auto-calculate:**

- Duration (days)
- Total price = `price * duration`

---

### RatingStars

```tsx
interface RatingStarsProps {
  rating: number; // 1-5
  size?: 'sm' | 'md' | 'lg';
  interactive?: boolean;
  onChange?: (rating: number) => void;
}
```

**Render:**

- 5 stars
- Filled stars up to `rating`
- If `interactive`, allow click to change rating

---

### SearchBar

```tsx
interface SearchBarProps {
  onSearch: (params: SearchParams) => void;
}

interface SearchParams {
  location: string;
  minPrice: number;
  maxPrice: number;
  checkIn?: Date;
  checkOut?: Date;
}
```

**Layout:**

```
┌─────────────────────────────────────────────┐
│ [Location] | [Price] | [Date] | [Tìm kiếm] │
└─────────────────────────────────────────────┘
```

---

## 🔐 Authentication

### Auth State (Zustand)

```typescript
// store/authStore.ts
interface AuthState {
  user: User | null;
  token: string | null;
  isAuthenticated: boolean;
  login: (email: string, password: string) => Promise<void>;
  register: (data: RegisterData) => Promise<void>;
  logout: () => void;
  updateProfile: (data: Partial<User>) => Promise<void>;
}
```

---

### Protected Routes

```tsx
// middleware.ts
export function middleware(request: NextRequest) {
  const token = request.cookies.get('token');
  
  if (request.nextUrl.pathname.startsWith('/tai-khoan')) {
    if (!token) {
      return NextResponse.redirect(new URL('/dang-nhap', request.url));
    }
  }
  
  return NextResponse.next();
}
```

---

## 📡 API Client

### Setup

```typescript
// lib/api.ts
import axios from 'axios';

const api = axios.create({
  baseURL: process.env.NEXT_PUBLIC_API_URL,
  headers: {
    'Content-Type': 'application/json',
  },
});

// Request interceptor (add token)
api.interceptors.request.use((config) => {
  const token = localStorage.getItem('token');
  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
  }
  return config;
});

// Response interceptor (handle errors)
api.interceptors.response.use(
  (response) => response,
  (error) => {
    if (error.response?.status === 401) {
      // Redirect to login
      window.location.href = '/dang-nhap';
    }
    return Promise.reject(error);
  }
);

export default api;
```

---

### API Methods

```typescript
// lib/api.ts

// Accommodations
export const accommodationApi = {
  getAll: (params) => api.get('/accommodations', { params }),
  getById: (id) => api.get(`/accommodations/${id}`),
  getBySlug: (slug) => api.get(`/accommodations/slug/${slug}`),
  getByCategory: (category, params) => api.get(`/accommodations/category/${category}`, { params }),
  getByLocation: (provinceSlug, params) => api.get(`/accommodations/location/${provinceSlug}`, { params }),
  compare: (ids) => api.get('/accommodations/compare', { params: { ids: ids.join(',') } }),
};

// Auth
export const authApi = {
  login: (data) => api.post('/auth/login', data),
  register: (data) => api.post('/auth/register', data),
  me: () => api.get('/auth/me'),
  forgotPassword: (email) => api.post('/auth/forgot-password', { email }),
  resetPassword: (data) => api.post('/auth/reset-password', data),
  verifyOTP: (data) => api.post('/auth/verify-otp', data),
  resendOTP: (email) => api.post('/auth/resend-otp', { email }),
};

// Bookings
export const bookingApi = {
  create: (data) => api.post('/bookings', data),
  getMyBookings: (params) => api.get('/bookings/me', { params }),
  getById: (id) => api.get(`/bookings/${id}`),
  cancel: (id) => api.patch(`/bookings/${id}/cancel`),
};

// Contracts
export const contractApi = {
  getMyContracts: (params) => api.get('/contracts/me', { params }),
  getById: (id) => api.get(`/contracts/${id}`),
  downloadPDF: (id) => api.get(`/contracts/${id}/pdf`, { responseType: 'blob' }),
};

// Payments
export const paymentApi = {
  getMyPayments: (params) => api.get('/payments/me', { params }),
  getById: (id) => api.get(`/payments/${id}`),
  downloadReceipt: (id) => api.get(`/payments/${id}/receipt`, { responseType: 'blob' }),
};

// Reviews
export const reviewApi = {
  getByAccommodation: (accommodationId, params) => api.get(`/reviews/accommodation/${accommodationId}`, { params }),
  getMyReviews: () => api.get('/reviews/me'),
  create: (data) => api.post('/reviews', data),
  update: (id, data) => api.put(`/reviews/${id}`, data),
  delete: (id) => api.delete(`/reviews/${id}`),
};

// Favorites
export const favoriteApi = {
  getMyFavorites: () => api.get('/favorites/me'),
  add: (accommodationId) => api.post('/favorites', { accommodationId }),
  remove: (accommodationId) => api.delete(`/favorites/${accommodationId}`),
  check: (accommodationId) => api.get(`/favorites/check/${accommodationId}`),
};

// Notifications
export const notificationApi = {
  getAll: (params) => api.get('/notifications', { params }),
  markAsRead: (id) => api.patch(`/notifications/${id}/read`),
  markAllAsRead: () => api.patch('/notifications/read-all'),
  getUnreadCount: () => api.get('/notifications/unread-count'),
};

// Locations
export const locationApi = {
  getProvinces: () => api.get('/locations/provinces'),
  getDistricts: (provinceId) => api.get(`/locations/provinces/${provinceId}/districts`),
  getWards: (districtId) => api.get(`/locations/districts/${districtId}/wards`),
  getProvinceBySlug: (slug) => api.get(`/locations/provinces/slug/${slug}`),
};

// Blog / News
export const blogApi = {
  getAll: (params) => api.get('/posts', { params }),
  getBySlug: (slug) => api.get(`/posts/slug/${slug}`),
  getCategories: () => api.get('/post-categories'),
  getByCategory: (categorySlug, params) => api.get(`/posts/category/${categorySlug}`, { params }),
};

// Video Reviews
export const videoReviewApi = {
  getAll: (params) => api.get('/video-reviews', { params }),
  getBySlug: (slug) => api.get(`/video-reviews/slug/${slug}`),
};

// Landlord APIs
export const landlordApi = {
  // Listings
  createListing: (data) => api.post('/landlord/listings', data),
  updateListing: (id, data) => api.put(`/landlord/listings/${id}`, data),
  deleteListing: (id) => api.delete(`/landlord/listings/${id}`),
  getMyListings: (params) => api.get('/landlord/listings', { params }),
  toggleVisibility: (id) => api.patch(`/landlord/listings/${id}/toggle`),
  
  // Booking Requests
  getBookingRequests: (params) => api.get('/landlord/booking-requests', { params }),
  approveBooking: (id) => api.patch(`/landlord/booking-requests/${id}/approve`),
  rejectBooking: (id) => api.patch(`/landlord/booking-requests/${id}/reject`),
  
  // Contracts
  getContracts: (params) => api.get('/landlord/contracts', { params }),
  createContract: (data) => api.post('/landlord/contracts', data),
  
  // Finance
  getFinanceSummary: (params) => api.get('/landlord/finance/summary', { params }),
  addExpense: (data) => api.post('/landlord/finance/expenses', data),
  
  // Stats
  getStats: () => api.get('/landlord/stats'),
  getRevenueChart: (params) => api.get('/landlord/stats/revenue', { params }),
  getOccupancyRate: () => api.get('/landlord/stats/occupancy'),
};

// Contact
export const contactApi = {
  sendMessage: (data) => api.post('/contact', data),
};
```

---

## 🎨 Tailwind Configuration

```typescript
// tailwind.config.ts
export default {
  theme: {
    extend: {
      colors: {
        primary: {
          DEFAULT: '#3498db',
          dark: '#2980b9',
        },
        success: '#27ae60',
        warning: '#f39c12',
        danger: '#e74c3c',
      },
      fontFamily: {
        sans: ['Inter', 'sans-serif'],
      },
    },
  },
  plugins: [],
};
```

---

## 📱 Responsive Design

### Breakpoints

```css
/* Mobile: < 640px */
/* Tablet: 640px - 1024px */
/* Desktop: >= 1024px */
```

**Usage:**

```tsx
<div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
  {accommodations.map(item => <AccommodationCard {...item} />)}
</div>
```

---

## 🚀 Performance Optimization

### Image Optimization

```tsx
import Image from 'next/image';

<Image
  src={accommodation.image}
  alt={accommodation.title}
  width={400}
  height={300}
  placeholder="blur"
  blurDataURL="/placeholder.jpg"
/>
```

---

### Code Splitting

```tsx
import dynamic from 'next/dynamic';

const Map = dynamic(() => import('@/components/Map'), {
  ssr: false,
  loading: () => <LoadingSpinner />,
});
```

---

### Caching

```tsx
// app/phong-tro/[slug]/page.tsx
export const revalidate = 3600; // Revalidate every hour

export async function generateStaticParams() {
  const accommodations = await fetch('https://api/accommodations').then(r => r.json());
  return accommodations.map(item => ({ slug: item.slug }));
}
```

---

## 🧪 Testing

### Unit Test Example

```tsx
// __tests__/AccommodationCard.test.tsx
import { render, screen } from '@testing-library/react';
import AccommodationCard from '@/components/accommodation/AccommodationCard';

test('renders accommodation card', () => {
  const props = {
    title: 'Phòng trọ test',
    price: 3000000,
    // ... other props
  };
  
  render(<AccommodationCard {...props} />);
  expect(screen.getByText('Phòng trọ test')).toBeInTheDocument();
  expect(screen.getByText('3,000,000 VNĐ/tháng')).toBeInTheDocument();
});
```

---

## 📄 SEO Optimization

### Metadata

```tsx
// app/phong-tro/[slug]/page.tsx
export async function generateMetadata({ params }) {
  const accommodation = await getAccommodation(params.slug);
  
  return {
    title: `${accommodation.title} - LaPlace`,
    description: accommodation.description,
    openGraph: {
      images: [accommodation.image],
    },
  };
}
```

---

### Sitemap

```typescript
// app/sitemap.ts
export default async function sitemap() {
  const accommodations = await fetch(`${API_URL}/accommodations`).then(r => r.json());
  const provinces = await fetch(`${API_URL}/locations/provinces`).then(r => r.json());
  const posts = await fetch(`${API_URL}/posts`).then(r => r.json());

  return [
    // Static pages
    { url: 'https://laplace.vn', lastModified: new Date() },
    { url: 'https://laplace.vn/tim-phong', lastModified: new Date() },
    { url: 'https://laplace.vn/phong-tro', lastModified: new Date() },
    { url: 'https://laplace.vn/nha-nguyen-can', lastModified: new Date() },
    { url: 'https://laplace.vn/can-ho', lastModified: new Date() },
    { url: 'https://laplace.vn/ky-tuc-xa', lastModified: new Date() },
    { url: 'https://laplace.vn/video-review', lastModified: new Date() },
    { url: 'https://laplace.vn/tinh-thanh', lastModified: new Date() },
    { url: 'https://laplace.vn/tin-tuc', lastModified: new Date() },
    { url: 'https://laplace.vn/gioi-thieu', lastModified: new Date() },
    { url: 'https://laplace.vn/lien-he', lastModified: new Date() },
    { url: 'https://laplace.vn/ung-dung', lastModified: new Date() },
    { url: 'https://laplace.vn/chinh-sach/dieu-khoan', lastModified: new Date() },
    { url: 'https://laplace.vn/chinh-sach/bao-mat', lastModified: new Date() },

    // Dynamic: Accommodations
    ...accommodations.map(item => ({
      url: `https://laplace.vn/phong-tro/${item.slug}`,
      lastModified: new Date(item.updatedAt),
    })),

    // Dynamic: Provinces
    ...provinces.map(item => ({
      url: `https://laplace.vn/tinh-thanh/${item.slug}`,
      lastModified: new Date(),
    })),

    // Dynamic: Blog posts
    ...posts.map(item => ({
      url: `https://laplace.vn/tin-tuc/bai-viet/${item.slug}`,
      lastModified: new Date(item.updatedAt),
    })),
  ];
}
```

---

## 📊 Tổng kết Pages

### Public Pages (18 trang)

| # | Page | Route | Mô tả |
|---|------|-------|-------|
| 1 | Homepage | `/` | Trang chủ |
| 2 | Search | `/tim-phong` | Tìm kiếm phòng |
| 3 | Phòng trọ - List | `/phong-tro` | Danh mục phòng trọ |
| 4 | Phòng trọ - Detail | `/phong-tro/[slug]` | Chi tiết phòng |
| 5 | Nhà nguyên căn - List | `/nha-nguyen-can` | Danh mục nhà nguyên căn |
| 6 | Nhà nguyên căn - Detail | `/nha-nguyen-can/[slug]` | Chi tiết nhà |
| 7 | Căn hộ - List | `/can-ho` | Danh mục căn hộ |
| 8 | Căn hộ - Detail | `/can-ho/[slug]` | Chi tiết căn hộ |
| 9 | KTX - List | `/ky-tuc-xa` | Danh mục KTX |
| 10 | KTX - Detail | `/ky-tuc-xa/[slug]` | Chi tiết KTX |
| 11 | Tỉnh thành | `/tinh-thanh` | Tất cả tỉnh thành |
| 12 | Tỉnh - List | `/tinh-thanh/[slug]` | Listing theo tỉnh |
| 13 | Quận - List | `/tinh-thanh/[tinh]/[quan]` | Listing theo quận |
| 14 | Video Review | `/video-review` | Tất cả video |
| 15 | Video Detail | `/video-review/[slug]` | Chi tiết video |
| 16 | So sánh | `/so-sanh` | So sánh phòng |
| 17 | Blog | `/tin-tuc` | Tin tức |
| 18 | Blog Category | `/tin-tuc/[category]` | Blog theo danh mục |
| 19 | Blog Detail | `/tin-tuc/bai-viet/[slug]` | Chi tiết bài viết |
| 20 | Giới thiệu | `/gioi-thieu` | About |
| 21 | Liên hệ | `/lien-he` | Contact |
| 22 | Ứng dụng | `/ung-dung` | Download app |
| 23 | Điều khoản | `/chinh-sach/dieu-khoan` | Terms |
| 24 | Bảo mật | `/chinh-sach/bao-mat` | Privacy |
| 25 | Hoàn tiền | `/chinh-sach/hoan-tien` | Refund |

### Auth Pages (5 trang)

| # | Page | Route |
|---|------|-------|
| 1 | Đăng nhập | `/dang-nhap` |
| 2 | Đăng ký | `/dang-ky` |
| 3 | Quên mật khẩu | `/quen-mat-khau` |
| 4 | Đặt lại mật khẩu | `/dat-lai-mat-khau` |
| 5 | Xác thực OTP | `/xac-thuc` |

### Account Pages - Người thuê (8 trang)

| # | Page | Route |
|---|------|-------|
| 1 | Dashboard | `/tai-khoan` |
| 2 | Đặt phòng | `/tai-khoan/dat-phong` |
| 3 | Hợp đồng | `/tai-khoan/hop-dong` |
| 4 | Thanh toán | `/tai-khoan/thanh-toan` |
| 5 | Đánh giá | `/tai-khoan/danh-gia` |
| 6 | Yêu thích | `/tai-khoan/yeu-thich` |
| 7 | Thông báo | `/tai-khoan/thong-bao` |
| 8 | Thông tin | `/tai-khoan/thong-tin` |

### Landlord Pages - Chủ trọ (7 trang)

| # | Page | Route |
|---|------|-------|
| 1 | Dashboard | `/chu-tro` |
| 2 | Đăng tin | `/chu-tro/dang-tin` |
| 3 | Tin đăng | `/chu-tro/tin-dang` |
| 4 | Yêu cầu đặt phòng | `/chu-tro/yeu-cau-dat-phong` |
| 5 | Hợp đồng | `/chu-tro/hop-dong` |
| 6 | Thu chi | `/chu-tro/thu-chi` |
| 7 | Thống kê | `/chu-tro/thong-ke` |

### Error Pages (2 trang)

| # | Page | Route |
|---|------|-------|
| 1 | 404 Not Found | `not-found.tsx` |
| 2 | Error | `error.tsx` |

---

**Tổng cộng: ~47 pages** (25 public + 5 auth + 8 account + 7 landlord + 2 error)

---

*Last Updated: 2026-02-15*
*Version: 2.0.0*
*Reference: [tromoi.com](https://tromoi.com)*

