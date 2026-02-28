import { Refine, Authenticated } from "@refinedev/core";
import routerBindings, {
  UnsavedChangesNotifier,
  NavigateToResource,
  CatchAllNavigate,
} from "@refinedev/react-router-v6";
import { BrowserRouter, Route, Routes, Outlet } from "react-router-dom";

import { AdminLayout } from "@/components/layout/AdminLayout";

// Common Pages
import { UserList, UserEdit, UserCreate, UserShow } from "@/pages/users";
import { PostCategoryList, PostCategoryCreate, PostCategoryEdit } from "@/pages/post-categories";
import { PostList, PostCreate, PostEdit } from "@/pages/posts";
import { TagList, TagCreate, TagEdit } from "@/pages/post-tags";
import { BannerList, BannerCreate, BannerEdit } from "@/pages/banners";
import { StaticPageList, StaticPageCreate, StaticPageEdit } from "@/pages/staticPages";
import { MediaList } from "@/pages/media";
import { SettingList, SettingEdit, GeneralConfig } from "@/pages/settings";
import { ActivityLogList } from "@/pages/activity-logs";
import { DashboardPage } from "@/pages/dashboard";
import { LoginPage } from "@/pages/login";
import { ProfilePage } from "@/pages/profile";
import { UserSettingsPage } from "@/pages/settings-user";
import { RoleList, RoleCreate, RoleEdit } from "@/pages/roles";
import { PermissionList, PermissionCreate, PermissionEdit } from "@/pages/permissions";
import { MenuList, MenuCreate, MenuEdit } from "@/pages/menus";

// LaPlace Rental Management Pages (Coming Soon)
// TODO: Create these pages
// import { AccommodationList, AccommodationCreate, AccommodationEdit, AccommodationShow } from "@/pages/accommodations";
// import { BookingList, BookingShow } from "@/pages/bookings";
// import { ContractList, ContractCreate, ContractEdit, ContractShow } from "@/pages/contracts";
// import { PaymentList, PaymentShow } from "@/pages/payments";
// import { ReviewList, ReviewShow } from "@/pages/reviews";
// import { FacilityList, FacilityCreate, FacilityEdit } from "@/pages/facilities";
// import { RevenueReport, OccupancyReport, CustomerReport } from "@/pages/reports";

import { authProvider } from "@/authProvider";
import { dataProvider } from "@/dataProvider";

import { ThemeProvider } from "@/providers/ThemeProvider";

import "@/index.css";

// Temporary placeholder component
const ComingSoonPage = ({ title }: { title: string }) => (
  <div className="p-6">
    <h1 className="text-2xl font-bold text-gray-800">{title}</h1>
    <p className="mt-4 text-gray-600">Trang này đang được phát triển...</p>
    <p className="mt-2 text-sm text-gray-500">
      Vui lòng quay lại sau hoặc liên hệ developer để được hỗ trợ.
    </p>
  </div>
);

