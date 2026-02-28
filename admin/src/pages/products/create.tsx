import { useState } from "react";
import { useCreate, useNavigation, useList } from "@refinedev/core";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Select } from "@/components/ui/select";
import { Checkbox } from "@/components/ui/checkbox";
import { RichTextEditor } from "../../components/common/RichTextEditor";
import { FeaturedImageBox } from "../../components/posts";
import { ArrowLeft, Save, Loader2, Bot, Zap, Search, Package, Construction } from "lucide-react";
import axios from "axios";

// AI Feature Flag - Set to true when ready to enable
const AI_ENABLED = false;
import { WidgetSelector } from "@/components/products/WidgetSelector";
import { SpecificationEditor } from "@/components/products/SpecificationEditor";
import { ProductVariantEditor } from "@/components/products/ProductVariantEditor";
import { ProductWarehouseSelector } from "@/components/products/ProductWarehouseSelector";
import { AIButton } from "@/components/ui/ai-coming-soon";

export const ProductCreate = () => {
    const { push, goBack } = useNavigation();
    const { mutate: create, isLoading } = useCreate();

    // Form state
    const [name, setName] = useState("");
    const [slug, setSlug] = useState("");
    const [description, setDescription] = useState("");
    const [shortDescription, setShortDescription] = useState("");
    const [price, setPrice] = useState<number>(0);
    const [comparePrice, setComparePrice] = useState<number>(0);
    const [stock, setStock] = useState<number>(0);
    const [sku, setSku] = useState("");
    const [categoryId, setCategoryId] = useState("");
    const [thumbnail, setThumbnail] = useState("");
    const [isActive, setIsActive] = useState(true);
    const [isFeatured, setIsFeatured] = useState(false);
    const [metaTitle, setMetaTitle] = useState("");
    const [metaDescription, setMetaDescription] = useState("");
    const [metaKeywords, setMetaKeywords] = useState("");

    // AI State
    const [focusKeyword, setFocusKeyword] = useState("");
    const [isGeneratingAI, setIsGeneratingAI] = useState(false);

    // Policy Widgets
    const [selectedWidgets, setSelectedWidgets] = useState<string[]>([]);

    // Product Specifications
    const [specifications, setSpecifications] = useState<any[]>([]);

    // Product Variants
    const [variants, setVariants] = useState<any[]>([]);

    // Warehouse selection (just IDs, no quantity)
    const [warehouseIds, setWarehouseIds] = useState<string[]>([]);

    // Toast message
    const [message, setMessage] = useState<{ type: 'success' | 'error' | 'info' | 'warning'; text: string } | null>(null);

    const showMessage = (type: 'success' | 'error' | 'info' | 'warning', text: string) => {
        setMessage({ type, text });
        setTimeout(() => setMessage(null), 5000);
    };

    // Fetch categories
    const { data: categoriesData } = useList({
        resource: "categories",
        pagination: { mode: "off" }
    });
    const categories = categoriesData?.data || [];

    const generateSlug = (name: string) => {
        return name
            .toLowerCase()
            .normalize("NFD")
            .replace(/[\u0300-\u036f]/g, "")
            .replace(/đ/g, "d")
            .replace(/Đ/g, "D")
            .replace(/[^a-z0-9\s-]/g, "")
            .replace(/\s+/g, "-")
            .replace(/-+/g, "-")
            .trim();
    };

    const handleKeywordBlur = () => {
        if (!slug && focusKeyword) {
            setSlug(generateSlug(focusKeyword));
        }
        if (!metaKeywords && focusKeyword) {
            setMetaKeywords(focusKeyword);
        }
    };

    // Generate AI content (DISABLED)
    const handleGenerateAI = async () => {
        if (!AI_ENABLED) {
            showMessage("warning", "🚧 Tính năng AI đang được phát triển. Vui lòng thử lại sau!");
            return;
        }
        if (!focusKeyword || focusKeyword.trim() === "") {
            showMessage("warning", "Vui lòng nhập từ khóa chính trước!");
            return;
        }

        setIsGeneratingAI(true);
        showMessage("info", "Đang tạo nội dung sản phẩm bằng AI...");

        try {
            const API_URL = import.meta.env.VITE_API_URL || "http://localhost:5002/api";
            const token = localStorage.getItem("token");

            const axiosInstance = axios.create({
                baseURL: API_URL,
                headers: { Authorization: `Bearer ${token}` }
            });

            const [seoConfigRes, aiSettingsRes] = await Promise.all([
                axiosInstance.get("/settings/seo_config"),
                axiosInstance.get("/settings?group=ai")
            ]);

            const seoConfigData = seoConfigRes.data.data || seoConfigRes.data;
            const aiSettingsData = aiSettingsRes.data;

            let seoConfig: any = {};
            try {
                seoConfig = JSON.parse(seoConfigData.value || "{}");
            } catch (e) {
                console.error("Failed to parse SEO config:", e);
            }

            const aiSettings: any = {};
            aiSettingsData.data?.forEach((setting: any) => {
                aiSettings[setting.key] = setting.value;
            });

            const aiProvider = aiSettings.ai_provider || "gemini";
            const apiKey = aiProvider === "gemini" ? aiSettings.gemini_api_key : aiSettings.chatgpt_api_key;

            if (!apiKey) {
                showMessage("error", `Vui lòng cấu hình API Key cho ${aiProvider} trong Cấu hình hệ thống!`);
                setIsGeneratingAI(false);
                return;
            }

            const prompt = `
Bạn là một chuyên gia viết mô tả sản phẩm cho e-commerce. Hãy tạo nội dung mô tả sản phẩm với các yêu cầu sau:

**Từ khóa sản phẩm:** ${focusKeyword}

**Yêu cầu nội dung:**
1. Viết bằng tiếng Việt, chuyên nghiệp, hấp dẫn
2. Mô tả đầy đủ tính năng, lợi ích của sản phẩm
3. Sử dụng từ khóa "${focusKeyword}" một cách tự nhiên
4. Format HTML với các heading H2, H3 (không dùng H1)
5. Có bullet points cho các tính năng nổi bật

**Yêu cầu tạo:**
- Tên sản phẩm (SEO-friendly, hấp dẫn, chứa từ khóa)
- Mô tả ngắn (100-150 ký tự, dùng cho preview)
- Mô tả chi tiết (HTML content, đầy đủ thông tin sản phẩm)
- Meta Description (${seoConfig.metaDescription?.minLength || 70}-${seoConfig.metaDescription?.maxLength || 160} ký tự)

Trả về JSON với format:
{
  "name": "Tên sản phẩm",
  "shortDescription": "Mô tả ngắn",
  "description": "HTML content mô tả chi tiết",
  "metaDescription": "Meta description SEO"
}
`;

            let aiResponse: any;
            if (aiProvider === "gemini") {
                const geminiUrl = `https://generativelanguage.googleapis.com/v1beta/models/gemini-flash-latest:generateContent?key=${apiKey}`;
                const geminiRes = await fetch(geminiUrl, {
                    method: "POST",
                    headers: { "Content-Type": "application/json" },
                    body: JSON.stringify({
                        contents: [{ parts: [{ text: prompt }] }],
                        generationConfig: {
                            temperature: parseFloat(aiSettings.ai_temperature || "0.7"),
                            maxOutputTokens: parseInt(aiSettings.ai_max_tokens || "8000")
                        }
                    })
                });

                if (!geminiRes.ok) {
                    throw new Error(`Gemini API error: ${geminiRes.status}`);
                }

                const geminiData = await geminiRes.json();
                const generatedText = geminiData.candidates?.[0]?.content?.parts?.[0]?.text || "";

                let jsonText = generatedText;
                const jsonMatch = generatedText.match(/```json\s*([\s\S]*?)(?:```|$)/);
                if (jsonMatch) {
                    jsonText = jsonMatch[1].trim();
                }

                try {
                    aiResponse = JSON.parse(jsonText);
                } catch (parseError) {
                    const nameMatch = jsonText.match(/"name"\s*:\s*"([^"]*(?:\\.[^"]*)*)"/);
                    const shortDescMatch = jsonText.match(/"shortDescription"\s*:\s*"([^"]*(?:\\.[^"]*)*)"/);
                    const descMatch = jsonText.match(/"description"\s*:\s*"([\s\S]*?)"/);
                    const metaDescMatch = jsonText.match(/"metaDescription"\s*:\s*"([^"]*(?:\\.[^"]*)*)"/);

                    aiResponse = {
                        name: nameMatch ? nameMatch[1].replace(/\\"/g, '"') : "",
                        shortDescription: shortDescMatch ? shortDescMatch[1].replace(/\\"/g, '"') : "",
                        description: descMatch ? descMatch[1].replace(/\\n/g, "\n").replace(/\\"/g, '"') : "",
                        metaDescription: metaDescMatch ? metaDescMatch[1].replace(/\\"/g, '"') : ""
                    };
                }
            } else {
                // ChatGPT
                const chatgptRes = await fetch("https://api.openai.com/v1/chat/completions", {
                    method: "POST",
                    headers: {
                        "Content-Type": "application/json",
                        Authorization: `Bearer ${apiKey}`
                    },
                    body: JSON.stringify({
                        model: "gpt-3.5-turbo",
                        messages: [
                            { role: "system", content: "You are a professional product content writer." },
                            { role: "user", content: prompt }
                        ],
                        temperature: parseFloat(aiSettings.ai_temperature || "0.7"),
                        max_tokens: parseInt(aiSettings.ai_max_tokens || "8000")
                    })
                });

                if (!chatgptRes.ok) {
                    throw new Error(`ChatGPT API error: ${chatgptRes.status}`);
                }

                const chatgptData = await chatgptRes.json();
                const generatedText = chatgptData.choices?.[0]?.message?.content || "";

                let jsonText = generatedText;
                const jsonMatch = generatedText.match(/```json\s*([\s\S]*?)(?:```|$)/);
                if (jsonMatch) {
                    jsonText = jsonMatch[1].trim();
                }

                aiResponse = JSON.parse(jsonText);
            }

            // Set generated content
            if (aiResponse.name) setName(aiResponse.name);
            if (aiResponse.shortDescription) setShortDescription(aiResponse.shortDescription);
            if (aiResponse.description) setDescription(aiResponse.description);
            if (aiResponse.metaDescription) setMetaDescription(aiResponse.metaDescription);
            if (!slug && focusKeyword) setSlug(generateSlug(focusKeyword));

            showMessage("success", "Đã tạo nội dung sản phẩm thành công!");
        } catch (error: any) {
            console.error("AI Generation Error:", error);
            showMessage("error", `Lỗi khi tạo nội dung AI: ${error.message}`);
        } finally {
            setIsGeneratingAI(false);
        }
    };

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();

        if (!name) {
            showMessage("error", "Vui lòng nhập tên sản phẩm");
            return;
        }

        create(
            {
                resource: "products",
                values: {
                    name,
                    slug: slug || generateSlug(name),
                    description,
                    shortDescription,
                    price: Number(price),
                    comparePrice: Number(comparePrice),
                    stock: Number(stock),
                    sku,
                    categoryId: categoryId || null,
                    thumbnail,
                    isActive,
                    isFeatured,
                    specifications: specifications.length > 0 ? { groups: specifications } : null,
                    variants: variants.length > 0 ? variants : undefined,
                    warehouseIds: warehouseIds.length > 0 ? warehouseIds : undefined,
                    metaTitle: metaTitle || `${name} | Webest FastShop`,
                    metaDescription,
                    metaKeywords
                },
            },
            {
                onSuccess: async (data) => {
                    // Save widgets for the new product
                    if (selectedWidgets.length > 0 && data?.data?.id) {
                        try {
                            const API_URL = import.meta.env.VITE_API_URL || "http://localhost:5002/api";
                            const token = localStorage.getItem("token");
                            await axios.put(`${API_URL}/policy-widgets/product/${data.data.id}`, {
                                widgetIds: selectedWidgets
                            }, {
                                headers: { Authorization: `Bearer ${token}` }
                            });
                        } catch (error) {
                            console.error("Failed to save widgets:", error);
                        }
                    }
                    showMessage("success", "Tạo sản phẩm thành công!");
                    setTimeout(() => push("/products"), 1000);
                },
                onError: (error: any) => {
                    showMessage("error", error?.message || "Có lỗi xảy ra");
                }
            }
        );
    };

    return (
        <div className="space-y-6">
            {/* Toast Message */}
            {message && (
                <div
                    className={`fixed top-20 right-4 z-50 px-4 py-3 rounded-md shadow-lg max-w-md ${message.type === "success" ? "bg-success text-white" :
                        message.type === "error" ? "bg-destructive text-white" :
                            message.type === "warning" ? "bg-warning text-white" :
                                "bg-primary text-white"
                        }`}
                >
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
                        Thêm sản phẩm mới
                    </h1>
                    <p className="text-muted-foreground mt-1">
                        Điền thông tin sản phẩm bên dưới
                    </p>
                </div>
            </div>

            <form onSubmit={handleSubmit}>
                <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
                    {/* Main Content */}
                    <div className="lg:col-span-2 space-y-6">
                        {/* AI Keyword Box */}
                        <Card>
                            <CardHeader className="pb-3">
                                <div className="flex items-center justify-between">
                                    <CardTitle className="text-base flex items-center gap-2">
                                        <Bot className="h-4 w-4 text-primary" />
                                        Từ khóa & AI Content Generator
                                    </CardTitle>
                                    <div className="flex items-center gap-2">
                                        {AI_ENABLED ? (
                                            <Button
                                                type="button"
                                                onClick={handleGenerateAI}
                                                disabled={isGeneratingAI || !focusKeyword || focusKeyword.trim() === ""}
                                                variant="default"
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
                                </div>
                            </CardHeader>
                            <CardContent>
                                <div className="space-y-2">
                                    <Label>Từ khóa chính (Focus Keyword)</Label>
                                    <div className="relative">
                                        <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                                        <Input
                                            value={focusKeyword}
                                            onChange={(e) => setFocusKeyword(e.target.value)}
                                            onBlur={handleKeywordBlur}
                                            placeholder="Ví dụ: Điện thoại iPhone 15 Pro Max"
                                            className="pl-9 text-lg"
                                        />
                                    </div>
                                    <p className="text-xs text-muted-foreground">
                                        Từ khóa này sẽ được dùng để tạo slug và tối ưu SEO
                                    </p>
                                </div>
                            </CardContent>
                        </Card>

                        {/* Basic Info */}
                        <Card>
                            <CardHeader>
                                <CardTitle>Thông tin cơ bản</CardTitle>
                            </CardHeader>
                            <CardContent className="space-y-4">
                                <div className="space-y-2">
                                    <Label htmlFor="name">Tên sản phẩm *</Label>
                                    <Input
                                        id="name"
                                        value={name}
                                        onChange={(e) => setName(e.target.value)}
                                        placeholder="Nhập tên sản phẩm"
                                        required
                                    />
                                </div>

                                <div className="space-y-2">
                                    <Label htmlFor="slug">Đường dẫn (Slug)</Label>
                                    <Input
                                        id="slug"
                                        value={slug}
                                        onChange={(e) => setSlug(e.target.value)}
                                        placeholder="ten-san-pham"
                                    />
                                </div>

                                <div className="space-y-2">
                                    <Label>Mô tả ngắn</Label>
                                    <Input
                                        value={shortDescription}
                                        onChange={(e) => setShortDescription(e.target.value)}
                                        placeholder="Mô tả ngắn gọn về sản phẩm..."
                                        maxLength={200}
                                    />
                                </div>

                                <div className="space-y-2">
                                    <Label>Mô tả chi tiết</Label>
                                    <RichTextEditor
                                        value={description}
                                        onChange={setDescription}
                                        placeholder="Nhập mô tả chi tiết sản phẩm..."
                                        height={300}
                                    />
                                </div>
                            </CardContent>
                        </Card>

                        {/* Specifications */}
                        <SpecificationEditor
                            specifications={specifications}
                            onChange={setSpecifications}
                        />

                        {/* Product Variants */}
                        <ProductVariantEditor
                            onVariantsChange={setVariants}
                            basePrice={price}
                            baseStock={stock}
                        />

                        {/* Price & Stock */}
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
                                            value={price}
                                            onChange={(e) => setPrice(Number(e.target.value))}
                                            min={0}
                                            required
                                        />
                                    </div>

                                    <div className="space-y-2">
                                        <Label htmlFor="comparePrice">Giá so sánh (VNĐ)</Label>
                                        <Input
                                            id="comparePrice"
                                            type="number"
                                            value={comparePrice}
                                            onChange={(e) => setComparePrice(Number(e.target.value))}
                                            min={0}
                                        />
                                    </div>

                                    <div className="space-y-2">
                                        <Label htmlFor="stock">Số lượng tồn kho *</Label>
                                        <Input
                                            id="stock"
                                            type="number"
                                            value={stock}
                                            onChange={(e) => setStock(Number(e.target.value))}
                                            min={0}
                                            required
                                        />
                                    </div>

                                    <div className="space-y-2">
                                        <Label htmlFor="sku">Mã SKU</Label>
                                        <Input
                                            id="sku"
                                            value={sku}
                                            onChange={(e) => setSku(e.target.value)}
                                            placeholder="SKU-001"
                                        />
                                    </div>
                                </div>
                            </CardContent>
                        </Card>

                        {/* SEO */}
                        <Card>
                            <CardHeader>
                                <CardTitle>SEO</CardTitle>
                            </CardHeader>
                            <CardContent className="space-y-4">
                                <div className="space-y-2">
                                    <Label>Meta Title</Label>
                                    <Input
                                        value={metaTitle}
                                        onChange={(e) => setMetaTitle(e.target.value)}
                                        placeholder="Tiêu đề SEO..."
                                        maxLength={60}
                                    />
                                </div>

                                <div className="space-y-2">
                                    <Label>Meta Description</Label>
                                    <Input
                                        value={metaDescription}
                                        onChange={(e) => setMetaDescription(e.target.value)}
                                        placeholder="Mô tả SEO..."
                                        maxLength={160}
                                    />
                                </div>

                                <div className="space-y-2">
                                    <Label>Meta Keywords</Label>
                                    <Input
                                        value={metaKeywords}
                                        onChange={(e) => setMetaKeywords(e.target.value)}
                                        placeholder="keyword1, keyword2, keyword3"
                                    />
                                </div>
                            </CardContent>
                        </Card>
                    </div>

                    {/* Sidebar */}
                    <div className="space-y-6">
                        {/* Status */}
                        <Card>
                            <CardHeader>
                                <CardTitle>Trạng thái</CardTitle>
                            </CardHeader>
                            <CardContent className="space-y-4">
                                <div className="flex items-center gap-3">
                                    <Checkbox
                                        id="isActive"
                                        checked={isActive}
                                        onCheckedChange={(checked) => setIsActive(!!checked)}
                                    />
                                    <Label htmlFor="isActive" className="cursor-pointer">Đang bán</Label>
                                </div>

                                <div className="flex items-center gap-3">
                                    <Checkbox
                                        id="isFeatured"
                                        checked={isFeatured}
                                        onCheckedChange={(checked) => setIsFeatured(!!checked)}
                                    />
                                    <Label htmlFor="isFeatured" className="cursor-pointer">Sản phẩm nổi bật</Label>
                                </div>
                            </CardContent>
                        </Card>

                        {/* Category */}
                        <Card>
                            <CardHeader>
                                <CardTitle>Danh mục</CardTitle>
                            </CardHeader>
                            <CardContent>
                                <Select
                                    value={categoryId}
                                    onChange={(e) => setCategoryId(e.target.value)}
                                >
                                    <option value="">-- Chọn danh mục --</option>
                                    {categories.map((cat: any) => (
                                        <option key={cat.id} value={cat.id}>
                                            {cat.name}
                                        </option>
                                    ))}
                                </Select>
                            </CardContent>
                        </Card>

                        {/* Featured Image */}
                        <FeaturedImageBox
                            imageUrl={thumbnail}
                            onImageChange={setThumbnail}
                            onImageRemove={() => setThumbnail("")}
                        />

                        {/* Widget Selector */}
                        <WidgetSelector
                            selectedWidgets={selectedWidgets}
                            onWidgetsChange={setSelectedWidgets}
                        />

                        {/* Warehouse Selector */}
                        <ProductWarehouseSelector
                            initialWarehouseIds={[]}
                            onChange={setWarehouseIds}
                        />

                        {/* Submit */}
                        <Card>
                            <CardContent className="pt-6">
                                <Button type="submit" className="w-full" disabled={isLoading}>
                                    {isLoading ? (
                                        <Loader2 className="h-4 w-4 mr-2 animate-spin" />
                                    ) : (
                                        <Save className="h-4 w-4 mr-2" />
                                    )}
                                    Lưu sản phẩm
                                </Button>
                            </CardContent>
                        </Card>
                    </div>
                </div>
            </form>
        </div>
    );
};
