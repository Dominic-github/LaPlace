import { useState, useEffect } from "react";
import { useOne, useUpdate, useNavigation } from "@refinedev/core";
import { useParams } from "react-router-dom";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Select } from "@/components/ui/select";
import { Switch } from "@/components/ui/switch";
import { Spinner } from "@/components/ui/spinner";
import { ArrowLeft, Save, Loader2 } from "lucide-react";

export const UserEdit = () => {
    const { id } = useParams();
    const { push, goBack } = useNavigation();
    const { data, isLoading: isFetching } = useOne({
        resource: "users",
        id: id!,
    });
    const { mutate: update, isLoading } = useUpdate();

    const [formData, setFormData] = useState({
        firstName: "",
        lastName: "",
        phone: "",
        role: "USER",
        isActive: true,
    });

    useEffect(() => {
        if (data?.data) {
            const user = data.data;
            setFormData({
                firstName: user.firstName || "",
                lastName: user.lastName || "",
                phone: user.phone || "",
                role: user.role || "USER",
                isActive: user.isActive ?? true,
            });
        }
    }, [data]);

    const handleChange = (field: string, value: any) => {
        setFormData((prev) => ({ ...prev, [field]: value }));
    };

    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault();
        update(
            {
                resource: "users",
                id: id!,
                values: formData,
            },
            {
                onSuccess: () => push("/users"),
            }
        );
    };

    if (isFetching) {
        return (
            <div className="flex items-center justify-center h-96">
                <Spinner size="lg" />
            </div>
        );
    }

    return (
        <div className="space-y-6">
            {/* Header */}
            <div className="flex items-center gap-4">
                <Button variant="ghost" size="sm" onClick={goBack}>
                    <ArrowLeft className="h-4 w-4 mr-2" />
                    Quay lại
                </Button>
                <div>
                    <h1 className="text-3xl font-bold">Chỉnh sửa người dùng</h1>
                    <p className="text-muted-foreground mt-1">{data?.data?.email}</p>
                </div>
            </div>

            <form onSubmit={handleSubmit}>
                <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
                    {/* Main Info */}
                    <div className="lg:col-span-2 space-y-6">
                        <Card>
                            <CardHeader>
                                <CardTitle>Thông tin cá nhân</CardTitle>
                            </CardHeader>
                            <CardContent className="space-y-4">
                                <div className="space-y-2">
                                    <Label htmlFor="email">Email</Label>
                                    <Input
                                        id="email"
                                        value={data?.data?.email || ""}
                                        disabled
                                        className="bg-muted"
                                    />
                                    <p className="text-xs text-muted-foreground">Email không thể thay đổi</p>
                                </div>

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
                                        <option value="USER">User</option>
                                        <option value="ADMIN">Admin</option>
                                    </Select>
                                </div>

                                <div className="flex items-center justify-between">
                                    <Label htmlFor="isActive">Trạng thái hoạt động</Label>
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
