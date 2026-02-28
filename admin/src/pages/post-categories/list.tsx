import { useState } from "react";
import { useList, useDelete, useNavigation } from "@refinedev/core";
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
import { Plus, Pencil, Trash2, Search, FolderKanban } from "lucide-react";

interface PostCategory {
  id: string;
  name: string;
  slug: string;
  parentId?: string;
  isActive: boolean;
  createdAt: string;
  _count?: { posts: number };
}

export const PostCategoryList = () => {
  const { push } = useNavigation();
  const [current, setCurrent] = useState(1);
  const [pageSize] = useState(10);
  const [search, setSearch] = useState("");
  const [deleteId, setDeleteId] = useState<string | null>(null);

  const { data, isLoading } = useList<PostCategory>({
    resource: "post-categories",
    pagination: { current, pageSize },
    filters: search ? [{ field: "name", operator: "contains", value: search }] : [],
  });

  const { mutate: deleteItem, isLoading: isDeleting } = useDelete();

  const categories = data?.data || [];
  const total = data?.total || 0;

  const handleDelete = () => {
    if (deleteId) {
      deleteItem(
        { resource: "post-categories", id: deleteId },
        { onSuccess: () => setDeleteId(null) }
      );
    }
  };

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold flex items-center gap-2">
            <FolderKanban className="h-8 w-8" />
            Post Categories
          </h1>
          <p className="text-muted-foreground mt-1">
            Quản lý chuyên mục bài viết
          </p>
        </div>
        <Button onClick={() => push("/post-categories/create")}>
          <Plus className="h-4 w-4 mr-2" />
          Thêm chuyên mục
        </Button>
      </div>

      <Card>
        <CardContent className="pt-6">
          <div className="relative flex-1 max-w-sm">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
            <Input
              placeholder="Tìm chuyên mục..."
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              className="pl-9"
            />
          </div>
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle>Danh sách chuyên mục ({total})</CardTitle>
        </CardHeader>
        <CardContent>
          {isLoading ? (
            <div className="flex items-center justify-center h-64">
              <Spinner size="lg" />
            </div>
          ) : categories.length === 0 ? (
            <div className="text-center py-12 text-muted-foreground">
              Không có chuyên mục nào
            </div>
          ) : (
            <>
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>Tên chuyên mục</TableHead>
                    <TableHead>Slug</TableHead>
                    <TableHead className="text-center">Chuyên mục cha</TableHead>
                    <TableHead className="text-center">Số bài viết</TableHead>
                    <TableHead className="text-center">Trạng thái</TableHead>
                    <TableHead>Ngày tạo</TableHead>
                    <TableHead className="text-right w-28">Thao tác</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {categories.map((category) => (
                    <TableRow key={category.id}>
                      <TableCell className="font-medium">{category.name}</TableCell>
                      <TableCell className="text-muted-foreground">{category.slug}</TableCell>
                      <TableCell className="text-center">
                        {category.parentId ? "Có" : "Gốc"}
                      </TableCell>
                      <TableCell className="text-center">
                        {category._count?.posts || 0}
                      </TableCell>
                      <TableCell className="text-center">
                        <Badge variant={category.isActive ? "success" : "secondary"}>
                          {category.isActive ? "Hoạt động" : "Ẩn"}
                        </Badge>
                      </TableCell>
                      <TableCell>
                        {new Date(category.createdAt).toLocaleDateString("vi-VN")}
                      </TableCell>
                      <TableCell className="text-right">
                        <div className="flex items-center justify-end gap-1">
                          <Button
                            variant="ghost"
                            size="sm"
                            onClick={() => push(`/post-categories/edit/${category.id}`)}
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

      <Dialog open={!!deleteId} onClose={() => setDeleteId(null)}>
        <DialogHeader>
          <DialogTitle>Xác nhận xóa</DialogTitle>
          <DialogDescription>
            Bạn có chắc chắn muốn xóa chuyên mục này?
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
