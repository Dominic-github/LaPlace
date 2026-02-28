import { useState, useEffect } from "react";
import { useCreate, useNavigation } from "@refinedev/core";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Checkbox } from "@/components/ui/checkbox";
import { Spinner } from "@/components/ui/spinner";
import { ArrowLeft, Save, Loader2, Shield, CheckSquare, Square } from "lucide-react";
import axios from "axios";

interface Permission {
  id: string;
  name: string;
  displayName?: string;
  module: string;
}

interface PermissionsByModule {
  [module: string]: Permission[];
}

const moduleLabels: Record<string, string> = {
  products: "Sản phẩm",
  orders: "Đơn hàng",
  users: "Người dùng",
  posts: "Bài viết",
  categories: "Danh mục",
  settings: "Cài đặt",
  media: "Media",
  coupons: "Mã giảm giá",
  reports: "Báo cáo",
  roles: "Vai trò",
  permissions: "Quyền hạn",
};

export const RoleCreate = () => {
  const { push, goBack } = useNavigation();
  const { mutate: create, isLoading } = useCreate();

  // Form state
  const [name, setName] = useState("");
  const [displayName, setDisplayName] = useState("");
  const [description, setDescription] = useState("");
  const [isActive, setIsActive] = useState(true);
  const [selectedPermissions, setSelectedPermissions] = useState<string[]>([]);

  // Permissions state
  const [permissionsByModule, setPermissionsByModule] = useState<PermissionsByModule>({});
  const [loadingPermissions, setLoadingPermissions] = useState(true);

  // Toast message
  const [message, setMessage] = useState<{ type: 'success' | 'error'; text: string } | null>(null);

  const showMessage = (type: 'success' | 'error', text: string) => {
    setMessage({ type, text });
    setTimeout(() => setMessage(null), 5000);
  };

  // Fetch permissions grouped by module
  useEffect(() => {
    const fetchPermissions = async () => {
      try {
        const API_URL = import.meta.env.VITE_API_URL || "http://localhost:5002/api";
        const token = localStorage.getItem("token");
        const res = await axios.get(`${API_URL}/permissions/by-module`, {
          headers: { Authorization: `Bearer ${token}` }
        });
        if (res.data.success) {
          setPermissionsByModule(res.data.data);
        }
      } catch (error) {
        console.error("Failed to fetch permissions:", error);
      } finally {
        setLoadingPermissions(false);
      }
    };
    fetchPermissions();
  }, []);

  // Toggle all permissions in a module
  const handleToggleModule = (module: string) => {
    const modulePerms = permissionsByModule[module] || [];
    const modulePermIds = modulePerms.map(p => p.id);
    const allSelected = modulePermIds.every(id => selectedPermissions.includes(id));

    if (allSelected) {
      setSelectedPermissions(prev => prev.filter(id => !modulePermIds.includes(id)));
    } else {
      setSelectedPermissions(prev => [...new Set([...prev, ...modulePermIds])]);
    }
  };

  // Toggle single permission
  const handlePermissionToggle = (permId: string) => {
    if (selectedPermissions.includes(permId)) {
      setSelectedPermissions(prev => prev.filter(id => id !== permId));
    } else {
      setSelectedPermissions(prev => [...prev, permId]);
    }
  };

  // Select/Deselect all permissions
  const handleSelectAll = () => {
    const allPermIds = Object.values(permissionsByModule).flat().map(p => p.id);
    if (selectedPermissions.length === allPermIds.length) {
      setSelectedPermissions([]);
    } else {
      setSelectedPermissions(allPermIds);
    }
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();

    if (!name) {
      showMessage("error", "Vui lòng nhập tên vai trò");
      return;
    }

    create(
      {
        resource: "roles",
        values: {
          name,
          displayName: displayName || name,
          description,
          isActive,
          permissions: selectedPermissions,
        },
      },
      {
        onSuccess: () => {
          showMessage("success", "Tạo vai trò thành công!");
          setTimeout(() => push("/roles"), 1000);
        },
        onError: (error: any) => {
          showMessage("error", error?.message || "Có lỗi xảy ra");
        }
      }
    );
  };

  if (loadingPermissions) {
    return (
      <div className="flex items-center justify-center py-20">
        <Spinner size="lg" />
      </div>
    );
  }

  const allPermIds = Object.values(permissionsByModule).flat().map(p => p.id);
  const allSelected = allPermIds.length > 0 && selectedPermissions.length === allPermIds.length;

  return (
    <div className="space-y-6">
      {/* Toast Message */}
      {message && (
        <div
          className={`fixed top-20 right-4 z-50 px-4 py-3 rounded-md shadow-lg max-w-md ${message.type === "success" ? "bg-success text-white" : "bg-destructive text-white"
            }`}
        >
          {message.text}
        </div>
      )}

      {/* Header */}
      <div className="flex items-center gap-4">
        <Button variant="ghost" size="sm" onClick={goBack}>
          <ArrowLeft className="h-4 w-4 mr-2" />
          Quay lại
        </Button>
        <div>
          <h1 className="text-3xl font-bold flex items-center gap-2">
            <Shield className="h-8 w-8" />
            Thêm vai trò mới
          </h1>
          <p className="text-muted-foreground mt-1">
            Tạo vai trò và phân quyền
          </p>
        </div>
      </div>

      <form onSubmit={handleSubmit}>
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          {/* Main Content */}
          <div className="lg:col-span-2 space-y-6">
            <Card>
              <CardHeader>
                <CardTitle>Thông tin vai trò</CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="grid grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <Label htmlFor="name">Tên (key) *</Label>
                    <Input
                      id="name"
                      value={name}
                      onChange={(e) => setName(e.target.value)}
                      placeholder="admin, editor, manager"
                      required
                    />
                    <p className="text-xs text-muted-foreground">Dùng cho hệ thống</p>
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="displayName">Tên hiển thị</Label>
                    <Input
                      id="displayName"
                      value={displayName}
                      onChange={(e) => setDisplayName(e.target.value)}
                      placeholder="Quản trị viên"
                    />
                  </div>
                </div>

                <div className="space-y-2">
                  <Label htmlFor="description">Mô tả</Label>
                  <Textarea
                    id="description"
                    value={description}
                    onChange={(e) => setDescription(e.target.value)}
                    placeholder="Mô tả về vai trò này..."
                    rows={3}
                  />
                </div>

                <div className="flex items-center gap-3">
                  <Checkbox
                    id="isActive"
                    checked={isActive}
                    onCheckedChange={(checked) => setIsActive(!!checked)}
                  />
                  <Label htmlFor="isActive" className="cursor-pointer">Kích hoạt</Label>
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <div className="flex items-center justify-between">
                  <CardTitle>Quyền hạn ({selectedPermissions.length}/{allPermIds.length})</CardTitle>
                  <Button
                    type="button"
                    variant="outline"
                    size="sm"
                    onClick={handleSelectAll}
                  >
                    {allSelected ? (
                      <>
                        <Square className="h-4 w-4 mr-2" />
                        Bỏ chọn tất cả
                      </>
                    ) : (
                      <>
                        <CheckSquare className="h-4 w-4 mr-2" />
                        Chọn tất cả
                      </>
                    )}
                  </Button>
                </div>
              </CardHeader>
              <CardContent className="space-y-6">
                {Object.keys(permissionsByModule).length === 0 ? (
                  <div className="text-center py-8">
                    <p className="text-muted-foreground mb-4">
                      Chưa có quyền nào được tạo trong hệ thống.
                    </p>
                    <p className="text-sm text-muted-foreground">
                      Chạy <code className="bg-muted px-2 py-1 rounded">docker compose exec backend npm run seed:roles</code> để tạo dữ liệu mẫu.
                    </p>
                  </div>
                ) : (
                  Object.entries(permissionsByModule).map(([module, perms]) => {
                    const modulePermIds = perms.map(p => p.id);
                    const selectedCount = modulePermIds.filter(id => selectedPermissions.includes(id)).length;
                    const allModuleSelected = selectedCount === perms.length;

                    return (
                      <div key={module} className="border rounded-lg p-4">
                        <div className="flex items-center justify-between mb-3">
                          <div className="flex items-center gap-2">
                            <Checkbox
                              checked={allModuleSelected}
                              onCheckedChange={() => handleToggleModule(module)}
                            />
                            <span className="font-semibold">
                              {moduleLabels[module] || module}
                            </span>
                            <span className="text-sm text-muted-foreground">
                              ({selectedCount}/{perms.length})
                            </span>
                          </div>
                        </div>
                        <div className="grid grid-cols-2 md:grid-cols-4 gap-2 pl-6">
                          {perms.map((perm) => (
                            <div key={perm.id} className="flex items-center gap-2">
                              <Checkbox
                                id={`perm-${perm.id}`}
                                checked={selectedPermissions.includes(perm.id)}
                                onCheckedChange={() => handlePermissionToggle(perm.id)}
                              />
                              <Label htmlFor={`perm-${perm.id}`} className="cursor-pointer text-sm">
                                {perm.displayName || perm.name}
                              </Label>
                            </div>
                          ))}
                        </div>
                      </div>
                    );
                  })
                )}
              </CardContent>
            </Card>
          </div>

          {/* Sidebar */}
          <div className="space-y-6">
            <Card>
              <CardHeader>
                <CardTitle>Tổng quan</CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="flex justify-between text-sm">
                  <span className="text-muted-foreground">Tổng quyền:</span>
                  <span className="font-medium">{allPermIds.length}</span>
                </div>
                <div className="flex justify-between text-sm">
                  <span className="text-muted-foreground">Đã chọn:</span>
                  <span className="font-medium text-green-600">{selectedPermissions.length}</span>
                </div>
                <div className="flex justify-between text-sm">
                  <span className="text-muted-foreground">Trạng thái:</span>
                  <span className={`font-medium ${isActive ? 'text-green-600' : 'text-red-600'}`}>
                    {isActive ? 'Hoạt động' : 'Không hoạt động'}
                  </span>
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardContent className="pt-6">
                <Button type="submit" className="w-full" disabled={isLoading}>
                  {isLoading ? (
                    <Loader2 className="h-4 w-4 mr-2 animate-spin" />
                  ) : (
                    <Save className="h-4 w-4 mr-2" />
                  )}
                  Lưu vai trò
                </Button>
              </CardContent>
            </Card>
          </div>
        </div>
      </form>
    </div>
  );
};
