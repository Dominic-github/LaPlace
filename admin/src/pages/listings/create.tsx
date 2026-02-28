import { useList } from "@refinedev/core";
import { useNavigate, useParams } from "react-router-dom";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { ArrowLeft, Save, Loader2 } from "lucide-react";
import { useState, useEffect } from "react";
import { MediaPicker } from "@/components/media";

const API_URL = import.meta.env.VITE_API_URL || "http://localhost:5003/api";

export const ListingCreate = () => {
  const navigate = useNavigate();

  // Fetch categories and provinces
  const { data: categoriesData } = useList({
    resource: "categories",
    pagination: { current: 1, pageSize: 50 },
  });
  const categories = categoriesData?.data || [];

  const { data: provincesData } = useList({
    resource: "provinces",
    pagination: { current: 1, pageSize: 100 },
  });
  const provinces = provincesData?.data || [];

  const [formData, setFormData] = useState({
    title: "",
    description: "",
    address: "",
    categoryId: "",
    provinceId: "",
    wardId: "",
    listingType: "BUY",
    propertyType: "HOUSE",
    price: "",
    priceUnit: "VND",
    area: "",
    bedrooms: "",
    bathrooms: "",
    floors: "",
    status: "PENDING",
    isVip: false,
  });
  const [images, setImages] = useState<string[]>([]);
  const [uploading, setUploading] = useState(false);
  const [loading, setLoading] = useState(false);

  // Wards depend on selected province (2 cấp trực tiếp)
  const [wards, setWards] = useState<any[]>([]);

  useEffect(() => {
    if (formData.provinceId) {
      const token = localStorage.getItem("token");
      fetch(`${API_URL}/provinces/${formData.provinceId}/wards`, {
        headers: { Authorization: `Bearer ${token}` },
      })
        .then(res => res.json())
        .then(data => setWards(data.data || []))
        .catch(() => setWards([]));
    } else {
      setWards([]);
    }
  }, [formData.provinceId]);

  const handleImageUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const files = e.target.files;
    if (!files || files.length === 0) return;

    setUploading(true);
    const token = localStorage.getItem("token");

    for (let i = 0; i < files.length; i++) {
      const formDataUpload = new FormData();
      formDataUpload.append("file", files[i]);

      try {
        const response = await fetch(`${API_URL}/upload`, {
          method: "POST",
          headers: { Authorization: `Bearer ${token}` },
          body: formDataUpload,
        });
        const data = await response.json();
        if (data.url) {
          setImages(prev => [...prev, data.url]);
        }
      } catch (error) {
        console.error("Upload failed:", error);
      }
    }
    setUploading(false);
  };

  const removeImage = (index: number) => {
    setImages(prev => prev.filter((_, i) => i !== index));
  };

  const generateSlug = (title: string) => {
    return title
      .toLowerCase()
      .normalize("NFD")
      .replace(/[\u0300-\u036f]/g, "")
      .replace(/đ/g, "d")
      .replace(/[^a-z0-9\s-]/g, "")
      .replace(/\s+/g, "-")
      .replace(/-+/g, "-")
      .trim();
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!formData.categoryId) {
      alert("Vui lòng chọn danh mục BĐS");
      return;
    }
    if (!formData.provinceId) {
      alert("Vui lòng chọn tỉnh/thành phố");
      return;
    }
    if (images.length === 0) {
      alert("Vui lòng tải lên ít nhất 1 hình ảnh");
      return;
    }

    setLoading(true);

    try {
      const token = localStorage.getItem("token");
      const slug = generateSlug(formData.title) + "-" + Date.now();

      const response = await fetch(`${API_URL}/listings`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          "Authorization": `Bearer ${token}`,
        },
        body: JSON.stringify({
          ...formData,
          slug,
          price: parseFloat(formData.price) || 0,
          area: parseFloat(formData.area) || 0,
          bedrooms: formData.bedrooms ? parseInt(formData.bedrooms) : null,
          bathrooms: formData.bathrooms ? parseInt(formData.bathrooms) : null,
          floors: formData.floors ? parseInt(formData.floors) : null,
          images: images.map((url, idx) => ({ url, order: idx, isPrimary: idx === 0 })),
        }),
      });

      if (response.ok) {
        navigate("/listings");
      } else {
        const error = await response.json();
        alert(error.message || "Có lỗi xảy ra khi tạo tin đăng");
      }
    } catch (error) {
      console.error(error);
      alert("Có lỗi xảy ra");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="space-y-6">
      <div className="flex items-center gap-4">
        <Button variant="outline" onClick={() => navigate("/listings")}>
          <ArrowLeft className="h-4 w-4 mr-2" />
          Quay lại
        </Button>
        <h1 className="text-2xl font-bold">Thêm tin đăng mới</h1>
      </div>

      <form onSubmit={handleSubmit}>
        <div className="grid gap-6 lg:grid-cols-3">
          <div className="lg:col-span-2 space-y-6">
            {/* Basic Info */}
            <Card>
              <CardHeader>
                <CardTitle>Thông tin cơ bản</CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="grid gap-4 md:grid-cols-2">
                  <div className="space-y-2">
                    <Label>Danh mục BĐS *</Label>
                    <select
                      value={formData.categoryId}
                      onChange={(e) => setFormData({ ...formData, categoryId: e.target.value })}
                      className="w-full h-10 rounded-md border border-input bg-background px-3"
                      required
                    >
                      <option value="">-- Chọn danh mục --</option>
                      {categories.map((cat: any) => (
                        <option key={cat.id} value={cat.id}>{cat.name}</option>
                      ))}
                    </select>
                  </div>
                  <div className="space-y-2">
                    <Label>Loại BĐS</Label>
                    <select
                      value={formData.propertyType}
                      onChange={(e) => setFormData({ ...formData, propertyType: e.target.value })}
                      className="w-full h-10 rounded-md border border-input bg-background px-3"
                    >
                      <option value="HOUSE">Nhà</option>
                      <option value="APARTMENT">Căn hộ</option>
                      <option value="VILLA">Biệt thự</option>
                      <option value="LAND">Đất</option>
                      <option value="OFFICE">Văn phòng</option>
                      <option value="ROOM">Phòng trọ</option>
                    </select>
                  </div>
                </div>
                <div className="space-y-2">
                  <Label>Tiêu đề *</Label>
                  <Input
                    value={formData.title}
                    onChange={(e) => setFormData({ ...formData, title: e.target.value })}
                    placeholder="VD: Nhà phố 3 tầng mặt tiền Quận 1"
                    required
                  />
                </div>
                <div className="space-y-2">
                  <Label>Mô tả chi tiết *</Label>
                  <textarea
                    value={formData.description}
                    onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                    placeholder="Mô tả chi tiết về bất động sản, tiện ích, vị trí..."
                    rows={5}
                    className="w-full rounded-md border border-input bg-background px-3 py-2 text-sm"
                    required
                  />
                </div>
              </CardContent>
            </Card>

            {/* Location */}
            <Card>
              <CardHeader>
                <CardTitle>Vị trí</CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="grid gap-4 md:grid-cols-2">
                  <div className="space-y-2">
                    <Label>Tỉnh/Thành phố *</Label>
                    <select
                      value={formData.provinceId}
                      onChange={(e) => setFormData({ ...formData, provinceId: e.target.value, wardId: "" })}
                      className="w-full h-10 rounded-md border border-input bg-background px-3"
                      required
                    >
                      <option value="">-- Chọn tỉnh/thành --</option>
                      {provinces.map((p: any) => (
                        <option key={p.id} value={p.id}>{p.name}</option>
                      ))}
                    </select>
                  </div>
                  <div className="space-y-2">
                    <Label>Phường/Xã</Label>
                    <select
                      value={formData.wardId}
                      onChange={(e) => setFormData({ ...formData, wardId: e.target.value })}
                      className="w-full h-10 rounded-md border border-input bg-background px-3"
                      disabled={!formData.provinceId}
                    >
                      <option value="">-- Chọn phường/xã --</option>
                      {wards.map((w: any) => (
                        <option key={w.id} value={w.id}>{w.name}</option>
                      ))}
                    </select>
                  </div>
                </div>
                <div className="space-y-2">
                  <Label>Địa chỉ chi tiết</Label>
                  <Input
                    value={formData.address}
                    onChange={(e) => setFormData({ ...formData, address: e.target.value })}
                    placeholder="VD: 123 Nguyễn Huệ"
                  />
                </div>
              </CardContent>
            </Card>

            {/* Property Details */}
            <Card>
              <CardHeader>
                <CardTitle>Thông tin bất động sản</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                  <div className="space-y-2">
                    <Label>Loại tin</Label>
                    <select
                      value={formData.listingType}
                      onChange={(e) => setFormData({ ...formData, listingType: e.target.value })}
                      className="w-full h-10 rounded-md border border-input bg-background px-3"
                    >
                      <option value="BUY">Bán</option>
                      <option value="RENT">Cho thuê</option>
                    </select>
                  </div>
                  <div className="space-y-2">
                    <Label>Giá *</Label>
                    <Input
                      type="number"
                      value={formData.price}
                      onChange={(e) => setFormData({ ...formData, price: e.target.value })}
                      placeholder="5000000000"
                      required
                    />
                  </div>
                  <div className="space-y-2">
                    <Label>Đơn vị</Label>
                    <select
                      value={formData.priceUnit}
                      onChange={(e) => setFormData({ ...formData, priceUnit: e.target.value })}
                      className="w-full h-10 rounded-md border border-input bg-background px-3"
                    >
                      <option value="VND">VNĐ</option>
                      <option value="VND_M2">VNĐ/m²</option>
                      <option value="VND_MONTH">VNĐ/tháng</option>
                    </select>
                  </div>
                  <div className="space-y-2">
                    <Label>Diện tích (m²) *</Label>
                    <Input
                      type="number"
                      value={formData.area}
                      onChange={(e) => setFormData({ ...formData, area: e.target.value })}
                      placeholder="100"
                      required
                    />
                  </div>
                  <div className="space-y-2">
                    <Label>Phòng ngủ</Label>
                    <Input
                      type="number"
                      value={formData.bedrooms}
                      onChange={(e) => setFormData({ ...formData, bedrooms: e.target.value })}
                      placeholder="3"
                    />
                  </div>
                  <div className="space-y-2">
                    <Label>Toilet</Label>
                    <Input
                      type="number"
                      value={formData.bathrooms}
                      onChange={(e) => setFormData({ ...formData, bathrooms: e.target.value })}
                      placeholder="2"
                    />
                  </div>
                  <div className="space-y-2">
                    <Label>Số tầng</Label>
                    <Input
                      type="number"
                      value={formData.floors}
                      onChange={(e) => setFormData({ ...formData, floors: e.target.value })}
                      placeholder="3"
                    />
                  </div>
                </div>
              </CardContent>
            </Card>

            {/* Images */}
            <Card>
              <CardHeader>
                <CardTitle>Hình ảnh *</CardTitle>
              </CardHeader>
              <CardContent>
                <MediaPicker
                  value={images}
                  onChange={(urls) => setImages(urls as string[])}
                  multiple={true}
                  label="Chọn ảnh BĐS"
                />
                <p className="text-xs text-muted-foreground mt-2">
                  Ảnh đầu tiên sẽ là ảnh chính. Thêm nhiều ảnh để tăng độ hấp dẫn.
                </p>
              </CardContent>
            </Card>
          </div>

          {/* Sidebar */}
          <div className="space-y-6">
            <Card>
              <CardHeader>
                <CardTitle>Trạng thái</CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="space-y-2">
                  <Label>Trạng thái tin</Label>
                  <select
                    value={formData.status}
                    onChange={(e) => setFormData({ ...formData, status: e.target.value })}
                    className="w-full h-10 rounded-md border border-input bg-background px-3"
                  >
                    <option value="PENDING">Chờ duyệt</option>
                    <option value="APPROVED">Đã duyệt</option>
                    <option value="REJECTED">Từ chối</option>
                  </select>
                </div>
                <div className="flex items-center gap-2">
                  <input
                    type="checkbox"
                    id="isVip"
                    checked={formData.isVip}
                    onChange={(e) => setFormData({ ...formData, isVip: e.target.checked })}
                  />
                  <Label htmlFor="isVip">Tin VIP</Label>
                </div>
              </CardContent>
            </Card>

            <Button type="submit" className="w-full" disabled={loading}>
              {loading ? (
                <Loader2 className="h-4 w-4 mr-2 animate-spin" />
              ) : (
                <Save className="h-4 w-4 mr-2" />
              )}
              Tạo tin đăng
            </Button>
          </div>
        </div>
      </form>
    </div>
  );
};

