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
import { Plus, Pencil, Trash2, Search, Ticket } from "lucide-react";

interface Coupon {
  id: string;
  code: string;
  discountType: "PERCENTAGE" | "FIXED";
  discountValue: number;
  minOrderValue?: number;
  maxDiscount?: number;
  usageLimit?: number;
  usageCount: number;
  isActive: boolean;
  expiresAt?: string;
}

export const CouponList = () => {
  const { push } = useNavigation();
  const [current, setCurrent] = useState(1);
  const [pageSize] = useState(10);
  const [search, setSearch] = useState("");
  const [deleteId, setDeleteId] = useState<string | null>(null);

  const { data, isLoading } = useList<Coupon>({
    resource: "coupons",
    pagination: { current, pageSize },
    filters: search ? [{ field: "code", operator: "contains", value: search }] : [],
  });

  const { mutate: deleteCoupon, isLoading: isDeleting } = useDelete();

  const coupons = data?.data || [];
  const total = data?.total || 0;

  const handleDelete = () => {
    if (deleteId) {
      deleteCoupon(
        { resource: "coupons", id: deleteId },
        { onSuccess: () => setDeleteId(null) }
      );
    }
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold flex items-center gap-2">
            <Ticket className="h-8 w-8" />
            Mã giảm giá
          </h1>
          <p className="text-muted-foreground mt-1">
            Quản lý mã giảm giá của cửa hàng
          </p>
        </div>
        <Button onClick={() => push("/coupons/create")}>
          <Plus className="h-4 w-4 mr-2" />
          Thêm mã
        </Button>
      </div>

      {/* Filters */}
      <Card>
        <CardContent className="pt-6">
          <div className="flex gap-4">
            <div className="relative flex-1 max-w-sm">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
              <Input
                placeholder="Tìm mã giảm giá..."
                value={search}
                onChange={(e) => setSearch(e.target.value)}
                className="pl-9"
              />
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Table */}
      <Card>
        <CardHeader>
          <CardTitle>Danh sách mã giảm giá ({total})</CardTitle>
        </CardHeader>
        <CardContent>
          {isLoading ? (
            <div className="flex items-center justify-center h-64">
              <Spinner size="lg" />
            </div>
          ) : coupons.length === 0 ? (
            <div className="text-center py-12 text-muted-foreground">
              Không có mã giảm giá nào
            </div>
          ) : (
            <>
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>Mã</TableHead>
                    <TableHead className="text-center">Loại</TableHead>
                    <TableHead className="text-right">Giá trị</TableHead>
                    <TableHead className="text-center">Đã dùng</TableHead>
                    <TableHead className="text-center">Trạng thái</TableHead>
                    <TableHead>Hết hạn</TableHead>
                    <TableHead className="text-right w-28">Thao tác</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {coupons.map((coupon) => (
                    <TableRow key={coupon.id}>
                      <TableCell>
                        <span className="font-mono font-bold text-primary">
                          {coupon.code}
                        </span>
                      </TableCell>
                      <TableCell className="text-center">
                        <Badge variant="secondary">
                          {coupon.discountType === "PERCENTAGE" ? "Phần trăm" : "Cố định"}
                        </Badge>
                      </TableCell>
                      <TableCell className="text-right font-medium">
                        {coupon.discountType === "PERCENTAGE"
                          ? `${coupon.discountValue}%`
                          : `${coupon.discountValue?.toLocaleString()} VNĐ`}
                      </TableCell>
                      <TableCell className="text-center">
                        {coupon.usageCount}
                        {coupon.usageLimit && ` / ${coupon.usageLimit}`}
                      </TableCell>
                      <TableCell className="text-center">
                        <Badge variant={coupon.isActive ? "success" : "secondary"}>
                          {coupon.isActive ? "Hoạt động" : "Tạm dừng"}
                        </Badge>
                      </TableCell>
                      <TableCell>
                        {coupon.expiresAt
                          ? new Date(coupon.expiresAt).toLocaleDateString("vi-VN")
                          : "Không giới hạn"}
                      </TableCell>
                      <TableCell className="text-right">
                        <div className="flex items-center justify-end gap-1">
                          <Button
                            variant="ghost"
                            size="sm"
                            onClick={() => push(`/coupons/edit/${coupon.id}`)}
                          >
                            <Pencil className="h-4 w-4" />
                          </Button>
                          <Button
                            variant="ghost"
                            size="sm"
                            onClick={() => setDeleteId(coupon.id)}
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

      {/* Delete Dialog */}
      <Dialog open={!!deleteId} onClose={() => setDeleteId(null)}>
        <DialogHeader>
          <DialogTitle>Xác nhận xóa</DialogTitle>
          <DialogDescription>
            Bạn có chắc chắn muốn xóa mã giảm giá này?
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

export { CouponCreate } from "./create";
export { CouponEdit } from "./edit";