function AppContent() {
  return (
    <Refine
      dataProvider={dataProvider}
      routerProvider={routerBindings}
      authProvider={authProvider}
      resources={[
        // Dashboard
        {
          name: "dashboard",
          list: "/",
          meta: { label: "Dashboard", icon: "📊" }
        },

        // ============================================
        // RENTAL ACCOMMODATION MANAGEMENT (LaPlace)
        // ============================================
        {
          name: "accommodations",
          list: "/accommodations",
          create: "/accommodations/create",
          edit: "/accommodations/edit/:id",
          show: "/accommodations/show/:id",
          meta: { label: "Quản lý phòng trọ", icon: "🏠" }
        },
        {
          name: "facilities",
          list: "/facilities",
          create: "/facilities/create",
          edit: "/facilities/edit/:id",
          meta: { label: "Tiện nghi", icon: "🛋️" }
        },
        {
          name: "bookings",
          list: "/bookings",
          show: "/bookings/show/:id",
          meta: { label: "Đặt phòng", icon: "📅" }
        },
        {
          name: "contracts",
          list: "/contracts",
          create: "/contracts/create",
          edit: "/contracts/edit/:id",
          show: "/contracts/show/:id",
          meta: { label: "Hợp đồng", icon: "📝" }
        },
        {
          name: "payments",
          list: "/payments",
          show: "/payments/show/:id",
          meta: { label: "Thanh toán", icon: "💰" }
        },
        {
          name: "reviews",
          list: "/reviews",
          show: "/reviews/show/:id",
          meta: { label: "Đánh giá", icon: "⭐" }
        },

        // ============================================
        // REPORTS & ANALYTICS
        // ============================================
        {
          name: "reports",
          meta: { label: "Báo cáo thống kê", icon: "📈" }
        },
        {
          name: "reports/revenue",
          list: "/reports/revenue",
          meta: { label: "➜ Báo cáo doanh thu", parent: "reports" }
        },
        {
          name: "reports/occupancy",
          list: "/reports/occupancy",
          meta: { label: "➜ Báo cáo công suất", parent: "reports" }
        },
        {
          name: "reports/customers",
          list: "/reports/customers",
          meta: { label: "➜ Báo cáo khách hàng", parent: "reports" }
        },

        // ============================================
        // USER MANAGEMENT
        // ============================================
        {
          name: "users",
          list: "/users",
          create: "/users/create",
          edit: "/users/edit/:id",
          show: "/users/show/:id",
          meta: { label: "Người dùng", icon: "👥" }
        },

        // ============================================
        // CONTENT MANAGEMENT
        // ============================================
        {
          name: "post-categories",
          list: "/post-categories",
          create: "/post-categories/create",
          edit: "/post-categories/edit/:id",
          meta: { label: "Danh mục bài viết", icon: "📂" }
        },
        {
          name: "posts",
          list: "/posts",
          create: "/posts/create",
          edit: "/posts/edit/:id",
          meta: { label: "Bài viết", icon: "📝" }
        },
        {
          name: "post-tags",
          list: "/post-tags",
          create: "/post-tags/create",
          edit: "/post-tags/edit/:id",
          meta: { label: "Tags", icon: "🏷️" }
        },
        {
          name: "banners",
          list: "/banners",
          create: "/banners/create",
          edit: "/banners/edit/:id",
          meta: { label: "Banners", icon: "🎨" }
        },
        {
          name: "static-pages",
          list: "/static-pages",
          create: "/static-pages/create",
          edit: "/static-pages/edit/:id",
          meta: { label: "Trang tĩnh", icon: "📄" }
        },
        {
          name: "media",
          list: "/media",
          meta: { label: "Media", icon: "🖼️" }
        },
        {
          name: "menus",
          list: "/menus",
          create: "/menus/create",
          edit: "/menus/edit/:id",
          meta: { label: "Quản lý Menu", icon: "🍔" }
        },

        // ============================================
        // SYSTEM & SETTINGS
        // ============================================
        {
          name: "activity-logs",
          list: "/activity-logs",
          meta: { label: "Nhật ký hoạt động", icon: "📋" }
        },
        {
          name: "roles",
          list: "/roles",
          create: "/roles/create",
          edit: "/roles/edit/:id",
          meta: { label: "Vai trò", icon: "👤" }
        },
        {
          name: "permissions",
          list: "/permissions",
          create: "/permissions/create",
          edit: "/permissions/edit/:id",
          meta: { label: "Quyền hạn", icon: "🔒" }
        },
        {
          name: "general-config",
          list: "/general-config",
          meta: { label: "Cấu hình chung", icon: "⚙️" }
        },
        {
          name: "settings",
          list: "/settings",
          edit: "/settings/edit/:id",
          meta: { label: "Cài đặt", icon: "🔧" }
        },
      ]}
      options={{
        syncWithLocation: true,
        warnWhenUnsavedChanges: true,
      }}
    >
      <Routes>
        <Route
          element={
            <Authenticated
              key="authenticated-routes"
              fallback={<CatchAllNavigate to="/login" />}
            >
              <AdminLayout>
                <Outlet />
              </AdminLayout>
            </Authenticated>
          }
        >
          {/* Dashboard */}
          <Route index element={<DashboardPage />} />

          {/* ========================================== */}
          {/* RENTAL ACCOMMODATION MANAGEMENT */}
          {/* ========================================== */}

          {/* Accommodations */}
          <Route path="/accommodations">
            <Route index element={<ComingSoonPage title="Quản lý phòng trọ" />} />
            <Route path="create" element={<ComingSoonPage title="Thêm phòng trọ mới" />} />
            <Route path="edit/:id" element={<ComingSoonPage title="Chỉnh sửa phòng trọ" />} />
            <Route path="show/:id" element={<ComingSoonPage title="Chi tiết phòng trọ" />} />
          </Route>

          {/* Facilities */}
          <Route path="/facilities">
            <Route index element={<ComingSoonPage title="Quản lý tiện nghi" />} />
            <Route path="create" element={<ComingSoonPage title="Thêm tiện nghi mới" />} />
            <Route path="edit/:id" element={<ComingSoonPage title="Chỉnh sửa tiện nghi" />} />
          </Route>

          {/* Bookings */}
          <Route path="/bookings">
            <Route index element={<ComingSoonPage title="Quản lý đặt phòng" />} />
            <Route path="show/:id" element={<ComingSoonPage title="Chi tiết đặt phòng" />} />
          </Route>

          {/* Contracts */}
          <Route path="/contracts">
            <Route index element={<ComingSoonPage title="Quản lý hợp đồng" />} />
            <Route path="create" element={<ComingSoonPage title="Tạo hợp đồng mới" />} />
            <Route path="edit/:id" element={<ComingSoonPage title="Chỉnh sửa hợp đồng" />} />
            <Route path="show/:id" element={<ComingSoonPage title="Chi tiết hợp đồng" />} />
          </Route>

          {/* Payments */}
          <Route path="/payments">
            <Route index element={<ComingSoonPage title="Quản lý thanh toán" />} />
            <Route path="show/:id" element={<ComingSoonPage title="Chi tiết thanh toán" />} />
          </Route>

          {/* Reviews */}
          <Route path="/reviews">
            <Route index element={<ComingSoonPage title="Quản lý đánh giá" />} />
            <Route path="show/:id" element={<ComingSoonPage title="Chi tiết đánh giá" />} />
          </Route>

          {/* Reports */}
          <Route path="/reports">
            <Route path="revenue" element={<ComingSoonPage title="Báo cáo doanh thu" />} />
            <Route path="occupancy" element={<ComingSoonPage title="Báo cáo công suất" />} />
            <Route path="customers" element={<ComingSoonPage title="Báo cáo khách hàng" />} />
          </Route>

          {/* ========================================== */}
          {/* USER MANAGEMENT */}
          {/* ========================================== */}

          <Route path="/users">
            <Route index element={<UserList />} />
            <Route path="create" element={<UserCreate />} />
            <Route path="edit/:id" element={<UserEdit />} />
            <Route path="show/:id" element={<UserShow />} />
          </Route>

          {/* ========================================== */}
          {/* CONTENT MANAGEMENT */}
          {/* ========================================== */}

          {/* Post Categories */}
          <Route path="/post-categories">
            <Route index element={<PostCategoryList />} />
            <Route path="create" element={<PostCategoryCreate />} />
            <Route path="edit/:id" element={<PostCategoryEdit />} />
          </Route>

          {/* Posts */}
          <Route path="/posts">
            <Route index element={<PostList />} />
            <Route path="create" element={<PostCreate />} />
            <Route path="edit/:id" element={<PostEdit />} />
          </Route>

          {/* Post Tags */}
          <Route path="/post-tags">
            <Route index element={<TagList />} />
            <Route path="create" element={<TagCreate />} />
            <Route path="edit/:id" element={<TagEdit />} />
          </Route>

          {/* Banners */}
          <Route path="/banners">
            <Route index element={<BannerList />} />
            <Route path="create" element={<BannerCreate />} />
            <Route path="edit/:id" element={<BannerEdit />} />
          </Route>

          {/* Static Pages */}
          <Route path="/static-pages">
            <Route index element={<StaticPageList />} />
            <Route path="create" element={<StaticPageCreate />} />
            <Route path="edit/:id" element={<StaticPageEdit />} />
          </Route>

          {/* Menus */}
          <Route path="/menus">
            <Route index element={<MenuList />} />
            <Route path="create" element={<MenuCreate />} />
            <Route path="edit/:id" element={<MenuEdit />} />
          </Route>

          {/* Media */}
          <Route path="/media" element={<MediaList />} />

          {/* ========================================== */}
          {/* SYSTEM & SETTINGS */}
          {/* ========================================== */}

          {/* Activity Logs */}
          <Route path="/activity-logs" element={<ActivityLogList />} />

          {/* Roles & Permissions */}
          <Route path="/roles">
            <Route index element={<RoleList />} />
            <Route path="create" element={<RoleCreate />} />
            <Route path="edit/:id" element={<RoleEdit />} />
          </Route>
          
          <Route path="/permissions">
            <Route index element={<PermissionList />} />
            <Route path="create" element={<PermissionCreate />} />
            <Route path="edit/:id" element={<PermissionEdit />} />
          </Route>

          {/* Settings */}
          <Route path="/general-config" element={<GeneralConfig />} />
          <Route path="/settings">
            <Route index element={<SettingList />} />
            <Route path="edit/:id" element={<SettingEdit />} />
          </Route>

          {/* Profile */}
          <Route path="/profile" element={<ProfilePage />} />
          <Route path="/settings-user" element={<UserSettingsPage />} />
        </Route>

        {/* Unauthenticated Routes */}
        <Route
          element={
            <Authenticated key="unauthenticated-routes" fallback={<Outlet />}>
              <NavigateToResource resource="dashboard" />
            </Authenticated>
          }
        >
          <Route path="/login" element={<LoginPage />} />
        </Route>
      </Routes>
      <UnsavedChangesNotifier />
    </Refine>
  );
}

function App() {
  return (
    <BrowserRouter basename="/admin">
      <ThemeProvider>
        <AppContent />
      </ThemeProvider>
    </BrowserRouter>
  );
}

export default App;
