import { useState, useEffect } from "react";
import { useOne, useUpdate, useNavigation } from "@refinedev/core";
import { useParams } from "react-router-dom";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Checkbox } from "@/components/ui/checkbox";
import { Spinner } from "@/components/ui/spinner";
import { RichTextEditor } from "@/components/common/RichTextEditor";
import { ArrowLeft, Save, Loader2, FileText, Bot, Zap, Search } from "lucide-react";
import { AIButton } from "@/components/ui/ai-coming-soon";
import axios from "axios";

const AI_ENABLED = false;

export const StaticPageEdit = () => {
  const { id } = useParams();
  const { goBack } = useNavigation();
  const { data, isLoading: isFetching } = useOne({
    resource: "static-pages",
    id: id!,
  });
  const { mutate: update, isLoading } = useUpdate();

  const [title, setTitle] = useState("");
  const [slug, setSlug] = useState("");
  const [excerpt, setExcerpt] = useState("");
  const [content, setContent] = useState("");
  const [metaTitle, setMetaTitle] = useState("");
  const [metaDescription, setMetaDescription] = useState("");
  const [metaKeywords, setMetaKeywords] = useState("");
  const [order, setOrder] = useState(0);
  const [isActive, setIsActive] = useState(true);

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
      const page = data.data;
      setTitle(page.title || "");
      setSlug(page.slug || "");
      setExcerpt(page.excerpt || "");
      setContent(page.content || "");
      setMetaTitle(page.metaTitle || "");
      setMetaDescription(page.metaDescription || "");
      setMetaKeywords(page.metaKeywords || "");
      setOrder(page.order || 0);
      setIsActive(page.isActive ?? true);
    }
  }, [data]);

  const slugify = (text: string) => {
    return text
      .toLowerCase()
      .normalize("NFD")
      .replace(/[\u0300-\u036f]/g, "")
      .replace(/đ/g, "d")
      .replace(/[^a-z0-9\s-]/g, "")
      .replace(/\s+/g, "-")
      .replace(/-+/g, "-")
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
Viết trang tĩnh về: ${focusKeyword}

Yêu cầu:
1. Tiêu đề chuyên nghiệp
2. Excerpt ngắn gọn 2-3 câu
3. Nội dung chi tiết với HTML (h2, h3, p, ul, li)
4. Meta title, description, keywords cho SEO

Trả về JSON:
{
  "title": "Tiêu đề",
  "excerpt": "Mô tả ngắn",
  "content": "<h2>...</h2><p>...</p>",
  "metaTitle": "Meta title",
  "metaDescription": "Meta desc 120-160 ký tự",
  "metaKeywords": "keyword1, keyword2"
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
            generationConfig: { temperature: 0.7, maxOutputTokens: 8000 }
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

      if (aiResponse.title) setTitle(aiResponse.title);
      if (aiResponse.excerpt) setExcerpt(aiResponse.excerpt);
      if (aiResponse.content) setContent(aiResponse.content);
      if (aiResponse.metaTitle) setMetaTitle(aiResponse.metaTitle);
      if (aiResponse.metaDescription) setMetaDescription(aiResponse.metaDescription);
      if (aiResponse.metaKeywords) setMetaKeywords(aiResponse.metaKeywords);
      if (!slug && aiResponse.title) setSlug(slugify(aiResponse.title));

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
      {
        resource: "static-pages",
        id: id!,
        values: {
          title,
          slug: slug || slugify(title),
          excerpt,
          content,
          metaTitle,
          metaDescription,
          metaKeywords,
          order: Number(order),
          isActive,
        },
      },
      {
        onSuccess: () => showMessage("success", "Cập nhật thành công!"),
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
            <FileText className="h-8 w-8" />
            Chỉnh sửa trang tĩnh
          </h1>
        </div>
      </div>

      <form onSubmit={handleSubmit}>
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
                    placeholder="Nhập từ khóa: Về chúng tôi, Chính sách bảo mật..."
                    className="pl-9"
                  />
                </div>
              </CardContent>
            </Card>

            {/* Main Content */}
            <Card>
              <CardHeader>
                <CardTitle>Nội dung</CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="space-y-2">
                  <Label htmlFor="title">Tiêu đề *</Label>
                  <Input
                    id="title"
                    value={title}
                    onChange={(e) => setTitle(e.target.value)}
                    placeholder="Tiêu đề trang"
                    required
                  />
                </div>

                <div className="space-y-2">
                  <Label htmlFor="slug">Slug</Label>
                  <Input
                    id="slug"
                    value={slug}
                    onChange={(e) => setSlug(e.target.value)}
                    placeholder="url-trang"
                  />
                </div>

                <div className="space-y-2">
                  <Label>Mô tả ngắn</Label>
                  <RichTextEditor
                    value={excerpt}
                    onChange={setExcerpt}
                    placeholder="Mô tả ngắn..."
                    height={120}
                  />
                </div>

                <div className="space-y-2">
                  <Label>Nội dung *</Label>
                  <RichTextEditor
                    value={content}
                    onChange={setContent}
                    placeholder="Nội dung trang..."
                    height={400}
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
                    placeholder="Meta title cho SEO"
                  />
                </div>
                <div className="space-y-2">
                  <Label>Meta Description</Label>
                  <Input
                    value={metaDescription}
                    onChange={(e) => setMetaDescription(e.target.value)}
                    placeholder="Meta description 120-160 ký tự"
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
                  Cập nhật trang
                </Button>
              </CardContent>
            </Card>
          </div>
        </div>
      </form>
    </div>
  );
};
