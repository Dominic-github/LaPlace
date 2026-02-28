# 🏠 LaPlace - Admin Panel Documentation

## 📝 Tổng quan

Admin Panel của LaPlace được xây dựng với:
- **React 18** - UI Library
- **Refine Framework 4** - Admin framework
- **Ant Design 5** - Component library
- **Vite 5** - Build tool
- **TypeScript 5** - Type safety

---

## 🚀 Quick Start

### Installation

```powershell
cd admin
npm install
```

### Development

```powershell
npm run dev
# Admin panel: http://localhost:7202
```

### Build Production

```powershell
npm run build
npm run preview
```

---

## 📂 Cấu trúc Project

```
admin/
├── src/
│   ├── pages/                  # Refine Resources
│   │   ├── accommodations/
│   │   │   ├── list.tsx
│   │   │   ├── create.tsx
│   │   │   ├── edit.tsx
│   │   │   └── show.tsx
│   │   ├── bookings/
│   │   ├── contracts/
│   │   ├── payments/
│   │   ├── reviews/
│   │   ├── facilities/
│   │   ├── users/
│   │   ├── roles/
│   │   └── reports/
│   │       ├── revenue.tsx
│   │       ├── occupancy.tsx
│   │       └── customers.tsx
│   ├── components/
│   │   ├── layout/
│   │   │   ├── Header.tsx
│   │   │   └── Sider.tsx
│   │   └── dashboard/
│   │       ├── StatCard.tsx
│   │       └── RevenueChart.tsx
│   ├── providers/
│   │   ├── authProvider.tsx
│   │   └── dataProvider.tsx
│   ├── App.tsx
│   └── main.tsx
├── vite.config.ts
├── tsconfig.json
└── package.json
```

---

## 🎯 Chức năng chính

### 1️⃣ **Dashboard**

**Đường dẫn:** `/`

**Nội dung:**

1. **Thống kê tổng quan (4 cards)**
   - 📊 Tổng doanh thu (tháng này)
   - 🏠 Tổng phòng trọ
   - 📅 Đặt phòng mới (tháng này)
   - 👥 Số khách hàng

2. **Biểu đồ Revenue** (Line Chart)
   - Doanh thu 12 tháng gần nhất
   - So sánh với năm trước

3. **Booking gần đây** (Table)
   - 10 booking mới nhất
   - Hiển thị: ID, Khách hàng, Phòng, Ngày, Trạng thái

4. **Top Accommodations** (List)
   - 5 phòng có booking nhiều nhất

---

### 2️⃣ **Quản lý Phòng trọ (Accommodations)**

#### 📋 List Page

**Đường dẫn:** `/accommodations`

**Features:**

- ✅ **DataGrid với Ant Design Table**
  - Columns: ID, Ảnh, Tiêu đề, Giá, Diện tích, Trạng thái, Actions
  - Pagination (10/20/50 items)
  - Filter theo: Trạng thái, Giá, Diện tích
  - Search theo: Title, Address
  - Sort: Giá, Diện tích, Ngày tạo

- ✅ **Actions**
  - 👁️ Show (Xem chi tiết)
  - ✏️ Edit (Chỉnh sửa)
  - 🗑️ Delete (Xóa - với confirm modal)

- ✅ **Export**
  - Export to Excel (all fields)

---

#### ➕ Create Page

**Đường dẫn:** `/accommodations/create`

**Form Fields:**

```typescript
interface AccommodationForm {
  title: string;              // Required
  description: string;        // Rich text editor
  address: string;            // Required
  province: string;           // Select dropdown
  district: string;           // Dependent on province
  ward: string;               // Dependent on district
  price: number;              // Required, >= 0
  area: number;               // Required, >= 0
  bedrooms: number;           // Required, >= 0
  bathrooms: number;          // Required, >= 0
  maxOccupancy: number;       // Required, >= 1
  status: 'available' | 'occupied' | 'maintenance';
  images: FileList;           // Multiple upload
  facilityIds: number[];      // Multi-select
  featured: boolean;          // Checkbox
}
```

**Validation Rules:**

- `title`: Max 255 characters
- `price`: Min 0, Format: 1,000,000 VNĐ
- `area`: Min 0, Format: 25.5 m²
- `images`: Max 10 files, Max size 5MB each

**Components:**

- **Location Cascade:** Province → District → Ward
- **Image Upload:** Drag & drop, Preview thumbnails
- **Facilities Multi-Select:** Checkboxes với icons

---

#### ✏️ Edit Page

**Đường dẫn:** `/accommodations/edit/:id`

**Same as Create, with:**

- Pre-populated data
- Existing images preview (with delete option)
- Update button instead of Create

---

#### 👁️ Show Page

