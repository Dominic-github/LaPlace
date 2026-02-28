import { useState, useEffect } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Checkbox } from "@/components/ui/checkbox";
import { Label } from "@/components/ui/label";
import { Spinner } from "@/components/ui/spinner";
import {
    Puzzle, ShieldCheck, Truck, RefreshCw, Gift, Package, Clock, CheckCircle, Star,
    Wrench, MapPin, Phone, CreditCard, Percent, Heart, AlertTriangle
} from "lucide-react";
import axios from "axios";

interface PolicyWidget {
    id: string;
    title: string;
    description?: string;
    icon: string;
    iconColor?: string;
    isActive: boolean;
}

interface WidgetSelectorProps {
    productId?: string;
    selectedWidgets: string[];
    onWidgetsChange: (widgetIds: string[]) => void;
}

// Icon mapping
const iconMap: Record<string, React.ComponentType<{ className?: string; style?: React.CSSProperties }>> = {
    "shield-check": ShieldCheck,
    "truck": Truck,
    "refresh-cw": RefreshCw,
    "gift": Gift,
    "package": Package,
    "clock": Clock,
    "check-circle": CheckCircle,
    "star": Star,
    "wrench": Wrench,
    "map-pin": MapPin,
    "phone": Phone,
    "credit-card": CreditCard,
    "percent": Percent,
    "heart": Heart,
    "alert-triangle": AlertTriangle,
};

export const WidgetSelector = ({ productId, selectedWidgets, onWidgetsChange }: WidgetSelectorProps) => {
    const [widgets, setWidgets] = useState<PolicyWidget[]>([]);
    const [isLoading, setIsLoading] = useState(true);

    useEffect(() => {
        const fetchWidgets = async () => {
            try {
                const API_URL = import.meta.env.VITE_API_URL || "http://localhost:5002/api";
                const token = localStorage.getItem("token");

                // Get all active widgets
                const res = await axios.get(`${API_URL}/policy-widgets?isActive=true`, {
                    headers: { Authorization: `Bearer ${token}` }
                });
                setWidgets(res.data.data || []);
            } catch (error) {
                console.error("Failed to fetch widgets:", error);
            } finally {
                setIsLoading(false);
            }
        };
        fetchWidgets();
    }, []);

    const handleToggle = (widgetId: string) => {
        if (selectedWidgets.includes(widgetId)) {
            onWidgetsChange(selectedWidgets.filter(id => id !== widgetId));
        } else {
            onWidgetsChange([...selectedWidgets, widgetId]);
        }
    };

    if (isLoading) {
        return (
            <Card>
                <CardHeader>
                    <CardTitle className="text-base flex items-center gap-2">
                        <Puzzle className="h-4 w-4" />
                        Widget chính sách
                    </CardTitle>
                </CardHeader>
                <CardContent>
                    <div className="flex items-center justify-center py-6">
                        <Spinner size="sm" />
                    </div>
                </CardContent>
            </Card>
        );
    }

    if (widgets.length === 0) {
        return (
            <Card>
                <CardHeader>
                    <CardTitle className="text-base flex items-center gap-2">
                        <Puzzle className="h-4 w-4" />
                        Widget chính sách
                    </CardTitle>
                </CardHeader>
                <CardContent>
                    <p className="text-sm text-muted-foreground text-center py-4">
                        Chưa có widget nào. Hãy tạo widget tại mục "Policy Widgets".
                    </p>
                </CardContent>
            </Card>
        );
    }

    return (
        <Card>
            <CardHeader className="pb-3">
                <CardTitle className="text-base flex items-center gap-2">
                    <Puzzle className="h-4 w-4" />
                    Widget chính sách
                </CardTitle>
            </CardHeader>
            <CardContent>
                <div className="space-y-3">
                    {widgets.map((widget) => {
                        const IconComponent = iconMap[widget.icon] || Puzzle;
                        const isChecked = selectedWidgets.includes(widget.id);

                        return (
                            <div
                                key={widget.id}
                                className={`flex items-start gap-3 p-3 border rounded-lg cursor-pointer transition-all hover:bg-muted/50 ${isChecked ? "border-primary bg-primary/5" : "border-border"
                                    }`}
                                onClick={() => handleToggle(widget.id)}
                            >
                                <Checkbox
                                    checked={isChecked}
                                    onCheckedChange={() => handleToggle(widget.id)}
                                    className="mt-0.5"
                                />
                                <div
                                    className="p-1.5 rounded shrink-0"
                                    style={{ backgroundColor: `${widget.iconColor}20` }}
                                >
                                    <IconComponent
                                        className="h-4 w-4"
                                        style={{ color: widget.iconColor }}
                                    />
                                </div>
                                <div className="flex-1 min-w-0">
                                    <Label className="font-medium text-sm cursor-pointer">
                                        {widget.title}
                                    </Label>
                                    {widget.description && (
                                        <p className="text-xs text-muted-foreground mt-0.5">
                                            {widget.description}
                                        </p>
                                    )}
                                </div>
                            </div>
                        );
                    })}
                </div>
                <p className="text-xs text-muted-foreground mt-3">
                    Chọn các chính sách áp dụng cho sản phẩm này
                </p>
            </CardContent>
        </Card>
    );
};
