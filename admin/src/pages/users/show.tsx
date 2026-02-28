import { useOne, useNavigation, useList } from "@refinedev/core";
import { useParams } from "react-router-dom";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Spinner } from "@/components/ui/spinner";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import {
  ArrowLeft,
  Pencil,
  User,
  Mail,
  Phone,
  Calendar,
  Shield,
  Wallet,
  Home,
  FileText,
} from "lucide-react";

export const UserShow = () => {
  const { id } = useParams();
  const { push, goBack } = useNavigation();

  const { data, isLoading } = useOne({
    resource: "users",
    id: id!,
  });

  const user = data?.data;

  // Fetch user listings
  const { data: listingsData } = useList({
    resource: "listings",
    filters: [{ field: "userId", operator: "eq", value: id }],
    pagination: { current: 1, pageSize: 5 },
    sorters: [{ field: "createdAt", order: "desc" }],
  });

  const listings = listingsData?.data || [];

  if (isLoading) {
    return (
      <div className="flex items-center justify-center h-96">
        <Spinner size="lg" />
      </div>
    );
  }

  if (!user) {
    return (
      <div className="text-center py-12">
        <p className="text-muted-foreground">Không tìm thấy người dùng</p>
      </div>
    );
  }

  return (
    <div className="space-y-6 max-w-5xl mx-auto">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-4">
          <Button variant="ghost" size="sm" onClick={goBack}>
            <ArrowLeft className="h-4 w-4 mr-2" />
            Quay lại
          </Button>
          <div>
            <h1 className="text-2xl font-bold">Chi tiết người dùng</h1>
            <p className="text-muted-foreground text-sm">ID: {user.id}</p>
          </div>
        </div>
        <Button onClick={() => push(`/users/edit/${id}`)}>
          <Pencil className="h-4 w-4 mr-2" />
          Chỉnh sửa
        </Button>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Main Info */}
        <div className="lg:col-span-2 space-y-6">
          {/* Basic Info */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <User className="h-5 w-5" />
                Thông tin cơ bản
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="flex items-start gap-6">
                <Avatar className="h-24 w-24">
                  <AvatarImage src={user.avatar} />
                  <AvatarFallback className="text-2xl">
                    {user.fullName?.[0] || user.email?.[0]?.toUpperCase()}
                  </AvatarFallback>
                </Avatar>
                <div className="flex-1 grid grid-cols-2 gap-4">
                  <div className="col-span-2">
                    <p className="text-sm text-muted-foreground">Họ và tên</p>
                    <p className="font-medium">{user.fullName || "—"}</p>
                  </div>
                  <div className="flex items-center gap-2">
                    <Mail className="h-4 w-4 text-muted-foreground" />
                    <div>
                      <p className="text-sm text-muted-foreground">Email</p>
                      <p className="font-medium">{user.email}</p>
                    </div>
                  </div>
                  <div className="flex items-center gap-2">
                    <Phone className="h-4 w-4 text-muted-foreground" />
                    <div>
                      <p className="text-sm text-muted-foreground">Số điện thoại</p>
                      <p className="font-medium">{user.phone || "—"}</p>
                    </div>
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Point Balance & Stats */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Wallet className="h-5 w-5" />
                Số dư & Thống kê
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="grid grid-cols-3 gap-4">
                <div className="text-center p-4 bg-muted/30 rounded-lg">
                  <Wallet className="h-8 w-8 mx-auto mb-2 text-primary" />
                  <p className="text-2xl font-bold text-primary">
                    {(user.pointBalance || 0).toLocaleString()}
                  </p>
                  <p className="text-sm text-muted-foreground">Điểm</p>
                </div>
                <div className="text-center p-4 bg-muted/30 rounded-lg">
                  <Home className="h-8 w-8 mx-auto mb-2 text-blue-500" />
                  <p className="text-2xl font-bold">
                    {user._count?.listings || 0}
                  </p>
                  <p className="text-sm text-muted-foreground">Tin đăng</p>
                </div>
                <div className="text-center p-4 bg-muted/30 rounded-lg">
                  <FileText className="h-8 w-8 mx-auto mb-2 text-green-500" />
                  <p className="text-2xl font-bold">
                    {user._count?.transactions || 0}
                  </p>
                  <p className="text-sm text-muted-foreground">Giao dịch</p>
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Recent Listings */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Home className="h-5 w-5" />
                Tin đăng gần đây
              </CardTitle>
            </CardHeader>
            <CardContent>
              {listings.length === 0 ? (
                <p className="text-muted-foreground text-center py-4">
                  Chưa có tin đăng nào
                </p>
              ) : (
                <Table>
                  <TableHeader>
                    <TableRow>
                      <TableHead>Tiêu đề</TableHead>
                      <TableHead className="text-right">Giá</TableHead>
                      <TableHead className="text-center">Trạng thái</TableHead>
                      <TableHead>Ngày đăng</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {listings.map((listing: any) => (
                      <TableRow
                        key={listing.id}
                        className="cursor-pointer hover:bg-muted/50"
                        onClick={() => push(`/listings/show/${listing.id}`)}
                      >
                        <TableCell className="font-medium max-w-[200px] truncate">
                          {listing.title}
                        </TableCell>
                        <TableCell className="text-right">
                          {listing.price?.toLocaleString()} VNĐ
                        </TableCell>
                        <TableCell className="text-center">
                          <Badge variant={
                            listing.status === 'APPROVED' ? 'success' :
                            listing.status === 'PENDING' ? 'warning' :
                            listing.status === 'REJECTED' ? 'destructive' : 'secondary'
                          }>
                            {listing.status === 'APPROVED' ? 'Đã duyệt' :
                             listing.status === 'PENDING' ? 'Chờ duyệt' :
                             listing.status === 'REJECTED' ? 'Từ chối' : listing.status}
                          </Badge>
                        </TableCell>
                        <TableCell>
                          {new Date(listing.createdAt).toLocaleDateString("vi-VN")}
                        </TableCell>
                      </TableRow>
                    ))}
                  </TableBody>
                </Table>
              )}
            </CardContent>
          </Card>
        </div>

        {/* Sidebar */}
        <div className="space-y-6">
          {/* Account Status */}
          <Card>
            <CardHeader>
              <CardTitle className="text-sm flex items-center gap-2">
                <Shield className="h-4 w-4" />
                Trạng thái tài khoản
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="flex items-center justify-between">
                <span className="text-muted-foreground">Vai trò</span>
                <Badge variant={user.role === "ADMIN" ? "destructive" : "secondary"}>
                  {user.role}
                </Badge>
              </div>
              <div className="flex items-center justify-between">
                <span className="text-muted-foreground">Trạng thái</span>
                <Badge variant={user.isActive ? "success" : "secondary"}>
                  {user.isActive ? "Hoạt động" : "Bị khóa"}
                </Badge>
              </div>
              <div className="flex items-center justify-between">
                <span className="text-muted-foreground">Email xác thực</span>
                <Badge variant={user.emailVerified ? "success" : "warning"}>
                  {user.emailVerified ? "Đã xác thực" : "Chưa xác thực"}
                </Badge>
              </div>
            </CardContent>
          </Card>

          {/* Dates */}
          <Card>
            <CardHeader>
              <CardTitle className="text-sm flex items-center gap-2">
                <Calendar className="h-4 w-4" />
                Thời gian
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-4 text-sm">
              <div className="flex justify-between">
                <span className="text-muted-foreground">Ngày tạo</span>
                <span>
                  {new Date(user.createdAt).toLocaleDateString("vi-VN")}
                </span>
              </div>
              <div className="flex justify-between">
                <span className="text-muted-foreground">Cập nhật</span>
                <span>
                  {new Date(user.updatedAt).toLocaleDateString("vi-VN")}
                </span>
              </div>
              {user.lastLoginAt && (
                <div className="flex justify-between">
                  <span className="text-muted-foreground">Đăng nhập cuối</span>
                  <span>
                    {new Date(user.lastLoginAt).toLocaleString("vi-VN")}
                  </span>
                </div>
              )}
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
};
