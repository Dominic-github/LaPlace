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
import { Plus, Pencil, Trash2, Search, FileText } from "lucide-react";

interface StaticPage {
  id: string;
  title: string;
  slug: string;
  isActive: boolean;
  order: number;
  createdAt: string;
}

export const StaticPageList = () => {
  const { push } = useNavigation();
  const [current, setCurrent] = useState(1);
  const [pageSize] = useState(10);
  const [search, setSearch] = useState("");
  const [deleteId, setDeleteId] = useState<string | null>(null);

  const { data, isLoading } = useList<StaticPage>({
    resource: "static-pages",
    pagination: { current, pageSize },
    filters: search ? [{ field: "title", operator: "contains", value: search }] : [],
    sorters: [{ field: "order", order: "asc" }],
  });

  const { mutate: deleteItem, isLoading: isDeleting } = useDelete();

  const pages = data?.data || [];
  const total = data?.total || 0;

  const handleDelete = () => {
    if (deleteId) {
      deleteItem(
        { resource: "static-pages", id: deleteId },
        { onSuccess: () => setDeleteId(null) }
      );
    }
  };

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold flex items-center gap-2">
            <FileText className="h-8 w-8" />
            Static Pages
          </h1>
          <p className="text-muted-foreground mt-1">Quản lý trang tĩnh</p>
        </div>
        <Button onClick={() => push("/static-pages/create")}>
          <Plus className="h-4 w-4 mr-2" />
          Tạo trang mới
        </Button>
      </div>

      <Card>
        <CardContent className="pt-6">
          <div className="relative flex-1 max-w-sm">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
            <Input
              placeholder="Tìm trang..."
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              className="pl-9"
            />
          </div>
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle>Danh sách trang ({total})</CardTitle>
        </CardHeader>
        <CardContent>
          {isLoading ? (
            <div className="flex items-center justify-center h-64">
              <Spinner size="lg" />
            </div>
          ) : pages.length === 0 ? (
            <div className="text-center py-12 text-muted-foreground">
              Không có trang nào
            </div>
          ) : (
            <>
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>Tiêu đề</TableHead>
                    <TableHead>Slug</TableHead>
                    <TableHead className="text-center">Trạng thái</TableHead>
                    <TableHead className="text-center">Thứ tự</TableHead>
                    <TableHead>Ngày tạo</TableHead>
                    <TableHead className="text-right w-28">Thao tác</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {pages.map((page) => (
                    <TableRow key={page.id}>
                      <TableCell className="font-medium">{page.title}</TableCell>
                      <TableCell className="text-muted-foreground">{page.slug}</TableCell>
                      <TableCell className="text-center">
                        <Badge variant={page.isActive ? "success" : "secondary"}>
                          {page.isActive ? "Hiển thị" : "Ẩn"}
                        </Badge>
                      </TableCell>
                      <TableCell className="text-center">{page.order}</TableCell>
                      <TableCell>
                        {new Date(page.createdAt).toLocaleDateString("vi-VN")}
                      </TableCell>
                      <TableCell className="text-right">
                        <div className="flex items-center justify-end gap-1">
                          <Button
                            variant="ghost"
                            size="sm"
                            onClick={() => push(`/static-pages/edit/${page.id}`)}
                          >
                            <Pencil className="h-4 w-4" />
                          </Button>
                          <Button
                            variant="ghost"
                            size="sm"
                            onClick={() => setDeleteId(page.id)}
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
            Bạn có chắc chắn muốn xóa trang này?
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
