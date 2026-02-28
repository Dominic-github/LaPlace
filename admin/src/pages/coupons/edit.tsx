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

export const CouponEdit = () => {
    const { id } = useParams();
    const { push, goBack } = useNavigation();
    const { data, isLoading: isFetching } = useOne({
        resource: "coupons",
        id: id!,
    });
    const { mutate: update, isLoading } = useUpdate();

    const [formData, setFormData] = useState({
        code: "",
        discountType: "PERCENTAGE",
        discountValue: 0,
        minOrderValue: 0,
        maxDiscount: 0,
        usageLimit: 0,
        expiresAt: "",
        isActive: true,
    });

    useEffect(() => {
        if (data?.data) {
            const coupon = data.data;
            setFormData({
                code: coupon.code || "",
                discountType: coupon.discountType || "PERCENTAGE",
                discountValue: coupon.discountValue || 0,
                minOrderValue: coupon.minOrderValue || 0,
                maxDiscount: coupon.maxDiscount || 0,
                usageLimit: coupon.usageLimit || 0,
                expiresAt: coupon.expiresAt ? coupon.expiresAt.split("T")[0] : "",
                isActive: coupon.isActive ?? true,
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
                resource: "coupons",
                id: id!,
                values: {
                    ...formData,
                    discountValue: Number(formData.discountValue),
                    minOrderValue: Number(formData.minOrderValue) || null,
                    maxDiscount: Number(formData.maxDiscount) || null,
                    usageLimit: Number(formData.usageLimit) || null,
                    expiresAt: formData.expiresAt ? new Date(formData.expiresAt).toISOString() : null,
                },
            },
            {
                onSuccess: () => push("/coupons"),
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
            <div className="flex items-center gap-4">
                <Button variant="ghost" size="sm" onClick={goBack}>
                    <ArrowLeft className="h-4 w-4 mr-2" />
                    Quay lại
                </Button>
                <div>
                    <h1 className="text-3xl font-bold">Chỉnh sửa mã giảm giá</h1>
                    <p className="text-muted-foreground mt-1">{formData.code}</p>
                </div>
            </div>

            <form onSubmit={handleSubmit}>
                <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
                    <div className="lg:col-span-2 space-y-6">
                        <Card>
                            <CardHeader>
                                <CardTitle>Thông tin mã giảm giá</CardTitle>
                            </CardHeader>
                            <CardContent className="space-y-4">
                                <div className="space-y-2">
                                    <Label htmlFor="code">Mã giảm giá *</Label>
                                    <Input
                                        id="code"
                                        value={formData.code}
                                        onChange={(e) => handleChange("code", e.target.value.toUpperCase())}
                                        placeholder="VD: SALE50"
                                        required
                                    />
                                </div>

                                <div className="grid grid-cols-2 gap-4">
                                    <div className="space-y-2">
                                        <Label htmlFor="discountType">Loại giảm giá</Label>
                                        <Select
                                            id="discountType"
                                            value={formData.discountType}
                                            onChange={(e) => handleChange("discountType", e.target.value)}
                                        >
                                            <option value="PERCENTAGE">Phần trăm (%)</option>
                                            <option value="FIXED">Số tiền cố định (VNĐ)</option>
                                        </Select>
                                    </div>
                                    <div className="space-y-2">
                                        <Label htmlFor="discountValue">
                                            Giá trị {formData.discountType === "PERCENTAGE" ? "(%)" : "(VNĐ)"} *
                                        </Label>
                                        <Input
                                            id="discountValue"
                                            type="number"
                                            value={formData.discountValue}
                                            onChange={(e) => handleChange("discountValue", e.target.value)}
                                            min={0}
                                            required
                                        />
                                    </div>
                                </div>

                                <div className="grid grid-cols-2 gap-4">
                                    <div className="space-y-2">
                                        <Label htmlFor="minOrderValue">Đơn tối thiểu (VNĐ)</Label>
                                        <Input
                                            id="minOrderValue"
                                            type="number"
                                            value={formData.minOrderValue}
                                            onChange={(e) => handleChange("minOrderValue", e.target.value)}
                                            min={0}
                                        />
                                    </div>
                                    <div className="space-y-2">
                                        <Label htmlFor="maxDiscount">Giảm tối đa (VNĐ)</Label>
                                        <Input
                                            id="maxDiscount"
                                            type="number"
                                            value={formData.maxDiscount}
                                            onChange={(e) => handleChange("maxDiscount", e.target.value)}
                                            min={0}
                                        />
                                    </div>
                                </div>

                                <div className="grid grid-cols-2 gap-4">
                                    <div className="space-y-2">
                                        <Label htmlFor="usageLimit">Số lần sử dụng tối đa</Label>
                                        <Input
                                            id="usageLimit"
                                            type="number"
                                            value={formData.usageLimit}
                                            onChange={(e) => handleChange("usageLimit", e.target.value)}
                                            min={0}
                                            placeholder="0 = không giới hạn"
                                        />
                                    </div>
                                    <div className="space-y-2">
                                        <Label htmlFor="expiresAt">Ngày hết hạn</Label>
                                        <Input
                                            id="expiresAt"
                                            type="date"
                                            value={formData.expiresAt}
                                            onChange={(e) => handleChange("expiresAt", e.target.value)}
                                        />
                                    </div>
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
                                    <Label htmlFor="isActive">Kích hoạt</Label>
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
                                    Cập nhật
                                </Button>
                            </CardContent>
                        </Card>
                    </div>
                </div>
            </form>
        </div>
    );
};
