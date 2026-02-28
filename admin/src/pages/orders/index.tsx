import { useState } from "react";
import { useList, useNavigation } from "@refinedev/core";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import { Select } from "@/components/ui/select";
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
import { Eye, Search, ShoppingCart } from "lucide-react";

interface Order {
  id: string;
  orderNumber: string;
  total: number;
  status: string;
  paymentStatus: string;
  user?: { firstName?: string; lastName?: string; email?: string };
  createdAt: string;
}

const statusColors: Record<string, "default" | "secondary" | "destructive" | "success" | "warning"> = {
  PENDING: "warning",
  PROCESSING: "default",
  SHIPPED: "default",
  DELIVERED: "success",
  CANCELLED: "destructive",
};

const statusLabels: Record<string, string> = {
  PENDING: "Chờ xử lý",
  PROCESSING: "Đang xử lý",
  SHIPPED: "Đang giao",
  DELIVERED: "Đã giao",
  CANCELLED: "Đã hủy",
};

export const OrderList = () => {
  const { push } = useNavigation();
  const [current, setCurrent] = useState(1);
  const [pageSize] = useState(10);
  const [search, setSearch] = useState("");
  const [statusFilter, setStatusFilter] = useState("");

  const filters = [];
  if (search) {
    filters.push({ field: "orderNumber", operator: "contains" as const, value: search });
  }
  if (statusFilter) {
    filters.push({ field: "status", operator: "eq" as const, value: statusFilter });
  }

  const { data, isLoading } = useList<Order>({
    resource: "orders",
    pagination: { current, pageSize },
    filters,
    sorters: [{ field: "createdAt", order: "desc" }],
  });

  const orders = data?.data || [];
  const total = data?.total || 0;

  return (
    <div className="space-y-6">
      {/* Header */}
      <div>
        <h1 className="text-3xl font-bold flex items-center gap-2">
          <ShoppingCart className="h-8 w-8" />
          Đơn hàng
        </h1>
        <p className="text-muted-foreground mt-1">
          Quản lý đơn hàng của cửa hàng
        </p>
      </div>

      {/* Filters */}
      <Card>
        <CardContent className="pt-6">
          <div className="flex gap-4">
            <div className="relative flex-1 max-w-sm">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
              <Input
                placeholder="Tìm mã đơn hàng..."
                value={search}
                onChange={(e) => setSearch(e.target.value)}
                className="pl-9"
              />
            </div>
            <Select
              value={statusFilter}
              onChange={(e) => setStatusFilter(e.target.value)}
              className="w-48"
            >
              <option value="">Tất cả trạng thái</option>
              <option value="PENDING">Chờ xử lý</option>
              <option value="PROCESSING">Đang xử lý</option>
              <option value="SHIPPED">Đang giao</option>
              <option value="DELIVERED">Đã giao</option>
              <option value="CANCELLED">Đã hủy</option>
            </Select>
          </div>
        </CardContent>
      </Card>

      {/* Table */}
      <Card>
        <CardHeader>
          <CardTitle>Danh sách đơn hàng ({total})</CardTitle>
        </CardHeader>
        <CardContent>
          {isLoading ? (
            <div className="flex items-center justify-center h-64">
              <Spinner size="lg" />
            </div>
          ) : orders.length === 0 ? (
            <div className="text-center py-12 text-muted-foreground">
              Không có đơn hàng nào
            </div>
          ) : (
            <>
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>Mã đơn</TableHead>
                    <TableHead>Khách hàng</TableHead>
                    <TableHead className="text-right">Tổng tiền</TableHead>
                    <TableHead className="text-center">Trạng thái</TableHead>
                    <TableHead className="text-center">Thanh toán</TableHead>
                    <TableHead>Ngày đặt</TableHead>
                    <TableHead className="text-right w-20">Thao tác</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {orders.map((order) => (
                    <TableRow key={order.id}>
                      <TableCell>
                        <span className="font-mono font-medium">
                          {order.orderNumber}
                        </span>
                      </TableCell>
                      <TableCell>
                        <div className="font-medium">
                          {order.user?.firstName} {order.user?.lastName}
                        </div>
                        <div className="text-sm text-muted-foreground">
                          {order.user?.email}
                        </div>
                      </TableCell>
                      <TableCell className="text-right font-medium">
                        {order.total?.toLocaleString()} VNĐ
                      </TableCell>
                      <TableCell className="text-center">
                        <Badge variant={statusColors[order.status] || "secondary"}>
                          {statusLabels[order.status] || order.status}
                        </Badge>
                      </TableCell>
                      <TableCell className="text-center">
                        <Badge
                          variant={order.paymentStatus === "PAID" ? "success" : "warning"}
                        >
                          {order.paymentStatus === "PAID" ? "Đã thanh toán" : "Chưa thanh toán"}
                        </Badge>
                      </TableCell>
                      <TableCell>
                        {new Date(order.createdAt).toLocaleDateString("vi-VN")}
                      </TableCell>
                      <TableCell className="text-right">
                        <Button
                          variant="ghost"
                          size="sm"
                          onClick={() => push(`/orders/show/${order.id}`)}
                        >
                          <Eye className="h-4 w-4" />
                        </Button>
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
    </div>
  );
};

export { OrderShow } from "./show";
export { OrderEdit } from "./edit";
