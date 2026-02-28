import { useState } from "react";
import { useNavigation } from "@refinedev/core";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Checkbox } from "@/components/ui/checkbox";
import {
    ArrowLeft, Save, Loader2, Puzzle,
    ShieldCheck, Truck, RefreshCw, Gift, Package, Clock, CheckCircle, Star,
    Wrench, MapPin, Phone, CreditCard, Percent, Heart, AlertTriangle
} from "lucide-react";
import axios from "axios";

// Available icons
const availableIcons = [
    { name: "shield-check", icon: ShieldCheck, label: "Bảo hành" },
    { name: "truck", icon: Truck, label: "Giao hàng" },
    { name: "refresh-cw", icon: RefreshCw, label: "Đổi trả" },
    { name: "gift", icon: Gift, label: "Quà tặng" },
    { name: "package", icon: Package, label: "Đóng gói" },
    { name: "clock", icon: Clock, label: "Thời gian" },
    { name: "check-circle", icon: CheckCircle, label: "Hoàn thành" },
    { name: "star", icon: Star, label: "Đánh giá" },
    { name: "wrench", icon: Wrench, label: "Lắp đặt" },
    { name: "map-pin", icon: MapPin, label: "Địa điểm" },
    { name: "phone", icon: Phone, label: "Hỗ trợ" },
    { name: "credit-card", icon: CreditCard, label: "Thanh toán" },
    { name: "percent", icon: Percent, label: "Giảm giá" },
    { name: "heart", icon: Heart, label: "Yêu thích" },
    { name: "alert-triangle", icon: AlertTriangle, label: "Cảnh báo" },
];

// Available colors
const availableColors = [
    { value: "#3b82f6", label: "Xanh dương" },
    { value: "#22c55e", label: "Xanh lá" },
    { value: "#f59e0b", label: "Vàng" },
    { value: "#ef4444", label: "Đỏ" },
    { value: "#8b5cf6", label: "Tím" },
    { value: "#ec4899", label: "Hồng" },
    { value: "#06b6d4", label: "Cyan" },
    { value: "#64748b", label: "Xám" },
];

