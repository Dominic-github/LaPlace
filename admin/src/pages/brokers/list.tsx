import { useState } from "react";
import { useList, useDelete, useNavigation, useUpdate } from "@refinedev/core";
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
import { Users, Search, Eye, CheckCircle, XCircle, Trash2 } from "lucide-react";

interface Broker {
  id: string;
  idCardNumber: string;
  isVerified: boolean;
  verifiedAt?: string;
  createdAt: string;
  user?: {
    id: string;
    fullName?: string;
    email: string;
    phone?: string;
  };
  province?: {
    name: string;
  };
}

export const BrokerList = () => {
  const { push } = useNavigation();
  const [current, setCurrent] = useState(1);
  const [pageSize] = useState(10);
  const [search, setSearch] = useState("");
  const [deleteId, setDeleteId] = useState<string | null>(null);

  const { data, isLoading } = useList<Broker>({
    resource: "brokers",
    pagination: { current, pageSize },
    sorters: [{ field: "createdAt", order: "desc" }],
  });

  const { mutate: deleteItem, isLoading: isDeleting } = useDelete();
  const { mutate: updateItem, isLoading: isUpdating } = useUpdate();

  const brokers = data?.data || [];
  const total = data?.total || 0;

  const handleVerify = (brokerId: string, currentStatus: boolean) => {
    updateItem({
      resource: "brokers",
      id: brokerId,
      values: { isVerified: !currentStatus }
    });
  };

  const handleDelete = () => {
    if (deleteId) {
      deleteItem(
        { resource: "brokers", id: deleteId },
        { onSuccess: () => setDeleteId(null) }
      );
    }
  };

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold flex items-center gap-2">
            <Users className="h-8 w-8" />
            Môi giới
          </h1>
          <p className="text-muted-foreground mt-1">
            Quản lý môi giới bất động sản
          </p>
        </div>
      </div>

      <Card>
        <CardContent className="pt-6">
          <div className="relative flex-1 max-w-sm">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
            <Input
              placeholder="Tìm môi giới..."
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              className="pl-9"
            />
          </div>
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle>Danh sách môi giới ({total})</CardTitle>
        </CardHeader>
        <CardContent>
          {isLoading ? (
            <div className="flex items-center justify-center h-64">
              <Spinner size="lg" />
            </div>
          ) : brokers.length === 0 ? (
            <div className="text-center py-12 text-muted-foreground">
              Không có môi giới nào
            </div>
          ) : (
            <>
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>Họ tên</TableHead>
                    <TableHead>Email</TableHead>
                    <TableHead>Số điện thoại</TableHead>
                    <TableHead>CCCD</TableHead>
                    <TableHead>Khu vực</TableHead>
                    <TableHead className="text-center">Xác minh</TableHead>
                    <TableHead>Ngày đăng ký</TableHead>
                    <TableHead className="text-right w-28">Thao tác</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {brokers.map((broker) => (
                    <TableRow key={broker.id}>
                      <TableCell className="font-medium">
                        {broker.user?.fullName || "—"}
                      </TableCell>
                      <TableCell>{broker.user?.email}</TableCell>
                      <TableCell>{broker.user?.phone || "—"}</TableCell>
                      <TableCell>{broker.idCardNumber}</TableCell>
                      <TableCell>{broker.province?.name || "—"}</TableCell>
                      <TableCell className="text-center">
                        {broker.isVerified ? (
                          <Badge variant="success" className="gap-1">
                            <CheckCircle className="h-3 w-3" />
                            Đã xác minh
                          </Badge>
                        ) : (
                          <Badge variant="warning" className="gap-1">
                            <XCircle className="h-3 w-3" />
                            Chờ xác minh
                          </Badge>
                        )}
                      </TableCell>
                      <TableCell>
                        {new Date(broker.createdAt).toLocaleDateString("vi-VN")}
                      </TableCell>
                      <TableCell className="text-right">
                        <div className="flex items-center justify-end gap-1">
                          {!broker.isVerified ? (
                            <Button
                              variant="ghost"
                              size="sm"
                              onClick={() => handleVerify(broker.id, broker.isVerified)}
                              disabled={isUpdating}
                              className="text-green-600 hover:text-green-700"
                              title="Xác minh"
                            >
                              <CheckCircle className="h-4 w-4" />
                            </Button>
                          ) : (
                            <Button
                              variant="ghost"
                              size="sm"
                              onClick={() => handleVerify(broker.id, broker.isVerified)}
                              disabled={isUpdating}
                              className="text-orange-500 hover:text-orange-600"
                              title="Hủy xác minh"
                            >
                              <XCircle className="h-4 w-4" />
                            </Button>
                          )}
                          <Button
                            variant="ghost"
                            size="sm"
                            onClick={() => push(`/brokers/show/${broker.id}`)}
                          >
                            <Eye className="h-4 w-4" />
                          </Button>
                          <Button
                            variant="ghost"
                            size="sm"
                            onClick={() => setDeleteId(broker.id)}
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
            Bạn có chắc chắn muốn xóa môi giới này?
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
