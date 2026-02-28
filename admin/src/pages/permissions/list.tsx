import { useState, useEffect } from "react";
import { useNavigation } from "@refinedev/core";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Spinner } from "@/components/ui/spinner";
import { Search, Key, Plus, Settings, Package, ShoppingCart, Users, FileText, FolderOpen, Image, Gift, BarChart3, Shield, KeyRound } from "lucide-react";
import axios from "axios";

interface Permission {
  id: string;
  name: string;
  displayName?: string;
  description?: string;
  module: string;
  createdAt: string;
  _count?: { roles: number };
}

interface PermissionsByModule {
  [module: string]: Permission[];
}

const moduleConfig: Record<string, { label: string; icon: React.ReactNode; color: string }> = {
  products: { label: "Sản phẩm", icon: <Package className="h-5 w-5" />, color: "bg-blue-500" },
  orders: { label: "Đơn hàng", icon: <ShoppingCart className="h-5 w-5" />, color: "bg-green-500" },
  users: { label: "Người dùng", icon: <Users className="h-5 w-5" />, color: "bg-purple-500" },
  posts: { label: "Bài viết", icon: <FileText className="h-5 w-5" />, color: "bg-orange-500" },
  categories: { label: "Danh mục", icon: <FolderOpen className="h-5 w-5" />, color: "bg-yellow-500" },
  settings: { label: "Cài đặt", icon: <Settings className="h-5 w-5" />, color: "bg-gray-500" },
  media: { label: "Media", icon: <Image className="h-5 w-5" />, color: "bg-pink-500" },
  coupons: { label: "Mã giảm giá", icon: <Gift className="h-5 w-5" />, color: "bg-red-500" },
  reports: { label: "Báo cáo", icon: <BarChart3 className="h-5 w-5" />, color: "bg-indigo-500" },
  roles: { label: "Vai trò", icon: <Shield className="h-5 w-5" />, color: "bg-teal-500" },
  permissions: { label: "Quyền hạn", icon: <KeyRound className="h-5 w-5" />, color: "bg-cyan-500" },
};

const actionLabels: Record<string, string> = {
  view: "Xem",
  create: "Tạo",
  edit: "Sửa",
  delete: "Xóa",
  manage: "Quản lý",
  export: "Xuất",
  import: "Nhập",
};

