import { useState, useEffect } from "react";
import { useOne, useUpdate, useNavigation } from "@refinedev/core";
import { useParams } from "react-router-dom";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Select } from "@/components/ui/select";
import { Checkbox } from "@/components/ui/checkbox";
import { Spinner } from "@/components/ui/spinner";
import { FeaturedImageBox } from "../../components/posts";
import { ArrowLeft, Save, Loader2, ImageIcon } from "lucide-react";

export const BannerEdit = () => {
  const { id } = useParams();
  const { push, goBack } = useNavigation();
  const { mutate: update, isLoading: isUpdating } = useUpdate();

  // Fetch banner data
  const { data: bannerQuery, isLoading } = useOne({
    resource: "banners",
    id: id as string,
  });
  const bannerData = bannerQuery?.data;

  // Form state
  const [title, setTitle] = useState("");
  const [description, setDescription] = useState("");
  const [image, setImage] = useState("");
  const [link, setLink] = useState("");
  const [position, setPosition] = useState("HOME_MAIN");
  const [order, setOrder] = useState(0);
  const [startDate, setStartDate] = useState("");
  const [endDate, setEndDate] = useState("");
  const [isActive, setIsActive] = useState(true);

  // Toast message
  const [message, setMessage] = useState<{ type: 'success' | 'error'; text: string } | null>(null);

  const showMessage = (type: 'success' | 'error', text: string) => {
    setMessage({ type, text });
    setTimeout(() => setMessage(null), 5000);
  };

  // Initialize form from data
  useEffect(() => {
    if (bannerData) {
      setTitle(bannerData.title || "");
      setDescription(bannerData.description || "");
      setImage(bannerData.image || "");
      setLink(bannerData.link || "");
      setPosition(bannerData.position || "HOME_MAIN");
      setOrder(bannerData.order || 0);
      setIsActive(bannerData.isActive ?? true);

      if (bannerData.startDate) {
        const d = new Date(bannerData.startDate);
        setStartDate(d.toISOString().slice(0, 16));
      }
      if (bannerData.endDate) {
        const d = new Date(bannerData.endDate);
        setEndDate(d.toISOString().slice(0, 16));
      }
    }
  }, [bannerData]);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();

    if (!title) {
      showMessage("error", "Vui lòng nhập tiêu đề");
      return;
    }

    update(
      {
        resource: "banners",
        id: id as string,
        values: {
          title,
          description,
          image,
          link,
          position,
          order: Number(order),
          startDate: startDate ? new Date(startDate).toISOString() : null,
          endDate: endDate ? new Date(endDate).toISOString() : null,
          isActive,
        },
      },
      {
        onSuccess: () => {
          showMessage("success", "Cập nhật banner thành công!");
        },
        onError: (error: any) => {
          showMessage("error", error?.message || "Có lỗi xảy ra");
        }
      }
    );
  };

  if (isLoading) {
    return (
      <div className="flex items-center justify-center py-20">
        <Spinner size="lg" />
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* Toast Message */}
      {message && (
        <div
          className={`fixed top-20 right-4 z-50 px-4 py-3 rounded-md shadow-lg max-w-md ${message.type === "success" ? "bg-success text-white" : "bg-destructive text-white"
            }`}
        >
          {message.text}
        </div>
      )}

      {/* Header */}
      <div className="flex items-center gap-4">
        <Button variant="ghost" size="sm" onClick={goBack}>
          <ArrowLeft className="h-4 w-4 mr-2" />
          Quay lại
        </Button>
        <div>
          <h1 className="text-3xl font-bold flex items-center gap-2">
            <ImageIcon className="h-8 w-8" />
            Chỉnh sửa banner
          </h1>
          <p className="text-muted-foreground mt-1">
            Cập nhật thông tin banner
          </p>
        </div>
      </div>

      <form onSubmit={handleSubmit}>
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          {/* Main Content */}
          <div className="lg:col-span-2 space-y-6">
            <Card>
              <CardHeader>
                <CardTitle>Thông tin banner</CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="space-y-2">
                  <Label htmlFor="title">Tiêu đề *</Label>
                  <Input
                    id="title"
                    value={title}
                    onChange={(e) => setTitle(e.target.value)}
                    placeholder="Tiêu đề banner"
                    required
                  />
                </div>

                <div className="space-y-2">
                  <Label htmlFor="description">Mô tả</Label>
                  <Textarea
                    id="description"
                    value={description}
                    onChange={(e) => setDescription(e.target.value)}
                    placeholder="Mô tả ngắn..."
                    rows={3}
                  />
                </div>

                <div className="space-y-2">
                  <Label htmlFor="link">Link</Label>
                  <Input
                    id="link"
                    value={link}
                    onChange={(e) => setLink(e.target.value)}
                    placeholder="https://example.com/promotion"
                  />
                </div>

                <div className="grid grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <Label htmlFor="position">Vị trí hiển thị</Label>
                    <Select
                      id="position"
                      value={position}
                      onChange={(e) => setPosition(e.target.value)}
                    >
                      <option value="HOME_MAIN">Trang chủ - Chính</option>
                      <option value="HOME_SECONDARY">Trang chủ - Phụ</option>
                      <option value="CATEGORY">Danh mục</option>
                      <option value="PRODUCT">Sản phẩm</option>
                      <option value="SIDEBAR">Sidebar</option>
                    </Select>
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="order">Thứ tự hiển thị</Label>
                    <Input
                      id="order"
                      type="number"
                      value={order}
                      onChange={(e) => setOrder(Number(e.target.value))}
                      min={0}
                    />
                  </div>
                </div>

                <div className="grid grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <Label htmlFor="startDate">Ngày bắt đầu</Label>
                    <Input
                      id="startDate"
                      type="datetime-local"
                      value={startDate}
                      onChange={(e) => setStartDate(e.target.value)}
                    />
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="endDate">Ngày kết thúc</Label>
                    <Input
                      id="endDate"
                      type="datetime-local"
                      value={endDate}
                      onChange={(e) => setEndDate(e.target.value)}
                    />
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>

          {/* Sidebar */}
          <div className="space-y-6">
            {/* Status */}
            <Card>
              <CardHeader>
                <CardTitle>Trạng thái</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="flex items-center gap-3">
                  <Checkbox
                    id="isActive"
                    checked={isActive}
                    onCheckedChange={(checked) => setIsActive(!!checked)}
                  />
                  <Label htmlFor="isActive" className="cursor-pointer">Hoạt động</Label>
                </div>
              </CardContent>
            </Card>

            {/* Featured Image */}
            <FeaturedImageBox
              imageUrl={image}
              onImageChange={setImage}
              onImageRemove={() => setImage("")}
            />

            {/* Submit */}
            <Card>
              <CardContent className="pt-6">
                <Button type="submit" className="w-full" disabled={isUpdating}>
                  {isUpdating ? (
                    <Loader2 className="h-4 w-4 mr-2 animate-spin" />
                  ) : (
                    <Save className="h-4 w-4 mr-2" />
                  )}
                  Lưu thay đổi
                </Button>
              </CardContent>
            </Card>
          </div>
        </div>
      </form>
    </div>
  );
};
