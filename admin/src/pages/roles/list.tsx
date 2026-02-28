import { useState } from "react";
import { useList, useDelete, useNavigation } from "@refinedev/core";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { Pagination } from "@/components/ui/pagination";
import { Spinner } from "@/components/ui/spinner";
import {
  Dialog,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Plus, Pencil, Trash2, Shield, Users, Key, CheckCircle, XCircle } from "lucide-react";

interface Role {
  id: string;
  name: string;
  displayName?: string;
  description?: string;
  isActive?: boolean;
  createdAt: string;
  permissions?: Array<{ permission: { name: string; displayName?: string } }>;
  _count?: { users?: number; permissions: number };
}

export const RoleList = () => {
  const { push } = useNavigation();
  const [current, setCurrent] = useState(1);
  const [pageSize] = useState(10);
  const [deleteId, setDeleteId] = useState<string | null>(null);

  const { data, isLoading } = useList<Role>({
    resource: "roles",
    pagination: { current, pageSize },
  });

  const { mutate: deleteItem, isLoading: isDeleting } = useDelete();

  const roles = data?.data || [];
  const total = data?.total || 0;

  const handleDelete = () => {
    if (deleteId) {
      deleteItem(
        { resource: "roles", id: deleteId },
        { onSuccess: () => setDeleteId(null) }
      );
    }
  };

  // Protected roles that cannot be deleted
  const protectedRoles = ['super_admin', 'admin'];

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold flex items-center gap-2">
            <Shield className="h-8 w-8" />
            Vai trò
          </h1>
          <p className="text-muted-foreground mt-1">
            Quản lý vai trò và phân quyền người dùng
          </p>
        </div>
        <Button onClick={() => push("/roles/create")}>
          <Plus className="h-4 w-4 mr-2" />
          Thêm vai trò
        </Button>
      </div>

      {/* Stats Cards */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <Card>
          <CardContent className="pt-6">
            <div className="flex items-center gap-4">
              <div className="p-3 rounded-lg bg-primary/10">
                <Shield className="h-6 w-6 text-primary" />
              </div>
              <div>
                <p className="text-2xl font-bold">{total}</p>
                <p className="text-sm text-muted-foreground">Tổng vai trò</p>
              </div>
            </div>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="pt-6">
            <div className="flex items-center gap-4">
              <div className="p-3 rounded-lg bg-green-500/10">
                <CheckCircle className="h-6 w-6 text-green-500" />
              </div>
              <div>
                <p className="text-2xl font-bold">
                  {roles.filter(r => r.isActive !== false).length}
                </p>
                <p className="text-sm text-muted-foreground">Đang hoạt động</p>
              </div>
            </div>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="pt-6">
            <div className="flex items-center gap-4">
              <div className="p-3 rounded-lg bg-orange-500/10">
                <Key className="h-6 w-6 text-orange-500" />
              </div>
              <div>
                <p className="text-2xl font-bold">
                  {roles.reduce((acc, r) => acc + (r._count?.permissions || 0), 0)}
                </p>
                <p className="text-sm text-muted-foreground">Tổng quyền được gán</p>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>

      <Card>
        <CardHeader>
          <CardTitle>Danh sách vai trò</CardTitle>
        </CardHeader>
        <CardContent>
          {isLoading ? (
            <div className="flex items-center justify-center h-64">
              <Spinner size="lg" />
            </div>
          ) : roles.length === 0 ? (
            <div className="text-center py-12">
              <Shield className="h-12 w-12 text-muted-foreground mx-auto mb-4" />
              <p className="text-muted-foreground mb-4">
                Chưa có vai trò nào
              </p>
              <p className="text-sm text-muted-foreground mb-4">
                Chạy lệnh sau để tạo dữ liệu mẫu:
              </p>
              <code className="bg-muted px-3 py-2 rounded text-sm">
                docker compose exec backend npm run seed:roles
              </code>
            </div>
          ) : (
            <>
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>Tên vai trò</TableHead>
                    <TableHead>Mô tả</TableHead>
                    <TableHead className="text-center">Trạng thái</TableHead>
                    <TableHead className="text-center">Số quyền</TableHead>
                    <TableHead>Ngày tạo</TableHead>
                    <TableHead className="text-right w-28">Thao tác</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {roles.map((role) => (
                    <TableRow key={role.id}>
                      <TableCell>
                        <div>
                          <p className="font-medium">
                            {role.displayName || role.name}
                          </p>
                          <p className="text-xs text-muted-foreground font-mono">
                            {role.name}
                          </p>
                        </div>
                      </TableCell>
                      <TableCell className="text-muted-foreground max-w-xs truncate">
                        {role.description || "—"}
                      </TableCell>
                      <TableCell className="text-center">
                        {role.isActive !== false ? (
                          <Badge variant="success" className="gap-1">
                            <CheckCircle className="h-3 w-3" />
                            Hoạt động
                          </Badge>
                        ) : (
                          <Badge variant="secondary" className="gap-1">
                            <XCircle className="h-3 w-3" />
                            Tắt
                          </Badge>
                        )}
                      </TableCell>
                      <TableCell className="text-center">
                        <Badge variant="default">
                          <Key className="h-3 w-3 mr-1" />
                          {role._count?.permissions || role.permissions?.length || 0}
                        </Badge>
                      </TableCell>
                      <TableCell>
                        {new Date(role.createdAt).toLocaleDateString("vi-VN")}
                      </TableCell>
                      <TableCell className="text-right">
                        <div className="flex items-center justify-end gap-1">
                          <Button
                            variant="ghost"
                            size="sm"
                            onClick={() => push(`/roles/edit/${role.id}`)}
                          >
                            <Pencil className="h-4 w-4" />
                          </Button>
                          <Button
                            variant="ghost"
                            size="sm"
                            onClick={() => setDeleteId(role.id)}
                            className="text-destructive hover:text-destructive"
                            disabled={protectedRoles.includes(role.name)}
                            title={protectedRoles.includes(role.name) ? "Không thể xóa vai trò hệ thống" : "Xóa"}
                          >
                            <Trash2 className="h-4 w-4" />
                          </Button>
                        </div>
                      </TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>

              <div className="mt-4 flex justify-center">
                <Pagination
                  current={current}
                  total={total}
                  pageSize={pageSize}
                  onChange={setCurrent}
                />
              </div>
            </>
          )}
        </CardContent>
      </Card>

      <Dialog open={!!deleteId} onClose={() => setDeleteId(null)}>
        <DialogHeader>
          <DialogTitle>Xác nhận xóa</DialogTitle>
          <DialogDescription>
            Bạn có chắc chắn muốn xóa vai trò này? Hành động này không thể hoàn tác.
            Người dùng có vai trò này sẽ mất quyền truy cập.
          </DialogDescription>
        </DialogHeader>
        <DialogFooter>
          <Button variant="outline" onClick={() => setDeleteId(null)}>
            Hủy
          </Button>
          <Button variant="destructive" onClick={handleDelete} disabled={isDeleting}>
            {isDeleting ? "Đang xóa..." : "Xóa"}
          </Button>
        </DialogFooter>
      </Dialog>
    </div>
  );
};