export const PermissionList = () => {
  const { push } = useNavigation();
  const [search, setSearch] = useState("");
  const [permissionsByModule, setPermissionsByModule] = useState<PermissionsByModule>({});
  const [allPermissions, setAllPermissions] = useState<Permission[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  // Fetch permissions grouped by module
  useEffect(() => {
    const fetchPermissions = async () => {
      try {
        const API_URL = import.meta.env.VITE_API_URL || "http://localhost:5002/api";
        const token = localStorage.getItem("token");

        // Fetch permissions grouped by module
        const res = await axios.get(`${API_URL}/permissions/by-module`, {
          headers: { Authorization: `Bearer ${token}` }
        });

        if (res.data.success) {
          setPermissionsByModule(res.data.data);

          // Flatten to get all permissions
          const allPerms: Permission[] = [];
          Object.values(res.data.data).forEach((perms: any) => {
            allPerms.push(...perms);
          });
          setAllPermissions(allPerms);
        }
      } catch (error) {
        console.error("Failed to fetch permissions:", error);
      } finally {
        setIsLoading(false);
      }
    };
    fetchPermissions();
  }, []);

  // Filter permissions by search
  const filteredByModule = search
    ? Object.entries(permissionsByModule).reduce((acc, [module, perms]) => {
      const filtered = perms.filter(
        p =>
          p.name.toLowerCase().includes(search.toLowerCase()) ||
          p.displayName?.toLowerCase().includes(search.toLowerCase()) ||
          p.description?.toLowerCase().includes(search.toLowerCase())
      );
      if (filtered.length > 0) {
        acc[module] = filtered;
      }
      return acc;
    }, {} as PermissionsByModule)
    : permissionsByModule;

  const getActionFromPermission = (permName: string) => {
    const parts = permName.split(".");
    return parts.length > 1 ? parts[1] : permName;
  };

  if (isLoading) {
    return (
      <div className="flex items-center justify-center h-64">
        <Spinner size="lg" />
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold flex items-center gap-2">
            <Key className="h-8 w-8" />
            Quyền hạn
          </h1>
          <p className="text-muted-foreground mt-1">
            Danh sách tất cả quyền trong hệ thống ({allPermissions.length} quyền)
          </p>
        </div>
        <Button onClick={() => push("/permissions/create")}>
          <Plus className="h-4 w-4 mr-2" />
          Thêm quyền
        </Button>
      </div>

      {/* Search */}
      <Card>
        <CardContent className="pt-6">
          <div className="relative flex-1 max-w-md">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
            <Input
              placeholder="Tìm quyền..."
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              className="pl-9"
            />
          </div>
        </CardContent>
      </Card>

      {/* Permissions by Module */}
      {Object.keys(filteredByModule).length === 0 ? (
        <Card>
          <CardContent className="py-12 text-center">
            {search ? (
              <p className="text-muted-foreground">
                Không tìm thấy quyền nào phù hợp với "{search}"
              </p>
            ) : (
              <div className="space-y-4">
                <p className="text-muted-foreground">
                  Chưa có quyền nào được tạo trong hệ thống.
                </p>
                <p className="text-sm text-muted-foreground">
                  Chạy lệnh sau để tạo dữ liệu mẫu:
                </p>
                <code className="bg-muted px-3 py-2 rounded block text-sm">
                  docker compose exec backend npm run seed:roles
                </code>
              </div>
            )}
          </CardContent>
        </Card>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {Object.entries(filteredByModule).map(([module, perms]) => {
            const config = moduleConfig[module] || {
              label: module,
              icon: <Key className="h-5 w-5" />,
              color: "bg-gray-500",
            };

            return (
              <Card key={module} className="overflow-hidden">
                <CardHeader className={`${config.color} text-white`}>
                  <CardTitle className="flex items-center gap-2 text-lg">
                    {config.icon}
                    {config.label}
                    <Badge variant="secondary" className="ml-auto bg-white/20 text-white">
                      {perms.length}
                    </Badge>
                  </CardTitle>
                </CardHeader>
                <CardContent className="pt-4">
                  <div className="space-y-2">
                    {perms.map((perm) => {
                      const action = getActionFromPermission(perm.name);
                      return (
                        <div
                          key={perm.id}
                          className="flex items-center justify-between p-2 rounded-md hover:bg-muted transition-colors"
                        >
                          <div className="flex-1">
                            <p className="font-medium text-sm">
                              {perm.displayName || actionLabels[action] || action}
                            </p>
                            <p className="text-xs text-muted-foreground font-mono">
                              {perm.name}
                            </p>
                          </div>
                          <Badge variant="outline" className="text-xs">
                            {perm._count?.roles || 0} vai trò
                          </Badge>
                        </div>
                      );
                    })}
                  </div>
                </CardContent>
              </Card>
            );
          })}
        </div>
      )}

      {/* Stats Card */}
      <Card>
        <CardHeader>
          <CardTitle className="text-lg">Thống kê</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
            <div className="text-center p-4 rounded-lg bg-muted">
              <p className="text-2xl font-bold">{allPermissions.length}</p>
              <p className="text-sm text-muted-foreground">Tổng quyền</p>
            </div>
            <div className="text-center p-4 rounded-lg bg-muted">
              <p className="text-2xl font-bold">{Object.keys(permissionsByModule).length}</p>
              <p className="text-sm text-muted-foreground">Nhóm module</p>
            </div>
            <div className="text-center p-4 rounded-lg bg-muted">
              <p className="text-2xl font-bold">
                {allPermissions.filter(p => p.name.includes("view")).length}
              </p>
              <p className="text-sm text-muted-foreground">Quyền xem</p>
            </div>
            <div className="text-center p-4 rounded-lg bg-muted">
              <p className="text-2xl font-bold">
                {allPermissions.filter(p => p.name.includes("delete")).length}
              </p>
              <p className="text-sm text-muted-foreground">Quyền xóa</p>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
};
