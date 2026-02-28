import { useState, useEffect } from "react";
import { useOne, useUpdate, useNavigation } from "@refinedev/core";
import { useParams } from "react-router-dom";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Spinner } from "@/components/ui/spinner";
import { ArrowLeft, Save, Loader2, Key } from "lucide-react";

export const PermissionEdit = () => {
    const { id } = useParams();
    const { push, goBack } = useNavigation();
    const { data, isLoading: isFetching } = useOne({
        resource: "permissions",
        id: id!,
    });
    const { mutate: update, isLoading } = useUpdate();

    const [formData, setFormData] = useState({
        displayName: "",
        description: "",
    });

    useEffect(() => {
        if (data?.data) {
            const permission = data.data;
            setFormData({
                displayName: permission.displayName || "",
                description: permission.description || "",
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
                resource: "permissions",
                id: id!,
                values: formData,
            },
            {
                onSuccess: () => push("/permissions"),
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

    const permission = data?.data as any;

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
                        Chỉnh sửa quyền
                    </h1>
                    <p className="text-muted-foreground mt-1 font-mono">
                        {permission?.name}
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
                                <div className="space-y-2">
                                    <Label htmlFor="name">Tên quyền (không thể thay đổi)</Label>
                                    <Input
                                        id="name"
                                        value={permission?.name || ""}
                                        disabled
                                        className="bg-muted font-mono"
                                    />
                                </div>

                                <div className="grid grid-cols-2 gap-4">
                                    <div className="space-y-2">
                                        <Label>Module</Label>
                                        <Input
                                            value={permission?.module || ""}
                                            disabled
                                            className="bg-muted"
                                        />
                                    </div>
                                    <div className="space-y-2">
                                        <Label>Số vai trò sử dụng</Label>
                                        <Input
                                            value={permission?._count?.roles || 0}
                                            disabled
                                            className="bg-muted"
                                        />
                                    </div>
                                </div>

                                <div className="space-y-2">
                                    <Label htmlFor="displayName">Tên hiển thị</Label>
                                    <Input
                                        id="displayName"
                                        value={formData.displayName}
                                        onChange={(e) => handleChange("displayName", e.target.value)}
                                        placeholder="Ví dụ: Xem sản phẩm"
                                    />
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
                                <CardTitle>Thông tin</CardTitle>
                            </CardHeader>
                            <CardContent className="space-y-3 text-sm">
                                <div className="flex justify-between">
                                    <span className="text-muted-foreground">Ngày tạo:</span>
                                    <span>
                                        {permission?.createdAt
                                            ? new Date(permission.createdAt).toLocaleDateString("vi-VN")
                                            : "-"}
                                    </span>
                                </div>
                                <div className="flex justify-between">
                                    <span className="text-muted-foreground">Cập nhật:</span>
                                    <span>
                                        {permission?.updatedAt
                                            ? new Date(permission.updatedAt).toLocaleDateString("vi-VN")
                                            : "-"}
                                    </span>
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
