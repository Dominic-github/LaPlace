import { useOne, useUpdate, useNavigation } from "@refinedev/core";
import { useParams } from "react-router-dom";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Select } from "@/components/ui/select";
import { Spinner } from "@/components/ui/spinner";
import {
    Table,
    TableBody,
    TableCell,
    TableHead,
    TableHeader,
    TableRow,
} from "@/components/ui/table";
import { ArrowLeft, Package } from "lucide-react";
import { useState } from "react";

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

export const OrderShow = () => {
    const { id } = useParams();
    const { goBack } = useNavigation();
    const { data, isLoading, refetch } = useOne({
        resource: "orders",
        id: id!,
    });
    const { mutate: update, isLoading: isUpdating } = useUpdate();
    const [newStatus, setNewStatus] = useState("");

    const order = data?.data;

    const handleStatusUpdate = () => {
        if (newStatus && newStatus !== order?.status) {
            update(
                {
                    resource: "orders",
                    id: id!,
                    values: { status: newStatus },
                },
                {
                    onSuccess: () => {
                        refetch();
                        setNewStatus("");
                    },
                }
            );
        }
    };

    if (isLoading) {
        return (
            <div className="flex items-center justify-center h-96">
                <Spinner size="lg" />
            </div>
        );
    }

    if (!order) {
        return (
            <div className="text-center py-12">
                <p className="text-muted-foreground">Không tìm thấy đơn hàng</p>
            </div>
        );
    }

    return (
        <div className="space-y-6">
            {/* Header */}
            <div className="flex items-center justify-between">
                <div className="flex items-center gap-4">
                    <Button variant="ghost" size="sm" onClick={goBack}>
                        <ArrowLeft className="h-4 w-4 mr-2" />
                        Quay lại
                    </Button>
                    <div>
                        <h1 className="text-3xl font-bold">
                            Đơn hàng #{order.orderNumber}
                        </h1>
                        <p className="text-muted-foreground mt-1">
                            {new Date(order.createdAt).toLocaleString("vi-VN")}
                        </p>
                    </div>
                </div>
                <Badge variant={statusColors[order.status]} className="text-sm px-3 py-1">
                    {statusLabels[order.status]}
                </Badge>
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
                {/* Order Items */}
                <div className="lg:col-span-2 space-y-6">
                    <Card>
                        <CardHeader>
                            <CardTitle>Sản phẩm ({order.items?.length || 0})</CardTitle>
                        </CardHeader>
                        <CardContent>
                            <Table>
                                <TableHeader>
                                    <TableRow>
                                        <TableHead>Sản phẩm</TableHead>
                                        <TableHead className="text-center">SL</TableHead>
                                        <TableHead className="text-right">Đơn giá</TableHead>
                                        <TableHead className="text-right">Thành tiền</TableHead>
                                    </TableRow>
                                </TableHeader>
                                <TableBody>
                                    {order.items?.map((item: any) => (
                                        <TableRow key={item.id}>
                                            <TableCell>
                                                <div className="flex items-center gap-3">
                                                    {item.product?.images?.[0] ? (
                                                        <img
                                                            src={item.product.images[0]}
                                                            alt={item.product.name}
                                                            className="w-12 h-12 object-cover rounded"
                                                        />
                                                    ) : (
                                                        <div className="w-12 h-12 bg-muted rounded flex items-center justify-center">
                                                            <Package className="h-6 w-6 text-muted-foreground" />
                                                        </div>
                                                    )}
                                                    <div>
                                                        <p className="font-medium">{item.product?.name}</p>
                                                        {item.variant && (
                                                            <p className="text-sm text-muted-foreground">
                                                                {item.variant}
                                                            </p>
                                                        )}
                                                    </div>
                                                </div>
                                            </TableCell>
                                            <TableCell className="text-center">{item.quantity}</TableCell>
                                            <TableCell className="text-right">
                                                {item.price?.toLocaleString()} VNĐ
                                            </TableCell>
                                            <TableCell className="text-right font-medium">
                                                {(item.price * item.quantity)?.toLocaleString()} VNĐ
                                            </TableCell>
                                        </TableRow>
                                    ))}
                                </TableBody>
                            </Table>

                            <div className="mt-4 border-t pt-4 space-y-2">
                                <div className="flex justify-between">
                                    <span className="text-muted-foreground">Tạm tính</span>
                                    <span>{order.subtotal?.toLocaleString()} VNĐ</span>
                                </div>
                                <div className="flex justify-between">
                                    <span className="text-muted-foreground">Phí vận chuyển</span>
                                    <span>{order.shippingFee?.toLocaleString()} VNĐ</span>
                                </div>
                                {order.discount > 0 && (
                                    <div className="flex justify-between text-green-600">
                                        <span>Giảm giá</span>
                                        <span>-{order.discount?.toLocaleString()} VNĐ</span>
                                    </div>
                                )}
                                <div className="flex justify-between text-lg font-bold border-t pt-2">
                                    <span>Tổng cộng</span>
                                    <span>{order.total?.toLocaleString()} VNĐ</span>
                                </div>
                            </div>
                        </CardContent>
                    </Card>
                </div>

                {/* Sidebar */}
                <div className="space-y-6">
                    {/* Update Status */}
                    <Card>
                        <CardHeader>
                            <CardTitle>Cập nhật trạng thái</CardTitle>
                        </CardHeader>
                        <CardContent className="space-y-4">
                            <Select
                                value={newStatus || order.status}
                                onChange={(e) => setNewStatus(e.target.value)}
                            >
                                <option value="PENDING">Chờ xử lý</option>
                                <option value="PROCESSING">Đang xử lý</option>
                                <option value="SHIPPED">Đang giao</option>
                                <option value="DELIVERED">Đã giao</option>
                                <option value="CANCELLED">Đã hủy</option>
                            </Select>
                            <Button
                                className="w-full"
                                onClick={handleStatusUpdate}
                                disabled={isUpdating || !newStatus || newStatus === order.status}
                            >
                                {isUpdating ? "Đang cập nhật..." : "Cập nhật"}
                            </Button>
                        </CardContent>
                    </Card>

                    {/* Customer Info */}
                    <Card>
                        <CardHeader>
                            <CardTitle>Thông tin khách hàng</CardTitle>
                        </CardHeader>
                        <CardContent className="space-y-3 text-sm">
                            <div>
                                <p className="text-muted-foreground">Họ tên</p>
                                <p className="font-medium">
                                    {order.user?.firstName} {order.user?.lastName}
                                </p>
                            </div>
                            <div>
                                <p className="text-muted-foreground">Email</p>
                                <p className="font-medium">{order.user?.email}</p>
                            </div>
                            <div>
                                <p className="text-muted-foreground">Điện thoại</p>
                                <p className="font-medium">{order.phone || order.user?.phone || "—"}</p>
                            </div>
                        </CardContent>
                    </Card>

                    {/* Shipping Address */}
                    <Card>
                        <CardHeader>
                            <CardTitle>Địa chỉ giao hàng</CardTitle>
                        </CardHeader>
                        <CardContent>
                            <p className="text-sm">
                                {order.shippingAddress || "Chưa có địa chỉ"}
                            </p>
                        </CardContent>
                    </Card>

                    {/* Payment Info */}
                    <Card>
                        <CardHeader>
                            <CardTitle>Thanh toán</CardTitle>
                        </CardHeader>
                        <CardContent className="space-y-3 text-sm">
                            <div className="flex justify-between">
                                <span className="text-muted-foreground">Phương thức</span>
                                <span>{order.paymentMethod || "COD"}</span>
                            </div>
                            <div className="flex justify-between">
                                <span className="text-muted-foreground">Trạng thái</span>
                                <Badge
                                    variant={order.paymentStatus === "PAID" ? "success" : "warning"}
                                >
                                    {order.paymentStatus === "PAID" ? "Đã thanh toán" : "Chưa thanh toán"}
                                </Badge>
                            </div>
                        </CardContent>
                    </Card>
                </div>
            </div>
        </div>
    );
};
