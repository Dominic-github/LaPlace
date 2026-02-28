import { useState } from "react";
import { useCreate, useNavigation } from "@refinedev/core";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Checkbox } from "@/components/ui/checkbox";
import { RichTextEditor } from "../../components/common/RichTextEditor";
import { FeaturedImageBox } from "../../components/posts";
import { ArrowLeft, Save, Loader2, Bot, Zap, Search, FolderOpen } from "lucide-react";
import { AIButton } from "@/components/ui/ai-coming-soon";
import axios from "axios";

const AI_ENABLED = false;

export const CategoryCreate = () => {
    const { push, goBack } = useNavigation();
    const { mutate: create, isLoading } = useCreate();

    // Form state
    const [name, setName] = useState("");
    const [slug, setSlug] = useState("");
    const [description, setDescription] = useState("");
    const [image, setImage] = useState("");
    const [isActive, setIsActive] = useState(true);
    const [metaTitle, setMetaTitle] = useState("");
    const [metaDescription, setMetaDescription] = useState("");

    // AI state
    const [focusKeyword, setFocusKeyword] = useState("");
    const [isGeneratingAI, setIsGeneratingAI] = useState(false);

    // Toast message
    const [message, setMessage] = useState<{ type: 'success' | 'error' | 'info' | 'warning'; text: string } | null>(null);

    const showMessage = (type: 'success' | 'error' | 'info' | 'warning', text: string) => {
        setMessage({ type, text });
        setTimeout(() => setMessage(null), 5000);
    };

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
    };

    // Generate AI content
    const handleGenerateAI = async () => {
        if (!AI_ENABLED) return;
        if (!focusKeyword || focusKeyword.trim() === "") {
            showMessage("warning", "Vui lòng nhập từ khóa chính trước!");
            return;
        }

        setIsGeneratingAI(true);
        showMessage("info", "Đang tạo nội dung danh mục bằng AI...");

        try {
            const API_URL = import.meta.env.VITE_API_URL || "http://localhost:5002/api";
            const token = localStorage.getItem("token");

            const axiosInstance = axios.create({
                baseURL: API_URL,
                headers: { Authorization: `Bearer ${token}` }
            });

            const aiSettingsRes = await axiosInstance.get("/settings?group=ai");
            const aiSettingsData = aiSettingsRes.data;

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
Bạn là chuyên gia SEO e-commerce. Hãy tạo nội dung cho danh mục sản phẩm với các yêu cầu:

**Từ khóa danh mục:** ${focusKeyword}

**Yêu cầu:**
1. Tên danh mục SEO-friendly
2. Mô tả danh mục đầy đủ, hấp dẫn (HTML với H2, H3, bullet points)
3. Meta Description (120-160 ký tự)
4. Viết bằng tiếng Việt

Trả về JSON:
{
  "name": "Tên danh mục",
  "description": "HTML mô tả danh mục",
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
                        generationConfig: { temperature: 0.8, maxOutputTokens: 2000 }
                    })
                });

                if (!geminiRes.ok) throw new Error(`Gemini API error: ${geminiRes.status}`);

                const geminiData = await geminiRes.json();
                const generatedText = geminiData.candidates?.[0]?.content?.parts?.[0]?.text || "";

                let jsonText = generatedText;
                const jsonMatch = generatedText.match(/```json\s*([\s\S]*?)(?:```|$)/);
                if (jsonMatch) jsonText = jsonMatch[1].trim();

                aiResponse = JSON.parse(jsonText);
            } else {
                const chatgptRes = await fetch("https://api.openai.com/v1/chat/completions", {
                    method: "POST",
                    headers: {
                        "Content-Type": "application/json",
                        Authorization: `Bearer ${apiKey}`
                    },
                    body: JSON.stringify({
                        model: "gpt-3.5-turbo",
                        messages: [
                            { role: "system", content: "You are an SEO expert for e-commerce." },
                            { role: "user", content: prompt }
                        ],
                        temperature: 0.8,
                        max_tokens: 2000
                    })
                });

                if (!chatgptRes.ok) throw new Error(`ChatGPT API error: ${chatgptRes.status}`);

                const chatgptData = await chatgptRes.json();
                const generatedText = chatgptData.choices?.[0]?.message?.content || "";

                let jsonText = generatedText;
                const jsonMatch = generatedText.match(/```json\s*([\s\S]*?)(?:```|$)/);
                if (jsonMatch) jsonText = jsonMatch[1].trim();

                aiResponse = JSON.parse(jsonText);
            }

            if (aiResponse.name) setName(aiResponse.name);
            if (aiResponse.description) setDescription(aiResponse.description);
            if (aiResponse.metaDescription) setMetaDescription(aiResponse.metaDescription);
            if (!slug && focusKeyword) setSlug(generateSlug(focusKeyword));

            showMessage("success", "Đã tạo nội dung thành công!");
        } catch (error: any) {
            console.error("AI Generation Error:", error);
            showMessage("error", `Lỗi khi tạo nội dung AI: ${error.message}`);
        } finally {
            setIsGeneratingAI(false);
        }
    };

    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault();

        if (!name) {
            showMessage("error", "Vui lòng nhập tên danh mục");
            return;
        }

        create(
            {
                resource: "product-categories",
                values: {
                    name,
                    slug: slug || generateSlug(name),
                    description,
                    image,
                    isActive,
                    metaTitle: metaTitle || `${name} | Webest FastShop`,
                    metaDescription
                }
            },
            {
                onSuccess: () => {
                    showMessage("success", "Tạo danh mục thành công!");
                    setTimeout(() => push("/product-categories"), 1000);
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
                                Thêm danh mục mới
                            </h1>
                            <p className="text-muted-foreground mt-1">
                                Tạo danh mục sản phẩm mới
                            </p>
                        </div>
                    </div>
                    <Button type="submit" disabled={isLoading} size="lg">
                        {isLoading ? (
                            <Loader2 className="h-4 w-4 mr-2 animate-spin" />
                        ) : (
                            <Save className="h-4 w-4 mr-2" />
                        )}
                        Lưu danh mục
                    </Button>
                </div>

                <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
                    {/* Main Content */}
                    <div className="lg:col-span-2 space-y-6">
                        {/* AI Keyword Box */}
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
                                <div className="space-y-2">
                                    <Label>Từ khóa danh mục</Label>
                                    <div className="relative">
                                        <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                                        <Input
                                            value={focusKeyword}
                                            onChange={(e) => setFocusKeyword(e.target.value)}
                                            onBlur={handleKeywordBlur}
                                            placeholder="Ví dụ: Điện thoại, Laptop, Thời trang"
                                            className="pl-9 text-lg"
                                        />
                                    </div>
                                </div>
                            </CardContent>
                        </Card>

                        {/* Basic Info */}
                        <Card>
                            <CardHeader>
                                <CardTitle>Thông tin danh mục</CardTitle>
                            </CardHeader>
                            <CardContent className="space-y-4">
                                <div className="space-y-2">
                                    <Label htmlFor="name">Tên danh mục *</Label>
                                    <Input
                                        id="name"
                                        value={name}
                                        onChange={(e) => setName(e.target.value)}
                                        placeholder="Nhập tên danh mục"
                                        required
                                    />
                                </div>

                                <div className="space-y-2">
                                    <Label htmlFor="slug">Đường dẫn (Slug)</Label>
                                    <Input
                                        id="slug"
                                        value={slug}
                                        onChange={(e) => setSlug(e.target.value)}
                                        placeholder="ten-danh-muc"
                                    />
                                </div>

                                <div className="space-y-2">
                                    <Label>Mô tả</Label>
                                    <RichTextEditor
                                        value={description}
                                        onChange={setDescription}
                                        placeholder="Nhập mô tả danh mục..."
                                        height={250}
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
                            <CardContent>
                                <div className="flex items-center gap-3">
                                    <Checkbox
                                        id="isActive"
                                        checked={isActive}
                                        onCheckedChange={(checked) => setIsActive(!!checked)}
                                    />
                                    <Label htmlFor="isActive" className="cursor-pointer">Hiển thị</Label>
                                </div>
                            </CardContent>
                        </Card>

                        {/* Featured Image */}
                        <FeaturedImageBox
                            imageUrl={image}
                            onImageChange={setImage}
                            onImageRemove={() => setImage("")}
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
                                    Lưu danh mục
                                </Button>
                            </CardContent>
                        </Card>
                    </div>
                </div>
            </form>
        </div>
    );
};
