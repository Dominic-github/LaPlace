import { useState, useEffect, useCallback } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
    Dialog,
    DialogDescription,
    DialogFooter,
    DialogHeader,
    DialogTitle,
} from "@/components/ui/dialog";
import { MediaManager } from "@/components/media";
import {
    Plus,
    Trash2,
    Image as ImageIcon,
    X,
    AlertCircle,
    RefreshCw,
    Info,
    FolderOpen
} from "lucide-react";

interface VariantAttribute {
    name: string; // e.g., "Color", "Size"
    options: string[]; // e.g., ["Red", "Blue"] or ["S", "M", "L"]
}

interface VariantCombination {
    id?: string;
    name: string; // Combined name e.g., "Red - L"
    attributes: Record<string, string>; // e.g., { color: "Red", size: "L" }
    price: number | null;
    comparePrice: number | null;
    stock: number;
    sku: string;
    gtin: string;
    image: string;
    isActive: boolean;
}

interface ProductVariantEditorProps {
    productId?: string;
    initialVariants?: any[];
    onVariantsChange: (variants: VariantCombination[]) => void;
    basePrice?: number;
    baseStock?: number;
}

export const ProductVariantEditor = ({
    productId,
    initialVariants = [],
    onVariantsChange,
    basePrice = 0,
    baseStock = 0
}: ProductVariantEditorProps) => {
    const [variantGroups, setVariantGroups] = useState<VariantAttribute[]>([]);
    const [combinations, setCombinations] = useState<VariantCombination[]>([]);
    const [isGenerating, setIsGenerating] = useState(false);
    const [bulkPrice, setBulkPrice] = useState<string>("");
    const [bulkStock, setBulkStock] = useState<string>("");

    // Media library modal state
    const [isMediaModalOpen, setIsMediaModalOpen] = useState(false);
    const [selectedVariantIndex, setSelectedVariantIndex] = useState<number | null>(null);

    // Initialize from existing variants
    useEffect(() => {
        if (initialVariants && initialVariants.length > 0) {
            // Extract variant groups from existing variants
            const attrKeys = new Set<string>();
            const attrValues: Record<string, Set<string>> = {};

            initialVariants.forEach(v => {
                if (v.attributes && typeof v.attributes === 'object') {
                    Object.entries(v.attributes).forEach(([key, value]) => {
                        attrKeys.add(key);
                        if (!attrValues[key]) attrValues[key] = new Set();
                        attrValues[key].add(value as string);
                    });
                }
            });

            const groups: VariantAttribute[] = Array.from(attrKeys).map(key => ({
                name: key,
                options: Array.from(attrValues[key] || [])
            }));

            if (groups.length > 0) {
                setVariantGroups(groups);
            }

            // Map initial variants to combinations
            const mappedCombinations: VariantCombination[] = initialVariants.map(v => ({
                id: v.id,
                name: v.name || "",
                attributes: v.attributes || {},
                price: v.price,
                comparePrice: v.comparePrice,
                stock: v.inventory?.quantity || 0,
                sku: v.sku || "",
                gtin: v.barcode || "",
                image: v.image || "",
                isActive: v.isActive ?? true
            }));

            setCombinations(mappedCombinations);
        }
    }, [initialVariants]);

    // Add a new variant group
    const addVariantGroup = () => {
        if (variantGroups.length >= 2) {
            alert("Chỉ được phép tối đa 2 nhóm phân loại!");
            return;
        }
        setVariantGroups([...variantGroups, { name: "", options: [""] }]);
    };

    // Remove a variant group
    const removeVariantGroup = (index: number) => {
        const updated = variantGroups.filter((_, i) => i !== index);
        setVariantGroups(updated);
        // Regenerate combinations
        if (updated.length > 0) {
            generateCombinations(updated);
        } else {
            setCombinations([]);
            onVariantsChange([]);
        }
    };

    // Update variant group name
    const updateGroupName = (index: number, name: string) => {
        const updated = [...variantGroups];
        updated[index] = { ...updated[index], name };
        setVariantGroups(updated);
    };

    // Add option to a group
    const addOption = (groupIndex: number) => {
        const updated = [...variantGroups];
        updated[groupIndex] = {
            ...updated[groupIndex],
            options: [...updated[groupIndex].options, ""]
        };
        setVariantGroups(updated);
    };

    // Remove option from a group
    const removeOption = (groupIndex: number, optionIndex: number) => {
        const updated = [...variantGroups];
        updated[groupIndex] = {
            ...updated[groupIndex],
            options: updated[groupIndex].options.filter((_, i) => i !== optionIndex)
        };
        setVariantGroups(updated);
    };

    // Update option value
    const updateOption = (groupIndex: number, optionIndex: number, value: string) => {
        const updated = [...variantGroups];
        updated[groupIndex] = {
            ...updated[groupIndex],
            options: updated[groupIndex].options.map((opt, i) =>
                i === optionIndex ? value : opt
            )
        };
        setVariantGroups(updated);
    };

    // Generate all combinations from variant groups
    const generateCombinations = useCallback((groups: VariantAttribute[]) => {
        setIsGenerating(true);

        // Validate: check if any group has empty name
        const hasEmptyGroupName = groups.some(g => g.name.trim() === "");
        if (hasEmptyGroupName) {
            alert("Vui lòng nhập tên cho tất cả các nhóm phân loại");
            setIsGenerating(false);
            return;
        }

        // Validate: check if any group has all empty options
        const hasEmptyOptions = groups.some(g =>
            g.options.every(opt => opt.trim() === "")
        );
        if (hasEmptyOptions) {
            alert("Vui lòng nhập ít nhất 1 tùy chọn cho mỗi nhóm phân loại");
            setIsGenerating(false);
            return;
        }

        // Filter out empty groups and options
        const validGroups = groups
            .filter(g => g.name.trim() !== "")
            .map(g => ({
                ...g,
                options: g.options.filter(opt => opt.trim() !== "")
            }))
            .filter(g => g.options.length > 0);

        if (validGroups.length === 0) {
            setCombinations([]);
            onVariantsChange([]);
            setIsGenerating(false);
            return;
        }

        // Generate cartesian product
        const cartesian = (...arrays: string[][]): string[][] => {
            return arrays.reduce<string[][]>(
                (acc, arr) =>
                    acc.flatMap(x => arr.map(y => [...x, y])),
                [[]]
            );
        };

        const optionArrays = validGroups.map(g => g.options);
        const allCombinations = cartesian(...optionArrays);

        // Create variant combinations with existing data preservation
        const newCombinations: VariantCombination[] = allCombinations.map(combo => {
            const attributes: Record<string, string> = {};
            validGroups.forEach((group, i) => {
                attributes[group.name] = combo[i];
            });

            const name = combo.join(" - ");

            // Check if this combination already exists
            const existing = combinations.find(c =>
                c.name === name ||
                JSON.stringify(c.attributes) === JSON.stringify(attributes)
            );

            if (existing) {
                return { ...existing, name, attributes };
            }

            return {
                name,
                attributes,
                price: basePrice || null,
                comparePrice: null,
                stock: baseStock || 0,
                sku: "",
                gtin: "",
                image: "",
                isActive: true
            };
        });

        setCombinations(newCombinations);
        onVariantsChange(newCombinations);
        setIsGenerating(false);
    }, [combinations, basePrice, baseStock, onVariantsChange]);

    // Update a specific combination field
    const updateCombination = (index: number, field: keyof VariantCombination, value: any) => {
        const updated = [...combinations];
        updated[index] = { ...updated[index], [field]: value };
        setCombinations(updated);
        onVariantsChange(updated);
    };

    // Apply bulk values to all combinations
    const applyBulkValues = () => {
        if (!bulkPrice && !bulkStock) return;

        const updated = combinations.map(c => ({
            ...c,
            price: bulkPrice ? parseFloat(bulkPrice) : c.price,
            stock: bulkStock ? parseInt(bulkStock) : c.stock
        }));

        setCombinations(updated);
        onVariantsChange(updated);
        setBulkPrice("");
        setBulkStock("");
    };

    // Open media library modal for a specific variant
    const openMediaLibrary = (index: number) => {
        setSelectedVariantIndex(index);
        setIsMediaModalOpen(true);
    };

    // Handle selecting media from library
    const handleSelectMedia = (media: any) => {
        if (selectedVariantIndex !== null) {
            const fullUrl = media.url.startsWith('http')
                ? media.url
                : `http://localhost:5002${media.url}`;

            updateCombination(selectedVariantIndex, "image", fullUrl);
        }
        setIsMediaModalOpen(false);
        setSelectedVariantIndex(null);
    };

    // Close media modal
    const handleCloseMediaModal = () => {
        setIsMediaModalOpen(false);
        setSelectedVariantIndex(null);
    };

    return (
        <>
            <Card className="border-primary/20" style={{ backgroundColor: 'var(--color-card)' }}>
                <CardHeader className="pb-3">
                    <CardTitle className="text-base flex items-center gap-2 text-primary">
                        <span className="w-2 h-2 rounded-full bg-primary"></span>
                        Phân loại hàng
                    </CardTitle>
                </CardHeader>
                <CardContent className="space-y-6">
                    {/* Variant Groups */}
                    {variantGroups.map((group, groupIndex) => (
                        <div
                            key={groupIndex}
                            className="p-4 border rounded-lg bg-card space-y-3" style={{ borderColor: 'var(--color-border)' }}
                        >
                            {/* Row 1: Group Name */}
                            <div className="flex items-center gap-3">
                                <div className="flex-1">
                                    <Label className="text-sm text-muted-foreground">
                                        Phân loại {groupIndex + 1}
                                    </Label>
                                    <Input
                                        value={group.name}
                                        onChange={(e) => updateGroupName(groupIndex, e.target.value)}
                                        placeholder="e.g. Color, Size"
                                        className="mt-1"
                                        maxLength={14}
                                    />
                                    <span className="text-xs text-muted-foreground">
                                        {group.name.length}/14
                                    </span>
                                </div>
                                <Button
                                    type="button"
                                    variant="ghost"
                                    size="icon"
                                    className="text-destructive hover:text-destructive hover:bg-destructive/10"
                                    onClick={() => removeVariantGroup(groupIndex)}
                                >
                                    <Trash2 className="h-4 w-4" />
                                </Button>
                            </div>

                            {/* Row 2: Options (vertical list) */}
                            <div className="space-y-2">
                                <Label className="text-sm text-muted-foreground">Tùy chọn</Label>
                                {group.options.map((option, optionIndex) => (
                                    <div key={optionIndex} className="flex items-center gap-2">
                                        <Input
                                            value={option}
                                            onChange={(e) =>
                                                updateOption(groupIndex, optionIndex, e.target.value)
                                            }
                                            placeholder="Nhập"
                                            className="flex-1"
                                            maxLength={20}
                                        />
                                        <span className="text-xs text-muted-foreground whitespace-nowrap">
                                            {option.length}/20
                                        </span>
                                        {group.options.length > 1 && (
                                            <Button
                                                type="button"
                                                variant="ghost"
                                                size="icon"
                                                className="text-destructive hover:text-destructive"
                                                onClick={() => removeOption(groupIndex, optionIndex)}
                                            >
                                                <X className="h-4 w-4" />
                                            </Button>
                                        )}
                                    </div>
                                ))}
                            </div>

                            {/* Row 3: Add Option Button */}
                            <Button
                                type="button"
                                variant="outline"
                                size="sm"
                                onClick={() => addOption(groupIndex)}
                            >
                                <Plus className="h-4 w-4 mr-1" />
                                Thêm tùy chọn
                            </Button>
                        </div>
                    ))}

                    {/* Add Variant Group Button */}
                    {variantGroups.length < 2 && (
                        <Button
                            type="button"
                            variant="outline"
                            onClick={addVariantGroup}
                            className="w-full border-dashed"
                        >
                            <Plus className="h-4 w-4 mr-2" />
                            Thêm nhóm phân loại {variantGroups.length + 1}
                        </Button>
                    )}

                    {/* Generate Combinations Button */}
                    {variantGroups.length > 0 && (
                        <div className="flex justify-end">
                            <Button
                                type="button"
                                onClick={() => generateCombinations(variantGroups)}
                                disabled={isGenerating}
                                variant="secondary"
                            >
                                <RefreshCw className={`h-4 w-4 mr-2 ${isGenerating ? 'animate-spin' : ''}`} />
                                Tạo danh sách phân loại
                            </Button>
                        </div>
                    )}

                    {/* Combinations Table */}
                    {combinations.length > 0 && (
                        <div className="space-y-4">
                            <div className="flex items-center justify-between">
                                <h4 className="font-medium">Danh sách phân loại hàng</h4>
                            </div>

                            {/* Bulk Actions */}
                            <div className="flex items-center gap-4 p-3 bg-secondary rounded-lg">
                                <div className="flex items-center gap-2 flex-1">
                                    <span className="text-sm font-medium">đ</span>
                                    <Input
                                        type="number"
                                        placeholder="Giá"
                                        value={bulkPrice}
                                        onChange={(e) => setBulkPrice(e.target.value)}
                                        className="max-w-32"
                                    />
                                </div>
                                <div className="flex items-center gap-2 flex-1">
                                    <span className="text-sm font-medium">Kho hàng</span>
                                    <Input
                                        type="number"
                                        placeholder="Số lượng"
                                        value={bulkStock}
                                        onChange={(e) => setBulkStock(e.target.value)}
                                        className="max-w-32"
                                    />
                                </div>
                                <Input
                                    placeholder="SKU phân loại"
                                    disabled
                                    className="max-w-36"
                                />
                                <Button
                                    type="button"
                                    onClick={applyBulkValues}
                                    variant="default"
                                    size="sm"
                                >
                                    Áp dụng cho tất cả phân loại
                                </Button>
                            </div>

                            {/* Table Header */}
                            <div className="overflow-x-auto">
                                <table className="w-full border-collapse">
                                    <thead>
                                        <tr className="bg-secondary text-sm text-muted-foreground">
                                            {variantGroups
                                                .filter(g => g.name.trim())
                                                .map((group, i) => (
                                                    <th
                                                        key={i}
                                                        className="text-left p-3 border border-border font-medium"
                                                    >
                                                        <span className="text-primary">•</span> Nhóm phân loại {i + 1}
                                                    </th>
                                                ))}
                                            <th className="text-left p-3 border border-border font-medium">
                                                <span className="text-destructive">*</span> Giá
                                            </th>
                                            <th className="text-left p-3 border border-border font-medium">
                                                <span className="text-destructive">*</span> Kho hàng
                                                <Info className="inline h-3 w-3 ml-1 text-muted-foreground" />
                                            </th>
                                            <th className="text-left p-3 border border-border font-medium">SKU phân loại</th>
                                            <th className="text-left p-3 border border-border font-medium w-20">Ảnh</th>
                                        </tr>
                                    </thead>
                                    <tbody>
                                        {combinations.map((combo, index) => {
                                            const validGroups = variantGroups.filter(g => g.name.trim());

                                            // Calculate rowSpan for first group column
                                            const getRowSpan = (groupIndex: number): number => {
                                                if (groupIndex >= validGroups.length) return 1;
                                                const groupName = validGroups[groupIndex].name;
                                                const currentValue = combo.attributes[groupName];

                                                // Count how many consecutive rows have the same value
                                                let count = 0;
                                                for (let i = index; i < combinations.length; i++) {
                                                    // Check if all previous group values also match
                                                    let allPrevMatch = true;
                                                    for (let j = 0; j < groupIndex; j++) {
                                                        const prevGroupName = validGroups[j].name;
                                                        if (combinations[i].attributes[prevGroupName] !== combo.attributes[prevGroupName]) {
                                                            allPrevMatch = false;
                                                            break;
                                                        }
                                                    }

                                                    if (allPrevMatch && combinations[i].attributes[groupName] === currentValue) {
                                                        count++;
                                                    } else {
                                                        break;
                                                    }
                                                }
                                                return count;
                                            };

                                            // Check if this cell should be rendered (first occurrence)
                                            const shouldRenderCell = (groupIndex: number): boolean => {
                                                if (groupIndex >= validGroups.length) return true;
                                                if (index === 0) return true;

                                                const groupName = validGroups[groupIndex].name;
                                                const currentValue = combo.attributes[groupName];
                                                const prevValue = combinations[index - 1].attributes[groupName];

                                                // Check if all previous group values also match
                                                for (let j = 0; j < groupIndex; j++) {
                                                    const prevGroupName = validGroups[j].name;
                                                    if (combinations[index - 1].attributes[prevGroupName] !== combo.attributes[prevGroupName]) {
                                                        return true; // Previous groups don't match, so render this cell
                                                    }
                                                }

                                                return currentValue !== prevValue;
                                            };

                                            return (
                                                <tr key={index} className="border-b border-border hover:bg-accent/50">
                                                    {/* Attribute Columns with rowSpan */}
                                                    {validGroups.map((group, groupIdx) => {
                                                        if (!shouldRenderCell(groupIdx)) return null;
                                                        const rowSpan = getRowSpan(groupIdx);
                                                        return (
                                                            <td
                                                                key={groupIdx}
                                                                className="p-3 border border-border align-middle"
                                                                rowSpan={rowSpan > 1 ? rowSpan : undefined}
                                                            >
                                                                <span className="font-medium">
                                                                    {combo.attributes[group.name] || "-"}
                                                                </span>
                                                            </td>
                                                        );
                                                    })}

                                                    {/* Price */}
                                                    <td className="p-3 border border-border align-middle">
                                                        <div className="flex items-center gap-1">
                                                            <span className="text-muted-foreground">đ</span>
                                                            <Input
                                                                type="number"
                                                                value={combo.price ?? ""}
                                                                onChange={(e) =>
                                                                    updateCombination(
                                                                        index,
                                                                        "price",
                                                                        e.target.value ? parseFloat(e.target.value) : null
                                                                    )
                                                                }
                                                                placeholder="Nhập vào"
                                                                className="w-28"
                                                                min={0}
                                                            />
                                                        </div>
                                                    </td>

                                                    {/* Stock */}
                                                    <td className="p-3 border border-border align-middle">
                                                        <Input
                                                            type="number"
                                                            value={combo.stock}
                                                            onChange={(e) =>
                                                                updateCombination(
                                                                    index,
                                                                    "stock",
                                                                    parseInt(e.target.value) || 0
                                                                )
                                                            }
                                                            className="w-24"
                                                            min={0}
                                                        />
                                                    </td>

                                                    {/* SKU */}
                                                    <td className="p-3 border border-border align-middle">
                                                        <Input
                                                            value={combo.sku}
                                                            onChange={(e) =>
                                                                updateCombination(index, "sku", e.target.value)
                                                            }
                                                            placeholder="Nhập vào"
                                                            className="w-32"
                                                        />
                                                    </td>

                                                    {/* Image */}
                                                    <td className="p-3 border border-border align-middle">
                                                        <div
                                                            className="relative w-16 h-16 border border-border rounded-lg bg-secondary flex items-center justify-center overflow-hidden group cursor-pointer"
                                                            onClick={() => !combo.image && openMediaLibrary(index)}
                                                        >
                                                            {combo.image ? (
                                                                <>
                                                                    <img
                                                                        src={combo.image}
                                                                        alt={combo.name}
                                                                        className="w-full h-full object-cover"
                                                                    />
                                                                    <div className="absolute inset-0 bg-black/50 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center gap-1">
                                                                        <button
                                                                            type="button"
                                                                            onClick={(e) => {
                                                                                e.stopPropagation();
                                                                                openMediaLibrary(index);
                                                                            }}
                                                                            className="bg-card text-foreground p-1 rounded hover:bg-accent"
                                                                            title="Thay đổi ảnh"
                                                                        >
                                                                            <FolderOpen className="h-3 w-3" />
                                                                        </button>
                                                                        <button
                                                                            type="button"
                                                                            onClick={(e) => {
                                                                                e.stopPropagation();
                                                                                updateCombination(index, "image", "");
                                                                            }}
                                                                            className="bg-destructive text-destructive-foreground p-1 rounded hover:bg-destructive/90"
                                                                            title="Xóa ảnh"
                                                                        >
                                                                            <X className="h-3 w-3" />
                                                                        </button>
                                                                    </div>
                                                                </>
                                                            ) : (
                                                                <div className="flex flex-col items-center justify-center w-full h-full hover:bg-accent transition-colors">
                                                                    <ImageIcon className="h-6 w-6 text-primary" />
                                                                    <span className="text-[10px] text-muted-foreground mt-1">Chọn ảnh</span>
                                                                </div>
                                                            )}
                                                        </div>
                                                    </td>
                                                </tr>
                                            );
                                        })}
                                    </tbody>
                                </table>
                            </div>

                            {/* Warning */}
                            <div className="flex items-start gap-2 p-3 bg-warning/10 border border-warning/30 rounded-lg text-sm text-warning-foreground">
                                <AlertCircle className="h-4 w-4 mt-0.5 flex-shrink-0 text-warning" />
                                <div>
                                    <strong>Lưu ý:</strong> Mỗi phân loại hàng cần có đầy đủ <strong>Giá</strong> và <strong>Kho hàng</strong>.
                                    Các trường này sẽ ghi đè giá và tồn kho cơ bản của sản phẩm.
                                </div>
                            </div>
                        </div>
                    )}
                </CardContent>
            </Card>

            {/* Media Library Modal */}
            <Dialog open={isMediaModalOpen} onClose={handleCloseMediaModal} className="max-w-6xl w-[90vw]">
                <DialogHeader>
                    <DialogTitle>Chọn ảnh cho phân loại</DialogTitle>
                    <DialogDescription>
                        Chọn ảnh từ thư viện media hoặc upload ảnh mới
                    </DialogDescription>
                </DialogHeader>

                <div className="min-h-[500px]">
                    <MediaManager
                        onSelect={handleSelectMedia}
                        selectable={true}
                        multiple={false}
                        showFolderTree={true}
                        compact={false}
                    />
                </div>

                <DialogFooter>
                    <Button variant="outline" onClick={handleCloseMediaModal}>
                        Hủy
                    </Button>
                </DialogFooter>
            </Dialog>
        </>
    );
};
