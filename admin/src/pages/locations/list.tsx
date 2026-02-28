import { useList } from "@refinedev/core";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { useState } from "react";
import { Search, RefreshCw, MapPin, ChevronRight } from "lucide-react";

export const LocationList = () => {
  const [searchText, setSearchText] = useState("");
  const [selectedProvince, setSelectedProvince] = useState<string | null>(null);

  // Provinces (34 tỉnh/TP theo Nghị định 19/2025)
  const { data: provincesData, isLoading: loadingProvinces, refetch: refetchProvinces } = useList({
    resource: "provinces",
    pagination: { current: 1, pageSize: 100 },
    sorters: [{ field: "name", order: "asc" }],
  });

  // Wards (trực thuộc Province - 2 cấp)
  const { data: wardsData, isLoading: loadingWards } = useList({
    resource: `provinces/${selectedProvince}/wards`,
    pagination: { current: 1, pageSize: 500 },
    queryOptions: { enabled: !!selectedProvince },
  });

  const provinces = provincesData?.data || [];
  const wards = wardsData?.data || [];

  const filteredProvinces = provinces.filter((p: any) =>
    p.name?.toLowerCase().includes(searchText.toLowerCase())
  );

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold">Quản lý địa điểm</h1>
          <p className="text-muted-foreground mt-1">
            {provinces.length} tỉnh/thành phố (Đơn vị hành chính 2 cấp)
          </p>
        </div>
        <div className="flex gap-2">
          <Button variant="outline" onClick={() => refetchProvinces()}>
            <RefreshCw className="h-4 w-4 mr-2" />
            Làm mới
          </Button>
        </div>
      </div>

      <Card>
        <CardContent className="pt-4">
          <div className="relative mb-4">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
            <Input
              placeholder="Tìm kiếm tỉnh/thành..."
              value={searchText}
              onChange={(e) => setSearchText(e.target.value)}
              className="pl-10"
            />
          </div>
        </CardContent>
      </Card>

      <div className="grid gap-6 lg:grid-cols-2">
        {/* Provinces (34 tỉnh/TP) */}
        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-lg flex items-center gap-2">
              <MapPin className="h-5 w-5 text-primary" />
              Tỉnh/Thành phố ({filteredProvinces.length})
            </CardTitle>
          </CardHeader>
          <CardContent>
            {loadingProvinces ? (
              <div className="flex items-center justify-center h-32">
                <div className="animate-spin rounded-full h-6 w-6 border-b-2 border-primary"></div>
              </div>
            ) : (
              <div className="space-y-1 max-h-[500px] overflow-y-auto">
                {filteredProvinces.map((province: any) => (
                  <button
                    key={province.id}
                    onClick={() => setSelectedProvince(province.id)}
                    className={`w-full text-left px-3 py-2 rounded-lg text-sm flex items-center justify-between transition-colors ${selectedProvince === province.id
                        ? 'bg-primary text-primary-foreground'
                        : 'hover:bg-muted'
                      }`}
                  >
                    <span>{province.name}</span>
                    <ChevronRight className="h-4 w-4" />
                  </button>
                ))}
              </div>
            )}
          </CardContent>
        </Card>

        {/* Wards (trực thuộc Province - 2 cấp) */}
        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-lg flex items-center gap-2">
              <MapPin className="h-5 w-5 text-green-500" />
              Phường/Xã {selectedProvince && `(${wards.length})`}
            </CardTitle>
          </CardHeader>
          <CardContent>
            {!selectedProvince ? (
              <div className="text-center py-12 text-muted-foreground">
                Chọn tỉnh/thành để xem phường/xã trực thuộc
              </div>
            ) : loadingWards ? (
              <div className="flex items-center justify-center h-32">
                <div className="animate-spin rounded-full h-6 w-6 border-b-2 border-primary"></div>
              </div>
            ) : wards.length === 0 ? (
              <div className="text-center py-12 text-muted-foreground">
                Chưa có phường/xã nào
              </div>
            ) : (
              <div className="space-y-1 max-h-[500px] overflow-y-auto">
                {wards.map((ward: any) => (
                  <div
                    key={ward.id}
                    className="px-3 py-2 rounded-lg text-sm hover:bg-muted transition-colors flex items-center justify-between"
                  >
                    <span>{ward.name}</span>
                    <span className="text-xs text-muted-foreground">{ward.code}</span>
                  </div>
                ))}
              </div>
            )}
          </CardContent>
        </Card>
      </div>

      {/* Stats */}
      <Card>
        <CardContent className="pt-4">
          <div className="grid grid-cols-2 gap-4 text-center">
            <div className="p-4 bg-muted/50 rounded-lg">
              <div className="text-2xl font-bold text-primary">{provinces.length}</div>
              <div className="text-sm text-muted-foreground">Tỉnh/Thành</div>
            </div>
            <div className="p-4 bg-muted/50 rounded-lg">
              <div className="text-2xl font-bold text-green-500">{wards.length}</div>
              <div className="text-sm text-muted-foreground">Phường/Xã (đang xem)</div>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
};
