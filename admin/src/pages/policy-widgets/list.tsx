import { useState, useEffect } from "react";
import { useNavigation, useDelete } from "@refinedev/core";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Spinner } from "@/components/ui/spinner";
import {
    Dialog,
    DialogDescription,
    DialogFooter,
    DialogHeader,
    DialogTitle,
} from "@/components/ui/dialog";
import {
    Plus, Pencil, Trash2, Puzzle, ShieldCheck, Truck, RefreshCw,
    Gift, Package, Clock, CheckCircle, XCircle, Star
} from "lucide-react";
import axios from "axios";

interface PolicyWidget {
    id: string;
    title: string;
    description?: string;
    icon: string;
    iconColor?: string;
    link?: string;
    linkText?: string;
    order: number;
    isActive: boolean;
    createdAt: string;
    _count?: { products: number };
}

// Map icon names to Lucide icons
const iconMap: Record<string, React.ReactNode> = {
    "shield-check": <ShieldCheck className="h-6 w-6" />,
    "truck": <Truck className="h-6 w-6" />,
    "refresh-cw": <RefreshCw className="h-6 w-6" />,
    "gift": <Gift className="h-6 w-6" />,
    "package": <Package className="h-6 w-6" />,
    "clock": <Clock className="h-6 w-6" />,
    "check-circle": <CheckCircle className="h-6 w-6" />,
    "star": <Star className="h-6 w-6" />,
};

export const PolicyWidgetList = () => {
    const { push } = useNavigation();
    const [widgets, setWidgets] = useState<PolicyWidget[]>([]);
    const [isLoading, setIsLoading] = useState(true);
    const [deleteId, setDeleteId] = useState<string | null>(null);

    const { mutate: deleteItem, isLoading: isDeleting } = useDelete();

    const fetchWidgets = async () => {
        try {
            const API_URL = import.meta.env.VITE_API_URL || "http://localhost:5002/api";
            const token = localStorage.getItem("token");
            const res = await axios.get(`${API_URL}/policy-widgets`, {
                headers: { Authorization: `Bearer ${token}` }
            });
            setWidgets(res.data.data || []);
        } catch (error) {
            console.error("Failed to fetch widgets:", error);
        } finally {
            setIsLoading(false);
        }
    };

    useEffect(() => {
        fetchWidgets();
    }, []);

    const handleDelete = async () => {
        if (deleteId) {
            try {
                const API_URL = import.meta.env.VITE_API_URL || "http://localhost:5002/api";
                const token = localStorage.getItem("token");
                await axios.delete(`${API_URL}/policy-widgets/${deleteId}`, {
                    headers: { Authorization: `Bearer ${token}` }
                });
                setWidgets(widgets.filter(w => w.id !== deleteId));
                setDeleteId(null);
            } catch (error) {
                console.error("Delete failed:", error);
            }
        }
    };

    return (
        <div className="space-y-6">
            <div className="flex items-center justify-between">
                <div>
                    <h1 className="text-3xl font-bold flex items-center gap-2">
                        <Puzzle className="h-8 w-8" />
                        Widget chính sách
                    </h1>
                    <p className="text-muted-foreground mt-1">
                        Quản lý các widget hiển thị chính sách trên trang sản phẩm
                    </p>
                </div>
                <Button onClick={() => push("/policy-widgets/create")}>
                    <Plus className="h-4 w-4 mr-2" />
                    Thêm widget
                </Button>
            </div>

            {isLoading ? (
                <div className="flex items-center justify-center h-64">
                    <Spinner size="lg" />
                </div>
            ) : widgets.length === 0 ? (
                <Card>
                    <CardContent className="py-12 text-center">
                        <Puzzle className="h-12 w-12 text-muted-foreground mx-auto mb-4" />
                        <p className="text-muted-foreground mb-4">
                            Chưa có widget chính sách nào
                        </p>
                        <Button onClick={() => push("/policy-widgets/create")}>
                            <Plus className="h-4 w-4 mr-2" />
                            Tạo widget đầu tiên
                        </Button>
                    </CardContent>
                </Card>
            ) : (
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                    {widgets.map((widget) => (
                        <Card key={widget.id} className="relative group hover:shadow-lg transition-shadow">
                            <CardHeader className="pb-2">
                                <div className="flex items-start justify-between">
                                    <div
                                        className="p-3 rounded-lg"
                                        style={{ backgroundColor: `${widget.iconColor}20` }}
                                    >
                                        <div style={{ color: widget.iconColor }}>
                                            {iconMap[widget.icon] || <Puzzle className="h-6 w-6" />}
                                        </div>
                                    </div>
                                    <div className="flex gap-1 opacity-0 group-hover:opacity-100 transition-opacity">
                                        <Button
                                            variant="ghost"
                                            size="sm"
                                            onClick={() => push(`/policy-widgets/edit/${widget.id}`)}
                                        >
                                            <Pencil className="h-4 w-4" />
                                        </Button>
                                        <Button
                                            variant="ghost"
                                            size="sm"
                                            onClick={() => setDeleteId(widget.id)}
                                            className="text-destructive hover:text-destructive"
                                        >
                                            <Trash2 className="h-4 w-4" />
                                        </Button>
                                    </div>
                                </div>
                            </CardHeader>
                            <CardContent>
                                <h3 className="font-semibold mb-1">{widget.title}</h3>
                                {widget.description && (
                                    <p className="text-sm text-muted-foreground mb-2">
                                        {widget.description}
                                    </p>
                                )}
                                {widget.linkText && (
                                    <p className="text-sm text-primary">{widget.linkText}</p>
                                )}
                                <div className="flex items-center justify-between mt-3 pt-3 border-t">
                                    <Badge variant={widget.isActive ? "success" : "secondary"}>
                                        {widget.isActive ? "Hoạt động" : "Tắt"}
                                    </Badge>
                                    <span className="text-xs text-muted-foreground">
                                        {widget._count?.products || 0} sản phẩm
                                    </span>
                                </div>
                            </CardContent>
                        </Card>
                    ))}
                </div>
            )}

            <Dialog open={!!deleteId} onClose={() => setDeleteId(null)}>
                <DialogHeader>
                    <DialogTitle>Xác nhận xóa</DialogTitle>
                    <DialogDescription>
                        Bạn có chắc chắn muốn xóa widget này? Widget sẽ bị gỡ khỏi tất cả sản phẩm.
                    </DialogDescription>
                </DialogHeader>
                <DialogFooter>
                    <Button variant="outline" onClick={() => setDeleteId(null)}>
                        Hủy
                    </Button>
                    <Button variant="destructive" onClick={handleDelete} disabled={isDeleting}>
                        {isDeleting ? "Đang xóa..." : "Xóa"}
                    </Button>
                </DialogFooter>
            </Dialog>
        </div>
    );
};
