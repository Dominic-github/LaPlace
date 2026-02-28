import { useState } from "react";
import { useList, useDelete, useNavigation, useNotification } from "@refinedev/core";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
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
import { Plus, Pencil, Trash2, Search, FolderTree, AlertTriangle } from "lucide-react";

interface Category {
  id: string;
  name: string;
  slug: string;
  description?: string;
  image?: string;
  isActive: boolean;
  productCount?: number;
  _count?: { products: number };
}

export const CategoryList = () => {
  const { push } = useNavigation();
  const { open: notify } = useNotification();
  const [current, setCurrent] = useState(1);
  const [pageSize] = useState(10);
  const [search, setSearch] = useState("");
  const [deleteId, setDeleteId] = useState<string | null>(null);
  const [deleteError, setDeleteError] = useState<string | null>(null);
  const [showForceDelete, setShowForceDelete] = useState(false);
  const [isDeleting, setIsDeleting] = useState(false);

  const { data, isLoading, refetch } = useList<Category>({
    resource: "product-categories",
    pagination: { current, pageSize },
    filters: [
      ...(search ? [{ field: "name", operator: "contains" as const, value: search }] : []),
      { field: "includeInactive", operator: "eq" as const, value: "true" }
    ],
  });

  const categories = data?.data || [];
  const total = data?.total || 0;

  const handleDelete = async (force = false) => {
    if (!deleteId) return;

    setIsDeleting(true);
    setDeleteError(null);

    try {
      const token = localStorage.getItem("token");
      const url = `http://localhost:5002/api/product-categories/${deleteId}${force ? '?force=true' : ''}`;

      const res = await fetch(url, {
        method: "DELETE",
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });

      const result = await res.json();

      if (result.success) {
        notify?.({
          type: "success",
          message: "Đã xóa danh mục thành công",
        });
        setDeleteId(null);
        setShowForceDelete(false);
        refetch();
      } else {
        if (result.productCount && result.productCount > 0) {
          setDeleteError(result.message);
          setShowForceDelete(true);
        } else {
          setDeleteError(result.message);
        }
      }
    } catch (error) {
      setDeleteError("Có lỗi xảy ra khi xóa danh mục");
    } finally {
      setIsDeleting(false);
    }
  };

  const closeDeleteDialog = () => {
    setDeleteId(null);
    setDeleteError(null);
    setShowForceDelete(false);
  };

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold flex items-center gap-2">
            <FolderTree className="h-8 w-8" />
            Danh mục sản phẩm
          </h1>
          <p className="text-muted-foreground mt-1">
            Quản lý danh mục sản phẩm
          </p>
        </div>
        <Button onClick={() => push("/product-categories/create")}>
          <Plus className="h-4 w-4 mr-2" />
          Thêm danh mục
        </Button>
      </div>

      <Card>
        <CardContent className="pt-6">
          <div className="relative flex-1 max-w-sm">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
            <Input
              placeholder="Tìm danh mục..."
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              className="pl-9"
            />
          </div>
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle>Danh sách danh mục ({total})</CardTitle>
        </CardHeader>
        <CardContent>
          {isLoading ? (
            <div className="flex items-center justify-center h-64">
              <Spinner size="lg" />
            </div>
          ) : categories.length === 0 ? (
            <div className="text-center py-12 text-muted-foreground">
              Không có danh mục nào
            </div>
          ) : (
            <>
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead className="w-16">Ảnh</TableHead>
                    <TableHead>Tên danh mục</TableHead>
                    <TableHead>Slug</TableHead>
                    <TableHead className="text-center">Số sản phẩm</TableHead>
                    <TableHead className="text-center">Trạng thái</TableHead>
                    <TableHead className="text-right w-28">Thao tác</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {categories.map((category) => (
                    <TableRow key={category.id}>
                      <TableCell>
                        {category.image ? (
                          <img
                            src={category.image}
                            alt={category.name}
                            className="w-12 h-12 object-cover rounded"
                          />
                        ) : (
                          <div className="w-12 h-12 bg-muted rounded flex items-center justify-center">
                            <FolderTree className="h-6 w-6 text-muted-foreground" />
                          </div>
                        )}
                      </TableCell>
                      <TableCell className="font-medium">{category.name}</TableCell>
                      <TableCell className="text-muted-foreground">{category.slug}</TableCell>
                      <TableCell className="text-center">
                        {category.productCount || 0}
                      </TableCell>
                      <TableCell className="text-center">
                        <Badge variant={category.isActive ? "success" : "secondary"}>
                          {category.isActive ? "Hiển thị" : "Ẩn"}
                        </Badge>
                      </TableCell>
                      <TableCell className="text-right">
                        <div className="flex items-center justify-end gap-1">
                          <Button
                            variant="ghost"
                            size="sm"
                            onClick={() => push(`/product-categories/edit/${category.id}`)}
                          >
                            <Pencil className="h-4 w-4" />
                          </Button>
                          <Button
                            variant="ghost"
                            size="sm"
                            onClick={() => setDeleteId(category.id)}
                            className="text-destructive hover:text-destructive"
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

      <Dialog open={!!deleteId} onClose={closeDeleteDialog}>
        <DialogHeader>
          <DialogTitle>Xác nhận xóa</DialogTitle>
          <DialogDescription>
            {deleteError ? (
              <div className="space-y-3">
                <div className="flex items-start gap-2 text-amber-600 bg-amber-50 p-3 rounded-lg">
                  <AlertTriangle className="h-5 w-5 mt-0.5 flex-shrink-0" />
                  <span>{deleteError}</span>
                </div>
                {showForceDelete && (
                  <p className="text-sm text-muted-foreground">
                    Bạn có thể xóa bắt buộc, các sản phẩm thuộc danh mục này sẽ được chuyển sang danh mục "Chưa phân loại".
                  </p>
                )}
              </div>
            ) : (
              "Bạn có chắc chắn muốn xóa danh mục này?"
            )}
          </DialogDescription>
        </DialogHeader>
        <DialogFooter>
          <Button variant="outline" onClick={closeDeleteDialog}>
            Hủy
          </Button>
          {showForceDelete ? (
            <Button variant="destructive" onClick={() => handleDelete(true)} disabled={isDeleting}>
              {isDeleting ? "Đang xóa..." : "Xóa bắt buộc"}
            </Button>
          ) : (
            <Button variant="destructive" onClick={() => handleDelete(false)} disabled={isDeleting}>
              {isDeleting ? "Đang xóa..." : "Xóa"}
            </Button>
          )}
        </DialogFooter>
      </Dialog>
    </div>
  );
};

export { CategoryCreate } from "./create";
export { CategoryEdit } from "./edit";
