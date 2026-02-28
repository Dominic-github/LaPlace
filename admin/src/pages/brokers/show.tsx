import { useOne, useNavigation } from "@refinedev/core";
import { useParams } from "react-router-dom";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Spinner } from "@/components/ui/spinner";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import {
  ArrowLeft,
  User,
  Mail,
  Phone,
  MapPin,
  Calendar,
  CheckCircle,
  XCircle,
  CreditCard,
  FileText,
} from "lucide-react";

export const BrokerShow = () => {
  const { id } = useParams();
  const { goBack } = useNavigation();

  const { data, isLoading } = useOne({
    resource: "brokers",
    id: id!,
  });

  const broker = data?.data;

  if (isLoading) {
    return (
      <div className="flex items-center justify-center h-96">
        <Spinner size="lg" />
      </div>
    );
  }

  if (!broker) {
    return (
      <div className="text-center py-12">
        <p className="text-muted-foreground">Không tìm thấy thông tin môi giới</p>
        <Button variant="outline" onClick={goBack} className="mt-4">
          <ArrowLeft className="h-4 w-4 mr-2" />
          Quay lại
        </Button>
      </div>
    );
  }

  return (
    <div className="space-y-6 max-w-4xl mx-auto">
      {/* Header */}
      <div className="flex items-center gap-4">
        <Button variant="ghost" size="sm" onClick={goBack}>
          <ArrowLeft className="h-4 w-4 mr-2" />
          Quay lại
        </Button>
        <div>
          <h1 className="text-2xl font-bold">Chi tiết môi giới</h1>
          <p className="text-muted-foreground text-sm">ID: {broker.id}</p>
        </div>
      </div>

      <div className="grid gap-6 md:grid-cols-3">
        {/* Main Info */}
        <div className="md:col-span-2 space-y-6">
          {/* User Info */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <User className="h-5 w-5" />
                Thông tin người dùng
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="flex items-start gap-6">
                <Avatar className="h-20 w-20">
                  <AvatarImage src={broker.user?.avatar} />
                  <AvatarFallback className="text-xl">
                    {broker.user?.fullName?.[0] || broker.user?.email?.[0]?.toUpperCase()}
                  </AvatarFallback>
                </Avatar>
                <div className="flex-1 space-y-3">
                  <div>
                    <p className="text-sm text-muted-foreground">Họ và tên</p>
                    <p className="font-medium text-lg">{broker.user?.fullName || "—"}</p>
                  </div>
                  <div className="grid grid-cols-2 gap-4">
                    <div className="flex items-center gap-2">
                      <Mail className="h-4 w-4 text-muted-foreground" />
                      <div>
                        <p className="text-sm text-muted-foreground">Email</p>
                        <p className="font-medium">{broker.user?.email}</p>
                      </div>
                    </div>
                    <div className="flex items-center gap-2">
                      <Phone className="h-4 w-4 text-muted-foreground" />
                      <div>
                        <p className="text-sm text-muted-foreground">Số điện thoại</p>
                        <p className="font-medium">{broker.user?.phone || "—"}</p>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>

          {/* ID Card Info */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <CreditCard className="h-5 w-5" />
                Thông tin CCCD/CMND
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div>
                <p className="text-sm text-muted-foreground">Số CCCD/CMND</p>
                <p className="font-medium text-lg">{broker.idCardNumber || "—"}</p>
              </div>
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <p className="text-sm text-muted-foreground mb-2">Mặt trước</p>
                  {broker.idCardFront ? (
                    <img
                      src={broker.idCardFront}
                      alt="CCCD mặt trước"
                      className="w-full h-40 object-cover rounded-lg border"
                    />
                  ) : (
                    <div className="w-full h-40 bg-muted rounded-lg flex items-center justify-center">
                      <FileText className="h-8 w-8 text-muted-foreground" />
                    </div>
                  )}
                </div>
                <div>
                  <p className="text-sm text-muted-foreground mb-2">Mặt sau</p>
                  {broker.idCardBack ? (
                    <img
                      src={broker.idCardBack}
                      alt="CCCD mặt sau"
                      className="w-full h-40 object-cover rounded-lg border"
                    />
                  ) : (
                    <div className="w-full h-40 bg-muted rounded-lg flex items-center justify-center">
                      <FileText className="h-8 w-8 text-muted-foreground" />
                    </div>
                  )}
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Location */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <MapPin className="h-5 w-5" />
                Khu vực hoạt động
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-2">
                <div className="flex items-center gap-2">
                  <span className="text-muted-foreground">Tỉnh/TP:</span>
                  <span className="font-medium">{broker.province?.name || "—"}</span>
                </div>
                <div className="flex items-center gap-2">
                  <span className="text-muted-foreground">Phường/Xã:</span>
                  <span className="font-medium">{broker.ward?.name || "—"}</span>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Sidebar */}
        <div className="space-y-6">
          {/* Verification Status */}
          <Card>
            <CardHeader>
              <CardTitle className="text-sm">Trạng thái xác minh</CardTitle>
            </CardHeader>
            <CardContent>
              {broker.isVerified ? (
                <div className="text-center">
                  <CheckCircle className="h-12 w-12 text-green-500 mx-auto mb-2" />
                  <Badge variant="success" className="text-sm">Đã xác minh</Badge>
                  {broker.verifiedAt && (
                    <p className="text-xs text-muted-foreground mt-2">
                      Ngày xác minh: {new Date(broker.verifiedAt).toLocaleDateString("vi-VN")}
                    </p>
                  )}
                </div>
              ) : (
                <div className="text-center">
                  <XCircle className="h-12 w-12 text-yellow-500 mx-auto mb-2" />
                  <Badge variant="warning" className="text-sm">Chờ xác minh</Badge>
                </div>
              )}
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
            <CardContent className="space-y-3">
              <div>
                <p className="text-sm text-muted-foreground">Ngày đăng ký</p>
                <p className="font-medium">
                  {new Date(broker.createdAt).toLocaleDateString("vi-VN")}
                </p>
              </div>
              <div>
                <p className="text-sm text-muted-foreground">Cập nhật lần cuối</p>
                <p className="font-medium">
                  {new Date(broker.updatedAt).toLocaleDateString("vi-VN")}
                </p>
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
};