**Đường dẉ�n:** `/accommodations/show/:id`

**Layout:**

1. **Image Gallery** (Top)
   - Main image + thumbnails
   - Lightbox on click

2. **Details Section**
   - Title, Description, Address
   - Price, Area, Bedrooms, Bathrooms
   - Status badge
   - Facilities list

3. **Stats**
   - Total Bookings
   - Average Rating
   - View Count

4. **Reviews List**
   - Recent reviews (5 latest)
   - Link to full reviews

5. **Actions**
   - Edit button
   - Delete button

---

### 3️⃣ **Quản lý Đặt phòng (Bookings)**

#### 📋 List Page

**Đường dẫn:** `/bookings`

**Columns:**

- ID
- Khách hàng (name + email)
- Phòng trọ (title)
- Check-in / Check-out
- Số khách
- Tổng tiền
- Trạng thái (Tag với màu)
- Actions

**Filters:**

- Status: All / Pending / Confirmed / Cancelled / Completed
- Date range: Check-in date

**Status Colors:**

- `pending` - 🟡 Yellow
- `confirmed` - 🟢 Green
- `cancelled` - 🔴 Red
- `completed` - 🔵 Blue

---

#### 👁️ Show Page

**Đường dẫn:** `/bookings/show/:id`

**Sections:**

1. **Booking Info**
   - Booking ID, Created Date
   - Status (with update button)

2. **Customer Info**
   - Name, Email, Phone
   - Link to user profile

3. **Accommodation Info**
   - Title, Address, Price
   - Thumbnail image
   - Link to accommodation

4. **Booking Details**
   - Check-in / Check-out dates
   - Number of guests
   - Total price
   - Notes

5. **Actions**
   - **Update Status** (Dropdown + Button)
     - Pending → Confirmed / Cancelled
     - Confirmed → Completed / Cancelled
   - **Create Contract** (if status = Confirmed)
   - **Send Email** (Reminder, Confirmation)

---

### 4️⃣ **Quản lý Hợp đồng (Contracts)**

#### 📋 List Page

**Đường dẫn:** `/contracts`

**Columns:**

- ID
- Booking ID (link)
- Khách hàng
- Phòng trọ
- Ngày bắt đầu / Ngày kết thúc
- Tiền thuê hàng tháng
- Tiền cọc
- Trạng thái
- Actions

**Filters:**

- Status: Active / Expired / Terminated
- Date range

---

#### ➕ Create Page

**Đường dẫn:** `/contracts/create`

**Form:**

```typescript
interface ContractForm {
  bookingId: number;          // Select from confirmed bookings
  startDate: Date;            // Required
  endDate: Date;              // Required, > startDate
  monthlyRent: number;        // Required
  deposit: number;            // Required
  terms: string;              // Rich text editor
  contractFile?: File;        // PDF upload
}
```

**Auto-fill from Booking:**

- Khi chọn `bookingId`, auto-fill:
  - Customer info
  - Accommodation info
  - Start date (from check-in)
  - Monthly rent (from accommodation price)

**On Submit:**

1. Create contract
2. Update booking status → `completed`
3. Update accommodation status → `occupied`
4. Send email to customer

---

#### 👁️ Show Page

**Sections:**

1. **Contract Info**
   - Contract ID, Created Date
   - Status badge

2. **Related Booking**
   - Booking ID (link)
   - Booking details

3. **Customer & Accommodation**
   - Full details với links

4. **Contract Terms**
   - Start / End date
   - Monthly rent
   - Deposit
   - Terms (rendered HTML)

5. **Contract File**
   - PDF preview (iframe)
   - Download button

6. **Actions**
   - **Terminate Contract** (if status = Active)
   - **Upload Contract File** (if missing)

---

### 5️⃣ **Quản lý Thanh toán (Payments)**

#### 📋 List Page

**Đường dẫn:** `/payments`

**Columns:**

- ID
- Booking / Contract (link)
- Khách hàng
- Số tiền
- Phương thức thanh toán
- Trạng thái
- Ngày thanh toán
- Actions

**Filters:**

- Status: Pending / Completed / Failed
- Payment method: Cash / Bank Transfer / Online
- Date range

**Summary Cards (top):**

- Tổng số giao dịch
- Tổng tiền đã thu
- Tổng tiền đang chờ

---

#### ➕ Create Page

**Form:**

```typescript
interface PaymentForm {
  bookingId?: number;
  contractId?: number;        // bookingId OR contractId required
  amount: number;             // Required
  paymentMethod: string;      // Required
  transactionId?: string;
  notes?: string;
}
```

**On Submit:**

- Create payment with `status = pending`
- Admin can later update to `completed`

---

