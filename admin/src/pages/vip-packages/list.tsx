import { useList, useDelete, useCreate, useUpdate } from "@refinedev/core";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { useState } from "react";
import { Plus, Edit, Trash2, Star, RefreshCw, Save, X, Check } from "lucide-react";

const generateSlug = (name: string) => {
  return name
    .toLowerCase()
    .normalize("NFD")
    .replace(/[\u0300-\u036f]/g, "")
    .replace(/đ/g, "d")
    .replace(/[^a-z0-9\s-]/g, "")
    .replace(/\s+/g, "-")
    .replace(/-+/g, "-")
    .trim();
};

export const VipPackageList = () => {
  const [showForm, setShowForm] = useState(false);
  const [editingId, setEditingId] = useState<string | null>(null);
  const [formData, setFormData] = useState({
    name: "",
    slug: "",
    pricePoints: "",
    durationDays: "30",
    features: "",
    displayOrder: "0",
    isActive: true,
  });

  const { data, isLoading, refetch } = useList({
    resource: "vip-packages",
    pagination: { current: 1, pageSize: 50 },
    sorters: [{ field: "displayOrder", order: "asc" }],
  });

  const { mutate: createPackage } = useCreate();
  const { mutate: updatePackage } = useUpdate();
  const { mutate: deletePackage } = useDelete();

  const packages = data?.data || [];

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    const packageData = {
      name: formData.name,
      slug: formData.slug || generateSlug(formData.name),
      pricePoints: parseInt(formData.pricePoints) || 0,
      durationDays: parseInt(formData.durationDays) || 30,
      features: formData.features.split('\n').filter(f => f.trim()),
      displayOrder: parseInt(formData.displayOrder) || 0,
      isActive: formData.isActive,
    };

    if (editingId) {
      updatePackage({
        resource: "vip-packages",
        id: editingId,
        values: packageData,
      }, {
        onSuccess: () => {
          resetForm();
          refetch();
        },
      });
    } else {
      createPackage({
        resource: "vip-packages",
        values: packageData,
      }, {
        onSuccess: () => {
          resetForm();
          refetch();
        },
      });
    }
  };

  const handleEdit = (pkg: any) => {
    setEditingId(pkg.id);
    setFormData({
      name: pkg.name || "",
      slug: pkg.slug || "",
      pricePoints: pkg.pricePoints?.toString() || "",
      durationDays: pkg.durationDays?.toString() || "30",
      features: Array.isArray(pkg.features) ? pkg.features.join('\n') : "",
      displayOrder: pkg.displayOrder?.toString() || "0",
      isActive: pkg.isActive ?? true,
    });
    setShowForm(true);
  };

  const handleDelete = (id: string) => {
    if (confirm("Xóa gói VIP này?")) {
      deletePackage({ resource: "vip-packages", id }, { onSuccess: () => refetch() });
    }
  };

  const resetForm = () => {
    setShowForm(false);
    setEditingId(null);
    setFormData({
      name: "",
      slug: "",
      pricePoints: "",
      durationDays: "30",
      features: "",
      displayOrder: "0",
      isActive: true,
    });
  };

  const getPackageColor = (order: number) => {
    if (order === 1) return "from-yellow-400 to-orange-500";
    if (order === 2) return "from-purple-400 to-pink-500";
    if (order === 3) return "from-blue-400 to-cyan-500";
    return "from-gray-400 to-gray-500";
  };

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold">Quản lý gói VIP</h1>
          <p className="text-muted-foreground mt-1">Các gói đẩy tin và quảng cáo</p>
        </div>
        <div className="flex gap-2">
          <Button variant="outline" onClick={() => refetch()}>
            <RefreshCw className="h-4 w-4 mr-2" />
            Làm mới
          </Button>
          <Button onClick={() => setShowForm(true)}>
            <Plus className="h-4 w-4 mr-2" />
            Thêm gói
          </Button>
        </div>
      </div>

      {/* Add/Edit Form */}
      {showForm && (
        <Card>
          <CardHeader>
            <CardTitle>{editingId ? 'Sửa gói VIP' : 'Thêm gói VIP mới'}</CardTitle>
          </CardHeader>
          <CardContent>
            <form onSubmit={handleSubmit} className="space-y-4">
              <div className="grid gap-4 md:grid-cols-2">
                <div className="space-y-2">
                  <Label>Tên gói *</Label>
                  <Input
                    value={formData.name}
                    onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                    placeholder="VD: VIP 1 - Tin nổi bật"
                    required
                  />
                </div>
                <div className="space-y-2">
                  <Label>Slug</Label>
                  <Input
                    value={formData.slug}
                    onChange={(e) => setFormData({ ...formData, slug: e.target.value })}
                    placeholder="vip-1-tin-noi-bat"
                  />
                </div>
                <div className="space-y-2">
                  <Label>Giá (điểm) *</Label>
                  <Input
                    type="number"
                    value={formData.pricePoints}
                    onChange={(e) => setFormData({ ...formData, pricePoints: e.target.value })}
                    placeholder="VD: 200000"
                    required
                  />
                </div>
                <div className="space-y-2">
                  <Label>Thời hạn (ngày)</Label>
                  <Input
                    type="number"
                    value={formData.durationDays}
                    onChange={(e) => setFormData({ ...formData, durationDays: e.target.value })}
                    placeholder="VD: 30"
                  />
                </div>
                <div className="space-y-2">
                  <Label>Thứ tự hiển thị</Label>
                  <Input
                    type="number"
                    value={formData.displayOrder}
                    onChange={(e) => setFormData({ ...formData, displayOrder: e.target.value })}
                    placeholder="VD: 1"
                  />
                </div>
                <div className="flex items-center gap-2 pt-6">
                  <input
                    type="checkbox"
                    checked={formData.isActive}
                    onChange={(e) => setFormData({ ...formData, isActive: e.target.checked })}
                  />
                  <Label>Kích hoạt</Label>
                </div>
                <div className="space-y-2 md:col-span-2">
                  <Label>Tính năng (mỗi dòng 1 tính năng)</Label>
                  <textarea
                    value={formData.features}
                    onChange={(e) => setFormData({ ...formData, features: e.target.value })}
                    placeholder="Hiển thị đầu trang&#10;Bài viết nổi bật&#10;Huy hiệu VIP"
                    rows={4}
                    className="w-full rounded-md border border-input bg-background px-3 py-2 text-sm"
                  />
                </div>
              </div>
              <div className="flex gap-2">
                <Button type="submit">
                  <Save className="h-4 w-4 mr-2" />
                  {editingId ? 'Cập nhật' : 'Tạo gói'}
                </Button>
                <Button type="button" variant="outline" onClick={resetForm}>
                  <X className="h-4 w-4 mr-2" />
                  Hủy
                </Button>
              </div>
            </form>
          </CardContent>
        </Card>
      )}

      {/* Packages Grid */}
      {isLoading ? (
        <div className="flex items-center justify-center h-32">
          <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary"></div>
        </div>
      ) : packages.length === 0 ? (
        <Card>
          <CardContent className="py-12 text-center text-muted-foreground">
            Chưa có gói VIP nào. Bấm "Thêm gói" để tạo mới.
          </CardContent>
        </Card>
      ) : (
        <div className="grid gap-4 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5">
          {packages.map((pkg: any) => (
            <Card key={pkg.id} className="overflow-hidden flex flex-col">
              <div className={`h-1.5 bg-gradient-to-r ${getPackageColor(pkg.displayOrder)}`} />
              <CardHeader className="py-3 px-4">
                <div className="flex items-start justify-between">
                  <div className="min-h-[40px]">
                    <CardTitle className="flex items-center gap-1.5 text-sm">
                      <Star className="h-4 w-4 text-yellow-500 flex-shrink-0" />
                      <span className="line-clamp-2">{pkg.name}</span>
                    </CardTitle>
                  </div>
                  {!pkg.isActive && (
                    <span className="px-1.5 py-0.5 bg-red-500/20 text-red-500 text-xs rounded flex-shrink-0">
                      Tắt
                    </span>
                  )}
                </div>
              </CardHeader>
              <CardContent className="flex flex-col flex-1 px-4 pb-4 pt-0">
                <div className="text-center py-2 bg-muted/50 rounded-lg">
                  <div className="text-xl font-bold text-primary">
                    {pkg.pricePoints?.toLocaleString()}đ
                  </div>
                  <div className="text-xs text-muted-foreground">
                    / {pkg.durationDays} ngày
                  </div>
                </div>

                <div className="flex-1 mt-3 min-h-[60px]">
                  {Array.isArray(pkg.features) && pkg.features.length > 0 ? (
                    <div className="space-y-1">
                      {pkg.features.slice(0, 3).map((feature: string, idx: number) => (
                        <div key={idx} className="flex items-center gap-1.5 text-xs">
                          <Check className="h-3 w-3 text-green-500 flex-shrink-0" />
                          <span className="truncate">{feature}</span>
                        </div>
                      ))}
                      {pkg.features.length > 3 && (
                        <div className="text-xs text-muted-foreground">+{pkg.features.length - 3} tính năng...</div>
                      )}
                    </div>
                  ) : (
                    <div className="text-xs text-muted-foreground">Không có tính năng</div>
                  )}
                </div>

                <div className="flex gap-1.5 pt-2 mt-auto">
                  <Button size="sm" variant="outline" className="flex-1 h-7 text-xs" onClick={() => handleEdit(pkg)}>
                    <Edit className="h-3 w-3 mr-1" />
                    Sửa
                  </Button>
                  <Button size="sm" variant="outline" className="text-red-500 h-7 px-2" onClick={() => handleDelete(pkg.id)}>
                    <Trash2 className="h-3 w-3" />
                  </Button>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>
      )}
    </div>
  );
};
