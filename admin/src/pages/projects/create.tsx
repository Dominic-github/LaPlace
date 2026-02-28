import { useCreate, useUpdate, useOne, useList } from "@refinedev/core";
import { useNavigate, useParams } from "react-router-dom";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { useState, useEffect } from "react";
import { Save, ArrowLeft } from "lucide-react";
import { MediaPicker } from "@/components/media";

export const ProjectCreate = () => {
  const navigate = useNavigate();
  const { mutate: createProject, isLoading } = useCreate();

  const { data: provincesData } = useList({
    resource: "provinces",
    pagination: { current: 1, pageSize: 100 },
  });
  const provinces = provincesData?.data || [];

  const [formData, setFormData] = useState({
    name: "",
    slug: "",
    description: "",
    developer: "",
    address: "",
    provinceId: "",
    wardId: "",
    thumbnail: "",
    isActive: true,
  });

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

  const handleNameChange = (name: string) => {
    setFormData({ ...formData, name, slug: generateSlug(name) });
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    const submitData = { ...formData };
    if (!submitData.wardId) delete (submitData as any).wardId;

    createProject(
      { resource: "projects", values: submitData },
      { onSuccess: () => navigate("/projects") }
    );
  };

  return (
    <div className="space-y-6">
      <div className="flex items-center gap-4">
        <Button variant="ghost" onClick={() => navigate("/projects")}>
          <ArrowLeft className="h-4 w-4 mr-2" />
          Quay lại
        </Button>
        <h1 className="text-3xl font-bold">Thêm dự án mới</h1>
      </div>

      <Card>
        <CardContent className="pt-6">
          <form onSubmit={handleSubmit} className="space-y-6">
            <div className="grid gap-6 md:grid-cols-2">
              <div className="space-y-2">
                <Label>Tên dự án *</Label>
                <Input
                  value={formData.name}
                  onChange={(e) => handleNameChange(e.target.value)}
                  placeholder="VD: Vinhomes Grand Park"
                  required
                />
              </div>
              <div className="space-y-2">
                <Label>Slug</Label>
                <Input
                  value={formData.slug}
                  onChange={(e) => setFormData({ ...formData, slug: e.target.value })}
                />
              </div>
              <div className="space-y-2">
                <Label>Chủ đầu tư</Label>
                <Input
                  value={formData.developer}
                  onChange={(e) => setFormData({ ...formData, developer: e.target.value })}
                  placeholder="VD: Vingroup"
                />
              </div>
              <div className="space-y-2">
                <Label>Tỉnh/Thành phố *</Label>
                <select
                  value={formData.provinceId}
                  onChange={(e) => setFormData({ ...formData, provinceId: e.target.value })}
                  className="w-full h-10 rounded-md border border-input bg-background px-3"
                  required
                >
                  <option value="">Chọn tỉnh/thành</option>
                  {provinces.map((p: any) => (
                    <option key={p.id} value={p.id}>{p.name}</option>
                  ))}
                </select>
              </div>
              <div className="space-y-2 md:col-span-2">
                <Label>Địa chỉ</Label>
                <Input
                  value={formData.address}
                  onChange={(e) => setFormData({ ...formData, address: e.target.value })}
                  placeholder="Địa chỉ chi tiết"
                />
              </div>
              <div className="space-y-2 md:col-span-2">
                <Label>Mô tả</Label>
                <textarea
                  value={formData.description}
                  onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                  rows={4}
                  className="w-full rounded-md border border-input bg-background px-3 py-2 text-sm"
                  placeholder="Mô tả chi tiết về dự án"
                />
              </div>
              <div className="space-y-2">
                <Label>Ảnh đại diện</Label>
                <MediaPicker
                  value={formData.thumbnail}
                  onChange={(url) => setFormData({ ...formData, thumbnail: url as string })}
                  label="Chọn ảnh dự án"
                />
              </div>
              <div className="flex items-center gap-2">
                <input
                  type="checkbox"
                  id="isActive"
                  checked={formData.isActive}
                  onChange={(e) => setFormData({ ...formData, isActive: e.target.checked })}
                />
                <Label htmlFor="isActive">Kích hoạt</Label>
              </div>
            </div>

            <div className="flex gap-2">
              <Button type="submit" disabled={isLoading}>
                <Save className="h-4 w-4 mr-2" />
                {isLoading ? "Đang lưu..." : "Tạo dự án"}
              </Button>
              <Button type="button" variant="outline" onClick={() => navigate("/projects")}>
                Hủy
              </Button>
            </div>
          </form>
        </CardContent>
      </Card>
    </div>
  );
};

