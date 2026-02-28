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
import { FeaturedImageBox } from "@/components/posts";
import { ArrowLeft, Save, Loader2, Bot, Zap, Search, FolderOpen } from "lucide-react";
import { AIButton } from "@/components/ui/ai-coming-soon";
import axios from "axios";

const AI_ENABLED = false;

export const CategoryEdit = () => {
    const { id } = useParams();
    const { push, goBack } = useNavigation();
    const { data, isLoading: isFetching } = useOne({
        resource: "product-categories",
        id: id!,
    });
    const { mutate: update, isLoading } = useUpdate();

    const [formData, setFormData] = useState({
        name: "",
        slug: "",
        description: "",
        image: "",
        metaTitle: "",
        metaDescription: "",
        metaKeywords: "",
        isActive: true,
    });

    // AI state
    const [focusKeyword, setFocusKeyword] = useState("");
    const [isGeneratingAI, setIsGeneratingAI] = useState(false);

    // Toast
    const [message, setMessage] = useState<{ type: 'success' | 'error'; text: string } | null>(null);
    const showMessage = (type: 'success' | 'error', text: string) => {
        setMessage({ type, text });
        setTimeout(() => setMessage(null), 5000);
    };

    useEffect(() => {
        if (data?.data) {
            const category = data.data;
            setFormData({
                name: category.name || "",
                slug: category.slug || "",
                description: category.description || "",
                image: category.image || "",
                metaTitle: category.metaTitle || "",
                metaDescription: category.metaDescription || "",
                metaKeywords: category.metaKeywords || "",
                isActive: category.isActive ?? true,
            });
        }
    }, [data]);

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
Viết mô tả danh mục sản phẩm về: ${focusKeyword}

Yêu cầu:
1. Tên danh mục hấp dẫn
2. Mô tả chi tiết về danh mục (100-200 từ), giới thiệu các loại sản phẩm trong danh mục
3. Meta title cho SEO (50-60 ký tự)
4. Meta description (120-160 ký tự)
5. 5-8 meta keywords liên quan

Trả về JSON:
{
  "name": "Tên danh mục",
  "description": "Mô tả danh mục...",
  "metaTitle": "Meta title SEO",
  "metaDescription": "Meta description 120-160 ký tự",
  "metaKeywords": "keyword1, keyword2, keyword3"
}

Viết bằng tiếng Việt.
`;

            let aiResponse: any;
            if (aiProvider === "gemini") {
                const res = await fetch(`https://generativelanguage.googleapis.com/v1beta/models/gemini-flash-latest:generateContent?key=${apiKey}`, {
                    method: "POST",
                    headers: { "Content-Type": "application/json" },
                    body: JSON.stringify({
                        contents: [{ parts: [{ text: prompt }] }],
                        generationConfig: { temperature: 0.7, maxOutputTokens: 2000 }
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

    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault();
        update(
            { resource: "product-categories", id: id!, values: formData },
            {
                onSuccess: () => {
                    showMessage("success", "Cập nhật thành công!");
                    setTimeout(() => push("/product-categories"), 1000);
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

            <form onSubmit={handleSubmit}>
                {/* Header */}
                <div className="flex items-center justify-between mb-6">
                    <div className="flex items-center gap-4">
                        <Button type="button" variant="ghost" size="sm" onClick={goBack}>
                            <ArrowLeft className="h-4 w-4 mr-2" />
                            Quay lại
                        </Button>
                        <div>
                            <h1 className="text-3xl font-bold flex items-center gap-2">
                                <FolderOpen className="h-8 w-8" />
                                Chỉnh sửa danh mục
                            </h1>
                            <p className="text-muted-foreground mt-1">{formData.name}</p>
                        </div>
                    </div>
                    <Button type="submit" disabled={isLoading} size="lg">
                        {isLoading ? (
                            <Loader2 className="h-4 w-4 mr-2 animate-spin" />
                        ) : (
                            <Save className="h-4 w-4 mr-2" />
                        )}
                        Lưu thay đổi
                    </Button>
                </div>

                <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
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
                                        placeholder="Nhập từ khóa: Điện thoại, Thời trang nam..."
                                        className="pl-9"
                                    />
                                </div>
                            </CardContent>
                        </Card>

                        <Card>
                            <CardHeader>
                                <CardTitle>Thông tin danh mục</CardTitle>
                            </CardHeader>
                            <CardContent className="space-y-4">
                                <div className="space-y-2">
                                    <Label htmlFor="name">Tên danh mục *</Label>
                                    <Input
                                        id="name"
                                        value={formData.name}
                                        onChange={(e) => handleChange("name", e.target.value)}
                                        placeholder="Nhập tên danh mục"
                                        required
                                    />
                                </div>

                                <div className="space-y-2">
                                    <Label htmlFor="slug">Đường dẫn (Slug)</Label>
                                    <Input
                                        id="slug"
                                        value={formData.slug}
                                        onChange={(e) => handleChange("slug", e.target.value)}
                                        placeholder="ten-danh-muc"
                                    />
                                </div>

                                <div className="space-y-2">
                                    <Label htmlFor="description">Mô tả</Label>
                                    <Textarea
                                        id="description"
                                        value={formData.description}
                                        onChange={(e) => handleChange("description", e.target.value)}
                                        placeholder="Mô tả danh mục..."
                                        rows={5}
                                    />
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
                        <FeaturedImageBox
                            imageUrl={formData.image}
                            onImageChange={(url) => handleChange("image", url)}
                            onImageRemove={() => handleChange("image", "")}
                        />

                        <Card>
                            <CardHeader>
                                <CardTitle>Trạng thái</CardTitle>
                            </CardHeader>
                            <CardContent>
                                <div className="flex items-center justify-between">
                                    <Label htmlFor="isActive">Hiển thị</Label>
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
