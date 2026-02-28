import { useState, useEffect } from "react";
import { useOne, useUpdate, useNavigation } from "@refinedev/core";
import { useParams } from "react-router-dom";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Select } from "@/components/ui/select";
import { Spinner } from "@/components/ui/spinner";
import { ArrowLeft, Save, Loader2, Zap } from "lucide-react";

export const FlashSaleEdit = () => {
  const { id } = useParams();
  const { push, goBack } = useNavigation();
  const { mutate: update, isLoading: isUpdating } = useUpdate();

  // Fetch data
  const { data: dataQuery, isLoading } = useOne({
    resource: "flash-sales",
    id: id as string,
  });
  const flashSaleData = dataQuery?.data;

  // Form state
  const [name, setName] = useState("");
  const [description, setDescription] = useState("");
  const [startDate, setStartDate] = useState("");
  const [endDate, setEndDate] = useState("");
  const [status, setStatus] = useState("UPCOMING");
  const [discountPercent, setDiscountPercent] = useState(0);

  // Toast message
  const [message, setMessage] = useState<{ type: 'success' | 'error'; text: string } | null>(null);

  const showMessage = (type: 'success' | 'error', text: string) => {
    setMessage({ type, text });
    setTimeout(() => setMessage(null), 5000);
  };

  // Initialize form
  useEffect(() => {
    if (flashSaleData) {
      setName(flashSaleData.name || "");
      setDescription(flashSaleData.description || "");
      setStatus(flashSaleData.status || "UPCOMING");
      setDiscountPercent(flashSaleData.discountPercent || 0);

      if (flashSaleData.startDate) {
        const d = new Date(flashSaleData.startDate);
        setStartDate(d.toISOString().slice(0, 16));
      }
      if (flashSaleData.endDate) {
        const d = new Date(flashSaleData.endDate);
        setEndDate(d.toISOString().slice(0, 16));
      }
    }
  }, [flashSaleData]);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();

    if (!name) {
      showMessage("error", "Vui lòng nhập tên chương trình");
      return;
    }

    update(
      {
        resource: "flash-sales",
        id: id as string,
        values: {
          name,
          description,
          startDate: startDate ? new Date(startDate).toISOString() : null,
          endDate: endDate ? new Date(endDate).toISOString() : null,
          status,
          discountPercent: Number(discountPercent),
        },
      },
      {
        onSuccess: () => {
          showMessage("success", "Cập nhật Flash Sale thành công!");
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
            <Zap className="h-8 w-8 text-yellow-500" />
            Chỉnh sửa Flash Sale
          </h1>
          <p className="text-muted-foreground mt-1">
            Cập nhật thông tin chương trình
          </p>
        </div>
      </div>

      <form onSubmit={handleSubmit}>
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          {/* Main Content */}
          <div className="lg:col-span-2 space-y-6">
            <Card>
              <CardHeader>
                <CardTitle>Thông tin chương trình</CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="space-y-2">
                  <Label htmlFor="name">Tên chương trình *</Label>
                  <Input
                    id="name"
                    value={name}
                    onChange={(e) => setName(e.target.value)}
                    placeholder="Ví dụ: Flash Sale 11/11"
                    required
                  />
                </div>

                <div className="space-y-2">
                  <Label htmlFor="description">Mô tả</Label>
                  <Textarea
                    id="description"
                    value={description}
                    onChange={(e) => setDescription(e.target.value)}
                    placeholder="Mô tả về chương trình flash sale..."
                    rows={4}
                  />
                </div>

                <div className="grid grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <Label htmlFor="startDate">Ngày bắt đầu *</Label>
                    <Input
                      id="startDate"
                      type="datetime-local"
                      value={startDate}
                      onChange={(e) => setStartDate(e.target.value)}
                      required
                    />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="endDate">Ngày kết thúc *</Label>
                    <Input
                      id="endDate"
                      type="datetime-local"
                      value={endDate}
                      onChange={(e) => setEndDate(e.target.value)}
                      required
                    />
                  </div>
                </div>

                <div className="space-y-2">
                  <Label htmlFor="discountPercent">Giảm giá mặc định (%)</Label>
                  <Input
                    id="discountPercent"
                    type="number"
                    value={discountPercent}
                    onChange={(e) => setDiscountPercent(Number(e.target.value))}
                    min={0}
                    max={100}
                  />
                </div>
              </CardContent>
            </Card>
          </div>

          {/* Sidebar */}
          <div className="space-y-6">
            <Card>
              <CardHeader>
                <CardTitle>Trạng thái</CardTitle>
              </CardHeader>
              <CardContent>
                <Select
                  value={status}
                  onChange={(e) => setStatus(e.target.value)}
                >
                  <option value="UPCOMING">Sắp diễn ra</option>
                  <option value="ACTIVE">Đang diễn ra</option>
                  <option value="ENDED">Đã kết thúc</option>
                </Select>
              </CardContent>
            </Card>

            <Card>
              <CardContent className="pt-6">
                <div className="p-3 rounded-lg mb-4" style={{ backgroundColor: 'var(--color-muted)' }}>
                  <p className="text-sm">
                    💡 Sử dụng API để thêm/xóa sản phẩm trong flash sale
                  </p>
                </div>
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
