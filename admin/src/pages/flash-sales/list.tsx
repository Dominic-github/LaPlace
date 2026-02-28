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
import { Plus, Pencil, Trash2, Zap } from "lucide-react";

interface FlashSale {
  id: string;
  name: string;
  description?: string;
  status: string;
  startDate: string;
  endDate: string;
  _count?: { items: number };
}

const getStatusBadge = (status: string) => {
  const config: Record<string, { variant: "default" | "success" | "destructive"; label: string }> = {
    UPCOMING: { variant: "default", label: "Sắp diễn ra" },
    ACTIVE: { variant: "success", label: "Đang diễn ra" },
    ENDED: { variant: "destructive", label: "Đã kết thúc" },
  };
  return config[status] || { variant: "default", label: status };
};

export const FlashSaleList = () => {
  const { push } = useNavigation();
  const [current, setCurrent] = useState(1);
  const [pageSize] = useState(10);
  const [deleteId, setDeleteId] = useState<string | null>(null);

  const { data, isLoading } = useList<FlashSale>({
    resource: "flash-sales",
    pagination: { current, pageSize },
    sorters: [{ field: "startDate", order: "desc" }],
  });

  const { mutate: deleteItem, isLoading: isDeleting } = useDelete();

  const flashSales = data?.data || [];
  const total = data?.total || 0;

  const handleDelete = () => {
    if (deleteId) {
      deleteItem(
        { resource: "flash-sales", id: deleteId },
        { onSuccess: () => setDeleteId(null) }
      );
    }
  };

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold flex items-center gap-2">
            <Zap className="h-8 w-8" />
            Flash Sale
          </h1>
          <p className="text-muted-foreground mt-1">
            Quản lý chương trình Flash Sale
          </p>
        </div>
        <Button onClick={() => push("/flash-sales/create")}>
          <Plus className="h-4 w-4 mr-2" />
          Thêm Flash Sale
        </Button>
      </div>

      <Card>
        <CardHeader>
          <CardTitle>Danh sách Flash Sale ({total})</CardTitle>
        </CardHeader>
        <CardContent>
          {isLoading ? (
            <div className="flex items-center justify-center h-64">
              <Spinner size="lg" />
            </div>
          ) : flashSales.length === 0 ? (
            <div className="text-center py-12 text-muted-foreground">
              Không có Flash Sale nào
            </div>
          ) : (
            <>
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>Tên chương trình</TableHead>
                    <TableHead>Mô tả</TableHead>
                    <TableHead className="text-center">Trạng thái</TableHead>
                    <TableHead className="text-center">Số sản phẩm</TableHead>
                    <TableHead>Ngày bắt đầu</TableHead>
                    <TableHead>Ngày kết thúc</TableHead>
                    <TableHead className="text-right w-28">Thao tác</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {flashSales.map((sale) => {
                    const statusConfig = getStatusBadge(sale.status);
                    return (
                      <TableRow key={sale.id}>
                        <TableCell className="font-medium">{sale.name}</TableCell>
                        <TableCell className="text-muted-foreground max-w-xs truncate">
                          {sale.description || "—"}
                        </TableCell>
                        <TableCell className="text-center">
                          <Badge variant={statusConfig.variant}>{statusConfig.label}</Badge>
                        </TableCell>
                        <TableCell className="text-center">{sale._count?.items || 0}</TableCell>
                        <TableCell>
                          {new Date(sale.startDate).toLocaleString("vi-VN")}
                        </TableCell>
                        <TableCell>
                          {new Date(sale.endDate).toLocaleString("vi-VN")}
                        </TableCell>
                        <TableCell className="text-right">
                          <div className="flex items-center justify-end gap-1">
                            <Button
                              variant="ghost"
                              size="sm"
                              onClick={() => push(`/flash-sales/edit/${sale.id}`)}
                            >
                              <Pencil className="h-4 w-4" />
                            </Button>
                            <Button
                              variant="ghost"
                              size="sm"
                              onClick={() => setDeleteId(sale.id)}
                              className="text-destructive hover:text-destructive"
                            >
                              <Trash2 className="h-4 w-4" />
                            </Button>
                          </div>
                        </TableCell>
                      </TableRow>
                    );
                  })}
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
            Bạn có chắc chắn muốn xóa Flash Sale này?
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
