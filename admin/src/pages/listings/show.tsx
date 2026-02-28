import { useOne, useUpdate } from "@refinedev/core";
import { useParams, useNavigate } from "react-router-dom";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Separator } from "@/components/ui/separator";
import {
  ArrowLeft, Edit, Check, X, Trash2,
  Home, MapPin, DollarSign, Ruler, Bed, Bath,
  Compass, Building, FileText, Eye, Calendar, User,
  Phone, Mail, Star
} from "lucide-react";

const statusColors: Record<string, string> = {
  PENDING: "bg-yellow-500/20 text-yellow-500 border-yellow-500",
  APPROVED: "bg-green-500/20 text-green-500 border-green-500",
  REJECTED: "bg-red-500/20 text-red-500 border-red-500",
  EXPIRED: "bg-gray-500/20 text-gray-500 border-gray-500",
};

const statusLabels: Record<string, string> = {
  PENDING: "Chờ duyệt",
  APPROVED: "Đã duyệt",
  REJECTED: "Từ chối",
  EXPIRED: "Hết hạn",
};

const directionLabels: Record<string, string> = {
  NORTH: "Bắc",
  SOUTH: "Nam",
  EAST: "Đông",
  WEST: "Tây",
  NORTHEAST: "Đông Bắc",
  NORTHWEST: "Tây Bắc",
  SOUTHEAST: "Đông Nam",
  SOUTHWEST: "Tây Nam",
};

const legalLabels: Record<string, string> = {
  SO_HONG: "Sổ hồng",
  SO_DO: "Sổ đỏ",
  HOP_DONG: "Hợp đồng",
  GIAY_TAY: "Giấy tay",
  DANG_CHO: "Đang chờ sổ",
};

const furnitureLabels: Record<string, string> = {
  FULL: "Nội thất đầy đủ",
  BASIC: "Nội thất cơ bản",
  NONE: "Nhà trống",
};

