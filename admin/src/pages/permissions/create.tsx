import { useState } from "react";
import { useCreate, useNavigation } from "@refinedev/core";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Select } from "@/components/ui/select";
import { Textarea } from "@/components/ui/textarea";
import { ArrowLeft, Save, Loader2, Key } from "lucide-react";

const MODULES = [
    { value: "products", label: "Sản phẩm" },
    { value: "orders", label: "Đơn hàng" },
    { value: "users", label: "Người dùng" },
    { value: "posts", label: "Bài viết" },
    { value: "categories", label: "Danh mục" },
    { value: "settings", label: "Cài đặt" },
    { value: "media", label: "Media" },
    { value: "coupons", label: "Mã giảm giá" },
    { value: "reports", label: "Báo cáo" },
    { value: "roles", label: "Vai trò" },
    { value: "permissions", label: "Quyền hạn" },
    { value: "warehouses", label: "Kho hàng" },
    { value: "showrooms", label: "Showroom" },
    { value: "currencies", label: "Tiền tệ" },
    { value: "flashsales", label: "Flash Sales" },
    { value: "reviews", label: "Đánh giá" },
];

const ACTIONS = [
    { value: "view", label: "Xem" },
    { value: "create", label: "Tạo mới" },
    { value: "edit", label: "Chỉnh sửa" },
    { value: "delete", label: "Xóa" },
    { value: "manage", label: "Quản lý" },
    { value: "export", label: "Xuất file" },
    { value: "import", label: "Nhập file" },
];

export const PermissionCreate = () => {
    const { push, goBack } = useNavigation();
    const { mutate: create, isLoading } = useCreate();

    const [formData, setFormData] = useState({
        module: "",
        action: "",
        displayName: "",
        description: "",
    });

    const [errors, setErrors] = useState<Record<string, string>>({});

    const handleChange = (field: string, value: any) => {
        setFormData((prev) => ({ ...prev, [field]: value }));
        if (errors[field]) {
            setErrors((prev) => ({ ...prev, [field]: "" }));
        }
    };

    // Auto-generate displayName when module/action changes
    const generateDisplayName = () => {
        if (formData.module && formData.action) {
            const moduleName = MODULES.find(m => m.value === formData.module)?.label || formData.module;
            const actionName = ACTIONS.find(a => a.value === formData.action)?.label || formData.action;
            return `${actionName} ${moduleName}`;
        }
        return "";
    };

    const validate = () => {
        const newErrors: Record<string, string> = {};
        if (!formData.module) newErrors.module = "Vui lòng chọn module";
        if (!formData.action) newErrors.action = "Vui lòng chọn hành động";
        setErrors(newErrors);
        return Object.keys(newErrors).length === 0;
    };

    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault();
        if (!validate()) return;

        const permissionName = `${formData.module}.${formData.action}`;
        const displayName = formData.displayName || generateDisplayName();

        create(
            {
                resource: "permissions",
                values: {
                    name: permissionName,
                    displayName,
                    description: formData.description,
                    module: formData.module,
                },
            },
            {
                onSuccess: () => push("/permissions"),
                onError: (error: any) => {
                    if (error?.message?.includes("Unique")) {
                        setErrors({ module: "Quyền này đã tồn tại" });
                    }
                },
            }
        );
    };

    return (
        <div className="space-y-6">
            {/* Header */}
            <div className="flex items-center gap-4">
                <Button variant="ghost" size="sm" onClick={goBack}>
                    <ArrowLeft className="h-4 w-4 mr-2" />
                    Quay lại
                </Button>
                <div>
                    <h1 className="text-3xl font-bold flex items-center gap-2">
                        <Key className="h-8 w-8" />
                        Thêm quyền mới
                    </h1>
                    <p className="text-muted-foreground mt-1">
                        Tạo quyền hạn mới trong hệ thống
                    </p>
                </div>
            </div>

            <form onSubmit={handleSubmit}>
                <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
                    {/* Main Form */}
                    <div className="lg:col-span-2 space-y-6">
                        <Card>
                            <CardHeader>
                                <CardTitle>Thông tin quyền</CardTitle>
                            </CardHeader>
                            <CardContent className="space-y-4">
                                <div className="grid grid-cols-2 gap-4">
                                    <div className="space-y-2">
                                        <Label htmlFor="module">
                                            Module <span className="text-red-500">*</span>
                                        </Label>
                                        <Select
                                            id="module"
                                            value={formData.module}
                                            onChange={(e) => handleChange("module", e.target.value)}
                                        >
                                            <option value="">-- Chọn module --</option>
                                            {MODULES.map((m) => (
                                                <option key={m.value} value={m.value}>
                                                    {m.label}
                                                </option>
                                            ))}
                                        </Select>
                                        {errors.module && (
                                            <p className="text-xs text-red-500">{errors.module}</p>
                                        )}
                                    </div>
                                    <div className="space-y-2">
                                        <Label htmlFor="action">
                                            Hành động <span className="text-red-500">*</span>
                                        </Label>
                                        <Select
                                            id="action"
                                            value={formData.action}
                                            onChange={(e) => handleChange("action", e.target.value)}
                                        >
                                            <option value="">-- Chọn hành động --</option>
                                            {ACTIONS.map((a) => (
                                                <option key={a.value} value={a.value}>
                                                    {a.label}
                                                </option>
                                            ))}
                                        </Select>
                                        {errors.action && (
                                            <p className="text-xs text-red-500">{errors.action}</p>
                                        )}
                                    </div>
                                </div>

                                <div className="space-y-2">
                                    <Label htmlFor="displayName">Tên hiển thị</Label>
                                    <Input
                                        id="displayName"
                                        value={formData.displayName || generateDisplayName()}
                                        onChange={(e) => handleChange("displayName", e.target.value)}
                                        placeholder="Ví dụ: Xem sản phẩm"
                                    />
                                    <p className="text-xs text-muted-foreground">
                                        Tên hiển thị cho người dùng. Nếu để trống sẽ tự động tạo.
                                    </p>
                                </div>

                                <div className="space-y-2">
                                    <Label htmlFor="description">Mô tả</Label>
                                    <Textarea
                                        id="description"
                                        value={formData.description}
                                        onChange={(e) => handleChange("description", e.target.value)}
                                        placeholder="Mô tả chi tiết về quyền này..."
                                        rows={3}
                                    />
                                </div>
                            </CardContent>
                        </Card>
                    </div>

                    {/* Sidebar */}
                    <div className="space-y-6">
                        <Card>
                            <CardHeader>
                                <CardTitle>Xem trước</CardTitle>
                            </CardHeader>
                            <CardContent>
                                <div className="p-4 bg-muted rounded-lg space-y-2">
                                    <p className="text-sm">
                                        <span className="text-muted-foreground">Tên quyền:</span>{" "}
                                        <code className="bg-background px-2 py-1 rounded">
                                            {formData.module && formData.action
                                                ? `${formData.module}.${formData.action}`
                                                : "module.action"}
                                        </code>
                                    </p>
                                    <p className="text-sm">
                                        <span className="text-muted-foreground">Hiển thị:</span>{" "}
                                        {formData.displayName || generateDisplayName() || "..."}
                                    </p>
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
                                    Tạo quyền
                                </Button>
                            </CardContent>
                        </Card>
                    </div>
                </div>
            </form>
        </div>
    );
};
