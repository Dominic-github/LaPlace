import { useState, useEffect } from "react";
import { useList } from "@refinedev/core";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Checkbox } from "@/components/ui/checkbox";
import { Spinner } from "@/components/ui/spinner";
import { Badge } from "@/components/ui/badge";
import { Warehouse, MapPin } from "lucide-react";

interface ProductWarehouseSelectorProps {
    initialWarehouseIds?: string[];
    onChange: (warehouseIds: string[]) => void;
    productId?: string;
}

interface WarehouseData {
    id: string;
    name: string;
    address?: string;
    isActive: boolean;
}

export const ProductWarehouseSelector = ({
    initialWarehouseIds = [],
    onChange,
    productId,
}: ProductWarehouseSelectorProps) => {
    const [selectedWarehouses, setSelectedWarehouses] = useState<string[]>(initialWarehouseIds);

    // Fetch list of warehouses
    const { data: warehouseData, isLoading } = useList<WarehouseData>({
        resource: "warehouses",
        pagination: { pageSize: 100 },
        filters: [{ field: "isActive", operator: "eq", value: true }],
    });

    const warehouses = warehouseData?.data || [];

    // Initialize from props
    useEffect(() => {
        if (initialWarehouseIds && initialWarehouseIds.length > 0) {
            setSelectedWarehouses(initialWarehouseIds);
        }
    }, [initialWarehouseIds]);

    // Notify parent of changes
    useEffect(() => {
        onChange(selectedWarehouses);
    }, [selectedWarehouses, onChange]);

    const handleToggleWarehouse = (warehouseId: string) => {
        setSelectedWarehouses(prev => {
            if (prev.includes(warehouseId)) {
                return prev.filter(id => id !== warehouseId);
            } else {
                return [...prev, warehouseId];
            }
        });
    };

    const isSelected = (warehouseId: string) => {
        return selectedWarehouses.includes(warehouseId);
    };

    if (isLoading) {
        return (
            <Card>
                <CardContent className="flex items-center justify-center py-8">
                    <Spinner size="lg" />
                </CardContent>
            </Card>
        );
    }

    return (
        <Card>
            <CardHeader className="pb-3">
                <CardTitle className="text-base flex items-center justify-between">
                    <div className="flex items-center gap-2">
                        <Warehouse className="h-5 w-5" />
                        Kho lưu trữ
                    </div>
                    {selectedWarehouses.length > 0 && (
                        <Badge variant="secondary">
                            Đã chọn: {selectedWarehouses.length}
                        </Badge>
                    )}
                </CardTitle>
            </CardHeader>
            <CardContent className="space-y-3">
                {warehouses.length === 0 ? (
                    <div className="text-center py-6 text-muted-foreground">
                        <Warehouse className="h-12 w-12 mx-auto mb-2 opacity-50" />
                        <p>Chưa có kho nào được tạo</p>
                        <p className="text-sm mt-1">Vui lòng tạo kho trước khi quản lý sản phẩm</p>
                    </div>
                ) : (
                    <>
                        <p className="text-sm text-muted-foreground">
                            Chọn kho lưu trữ sản phẩm này
                        </p>

                        {warehouses.map((warehouse) => (
                            <div
                                key={warehouse.id}
                                className={`p-3 border rounded-lg transition-colors cursor-pointer ${isSelected(warehouse.id)
                                        ? "border-primary bg-primary/5"
                                        : "border-border hover:border-muted-foreground/50"
                                    }`}
                                onClick={() => handleToggleWarehouse(warehouse.id)}
                            >
                                <div className="flex items-center gap-3">
                                    <Checkbox
                                        checked={isSelected(warehouse.id)}
                                        onCheckedChange={() => handleToggleWarehouse(warehouse.id)}
                                    />
                                    <div className="flex-1">
                                        <span className="font-medium">{warehouse.name}</span>
                                        {warehouse.address && (
                                            <div className="text-xs text-muted-foreground flex items-center gap-1 mt-0.5">
                                                <MapPin className="h-3 w-3" />
                                                {warehouse.address}
                                            </div>
                                        )}
                                    </div>
                                </div>
                            </div>
                        ))}
                    </>
                )}
            </CardContent>
        </Card>
    );
};
