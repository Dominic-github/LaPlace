import { useList, useDelete, useUpdate } from "@refinedev/core";
import { useNavigate } from "react-router-dom";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { useState } from "react";
import { 
  Plus, Eye, Edit, Trash2, Check, X, Search, 
  Home, Building2, Map, DollarSign, Calendar, User,
  Filter, RefreshCw
} from "lucide-react";

const API_URL = import.meta.env.VITE_API_URL || "http://localhost:5003/api";

const statusColors: Record<string, string> = {
  PENDING: "bg-yellow-500/20 text-yellow-500",
  APPROVED: "bg-green-500/20 text-green-500",
  REJECTED: "bg-red-500/20 text-red-500",
  EXPIRED: "bg-gray-500/20 text-gray-500",
};

const statusLabels: Record<string, string> = {
  PENDING: "Chờ duyệt",
  APPROVED: "Đã duyệt",
  REJECTED: "Từ chối",
  EXPIRED: "Hết hạn",
};

const vipColors: Record<string, string> = {
  VIP1: "bg-gradient-to-r from-yellow-400 to-orange-500 text-white",
  VIP2: "bg-gradient-to-r from-purple-400 to-pink-500 text-white",
  VIP3: "bg-gradient-to-r from-blue-400 to-cyan-500 text-white",
};