export const ListingShow = () => {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const { mutate: updateListing } = useUpdate();

  const { data, isLoading, refetch } = useOne({
    resource: "listings",
    id: id || "",
  });

  const listing = data?.data;

  const handleApprove = () => {
    if (confirm("Duyệt tin đăng này?")) {
      updateListing({
        resource: "listings",
        id: id || "",
        values: { status: "APPROVED" },
      }, {
        onSuccess: () => refetch(),
      });
    }
  };

  const handleReject = () => {
    if (confirm("Từ chối tin đăng này?")) {
      updateListing({
        resource: "listings",
        id: id || "",
        values: { status: "REJECTED" },
      }, {
        onSuccess: () => refetch(),
      });
    }
  };

  const formatPrice = (price: number, unit: string) => {
    if (unit === "TOTAL") {
      if (price >= 1000000000) {
        return `${(price / 1000000000).toFixed(1)} tỷ`;
      }
      return `${(price / 1000000).toFixed(0)} triệu`;
    }
    if (unit === "M2") {
      return `${(price / 1000000).toFixed(1)} triệu/m²`;
    }
    return `${(price / 1000000).toFixed(1)} triệu/tháng`;
  };

  if (isLoading) {
    return (
      <div className="flex items-center justify-center h-64">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary"></div>
      </div>
    );
  }

  if (!listing) {
    return (
      <div className="text-center py-12">
        <p className="text-muted-foreground">Không tìm thấy tin đăng</p>
        <Button variant="outline" className="mt-4" onClick={() => navigate("/listings")}>
          <ArrowLeft className="h-4 w-4 mr-2" />
          Quay lại
        </Button>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-4">
          <Button variant="outline" onClick={() => navigate("/listings")}>
            <ArrowLeft className="h-4 w-4 mr-2" />
            Quay lại
          </Button>
          <div>
            <h1 className="text-2xl font-bold">Chi tiết tin đăng</h1>
            <p className="text-muted-foreground">ID: {listing.id}</p>
          </div>
        </div>
        <div className="flex gap-2">
          {listing.status === "PENDING" && (
            <>
              <Button variant="outline" className="text-green-500" onClick={handleApprove}>
                <Check className="h-4 w-4 mr-2" />
                Duyệt tin
              </Button>
              <Button variant="outline" className="text-red-500" onClick={handleReject}>
                <X className="h-4 w-4 mr-2" />
                Từ chối
              </Button>
            </>
          )}
          <Button onClick={() => navigate(`/listings/edit/${id}`)}>
            <Edit className="h-4 w-4 mr-2" />
            Chỉnh sửa
          </Button>
        </div>
      </div>

      {/* Status Banner */}
      <div className={`p-4 rounded-lg border ${statusColors[listing.status] || ''}`}>
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2">
            <span className="font-semibold">Trạng thái:</span>
            <span>{statusLabels[listing.status]}</span>
          </div>
          <div className="flex items-center gap-4 text-sm">
            <div className="flex items-center gap-1">
              <Eye className="h-4 w-4" />
              {listing.viewCount || 0} lượt xem
            </div>
            <div className="flex items-center gap-1">
              <Calendar className="h-4 w-4" />
              Đăng: {new Date(listing.createdAt).toLocaleDateString('vi-VN')}
            </div>
            {listing.expiresAt && (
              <div className="flex items-center gap-1">
                <Calendar className="h-4 w-4" />
                Hết hạn: {new Date(listing.expiresAt).toLocaleDateString('vi-VN')}
              </div>
            )}
          </div>
        </div>
      </div>

      <div className="grid gap-6 lg:grid-cols-3">
        {/* Main Content */}
        <div className="lg:col-span-2 space-y-6">
          {/* Title & Description */}
          <Card>
            <CardHeader>
              <div className="flex items-start justify-between">
                <div>
                  <span className={`inline-block px-2 py-1 rounded text-xs mb-2 ${listing.listingType === 'SELL' ? 'bg-blue-500/20 text-blue-500' : 'bg-purple-500/20 text-purple-500'}`}>
                    {listing.listingType === 'SELL' ? '🏠 BÁN' : '🏠 CHO THUÊ'}
                  </span>
                  {listing.isVip && listing.vipLevel && (
                    <span className="ml-2 px-2 py-1 rounded text-xs bg-gradient-to-r from-yellow-400 to-orange-500 text-white">
                      ⭐ {listing.vipLevel}
                    </span>
                  )}
                  <CardTitle className="text-xl mt-2">{listing.title}</CardTitle>
                </div>
                <div className="text-right">
                  <div className="text-2xl font-bold text-primary">
                    {formatPrice(listing.price, listing.priceUnit)}
                  </div>
                  {listing.priceUnit === "TOTAL" && listing.area && (
                    <div className="text-sm text-muted-foreground">
                      ~{(listing.price / listing.area / 1000000).toFixed(1)} tr/m²
                    </div>
                  )}
                </div>
              </div>
            </CardHeader>
            <CardContent>
              <p className="text-muted-foreground mb-4">{listing.description}</p>
              <div className="flex items-center gap-2 text-sm text-muted-foreground">
                <MapPin className="h-4 w-4" />
                {listing.address}
              </div>
            </CardContent>
          </Card>

          {/* Property Details */}
          <Card>
            <CardHeader>
              <CardTitle>📋 Thông tin chi tiết</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                <div className="flex items-center gap-2 p-3 bg-muted/50 rounded-lg">
                  <Ruler className="h-5 w-5 text-primary" />
                  <div>
                    <div className="text-xs text-muted-foreground">Diện tích</div>
                    <div className="font-semibold">{listing.area} m²</div>
                  </div>
                </div>
                {listing.bedrooms && (
                  <div className="flex items-center gap-2 p-3 bg-muted/50 rounded-lg">
                    <Bed className="h-5 w-5 text-primary" />
                    <div>
                      <div className="text-xs text-muted-foreground">Phòng ngủ</div>
                      <div className="font-semibold">{listing.bedrooms} PN</div>
                    </div>
                  </div>
                )}
                {listing.bathrooms && (
                  <div className="flex items-center gap-2 p-3 bg-muted/50 rounded-lg">
                    <Bath className="h-5 w-5 text-primary" />
                    <div>
                      <div className="text-xs text-muted-foreground">Toilet</div>
                      <div className="font-semibold">{listing.bathrooms} WC</div>
                    </div>
                  </div>
                )}
                {listing.floors && (
                  <div className="flex items-center gap-2 p-3 bg-muted/50 rounded-lg">
                    <Building className="h-5 w-5 text-primary" />
                    <div>
                      <div className="text-xs text-muted-foreground">Số tầng</div>
                      <div className="font-semibold">{listing.floors} tầng</div>
                    </div>
                  </div>
                )}
                {listing.direction && (
                  <div className="flex items-center gap-2 p-3 bg-muted/50 rounded-lg">
                    <Compass className="h-5 w-5 text-primary" />
                    <div>
                      <div className="text-xs text-muted-foreground">Hướng</div>
                      <div className="font-semibold">{directionLabels[listing.direction] || listing.direction}</div>
                    </div>
                  </div>
                )}
                {listing.legalStatus && (
                  <div className="flex items-center gap-2 p-3 bg-muted/50 rounded-lg">
                    <FileText className="h-5 w-5 text-primary" />
                    <div>
                      <div className="text-xs text-muted-foreground">Pháp lý</div>
                      <div className="font-semibold">{legalLabels[listing.legalStatus] || listing.legalStatus}</div>
                    </div>
                  </div>
                )}
                {listing.furniture && (
                  <div className="flex items-center gap-2 p-3 bg-muted/50 rounded-lg">
                    <Home className="h-5 w-5 text-primary" />
                    <div>
                      <div className="text-xs text-muted-foreground">Nội thất</div>
                      <div className="font-semibold">{furnitureLabels[listing.furniture] || listing.furniture}</div>
                    </div>
                  </div>
                )}
              </div>
            </CardContent>
          </Card>

          {/* Content */}
          {listing.content && (
            <Card>
              <CardHeader>
                <CardTitle>📝 Mô tả chi tiết</CardTitle>
              </CardHeader>
              <CardContent>
                <div
                  className="prose prose-invert max-w-none"
                  dangerouslySetInnerHTML={{ __html: listing.content }}
                />
              </CardContent>
            </Card>
          )}

          {/* Images */}
          {listing.images && listing.images.length > 0 && (
            <Card>
              <CardHeader>
                <CardTitle>🖼️ Hình ảnh ({listing.images.length})</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="grid grid-cols-2 md:grid-cols-3 gap-4">
                  {listing.images.map((img: any, idx: number) => (
                    <img
                      key={idx}
                      src={img.url}
                      alt={`Ảnh ${idx + 1}`}
                      className="w-full h-40 object-cover rounded-lg"
                    />
                  ))}
                </div>
              </CardContent>
            </Card>
          )}
        </div>

        {/* Sidebar */}
        <div className="space-y-6">
          {/* Owner Info */}
          <Card>
            <CardHeader>
              <CardTitle>👤 Người đăng</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              {listing.user ? (
                <>
                  <div className="flex items-center gap-3">
                    <div className="w-12 h-12 rounded-full bg-primary/20 flex items-center justify-center">
                      <User className="h-6 w-6 text-primary" />
                    </div>
                    <div>
                      <div className="font-semibold">{listing.user.fullName || 'N/A'}</div>
                      <div className="text-sm text-muted-foreground">
                        {listing.user.role === 'BROKER' ? '🎫 Môi giới' : '👤 Cá nhân'}
                      </div>
                    </div>
                  </div>
                  <Separator />
                  <div className="space-y-2 text-sm">
                    {listing.user.email && (
                      <div className="flex items-center gap-2">
                        <Mail className="h-4 w-4 text-muted-foreground" />
                        {listing.user.email}
                      </div>
                    )}
                    {listing.user.phone && (
                      <div className="flex items-center gap-2">
                        <Phone className="h-4 w-4 text-muted-foreground" />
                        {listing.user.phone}
                      </div>
                    )}
                  </div>
                </>
              ) : (
                <p className="text-muted-foreground">Không có thông tin</p>
              )}
            </CardContent>
          </Card>

          {/* Category Info */}
          <Card>
            <CardHeader>
              <CardTitle>📁 Danh mục</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="flex items-center gap-2">
                <span className="px-3 py-2 bg-primary/20 text-primary rounded-lg">
                  {listing.category?.name || 'Chưa phân loại'}
                </span>
              </div>
            </CardContent>
          </Card>

          {/* Location Info */}
          <Card>
            <CardHeader>
              <CardTitle>📍 Vị trí</CardTitle>
            </CardHeader>
            <CardContent className="space-y-2 text-sm">
              <div><strong>Địa chỉ:</strong> {listing.address}</div>
              {listing.province && <div><strong>Tỉnh/TP:</strong> {listing.province.name}</div>}
              {listing.ward && <div><strong>Phường/Xã:</strong> {listing.ward.name}</div>}
              {listing.latitude && listing.longitude && (
                <div className="mt-4 p-3 bg-muted/50 rounded text-xs">
                  <div>Lat: {listing.latitude}</div>
                  <div>Lng: {listing.longitude}</div>
                </div>
              )}
            </CardContent>
          </Card>

          {/* Stats */}
          <Card>
            <CardHeader>
              <CardTitle>📊 Thống kê</CardTitle>
            </CardHeader>
            <CardContent className="space-y-3">
              <div className="flex justify-between">
                <span className="text-muted-foreground">Lượt xem</span>
                <span className="font-semibold">{listing.viewCount || 0}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-muted-foreground">Tin nổi bật</span>
                <span>{listing.isFeatured ? '✅ Có' : '❌ Không'}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-muted-foreground">Gói VIP</span>
                <span>{listing.isVip ? `⭐ ${listing.vipLevel}` : '❌ Không'}</span>
              </div>
              <Separator />
              <div className="flex justify-between text-xs text-muted-foreground">
                <span>Tạo lúc</span>
                <span>{new Date(listing.createdAt).toLocaleString('vi-VN')}</span>
              </div>
              <div className="flex justify-between text-xs text-muted-foreground">
                <span>Cập nhật</span>
                <span>{new Date(listing.updatedAt).toLocaleString('vi-VN')}</span>
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
};
