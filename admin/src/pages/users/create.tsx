import { useState } from "react";
import { useCreate, useNavigation, useList } from "@refinedev/core";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Select } from "@/components/ui/select";
import { Switch } from "@/components/ui/switch";
import { ArrowLeft, Save, Loader2, UserPlus } from "lucide-react";

export const UserCreate = () => {
    const { push, goBack } = useNavigation();
    const { mutate: create, isLoading } = useCreate();

    // Fetch roles for dropdown
    const { data: rolesData } = useList({
        resource: "roles",
        pagination: { current: 1, pageSize: 100 },
    });
    const roles = rolesData?.data || [];

    const [formData, setFormData] = useState({
        email: "",
        password: "",
        confirmPassword: "",
        firstName: "",
        lastName: "",
        phone: "",
        role: "CUSTOMER",
        isActive: true,
    });

    const [errors, setErrors] = useState<Record<string, string>>({});

    const handleChange = (field: string, value: any) => {
        setFormData((prev) => ({ ...prev, [field]: value }));
        // Clear error when user types
        if (errors[field]) {
            setErrors((prev) => ({ ...prev, [field]: "" }));
        }
    };

    const validate = () => {
        const newErrors: Record<string, string> = {};

        if (!formData.email) {
            newErrors.email = "Email là bắt buộc";
        } else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(formData.email)) {
            newErrors.email = "Email không hợp lệ";
        }

        if (!formData.password) {
            newErrors.password = "Mật khẩu là bắt buộc";
        } else if (formData.password.length < 6) {
            newErrors.password = "Mật khẩu phải có ít nhất 6 ký tự";
        }

        if (formData.password !== formData.confirmPassword) {
            newErrors.confirmPassword = "Mật khẩu xác nhận không khớp";
        }

        setErrors(newErrors);
        return Object.keys(newErrors).length === 0;
    };

    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault();

        if (!validate()) return;

        const { confirmPassword, ...submitData } = formData;

        create(
            {
                resource: "users",
                values: submitData,
            },
            {
                onSuccess: () => push("/users"),
                onError: (error: any) => {
                    if (error?.message?.includes("email")) {
                        setErrors({ email: "Email này đã được sử dụng" });
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
                        <UserPlus className="h-8 w-8" />
                        Thêm người dùng
                    </h1>
                    <p className="text-muted-foreground mt-1">
                        Tạo tài khoản người dùng mới
                    </p>
                </div>
            </div>

            <form onSubmit={handleSubmit}>
                <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
                    {/* Main Info */}
                    <div className="lg:col-span-2 space-y-6">
                        <Card>
                            <CardHeader>
                                <CardTitle>Thông tin đăng nhập</CardTitle>
                            </CardHeader>
                            <CardContent className="space-y-4">
                                <div className="space-y-2">
                                    <Label htmlFor="email">
                                        Email <span className="text-red-500">*</span>
                                    </Label>
                                    <Input
                                        id="email"
                                        type="email"
                                        value={formData.email}
                                        onChange={(e) => handleChange("email", e.target.value)}
                                        placeholder="email@example.com"
                                        className={errors.email ? "border-red-500" : ""}
                                    />
                                    {errors.email && (
                                        <p className="text-xs text-red-500">{errors.email}</p>
                                    )}
                                </div>

                                <div className="grid grid-cols-2 gap-4">
                                    <div className="space-y-2">
                                        <Label htmlFor="password">
                                            Mật khẩu <span className="text-red-500">*</span>
                                        </Label>
                                        <Input
                                            id="password"
                                            type="password"
                                            value={formData.password}
                                            onChange={(e) => handleChange("password", e.target.value)}
                                            placeholder="••••••"
                                            className={errors.password ? "border-red-500" : ""}
                                        />
                                        {errors.password && (
                                            <p className="text-xs text-red-500">{errors.password}</p>
                                        )}
                                    </div>
                                    <div className="space-y-2">
                                        <Label htmlFor="confirmPassword">
                                            Xác nhận mật khẩu <span className="text-red-500">*</span>
                                        </Label>
                                        <Input
                                            id="confirmPassword"
                                            type="password"
                                            value={formData.confirmPassword}
                                            onChange={(e) => handleChange("confirmPassword", e.target.value)}
                                            placeholder="••••••"
                                            className={errors.confirmPassword ? "border-red-500" : ""}
                                        />
                                        {errors.confirmPassword && (
                                            <p className="text-xs text-red-500">{errors.confirmPassword}</p>
                                        )}
                                    </div>
                                </div>
                            </CardContent>
                        </Card>

                        <Card>
                            <CardHeader>
                                <CardTitle>Thông tin cá nhân</CardTitle>
                            </CardHeader>
                            <CardContent className="space-y-4">
                                <div className="grid grid-cols-2 gap-4">
                                    <div className="space-y-2">
                                        <Label htmlFor="firstName">Họ</Label>
                                        <Input
                                            id="firstName"
                                            value={formData.firstName}
                                            onChange={(e) => handleChange("firstName", e.target.value)}
                                            placeholder="Nguyễn"
                                        />
                                    </div>
                                    <div className="space-y-2">
                                        <Label htmlFor="lastName">Tên</Label>
                                        <Input
                                            id="lastName"
                                            value={formData.lastName}
                                            onChange={(e) => handleChange("lastName", e.target.value)}
                                            placeholder="Văn A"
                                        />
                                    </div>
                                </div>

                                <div className="space-y-2">
                                    <Label htmlFor="phone">Số điện thoại</Label>
                                    <Input
                                        id="phone"
                                        value={formData.phone}
                                        onChange={(e) => handleChange("phone", e.target.value)}
                                        placeholder="0123456789"
                                    />
                                </div>
                            </CardContent>
                        </Card>
                    </div>

                    {/* Sidebar */}
                    <div className="space-y-6">
                        <Card>
                            <CardHeader>
                                <CardTitle>Quyền & Trạng thái</CardTitle>
                            </CardHeader>
                            <CardContent className="space-y-4">
                                <div className="space-y-2">
                                    <Label htmlFor="role">Vai trò</Label>
                                    <Select
                                        id="role"
                                        value={formData.role}
                                        onChange={(e) => handleChange("role", e.target.value)}
                                    >
                                        <option value="CUSTOMER">Khách hàng</option>
                                        <option value="ADMIN">Quản trị viên</option>
                                        <option value="STAFF">Nhân viên</option>
                                    </Select>
                                </div>

                                <div className="flex items-center justify-between">
                                    <Label htmlFor="isActive">Kích hoạt ngay</Label>
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
                                    Tạo người dùng
                                </Button>
                            </CardContent>
                        </Card>
                    </div>
                </div>
            </form>
        </div>
    );
};