#### 👁️ Show Page

**Sections:**

1. **Payment Info**
   - Payment ID, Created Date
   - Amount (formatted)
   - Payment method
   - Transaction ID
   - Status

2. **Related Booking/Contract**
   - Link & details

3. **Customer Info**

4. **Actions**
   - **Update Status** → Completed / Failed
   - **Print Receipt**

---

### 6️⃣ **Quản lý Đánh giá (Reviews)**

#### 📋 List Page

**Đường dẫn:** `/reviews`

**Columns:**

- ID
- Accommodation (link)
- Khách hàng
- Rating (stars)
- Comment (truncated)
- Ngày tạo
- Approved (checkbox)
- Actions

**Filters:**

- Approved: Yes / No
- Rating: 1-5 stars
- Accommodation

**Bulk Actions:**

- Approve selected
- Delete selected

---

#### 👁️ Show Page

**Sections:**

1. **Review Info**
   - Review ID, Created Date
   - Approved status

2. **Customer Info**
   - Name, Email
   - Link to profile

3. **Accommodation Info**
   - Title, Image
   - Link to accommodation

4. **Review Content**
   - Rating (stars)
   - Comment
   - Images (if any)

5. **Actions**
   - **Approve** (if not approved)
   - **Delete**

---

### 7️⃣ **Quản lý Tiện nghi (Facilities)**

#### 📋 List Page

**Đường dẫn:** `/facilities`

**Simple CRUD:**

- ✅ List với Table
- ✅ Create modal (Inline)
- ✅ Edit modal (Inline)
- ✅ Delete with confirm

**Fields:**

- `name` (e.g., "WiFi")
- `icon` (Icon class name, e.g., "wifi")
- `category` (basic, furniture, appliance, security)

---

### 8️⃣ **Quản lý Người dùng (Users)**

#### 📋 List Page

**Đường dẫn:** `/users`

**Columns:**

- ID
- Avatar (thumbnail)
- Tên đầy đủ
- Email
- Phone
- Vai trò (Tag)
- Trạng thái (Active/Inactive/Banned)
- Actions

**Filters:**

- Role: Admin / Manager / Customer
- Status: Active / Inactive / Banned

---

#### ➕ Create Page

**Form:**

```typescript
interface UserForm {
  firstName: string;
  lastName: string;
  email: string;            // Unique
  password: string;         // Min 6 chars
  phone: string;
  roleIds: number[];        // Multi-select
  status: string;
  avatar?: File;
}
```

---

#### ✏️ Edit Page

**Same as Create, except:**

- Password field is optional (leave blank to keep current)
- Avatar preview

---

#### 👁️ Show Page

**Sections:**

1. **User Info**
   - Avatar, Name, Email, Phone
   - Roles, Status

2. **Statistics**
   - Total Bookings
   - Total Spent
   - Total Reviews

3. **Recent Bookings** (Table)
   - 5 latest bookings

4. **Recent Reviews** (List)
   - 5 latest reviews

5. **Activity Logs** (Timeline)
   - Recent actions

6. **Actions**
   - Edit
   - Ban/Unban
   - Reset Password

---

### 9️⃣ **Phân quyền (Roles & Permissions)**

#### Roles List

**Đường dẫn:** `/roles`

**Default Roles:**

- **Admin** - Full access
- **Manager** - Manage accommodations, bookings, contracts
- **Customer** - View own data only

**Actions:**

- Create role
- Edit role (assign permissions)
- Delete role (if not in use)

---

#### Permissions Management

**Đường dẫn:** `/roles/edit/:id`

**UI:**

- Grouped checkboxes theo resource:
  - **Accommodations:** Create, Read, Update, Delete
  - **Bookings:** Create, Read, Update, Delete
  - **Contracts:** Create, Read, Update, Delete
  - **Payments:** Create, Read, Update, Delete
  - **Reviews:** Read, Delete
  - **Users:** Create, Read, Update, Delete
  - **Reports:** View Revenue, View Occupancy, View Customers

---

### 🔟 **Báo cáo & Thống kê (Reports)**

#### 📊 Revenue Report

**Đường dẫn:** `/reports/revenue`

**Features:**

1. **Date Range Picker**
   - Custom range
   - Presets: This month, Last month, This year

2. **Summary Cards**
   - Tổng doanh thu
   - Tăng trưởng (%)
   - So sánh cùng kỳ

3. **Line Chart**
   - Doanh thu theo ngày/tháng

4. **Table**
   - Chi tiết giao dịch
   - Export to Excel

---

#### 📊 Occupancy Report

**Đường dẫn:** `/reports/occupancy`

**Features:**