export const ListingList = () => {
  const navigate = useNavigate();
  const [searchText, setSearchText] = useState("");
  const [statusFilter, setStatusFilter] = useState("");
  const { mutate: deleteListing } = useDelete();
  const { mutate: updateListing } = useUpdate();

  const { data, isLoading, refetch } = useList({
    resource: "listings",
    pagination: { current: 1, pageSize: 50 },
    filters: [
      ...(searchText ? [{ field: "search", operator: "contains" as const, value: searchText }] : []),
      ...(statusFilter ? [{ field: "status", operator: "eq" as const, value: statusFilter }] : []),
    ],
    sorters: [{ field: "createdAt", order: "desc" }],
  });

  const listings = data?.data || [];

  const handleApprove = (id: string) => {
    if (confirm("Duyệt tin đăng này?")) {
      updateListing({
        resource: "listings",
        id,
        values: { status: "APPROVED" },
      }, {
        onSuccess: () => refetch(),
      });
    }
  };

  const handleReject = (id: string) => {
    if (confirm("Từ chối tin đăng này?")) {
      updateListing({
        resource: "listings",
        id,
        values: { status: "REJECTED" },
      }, {
        onSuccess: () => refetch(),
      });
    }
  };

  const handleDelete = (id: string) => {
    if (confirm("Xóa tin đăng này? Hành động này không thể hoàn tác!")) {
      deleteListing({
        resource: "listings",
        id,
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
    return `${(price / 1000000).toFixed(1)} tr/m²`;
  };

  const pendingCount = listings.filter((l: any) => l.status === "PENDING").length;

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold">Quản lý tin đăng</h1>
          <p className="text-muted-foreground mt-1">
            Tổng: {listings.length} tin đăng
            {pendingCount > 0 && (
              <span className="ml-2 text-yellow-500">({pendingCount} chờ duyệt)</span>
            )}
          </p>
        </div>
        <div className="flex gap-2">
          <Button variant="outline" onClick={() => refetch()}>
            <RefreshCw className="h-4 w-4 mr-2" />
            Làm mới
          </Button>
          <Button onClick={() => navigate("/listings/create")}>
            <Plus className="h-4 w-4 mr-2" />
            Thêm tin
          </Button>
        </div>
      </div>

      {/* Filters */}
      <Card>
        <CardContent className="pt-4">
          <div className="flex gap-4 flex-wrap">
            <div className="flex-1 min-w-[200px]">
              <div className="relative">
                <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                <Input
                  placeholder="Tìm kiếm theo tiêu đề, địa chỉ..."
                  value={searchText}
                  onChange={(e) => setSearchText(e.target.value)}
                  className="pl-10"
                />
              </div>
            </div>
            <select
              value={statusFilter}
              onChange={(e) => setStatusFilter(e.target.value)}
              className="h-10 rounded-md border border-input bg-background px-3 py-2"
            >
              <option value="">Tất cả trạng thái</option>
              <option value="PENDING">Chờ duyệt</option>
              <option value="APPROVED">Đã duyệt</option>
              <option value="REJECTED">Từ chối</option>
              <option value="EXPIRED">Hết hạn</option>
            </select>
          </div>
        </CardContent>
      </Card>

      {/* Listings Table */}
      <Card>
        <CardContent className="pt-4">
          {isLoading ? (
            <div className="flex items-center justify-center h-32">
              <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary"></div>
            </div>
          ) : listings.length === 0 ? (
            <div className="text-center py-12 text-muted-foreground">
              Chưa có tin đăng nào
            </div>
          ) : (
            <div className="overflow-x-auto">
              <table className="w-full">
                <thead>
                  <tr className="border-b">
                    <th className="text-left py-3 px-2">Tin đăng</th>
                    <th className="text-left py-3 px-2">Loại</th>
                    <th className="text-left py-3 px-2">Giá</th>
                    <th className="text-left py-3 px-2">Diện tích</th>
                    <th className="text-left py-3 px-2">Trạng thái</th>
                    <th className="text-left py-3 px-2">VIP</th>
                    <th className="text-left py-3 px-2">Ngày đăng</th>
                    <th className="text-right py-3 px-2">Thao tác</th>
                  </tr>
                </thead>
                <tbody>
                  {listings.map((listing: any) => (
                    <tr key={listing.id} className="border-b hover:bg-muted/50">
                      <td className="py-3 px-2">
                        <div className="max-w-[300px]">
                          <div className="font-medium line-clamp-1">{listing.title}</div>
                          <div className="text-sm text-muted-foreground line-clamp-1">
                            {listing.address}
                          </div>
                        </div>
                      </td>
                      <td className="py-3 px-2">
                        <span className={`px-2 py-1 rounded text-xs ${listing.listingType === 'SELL' ? 'bg-blue-500/20 text-blue-500' : 'bg-purple-500/20 text-purple-500'}`}>
                          {listing.listingType === 'SELL' ? 'Bán' : 'Thuê'}
                        </span>
                      </td>
                      <td className="py-3 px-2 whitespace-nowrap">
                        <span className="font-semibold text-primary">
                          {formatPrice(listing.price, listing.priceUnit)}
                        </span>
                      </td>
                      <td className="py-3 px-2 whitespace-nowrap">
                        {listing.area} m²
                      </td>
                      <td className="py-3 px-2">
                        <span className={`px-2 py-1 rounded text-xs ${statusColors[listing.status] || ''}`}>
                          {statusLabels[listing.status] || listing.status}
                        </span>
                      </td>
                      <td className="py-3 px-2">
                        {listing.isVip && listing.vipLevel && (
                          <span className={`px-2 py-1 rounded text-xs ${vipColors[listing.vipLevel] || ''}`}>
                            {listing.vipLevel}
                          </span>
                        )}
                      </td>
                      <td className="py-3 px-2 text-sm text-muted-foreground whitespace-nowrap">
                        {new Date(listing.createdAt).toLocaleDateString('vi-VN')}
                      </td>
                      <td className="py-3 px-2">
                        <div className="flex justify-end gap-1">
                          {listing.status === "PENDING" && (
                            <>
                              <Button size="sm" variant="ghost" onClick={() => handleApprove(listing.id)} title="Duyệt">
                                <Check className="h-4 w-4 text-green-500" />
                              </Button>
                              <Button size="sm" variant="ghost" onClick={() => handleReject(listing.id)} title="Từ chối">
                                <X className="h-4 w-4 text-red-500" />
                              </Button>
                            </>
                          )}
                          <Button size="sm" variant="ghost" onClick={() => navigate(`/listings/show/${listing.id}`)}>
                            <Eye className="h-4 w-4" />
                          </Button>
                          <Button size="sm" variant="ghost" onClick={() => navigate(`/listings/edit/${listing.id}`)}>
                            <Edit className="h-4 w-4" />
                          </Button>
                          <Button size="sm" variant="ghost" onClick={() => handleDelete(listing.id)}>
                            <Trash2 className="h-4 w-4 text-red-500" />
                          </Button>
                        </div>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  );
};
