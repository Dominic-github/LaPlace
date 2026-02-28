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
import { Plus, Pencil, Trash2, Image as ImageIcon } from "lucide-react";

interface Banner {
  id: string;
  title: string;
  image: string;
  position: string;
  order: number;
  isActive: boolean;
  startDate?: string;
  endDate?: string;
}

const positionLabels: Record<string, string> = {
  HOME_MAIN: "Trang chủ - Chính",
  HOME_SECONDARY: "Trang chủ - Phụ",
  CATEGORY: "Danh mục",
  PRODUCT: "Sản phẩm",
  SIDEBAR: "Sidebar",
};

export const BannerList = () => {
  const { push } = useNavigation();
  const [current, setCurrent] = useState(1);
  const [pageSize] = useState(10);
  const [deleteId, setDeleteId] = useState<string | null>(null);

  const { data, isLoading } = useList<Banner>({
    resource: "banners",
    pagination: { current, pageSize },
    sorters: [{ field: "order", order: "asc" }],
  });

  const { mutate: deleteItem, isLoading: isDeleting } = useDelete();

  const banners = data?.data || [];
  const total = data?.total || 0;

  const handleDelete = () => {
    if (deleteId) {
      deleteItem(
        { resource: "banners", id: deleteId },
        { onSuccess: () => setDeleteId(null) }
      );
    }
  };

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold flex items-center gap-2">
            <ImageIcon className="h-8 w-8" />
            Banners
          </h1>
          <p className="text-muted-foreground mt-1">
            Quản lý banner quảng cáo
          </p>
        </div>
        <Button onClick={() => push("/banners/create")}>
          <Plus className="h-4 w-4 mr-2" />
          Thêm banner
        </Button>
      </div>

      <Card>
        <CardHeader>
          <CardTitle>Danh sách Banner ({total})</CardTitle>
        </CardHeader>
        <CardContent>
          {isLoading ? (
            <div className="flex items-center justify-center h-64">
              <Spinner size="lg" />
            </div>
          ) : banners.length === 0 ? (
            <div className="text-center py-12 text-muted-foreground">
              Không có banner nào
            </div>
          ) : (
            <>
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead className="w-24">Ảnh</TableHead>
                    <TableHead>Tiêu đề</TableHead>
                    <TableHead>Vị trí</TableHead>
                    <TableHead className="text-center">Thứ tự</TableHead>
                    <TableHead className="text-center">Trạng thái</TableHead>
                    <TableHead>Ngày bắt đầu</TableHead>
                    <TableHead>Ngày kết thúc</TableHead>
                    <TableHead className="text-right w-28">Thao tác</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {banners.map((banner) => (
                    <TableRow key={banner.id}>
                      <TableCell>
                        {banner.image ? (
                          <img
                            src={banner.image}
                            alt={banner.title}
                            className="w-20 h-10 object-cover rounded"
                          />
                        ) : (
                          <div className="w-20 h-10 bg-muted rounded flex items-center justify-center">
                            <ImageIcon className="h-5 w-5 text-muted-foreground" />
                          </div>
                        )}
                      </TableCell>
                      <TableCell className="font-medium">{banner.title}</TableCell>
                      <TableCell>{positionLabels[banner.position] || banner.position}</TableCell>
                      <TableCell className="text-center">{banner.order}</TableCell>
                      <TableCell className="text-center">
                        <Badge variant={banner.isActive ? "success" : "secondary"}>
                          {banner.isActive ? "Hoạt động" : "Ẩn"}
                        </Badge>
                      </TableCell>
                      <TableCell>
                        {banner.startDate
                          ? new Date(banner.startDate).toLocaleDateString("vi-VN")
                          : "—"}
                      </TableCell>
                      <TableCell>
                        {banner.endDate
                          ? new Date(banner.endDate).toLocaleDateString("vi-VN")
                          : "—"}
                      </TableCell>
                      <TableCell className="text-right">
                        <div className="flex items-center justify-end gap-1">
                          <Button
                            variant="ghost"
                            size="sm"
                            onClick={() => push(`/banners/edit/${banner.id}`)}
                          >
                            <Pencil className="h-4 w-4" />
                          </Button>
                          <Button
                            variant="ghost"
                            size="sm"
                            onClick={() => setDeleteId(banner.id)}
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
            Bạn có chắc chắn muốn xóa banner này?
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