1. **Summary Cards**
   - Tổng số phòng
   - Phòng đã thuê
   - Phòng trống
   - Phòng bảo trì
   - Tỷ lệ lấp đầy (%)

2. **Pie Chart**
   - Phân bố trạng thái phòng

3. **Table**
   - Danh sách phòng theo trạng thái

---

#### 📊 Customer Report

**Đường dẫn:** `/reports/customers`

**Features:**

1. **Summary Cards**
   - Tổng khách hàng
   - Khách hàng hoạt động
   - Khách hàng mới (tháng này)

2. **Top Customers Table**
   - Name, Total Bookings, Total Spent
   - Sort by spent

3. **Chart**
   - Khách hàng mới theo tháng (12 tháng)

---

## 🎨 UI Components

### StatCard

```tsx
<StatCard
  title="Tổng doanh thu"
  value="50,000,000 VNĐ"
  icon={<DollarCircleOutlined />}
  color="#52c41a"
  trend={+15.5}
/>
```

---

### StatusTag

```tsx
<StatusTag status="confirmed" />
// Output: <Tag color="green">Đã xác nhận</Tag>
```

---

### ImageUpload

```tsx
<ImageUpload
  maxCount={10}
  maxSize={5 * 1024 * 1024}
  onChange={(files) => setImages(files)}
/>
```

---

## 🔐 Authentication & Authorization

### Auth Provider

```tsx
// providers/authProvider.tsx
export const authProvider = {
  login: async ({ email, password }) => {
    // Call API: POST /api/auth/login
    // Save token to localStorage
  },
  logout: async () => {
    // Clear localStorage
  },
  checkAuth: async () => {
    // Verify token
  },
  checkError: (error) => {
    // Handle 401, 403
  },
  getPermissions: async () => {
    // Return user permissions
  },
  getUserIdentity: async () => {
    // Return current user
  },
};
```

---

### Access Control

```tsx
// Example: Hide delete button for non-admin
<CanAccess resource="accommodations" action="delete">
  <DeleteButton />
</CanAccess>
```

---

## 📡 Data Provider

```tsx
// providers/dataProvider.tsx
export const dataProvider = {
  getList: async (resource, params) => {
    // GET /api/{resource}?page=1&limit=10&search=...
  },
  getOne: async (resource, params) => {
    // GET /api/{resource}/{id}
  },
  create: async (resource, params) => {
    // POST /api/{resource}
  },
  update: async (resource, params) => {
    // PUT /api/{resource}/{id}
  },
  deleteOne: async (resource, params) => {
    // DELETE /api/{resource}/{id}
  },
  // ... other methods
};
```

---

## 🛠️ Configuration

### vite.config.ts

```typescript
export default defineConfig({
  server: {
    port: 7202,
    host: true,
  },
  build: {
    outDir: 'dist',
  },
});
```

---

### Environment Variables

```env
# .env
VITE_API_URL=http://localhost:7201
```

**Usage:**

```tsx
const API_URL = import.meta.env.VITE_API_URL;
```

---

## 🚀 Deployment

### Build for Production

```powershell
npm run build
```

**Output:** `dist/` folder

---

### Preview Production Build

```powershell
npm run preview
```

---

### Docker Deployment

```dockerfile
# Dockerfile
FROM node:22-alpine
WORKDIR /app
COPY package*.json ./
RUN npm ci --only=production
COPY . .
RUN npm run build
EXPOSE 7202
CMD ["npm", "run", "preview", "--", "--host", "--port", "7202"]
```

---

## 📝 Best Practices

### 1. Form Validation

- Use Ant Design Form validation
- Display inline errors
- Disable submit button during submission

---

### 2. Loading States

```tsx
const { data, isLoading } = useList({ resource: 'accommodations' });

if (isLoading) return <Spin />;
```

---

### 3. Error Handling

```tsx
const { mutate, isError, error } = useCreate();

{isError && <Alert message={error.message} type="error" />}
```

---

### 4. Optimistic Updates

```tsx
const { mutate } = useUpdate({
  resource: 'accommodations',
  mutationMode: 'optimistic',
});
```

---

### 5. Caching

- Refine automatically caches data
- Use `invalidate` to refresh:

```tsx
const { invalidate } = useInvalidate();
invalidate({ resource: 'accommodations', invalidates: ['list'] });
```

---

## 🧪 Testing

### Example Test

```tsx
// __tests__/AccommodationList.test.tsx
import { render, screen } from '@testing-library/react';
import AccommodationList from '../pages/accommodations/list';

test('renders accommodation list', async () => {
  render(<AccommodationList />);
  expect(await screen.findByText('Phòng trọ')).toBeInTheDocument();
});
```

---

*Last Updated: 2026-02-11*  
*Version: 1.0.0*
