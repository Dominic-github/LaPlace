import { useCreate, useUpdate, useOne } from "@refinedev/core";
import { useNavigate, useParams } from "react-router-dom";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { useState, useEffect } from "react";
import { Save, ArrowLeft } from "lucide-react";
import { MediaPicker } from "@/components/media";

export const CategoryCreate = () => {
  const navigate = useNavigate();
  const { mutate: createCategory, isLoading } = useCreate();

  const [formData, setFormData] = useState({
    name: "",
    slug: "",
    description: "",
    image: "",
    order: 0,
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
    setFormData({
      ...formData,
      name,
      slug: generateSlug(name),
    });
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    createCategory(
      { resource: "categories", values: formData },
      { onSuccess: () => navigate("/categories") }
    );
  };

  return (
    <div className="space-y-6">
      <div className="flex items-center gap-4">
        <Button variant="ghost" onClick={() => navigate("/categories")}>
          <ArrowLeft className="h-4 w-4 mr-2" />
          Quay lại
        </Button>
        <h1 className="text-3xl font-bold">Thêm danh mục BĐS</h1>
      </div>

      <Card>
        <CardContent className="pt-6">
          <form onSubmit={handleSubmit} className="space-y-6">
            <div className="grid gap-6 md:grid-cols-2">
              <div className="space-y-2">
                <Label>Tên danh mục *</Label>
                <Input
                  value={formData.name}
                  onChange={(e) => handleNameChange(e.target.value)}
                  placeholder="VD: Nhà phố"
                  required
                />
              </div>
              <div className="space-y-2">
                <Label>Slug</Label>
                <Input
                  value={formData.slug}
                  onChange={(e) => setFormData({ ...formData, slug: e.target.value })}
                  placeholder="nha-pho"
                />
              </div>
              <div className="space-y-2 md:col-span-2">
                <Label>Mô tả</Label>
                <Input
                  value={formData.description}
                  onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                  placeholder="Mô tả ngắn về danh mục"
                />
              </div>
              <div className="space-y-2">
                <Label>Hình ảnh</Label>
                <MediaPicker
                  value={formData.image}
                  onChange={(url) => setFormData({ ...formData, image: url as string })}
                  label="Chọn ảnh danh mục"
                />
              </div>
              <div className="space-y-2">
                <Label>Thứ tự hiển thị</Label>
                <Input
                  type="number"
                  value={formData.order}
                  onChange={(e) => setFormData({ ...formData, order: parseInt(e.target.value) || 0 })}
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
                {isLoading ? "Đang lưu..." : "Tạo danh mục"}
              </Button>
              <Button type="button" variant="outline" onClick={() => navigate("/categories")}>
                Hủy
              </Button>
            </div>
          </form>
        </CardContent>
      </Card>
    </div>
  );
};

export const CategoryEdit = () => {
  const navigate = useNavigate();
  const { id } = useParams<{ id: string }>();
  const { mutate: updateCategory, isLoading: updating } = useUpdate();
  const { data, isLoading } = useOne({ resource: "categories", id: id || "" });

  const [formData, setFormData] = useState({
    name: "",
    slug: "",
    description: "",
    image: "",
    order: 0,
    isActive: true,
  });

  useEffect(() => {
    if (data?.data) {
      const cat = data.data as any;
      setFormData({
        name: cat.name || "",
        slug: cat.slug || "",
        description: cat.description || "",
        image: cat.image || "",
        order: cat.order || 0,
        isActive: cat.isActive ?? true,
      });
    }
  }, [data]);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    updateCategory(
      { resource: "categories", id: id || "", values: formData },
      { onSuccess: () => navigate("/categories") }
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
        <Button variant="ghost" onClick={() => navigate("/categories")}>
          <ArrowLeft className="h-4 w-4 mr-2" />
          Quay lại
        </Button>
        <h1 className="text-3xl font-bold">Sửa danh mục: {formData.name}</h1>
      </div>

      <Card>
        <CardContent className="pt-6">
          <form onSubmit={handleSubmit} className="space-y-6">
            <div className="grid gap-6 md:grid-cols-2">
              <div className="space-y-2">
                <Label>Tên danh mục *</Label>
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
              <div className="space-y-2 md:col-span-2">
                <Label>Mô tả</Label>
                <Input
                  value={formData.description}
                  onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                />
              </div>
              <div className="space-y-2">
                <Label>Hình ảnh</Label>
                <MediaPicker
                  value={formData.image}
                  onChange={(url) => setFormData({ ...formData, image: url as string })}
                  label="Chọn ảnh danh mục"
                />
              </div>
              <div className="space-y-2">
                <Label>Thứ tự hiển thị</Label>
                <Input
                  type="number"
                  value={formData.order}
                  onChange={(e) => setFormData({ ...formData, order: parseInt(e.target.value) || 0 })}
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
              <Button type="button" variant="outline" onClick={() => navigate("/categories")}>
                Hủy
              </Button>
            </div>
          </form>
        </CardContent>
      </Card>
    </div>
  );
};
