import { useState, useEffect } from "react";
import { useOne, useUpdate, useNavigation } from "@refinedev/core";
import { useParams } from "react-router-dom";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Switch } from "@/components/ui/switch";
import { Spinner } from "@/components/ui/spinner";
import { ArrowLeft, Save, Loader2, Bot, Zap, Search, Package } from "lucide-react";
import { AIButton } from "@/components/ui/ai-coming-soon";
import axios from "axios";
import { WidgetSelector } from "@/components/products/WidgetSelector";
import { ProductVariantEditor } from "@/components/products/ProductVariantEditor";
import { ProductWarehouseSelector } from "@/components/products/ProductWarehouseSelector";

const AI_ENABLED = false;

export const ProductEdit = () => {
    const { id } = useParams();
    const { push, goBack } = useNavigation();
    const { data, isLoading: isFetching } = useOne({
        resource: "products",
        id: id!,
    });
    const { mutate: update, isLoading } = useUpdate();

    const [formData, setFormData] = useState({
        name: "",
        slug: "",
        description: "",
        price: 0,
        comparePrice: 0,
        stock: 0,
        sku: "",
        metaTitle: "",
        metaDescription: "",
        metaKeywords: "",
        isActive: true,
        isFeatured: false,
    });

    // AI state
    const [focusKeyword, setFocusKeyword] = useState("");
    const [isGeneratingAI, setIsGeneratingAI] = useState(false);

    // Policy Widgets
    const [selectedWidgets, setSelectedWidgets] = useState<string[]>([]);

    // Product Variants
    const [variants, setVariants] = useState<any[]>([]);
    const [initialVariants, setInitialVariants] = useState<any[]>([]);

    // Warehouse selection (just IDs, no quantity)
    const [warehouseIds, setWarehouseIds] = useState<string[]>([]);
    const [initialWarehouseIds, setInitialWarehouseIds] = useState<string[]>([]);

    // Toast
    const [message, setMessage] = useState<{ type: 'success' | 'error'; text: string } | null>(null);
    const showMessage = (type: 'success' | 'error', text: string) => {
        setMessage({ type, text });
        setTimeout(() => setMessage(null), 5000);
    };

    useEffect(() => {
        if (data?.data) {
            const product = data.data;
            setFormData({
                name: product.name || "",
                slug: product.slug || "",
                description: product.description || "",
                price: product.price || 0,
                comparePrice: product.comparePrice || 0,
                stock: product.inventory?.quantity || 0,
                sku: product.sku || "",
                metaTitle: product.metaTitle || "",
                metaDescription: product.metaDescription || "",
                metaKeywords: product.metaKeywords || "",
                isActive: product.isActive ?? true,
                isFeatured: product.isFeatured ?? false,
            });

            // Load product variants
            if (product.variants && Array.isArray(product.variants)) {
                setInitialVariants(product.variants);
            }

            // Load warehouse assignments
            if (product.warehouseStock && Array.isArray(product.warehouseStock)) {
                const ids = product.warehouseStock.map((ws: any) => ws.warehouseId);
                setWarehouseIds(ids);
                setInitialWarehouseIds(ids);
            }
        }
    }, [data]);

    // Function to fetch widgets
    const fetchWidgets = async () => {
        if (!id) return;
        try {
            const API_URL = import.meta.env.VITE_API_URL || "http://localhost:5002/api";
            const token = localStorage.getItem("token");
            const response = await axios.get(`${API_URL}/policy-widgets/product/${id}`, {
                headers: { Authorization: `Bearer ${token}` }
            });
            if (response.data.success && response.data.data) {
                setSelectedWidgets(response.data.data.map((w: any) => w.widgetId));
            }
        } catch (error) {
            console.error("Failed to load widgets:", error);
        }
    };

    // Load widgets on mount
    useEffect(() => {
        fetchWidgets();
    }, [id]);

    const handleChange = (field: string, value: any) => {
        setFormData((prev) => ({ ...prev, [field]: value }));
    };

    const slugify = (text: string) => {
        return text
            .toLowerCase()
            .normalize("NFD")
            .replace(/[\u0300-\u036f]/g, "")
            .replace(/đ/g, "d")
            .replace(/[^a-z0-9\s-]/g, "")
            .replace(/\s+/g, "-")
            .trim();
    };

    // AI Generation
    const handleGenerateAI = async () => {
        if (!AI_ENABLED) return;
        if (!focusKeyword.trim()) {
            showMessage("error", "Vui lòng nhập từ khóa!");
            return;
        }

        setIsGeneratingAI(true);
        try {
            const API_URL = import.meta.env.VITE_API_URL || "http://localhost:5002/api";
            const token = localStorage.getItem("token");

            const aiSettingsRes = await axios.get(`${API_URL}/settings?group=ai`, {
                headers: { Authorization: `Bearer ${token}` }
            });
            const aiSettings: any = {};
            aiSettingsRes.data.data?.forEach((s: any) => { aiSettings[s.key] = s.value; });

            const aiProvider = aiSettings.ai_provider || "gemini";
            const apiKey = aiProvider === "gemini" ? aiSettings.gemini_api_key : aiSettings.chatgpt_api_key;

            if (!apiKey) {
                showMessage("error", `Vui lòng cấu hình API Key cho ${aiProvider}!`);
                setIsGeneratingAI(false);
                return;
            }

            const prompt = `
Viết mô tả sản phẩm chi tiết về: ${focusKeyword}

Yêu cầu:
1. Tên sản phẩm hấp dẫn, chứa từ khóa
2. Mô tả chi tiết với tính năng, lợi ích, thông số (200-400 từ), bao gồm HTML cơ bản
3. Meta title cho SEO (50-60 ký tự)
4. Meta description (120-160 ký tự)
5. 5-8 meta keywords liên quan

Trả về JSON:
{
  "name": "Tên sản phẩm",
  "description": "<p>Mô tả chi tiết...</p><h3>Tính năng</h3><ul><li>...</li></ul>",
  "metaTitle": "Meta title SEO",
  "metaDescription": "Meta description 120-160 ký tự",
  "metaKeywords": "keyword1, keyword2, keyword3"
}

Viết bằng tiếng Việt, chuyên nghiệp.
`;

            let aiResponse: any;
            if (aiProvider === "gemini") {
                const res = await fetch(`https://generativelanguage.googleapis.com/v1beta/models/gemini-flash-latest:generateContent?key=${apiKey}`, {
                    method: "POST",
                    headers: { "Content-Type": "application/json" },
                    body: JSON.stringify({
                        contents: [{ parts: [{ text: prompt }] }],
                        generationConfig: { temperature: 0.7, maxOutputTokens: 4000 }
                    })
                });
                const d = await res.json();
                const text = d.candidates?.[0]?.content?.parts?.[0]?.text || "";
                const match = text.match(/```json\s*([\s\S]*?)(?:```|$)/);
                aiResponse = JSON.parse(match ? match[1].trim() : text);
            } else {
                const res = await fetch("https://api.openai.com/v1/chat/completions", {
                    method: "POST",
                    headers: { "Content-Type": "application/json", Authorization: `Bearer ${apiKey}` },
                    body: JSON.stringify({
                        model: "gpt-3.5-turbo",
                        messages: [{ role: "user", content: prompt }],
                        temperature: 0.7
                    })
                });
                const d = await res.json();
                const text = d.choices?.[0]?.message?.content || "";
                const match = text.match(/```json\s*([\s\S]*?)(?:```|$)/);
                aiResponse = JSON.parse(match ? match[1].trim() : text);
            }

            if (aiResponse.name) handleChange("name", aiResponse.name);
            if (aiResponse.description) handleChange("description", aiResponse.description);
            if (aiResponse.metaTitle) handleChange("metaTitle", aiResponse.metaTitle);
            if (aiResponse.metaDescription) handleChange("metaDescription", aiResponse.metaDescription);
            if (aiResponse.metaKeywords) handleChange("metaKeywords", aiResponse.metaKeywords);
            if (!formData.slug && aiResponse.name) handleChange("slug", slugify(aiResponse.name));

            showMessage("success", "Đã tạo nội dung AI thành công!");
        } catch (error: any) {
            showMessage("error", `Lỗi AI: ${error.message}`);
        } finally {
            setIsGeneratingAI(false);
        }
    };

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();

        // First update the product
        update(
            {
                resource: "products",
                id: id!,
                values: {
                    ...formData,
                    price: Number(formData.price),
                    comparePrice: Number(formData.comparePrice),
                    stock: Number(formData.stock),
                    variants: variants.length > 0 ? variants : undefined,
                    warehouseIds: warehouseIds.length > 0 ? warehouseIds : undefined,
                },
            },
            {
                onSuccess: async () => {
                    // Then update widgets
                    try {
                        const API_URL = import.meta.env.VITE_API_URL || "http://localhost:5002/api";
                        const token = localStorage.getItem("token");
                        await axios.put(`${API_URL}/policy-widgets/product/${id}`, {
                            widgetIds: selectedWidgets
                        }, {
                            headers: { Authorization: `Bearer ${token}` }
                        });
                        // Refetch widgets to ensure they're displayed correctly
                        await fetchWidgets();
                    } catch (error) {
                        console.error("Failed to update widgets:", error);
                    }
                    showMessage("success", "Cập nhật sản phẩm thành công!");
                    // Stay on edit page, don't redirect
                },
                onError: () => showMessage("error", "Có lỗi xảy ra!")
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
                        <Package className="h-8 w-8" />
                        Chỉnh sửa sản phẩm
                    </h1>
                    <p className="text-muted-foreground mt-1">{formData.name}</p>
                </div>
            </div>

            <form onSubmit={handleSubmit}>
                <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
                    {/* Main Info */}
                    <div className="lg:col-span-2 space-y-6">
                        {/* AI Generator */}
                        <Card>
                            <CardHeader className="pb-3">
                                <div className="flex items-center justify-between">
                                    <CardTitle className="text-base flex items-center gap-2">
                                        <Bot className="h-4 w-4 text-primary" />
                                        AI Content Generator
                                    </CardTitle>
                                    {AI_ENABLED ? (
                                        <Button
                                            type="button"
                                            onClick={handleGenerateAI}
                                            disabled={isGeneratingAI || !focusKeyword}
                                            size="sm"
                                        >
                                            {isGeneratingAI ? (
                                                <Loader2 className="h-4 w-4 mr-2 animate-spin" />
                                            ) : (
                                                <Zap className="h-4 w-4 mr-2" />
                                            )}
                                            Tạo nội dung AI
                                        </Button>
                                    ) : (
                                        <AIButton>Tạo nội dung AI</AIButton>
                                    )}
                                </div>
                            </CardHeader>
                            <CardContent>
                                <div className="relative">
                                    <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                                    <Input
                                        value={focusKeyword}
                                        onChange={(e) => setFocusKeyword(e.target.value)}
                                        placeholder="Nhập từ khóa: Tai nghe bluetooth, Áo thun nam..."
                                        className="pl-9"
                                    />
                                </div>
                            </CardContent>
                        </Card>

                        <Card>
                            <CardHeader>
                                <CardTitle>Thông tin cơ bản</CardTitle>
                            </CardHeader>
                            <CardContent className="space-y-4">
                                <div className="space-y-2">
                                    <Label htmlFor="name">Tên sản phẩm *</Label>
                                    <Input
                                        id="name"
                                        value={formData.name}
                                        onChange={(e) => handleChange("name", e.target.value)}
                                        placeholder="Nhập tên sản phẩm"
                                        required
                                    />
                                </div>

                                <div className="space-y-2">
                                    <Label htmlFor="slug">Đường dẫn (Slug)</Label>
                                    <Input
                                        id="slug"
                                        value={formData.slug}
                                        onChange={(e) => handleChange("slug", e.target.value)}
                                        placeholder="ten-san-pham"
                                    />
                                </div>

                                <div className="space-y-2">
                                    <Label htmlFor="description">Mô tả</Label>
                                    <Textarea
                                        id="description"
                                        value={formData.description}
                                        onChange={(e) => handleChange("description", e.target.value)}
                                        placeholder="Nhập mô tả sản phẩm..."
                                        rows={8}
                                    />
                                </div>
                            </CardContent>
                        </Card>

                        <Card>
                            <CardHeader>
                                <CardTitle>Giá & Kho hàng</CardTitle>
                            </CardHeader>
                            <CardContent>
                                <div className="grid grid-cols-2 gap-4">
                                    <div className="space-y-2">
                                        <Label htmlFor="price">Giá bán (VNĐ) *</Label>
                                        <Input
                                            id="price"
                                            type="number"
                                            value={formData.price}
                                            onChange={(e) => handleChange("price", e.target.value)}
                                            min={0}
                                            required
                                        />
                                    </div>

                                    <div className="space-y-2">
                                        <Label htmlFor="comparePrice">Giá so sánh (VNĐ)</Label>
                                        <Input
                                            id="comparePrice"
                                            type="number"
                                            value={formData.comparePrice}
                                            onChange={(e) => handleChange("comparePrice", e.target.value)}
                                            min={0}
                                        />
                                    </div>

                                    <div className="space-y-2">
                                        <Label htmlFor="stock">Số lượng tồn kho *</Label>
                                        <Input
                                            id="stock"
                                            type="number"
                                            value={formData.stock}
                                            onChange={(e) => handleChange("stock", e.target.value)}
                                            min={0}
                                            required
                                        />
                                    </div>

                                    <div className="space-y-2">
                                        <Label htmlFor="sku">Mã SKU</Label>
                                        <Input
                                            id="sku"
                                            value={formData.sku}
                                            onChange={(e) => handleChange("sku", e.target.value)}
                                            placeholder="SKU-001"
                                        />
                                    </div>
                                </div>
                            </CardContent>
                        </Card>

                        {/* Product Variants */}
                        <ProductVariantEditor
                            productId={id}
                            initialVariants={initialVariants}
                            onVariantsChange={setVariants}
                            basePrice={formData.price}
                            baseStock={formData.stock}
                        />

                        {/* SEO */}
                        <Card>
                            <CardHeader>
                                <CardTitle>SEO</CardTitle>
                            </CardHeader>
                            <CardContent className="space-y-4">
                                <div className="space-y-2">
                                    <Label>Meta Title</Label>
                                    <Input
                                        value={formData.metaTitle}
                                        onChange={(e) => handleChange("metaTitle", e.target.value)}
                                        placeholder="Meta title cho SEO"
                                    />
                                </div>
                                <div className="space-y-2">
                                    <Label>Meta Description</Label>
                                    <Textarea
                                        value={formData.metaDescription}
                                        onChange={(e) => handleChange("metaDescription", e.target.value)}
                                        placeholder="Meta description 120-160 ký tự"
                                        rows={3}
                                    />
                                </div>
                                <div className="space-y-2">
                                    <Label>Meta Keywords</Label>
                                    <Input
                                        value={formData.metaKeywords}
                                        onChange={(e) => handleChange("metaKeywords", e.target.value)}
                                        placeholder="keyword1, keyword2, keyword3"
                                    />
                                </div>
                            </CardContent>
                        </Card>
                    </div>

                    {/* Sidebar */}
                    <div className="space-y-6">
                        <Card>
                            <CardHeader>
                                <CardTitle>Trạng thái</CardTitle>
                            </CardHeader>
                            <CardContent className="space-y-4">
                                <div className="flex items-center justify-between">
                                    <Label htmlFor="isActive">Đang bán</Label>
                                    <Switch
                                        id="isActive"
                                        checked={formData.isActive}
                                        onChange={(e) => handleChange("isActive", e.target.checked)}
                                    />
                                </div>

                                <div className="flex items-center justify-between">
                                    <Label htmlFor="isFeatured">Sản phẩm nổi bật</Label>
                                    <Switch
                                        id="isFeatured"
                                        checked={formData.isFeatured}
                                        onChange={(e) => handleChange("isFeatured", e.target.checked)}
                                    />
                                </div>
                            </CardContent>
                        </Card>

                        {/* Widget Selector */}
                        <WidgetSelector
                            productId={id}
                            selectedWidgets={selectedWidgets}
                            onWidgetsChange={setSelectedWidgets}
                        />

                        {/* Warehouse Selector */}
                        <ProductWarehouseSelector
                            productId={id}
                            initialWarehouseIds={initialWarehouseIds}
                            onChange={setWarehouseIds}
                        />

                        <Card>
                            <CardContent className="pt-6">
                                <Button type="submit" className="w-full" disabled={isLoading}>
                                    {isLoading ? (
                                        <Loader2 className="h-4 w-4 mr-2 animate-spin" />
                                    ) : (
                                        <Save className="h-4 w-4 mr-2" />
                                    )}
                                    Cập nhật sản phẩm
                                </Button>
                            </CardContent>
                        </Card>
                    </div>
                </div>
            </form>
        </div>
    );
};