export const ProjectEdit = () => {
  const navigate = useNavigate();
  const { id } = useParams<{ id: string }>();
  const { mutate: updateProject, isLoading: updating } = useUpdate();
  const { data, isLoading } = useOne({ resource: "projects", id: id || "" });

  const { data: provincesData } = useList({
    resource: "provinces",
    pagination: { current: 1, pageSize: 100 },
  });
  const provinces = provincesData?.data || [];

  const [formData, setFormData] = useState({
    name: "",
    slug: "",
    description: "",
    developer: "",
    address: "",
    provinceId: "",
    wardId: "",
    thumbnail: "",
    isActive: true,
  });

  useEffect(() => {
    if (data?.data) {
      const project = data.data as any;
      setFormData({
        name: project.name || "",
        slug: project.slug || "",
        description: project.description || "",
        developer: project.developer || "",
        address: project.address || "",
        provinceId: project.provinceId || "",
        wardId: project.wardId || "",
        thumbnail: project.thumbnail || "",
        isActive: project.isActive ?? true,
      });
    }
  }, [data]);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    updateProject(
      { resource: "projects", id: id || "", values: formData },
      { onSuccess: () => navigate("/projects") }
    );
  };

  if (isLoading) {
    return (
      <div className="flex items-center justify-center h-64">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary"></div>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <div className="flex items-center gap-4">
        <Button variant="ghost" onClick={() => navigate("/projects")}>
          <ArrowLeft className="h-4 w-4 mr-2" />
          Quay lại
        </Button>
        <h1 className="text-3xl font-bold">Sửa dự án: {formData.name}</h1>
      </div>

      <Card>
        <CardContent className="pt-6">
          <form onSubmit={handleSubmit} className="space-y-6">
            <div className="grid gap-6 md:grid-cols-2">
              <div className="space-y-2">
                <Label>Tên dự án *</Label>
                <Input
                  value={formData.name}
                  onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                  required
                />
              </div>
              <div className="space-y-2">
                <Label>Slug</Label>
                <Input
                  value={formData.slug}
                  onChange={(e) => setFormData({ ...formData, slug: e.target.value })}
                />
              </div>
              <div className="space-y-2">
                <Label>Chủ đầu tư</Label>
                <Input
                  value={formData.developer}
                  onChange={(e) => setFormData({ ...formData, developer: e.target.value })}
                />
              </div>
              <div className="space-y-2">
                <Label>Tỉnh/Thành phố *</Label>
                <select
                  value={formData.provinceId}
                  onChange={(e) => setFormData({ ...formData, provinceId: e.target.value })}
                  className="w-full h-10 rounded-md border border-input bg-background px-3"
                  required
                >
                  <option value="">Chọn tỉnh/thành</option>
                  {provinces.map((p: any) => (
                    <option key={p.id} value={p.id}>{p.name}</option>
                  ))}
                </select>
              </div>
              <div className="space-y-2 md:col-span-2">
                <Label>Địa chỉ</Label>
                <Input
                  value={formData.address}
                  onChange={(e) => setFormData({ ...formData, address: e.target.value })}
                />
              </div>
              <div className="space-y-2 md:col-span-2">
                <Label>Mô tả</Label>
                <textarea
                  value={formData.description}
                  onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                  rows={4}
                  className="w-full rounded-md border border-input bg-background px-3 py-2 text-sm"
                />
              </div>
              <div className="space-y-2">
                <Label>Ảnh đại diện</Label>
                <MediaPicker
                  value={formData.thumbnail}
                  onChange={(url) => setFormData({ ...formData, thumbnail: url as string })}
                  label="Chọn ảnh dự án"
                />
              </div>
              <div className="flex items-center gap-2">
                <input
                  type="checkbox"
                  id="isActive"
                  checked={formData.isActive}
                  onChange={(e) => setFormData({ ...formData, isActive: e.target.checked })}
                />
                <Label htmlFor="isActive">Kích hoạt</Label>
              </div>
            </div>

            <div className="flex gap-2">
              <Button type="submit" disabled={updating}>
                <Save className="h-4 w-4 mr-2" />
                {updating ? "Đang lưu..." : "Cập nhật"}
              </Button>
              <Button type="button" variant="outline" onClick={() => navigate("/projects")}>
                Hủy
              </Button>
            </div>
          </form>
        </CardContent>
      </Card>
    </div>
  );
};