export const ListingEdit = () => {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();

  const { data: categoriesData } = useList({
    resource: "categories",
    pagination: { current: 1, pageSize: 50 },
  });
  const categories = categoriesData?.data || [];

  const { data: provincesData } = useList({
    resource: "provinces",
    pagination: { current: 1, pageSize: 100 },
  });
  const provinces = provincesData?.data || [];

  const [formData, setFormData] = useState<any>(null);
  const [images, setImages] = useState<string[]>([]);
  const [uploading, setUploading] = useState(false);
  const [loading, setLoading] = useState(false);
  const [fetching, setFetching] = useState(true);

  useEffect(() => {
    fetchListing();
  }, [id]);

  const fetchListing = async () => {
    try {
      const token = localStorage.getItem("token");
      const response = await fetch(`${API_URL}/listings/${id}`, {
        headers: { "Authorization": `Bearer ${token}` },
      });
      const data = await response.json();
      if (data.success || data.data) {
        const listing = data.data || data;
        setFormData(listing);
        if (listing.images) {
          setImages(listing.images.map((img: any) => img.url));
        }
      }
    } catch (error) {
      console.error(error);
    } finally {
      setFetching(false);
    }
  };

  const handleImageUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const files = e.target.files;
    if (!files || files.length === 0) return;

    setUploading(true);
    const token = localStorage.getItem("token");

    for (let i = 0; i < files.length; i++) {
      const formDataUpload = new FormData();
      formDataUpload.append("file", files[i]);

      try {
        const response = await fetch(`${API_URL}/upload`, {
          method: "POST",
          headers: { Authorization: `Bearer ${token}` },
          body: formDataUpload,
        });
        const data = await response.json();
        if (data.url) {
          setImages(prev => [...prev, data.url]);
        }
      } catch (error) {
        console.error("Upload failed:", error);
      }
    }
    setUploading(false);
  };

  const removeImage = (index: number) => {
    setImages(prev => prev.filter((_, i) => i !== index));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);

    try {
      const token = localStorage.getItem("token");
      const response = await fetch(`${API_URL}/listings/${id}`, {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
          "Authorization": `Bearer ${token}`,
        },
        body: JSON.stringify({
          ...formData,
          images: images.map((url, idx) => ({ url, order: idx, isPrimary: idx === 0 })),
        }),
      });

      if (response.ok) {
        navigate("/listings");
      } else {
        alert("Có lỗi xảy ra");
      }
    } catch (error) {
      console.error(error);
      alert("Có lỗi xảy ra");
    } finally {
      setLoading(false);
    }
  };

  if (fetching) {
    return (
      <div className="flex items-center justify-center h-64">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary"></div>
      </div>
    );
  }

  if (!formData) {
    return <div className="text-center py-12">Không tìm thấy tin đăng</div>;
  }

  return (
    <div className="space-y-6">
      <div className="flex items-center gap-4">
        <Button variant="outline" onClick={() => navigate("/listings")}>
          <ArrowLeft className="h-4 w-4 mr-2" />
          Quay lại
        </Button>
        <h1 className="text-2xl font-bold">Chỉnh sửa: {formData.title}</h1>
      </div>

      <form onSubmit={handleSubmit}>
        <div className="grid gap-6 lg:grid-cols-3">
          <div className="lg:col-span-2 space-y-6">
            <Card>
              <CardHeader>
                <CardTitle>Thông tin cơ bản</CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="grid gap-4 md:grid-cols-2">
                  <div className="space-y-2">
                    <Label>Danh mục BĐS</Label>
                    <select
                      value={formData.categoryId || ""}
                      onChange={(e) => setFormData({ ...formData, categoryId: e.target.value })}
                      className="w-full h-10 rounded-md border border-input bg-background px-3"
                    >
                      <option value="">-- Chọn danh mục --</option>
                      {categories.map((cat: any) => (
                        <option key={cat.id} value={cat.id}>{cat.name}</option>
                      ))}
                    </select>
                  </div>
                  <div className="space-y-2">
                    <Label>Tỉnh/Thành phố</Label>
                    <select
                      value={formData.provinceId || ""}
                      onChange={(e) => setFormData({ ...formData, provinceId: e.target.value })}
                      className="w-full h-10 rounded-md border border-input bg-background px-3"
                    >
                      <option value="">-- Chọn tỉnh/thành --</option>
                      {provinces.map((p: any) => (
                        <option key={p.id} value={p.id}>{p.name}</option>
                      ))}
                    </select>
                  </div>
                </div>
                <div className="space-y-2">
                  <Label>Tiêu đề</Label>
                  <Input
                    value={formData.title || ""}
                    onChange={(e) => setFormData({ ...formData, title: e.target.value })}
                  />
                </div>
                <div className="space-y-2">
                  <Label>Mô tả</Label>
                  <textarea
                    value={formData.description || ""}
                    onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                    rows={5}
                    className="w-full rounded-md border border-input bg-background px-3 py-2 text-sm"
                  />
                </div>
                <div className="space-y-2">
                  <Label>Địa chỉ</Label>
                  <Input
                    value={formData.address || ""}
                    onChange={(e) => setFormData({ ...formData, address: e.target.value })}
                  />
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle>Thông tin BĐS</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                  <div className="space-y-2">
                    <Label>Giá</Label>
                    <Input
                      type="number"
                      value={formData.price || ""}
                      onChange={(e) => setFormData({ ...formData, price: parseFloat(e.target.value) })}
                    />
                  </div>
                  <div className="space-y-2">
                    <Label>Diện tích</Label>
                    <Input
                      type="number"
                      value={formData.area || ""}
                      onChange={(e) => setFormData({ ...formData, area: parseFloat(e.target.value) })}
                    />
                  </div>
                  <div className="space-y-2">
                    <Label>Phòng ngủ</Label>
                    <Input
                      type="number"
                      value={formData.bedrooms || ""}
                      onChange={(e) => setFormData({ ...formData, bedrooms: parseInt(e.target.value) })}
                    />
                  </div>
                  <div className="space-y-2">
                    <Label>Toilet</Label>
                    <Input
                      type="number"
                      value={formData.bathrooms || ""}
                      onChange={(e) => setFormData({ ...formData, bathrooms: parseInt(e.target.value) })}
                    />
                  </div>
                </div>
              </CardContent>
            </Card>

            {/* Images */}
            <Card>
              <CardHeader>
                <CardTitle>Hình ảnh</CardTitle>
              </CardHeader>
              <CardContent>
                <MediaPicker
                  value={images}
                  onChange={(urls) => setImages(urls as string[])}
                  multiple={true}
                  label="Chọn ảnh BĐS"
                />
                <p className="text-xs text-muted-foreground mt-2">
                  Ảnh đầu tiên sẽ là ảnh chính.
                </p>
              </CardContent>
            </Card>
          </div>

          <div className="space-y-6">
            <Card>
              <CardHeader>
                <CardTitle>Trạng thái</CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="space-y-2">
                  <Label>Trạng thái</Label>
                  <select
                    value={formData.status || "PENDING"}
                    onChange={(e) => setFormData({ ...formData, status: e.target.value })}
                    className="w-full h-10 rounded-md border border-input bg-background px-3"
                  >
                    <option value="PENDING">Chờ duyệt</option>
                    <option value="APPROVED">Đã duyệt</option>
                    <option value="REJECTED">Từ chối</option>
                  </select>
                </div>
                <div className="flex items-center gap-2">
                  <input
                    type="checkbox"
                    checked={formData.isVip || false}
                    onChange={(e) => setFormData({ ...formData, isVip: e.target.checked })}
                  />
                  <Label>Tin VIP</Label>
                </div>
              </CardContent>
            </Card>

            <Button type="submit" className="w-full" disabled={loading}>
              {loading ? <Loader2 className="h-4 w-4 mr-2 animate-spin" /> : <Save className="h-4 w-4 mr-2" />}
              Cập nhật
            </Button>
          </div>
        </div>
      </form>
    </div>
  );
};
