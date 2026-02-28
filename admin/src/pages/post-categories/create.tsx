import { useState } from "react";
import { useCreate, useList, useNavigation } from "@refinedev/core";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Select } from "@/components/ui/select";
import { Switch } from "@/components/ui/switch";
import { ArrowLeft, Save, Loader2 } from "lucide-react";

export const PostCategoryCreate = () => {
  const { push, goBack } = useNavigation();
  const { mutate: create, isLoading } = useCreate();

  const { data: parentData } = useList({
    resource: "post-categories",
    pagination: { pageSize: 100 },
  });
  const parentOptions = parentData?.data || [];

  const [formData, setFormData] = useState({
    name: "",
    slug: "",
    parentId: "",
    description: "",
    order: 0,
    isActive: true,
  });

  const handleChange = (field: string, value: any) => {
    setFormData((prev) => ({ ...prev, [field]: value }));
  };

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
    setFormData((prev) => ({
      ...prev,
      name,
      slug: generateSlug(name),
    }));
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    create(
      {
        resource: "post-categories",
        values: {
          ...formData,
          parentId: formData.parentId || null,
          order: Number(formData.order),
        },
      },
      { onSuccess: () => push("/post-categories") }
    );
  };

  return (
    <div className="space-y-6">
      <div className="flex items-center gap-4">
        <Button variant="ghost" size="sm" onClick={goBack}>
          <ArrowLeft className="h-4 w-4 mr-2" />
          Quay lại
        </Button>
        <div>
          <h1 className="text-3xl font-bold">Thêm chuyên mục</h1>
          <p className="text-muted-foreground mt-1">Tạo chuyên mục bài viết mới</p>
        </div>
      </div>

      <form onSubmit={handleSubmit}>
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          <div className="lg:col-span-2 space-y-6">
            <Card>
              <CardHeader>
                <CardTitle>Thông tin chuyên mục</CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="space-y-2">
                  <Label htmlFor="name">Tên chuyên mục *</Label>
                  <Input
                    id="name"
                    value={formData.name}
                    onChange={(e) => handleNameChange(e.target.value)}
                    placeholder="Ví dụ: Tin tức công nghệ"
                    required
                  />
                </div>

                <div className="space-y-2">
                  <Label htmlFor="slug">Slug</Label>
                  <Input
                    id="slug"
                    value={formData.slug}
                    onChange={(e) => handleChange("slug", e.target.value)}
                    placeholder="tin-tuc-cong-nghe"
                  />
                  <p className="text-xs text-muted-foreground">Để trống để tự động tạo từ tên</p>
                </div>

                <div className="space-y-2">
                  <Label htmlFor="parentId">Chuyên mục cha</Label>
                  <Select
                    id="parentId"
                    value={formData.parentId}
                    onChange={(e) => handleChange("parentId", e.target.value)}
                  >
                    <option value="">Không có (Gốc)</option>
                    {parentOptions.map((opt: any) => (
                      <option key={opt.id} value={opt.id}>
                        {opt.name}
                      </option>
                    ))}
                  </Select>
                </div>

                <div className="space-y-2">
                  <Label htmlFor="description">Mô tả</Label>
                  <Textarea
                    id="description"
                    value={formData.description}
                    onChange={(e) => handleChange("description", e.target.value)}
                    placeholder="Mô tả ngắn về chuyên mục"
                    rows={4}
                  />
                </div>

                <div className="space-y-2">
                  <Label htmlFor="order">Thứ tự hiển thị</Label>
                  <Input
                    id="order"
                    type="number"
                    value={formData.order}
                    onChange={(e) => handleChange("order", e.target.value)}
                    min={0}
                  />
                </div>
              </CardContent>
            </Card>
          </div>

          <div className="space-y-6">
            <Card>
              <CardHeader>
                <CardTitle>Trạng thái</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="flex items-center justify-between">
                  <Label htmlFor="isActive">Hoạt động</Label>
                  <Switch
                    id="isActive"
                    checked={formData.isActive}
                    onChange={(e) => handleChange("isActive", e.target.checked)}
                  />
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardContent className="pt-6">
                <Button type="submit" className="w-full" disabled={isLoading}>
                  {isLoading ? (
                    <Loader2 className="h-4 w-4 mr-2 animate-spin" />
                  ) : (
                    <Save className="h-4 w-4 mr-2" />
                  )}
                  Lưu chuyên mục
                </Button>
              </CardContent>
            </Card>
          </div>
        </div>
      </form>
    </div>
  );
};