export const PolicyWidgetCreate = () => {
    const { push, goBack } = useNavigation();
    const [isLoading, setIsLoading] = useState(false);

    const [title, setTitle] = useState("");
    const [description, setDescription] = useState("");
    const [icon, setIcon] = useState("shield-check");
    const [iconColor, setIconColor] = useState("#3b82f6");
    const [link, setLink] = useState("");
    const [linkText, setLinkText] = useState("");
    const [order, setOrder] = useState(0);
    const [isActive, setIsActive] = useState(true);

    const [message, setMessage] = useState<{ type: 'success' | 'error'; text: string } | null>(null);
    const showMessage = (type: 'success' | 'error', text: string) => {
        setMessage({ type, text });
        setTimeout(() => setMessage(null), 5000);
    };

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        if (!title.trim()) {
            showMessage("error", "Vui lòng nhập tiêu đề!");
            return;
        }

        setIsLoading(true);
        try {
            const API_URL = import.meta.env.VITE_API_URL || "http://localhost:5002/api";
            const token = localStorage.getItem("token");

            await axios.post(`${API_URL}/policy-widgets`, {
                title,
                description,
                icon,
                iconColor,
                link,
                linkText,
                order,
                isActive,
            }, {
                headers: { Authorization: `Bearer ${token}` }
            });

            showMessage("success", "Tạo widget thành công!");
            setTimeout(() => push("/policy-widgets"), 1000);
        } catch (error: any) {
            showMessage("error", error.response?.data?.message || "Có lỗi xảy ra!");
        } finally {
            setIsLoading(false);
        }
    };

    const SelectedIcon = availableIcons.find(i => i.name === icon)?.icon || Puzzle;

    return (
        <div className="space-y-6">
            {/* Toast */}
            {message && (
                <div className={`fixed top-20 right-4 z-50 px-4 py-3 rounded-md shadow-lg ${message.type === "success" ? "bg-success text-white" : "bg-destructive text-white"}`}>
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
                        <Puzzle className="h-8 w-8" />
                        Thêm widget chính sách
                    </h1>
                </div>
            </div>

            <form onSubmit={handleSubmit}>
                <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
                    <div className="lg:col-span-2 space-y-6">
                        <Card>
                            <CardHeader>
                                <CardTitle>Thông tin widget</CardTitle>
                            </CardHeader>
                            <CardContent className="space-y-4">
                                <div className="space-y-2">
                                    <Label htmlFor="title">Tiêu đề *</Label>
                                    <Input
                                        id="title"
                                        value={title}
                                        onChange={(e) => setTitle(e.target.value)}
                                        placeholder="VD: Bảo hành chính hãng 2 năm"
                                        required
                                    />
                                </div>

                                <div className="space-y-2">
                                    <Label htmlFor="description">Mô tả phụ</Label>
                                    <Textarea
                                        id="description"
                                        value={description}
                                        onChange={(e) => setDescription(e.target.value)}
                                        placeholder="VD: có người đến tận nhà"
                                        rows={2}
                                    />
                                </div>

                                <div className="grid grid-cols-2 gap-4">
                                    <div className="space-y-2">
                                        <Label htmlFor="link">Đường dẫn (Link)</Label>
                                        <Input
                                            id="link"
                                            value={link}
                                            onChange={(e) => setLink(e.target.value)}
                                            placeholder="/chinh-sach-bao-hanh"
                                        />
                                    </div>
                                    <div className="space-y-2">
                                        <Label htmlFor="linkText">Text hiển thị cho link</Label>
                                        <Input
                                            id="linkText"
                                            value={linkText}
                                            onChange={(e) => setLinkText(e.target.value)}
                                            placeholder="Xem chi tiết bảo hành"
                                        />
                                    </div>
                                </div>
                            </CardContent>
                        </Card>

                        {/* Icon Selection */}
                        <Card>
                            <CardHeader>
                                <CardTitle>Chọn biểu tượng</CardTitle>
                            </CardHeader>
                            <CardContent>
                                <div className="grid grid-cols-7 gap-2">
                                    {availableIcons.map((iconItem) => {
                                        const IconComponent = iconItem.icon;
                                        return (
                                            <button
                                                key={iconItem.name}
                                                type="button"
                                                onClick={() => setIcon(iconItem.name)}
                                                className={`p-3 rounded-lg border-2 transition-all flex flex-col items-center gap-1 ${icon === iconItem.name
                                                    ? "border-primary bg-primary/10"
                                                    : "border-border hover:border-primary/50"
                                                    }`}
                                                title={iconItem.label}
                                            >
                                                <IconComponent className="h-5 w-5" />
                                                <span className="text-[10px] text-muted-foreground">{iconItem.label}</span>
                                            </button>
                                        );
                                    })}
                                </div>
                            </CardContent>
                        </Card>

                        {/* Color Selection */}
                        <Card>
                            <CardHeader>
                                <CardTitle>Màu biểu tượng</CardTitle>
                            </CardHeader>
                            <CardContent>
                                <div className="flex gap-2 flex-wrap">
                                    {availableColors.map((color) => (
                                        <button
                                            key={color.value}
                                            type="button"
                                            onClick={() => setIconColor(color.value)}
                                            className={`w-10 h-10 rounded-lg border-2 transition-all ${iconColor === color.value
                                                ? "border-foreground ring-2 ring-offset-2 ring-primary"
                                                : "border-transparent"
                                                }`}
                                            style={{ backgroundColor: color.value }}
                                            title={color.label}
                                        />
                                    ))}
                                </div>
                            </CardContent>
                        </Card>
                    </div>

                    {/* Sidebar */}
                    <div className="space-y-6">
                        {/* Preview */}
                        <Card>
                            <CardHeader>
                                <CardTitle>Xem trước</CardTitle>
                            </CardHeader>
                            <CardContent>
                                <div className="border rounded-lg p-4 bg-muted/30">
                                    <div className="flex items-start gap-3">
                                        <div
                                            className="p-2 rounded-lg shrink-0"
                                            style={{ backgroundColor: `${iconColor}20` }}
                                        >
                                            <SelectedIcon
                                                className="h-5 w-5"
                                                style={{ color: iconColor }}
                                            />
                                        </div>
                                        <div className="flex-1 min-w-0">
                                            <p className="font-medium text-sm">
                                                {title || "Tiêu đề widget"}
                                            </p>
                                            {description && (
                                                <p className="text-xs text-muted-foreground mt-0.5">
                                                    {description}
                                                </p>
                                            )}
                                            {linkText && (
                                                <p className="text-xs mt-1" style={{ color: iconColor }}>
                                                    {linkText}
                                                </p>
                                            )}
                                        </div>
                                    </div>
                                </div>
                            </CardContent>
                        </Card>

                        <Card>
                            <CardHeader>
                                <CardTitle>Cài đặt</CardTitle>
                            </CardHeader>
                            <CardContent className="space-y-4">
                                <div className="space-y-2">
                                    <Label>Thứ tự</Label>
                                    <Input
                                        type="number"
                                        value={order}
                                        onChange={(e) => setOrder(Number(e.target.value))}
                                        min={0}
                                    />
                                </div>
                                <div className="flex items-center gap-3">
                                    <Checkbox
                                        id="isActive"
                                        checked={isActive}
                                        onCheckedChange={(checked) => setIsActive(!!checked)}
                                    />
                                    <Label htmlFor="isActive">Kích hoạt</Label>
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
                                    Lưu widget
                                </Button>
                            </CardContent>
                        </Card>
                    </div>
                </div>
            </form>
        </div>
    );
};
