import { useState } from "react";
import { useCreate, useNavigation } from "@refinedev/core";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Checkbox } from "@/components/ui/checkbox";
import { RichTextEditor } from "../../components/common/RichTextEditor";
import { ArrowLeft, Save, Loader2, FileText, Bot, Zap, Search } from "lucide-react";
import { AIButton } from "@/components/ui/ai-coming-soon";
import axios from "axios";

// AI Feature Flag - Set to true when ready to enable
const AI_ENABLED = false;

export const StaticPageCreate = () => {
  const { push, goBack } = useNavigation();
  const { mutate: create, isLoading } = useCreate();

  // Form state
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

  // Toast message
  const [message, setMessage] = useState<{ type: 'success' | 'error' | 'info' | 'warning'; text: string } | null>(null);

  const showMessage = (type: 'success' | 'error' | 'info' | 'warning', text: string) => {
    setMessage({ type, text });
    setTimeout(() => setMessage(null), 5000);
  };

  const generateSlug = (text: string) => {
    return text
      .toLowerCase()
      .normalize("NFD")
      .replace(/[\u0300-\u036f]/g, "")
      .replace(/đ/g, "d")
      .replace(/[^a-z0-9\s-]/g, "")
      .replace(/\s+/g, "-")
      .trim();
  };

  // Generate AI content (DISABLED)
  const handleGenerateAI = async () => {
    if (!AI_ENABLED) {
      showMessage("warning", "🚧 Tính năng AI đang được phát triển. Vui lòng thử lại sau!");
      return;
    }
    if (!focusKeyword) {
      showMessage("warning", "Vui lòng nhập chủ đề trang!");
      return;
    }

    setIsGeneratingAI(true);
    showMessage("info", "Đang tạo nội dung trang bằng AI...");;

    try {
      const API_URL = import.meta.env.VITE_API_URL || "http://localhost:5002/api";
      const token = localStorage.getItem("token");

      const axiosInstance = axios.create({
        baseURL: API_URL,
        headers: { Authorization: `Bearer ${token}` }
      });

      const aiSettingsRes = await axiosInstance.get("/settings?group=ai");
      const aiSettings: any = {};
      aiSettingsRes.data.data?.forEach((s: any) => {
        aiSettings[s.key] = s.value;
      });

      const aiProvider = aiSettings.ai_provider || "gemini";
      const apiKey = aiProvider === "gemini" ? aiSettings.gemini_api_key : aiSettings.chatgpt_api_key;

      if (!apiKey) {
        showMessage("error", `Vui lòng cấu hình API Key cho ${aiProvider}!`);
        setIsGeneratingAI(false);
        return;
      }

      const prompt = `
Tạo nội dung trang tĩnh về chủ đề: ${focusKeyword}

Trả về JSON:
{
  "title": "Tiêu đề trang",
  "excerpt": "Mô tả ngắn 100-150 ký tự",
  "content": "Nội dung HTML đầy đủ với H2, H3",
  "metaDescription": "Meta description 120-160 ký tự"
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
        const data = await res.json();
        const text = data.candidates?.[0]?.content?.parts?.[0]?.text || "";
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
        const data = await res.json();
        const text = data.choices?.[0]?.message?.content || "";
        const match = text.match(/```json\s*([\s\S]*?)(?:```|$)/);
        aiResponse = JSON.parse(match ? match[1].trim() : text);
      }

      if (aiResponse.title) setTitle(aiResponse.title);
      if (aiResponse.excerpt) setExcerpt(aiResponse.excerpt);
      if (aiResponse.content) setContent(aiResponse.content);
      if (aiResponse.metaDescription) setMetaDescription(aiResponse.metaDescription);
      if (!slug) setSlug(generateSlug(focusKeyword));

      showMessage("success", "Đã tạo nội dung thành công!");
    } catch (error: any) {
      showMessage("error", `Lỗi: ${error.message}`);
    } finally {
      setIsGeneratingAI(false);
    }
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();

    if (!title) {
      showMessage("error", "Vui lòng nhập tiêu đề");
      return;
    }

    create(
      {
        resource: "static-pages",
        values: {
          title,
          slug: slug || generateSlug(title),
          excerpt,
          content,
          metaTitle: metaTitle || title,
          metaDescription,
          metaKeywords,
          order: Number(order),
          isActive,
        },
      },
      {
        onSuccess: () => {
          showMessage("success", "Tạo trang thành công!");
          setTimeout(() => push("/static-pages"), 1000);
        },
        onError: (error: any) => {
          showMessage("error", error?.message || "Có lỗi xảy ra");
        }
      }
    );
  };

  return (
    <div className="space-y-6">
      {message && (
        <div className={`fixed top-20 right-4 z-50 px-4 py-3 rounded-md shadow-lg max-w-md ${message.type === "success" ? "bg-success text-white" :
          message.type === "error" ? "bg-destructive text-white" :
            message.type === "warning" ? "bg-warning text-white" : "bg-primary text-white"
          }`}>
          {message.text}
        </div>
      )}

      <div className="flex items-center gap-4">
        <Button variant="ghost" size="sm" onClick={goBack}>
          <ArrowLeft className="h-4 w-4 mr-2" />
          Quay lại
        </Button>
        <div>
          <h1 className="text-3xl font-bold flex items-center gap-2">
            <FileText className="h-8 w-8" />
            Tạo trang tĩnh
          </h1>
        </div>
      </div>

      <form onSubmit={handleSubmit}>
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          <div className="lg:col-span-2 space-y-6">
            {/* AI Box */}
            <Card>
              <CardHeader className="pb-3">
                <div className="flex items-center justify-between">
                  <CardTitle className="text-base flex items-center gap-2">
                    <Bot className="h-4 w-4 text-primary" />
                    AI Content Generator
                  </CardTitle>
                  <div className="flex items-center gap-2">
                    {AI_ENABLED ? (
                      <Button type="button" onClick={handleGenerateAI} disabled={isGeneratingAI || !focusKeyword} variant="default">
                        {isGeneratingAI ? <Loader2 className="h-4 w-4 mr-2 animate-spin" /> : <Zap className="h-4 w-4 mr-2" />}
                        Tạo nội dung AI
                      </Button>
                    ) : (
                      <AIButton>Tạo nội dung AI</AIButton>
                    )}
                  </div>
                </div>
              </CardHeader>
              <CardContent>
                <div className="relative">
                  <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                  <Input
                    value={focusKeyword}
                    onChange={(e) => setFocusKeyword(e.target.value)}
                    placeholder="Nhập chủ đề trang: Chính sách bảo hành, Liên hệ..."
                    className="pl-9 text-lg"
                  />
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardHeader><CardTitle>Thông tin trang</CardTitle></CardHeader>
              <CardContent className="space-y-4">
                <div className="space-y-2">
                  <Label>Tiêu đề *</Label>
                  <Input value={title} onChange={(e) => setTitle(e.target.value)} required />
                </div>
                <div className="space-y-2">
                  <Label>Slug</Label>
                  <Input value={slug} onChange={(e) => setSlug(e.target.value)} placeholder="Để trống để tự động tạo" />
                </div>
                <div className="space-y-2">
                  <Label>Mô tả ngắn</Label>
                  <Input value={excerpt} onChange={(e) => setExcerpt(e.target.value)} />
                </div>
                <div className="space-y-2">
                  <Label>Nội dung</Label>
                  <RichTextEditor value={content} onChange={setContent} height={400} />
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardHeader><CardTitle>SEO</CardTitle></CardHeader>
              <CardContent className="space-y-4">
                <div className="space-y-2">
                  <Label>Meta Title</Label>
                  <Input value={metaTitle} onChange={(e) => setMetaTitle(e.target.value)} />
                </div>
                <div className="space-y-2">
                  <Label>Meta Description</Label>
                  <Input value={metaDescription} onChange={(e) => setMetaDescription(e.target.value)} />
                </div>
                <div className="space-y-2">
                  <Label>Meta Keywords</Label>
                  <Input value={metaKeywords} onChange={(e) => setMetaKeywords(e.target.value)} />
                </div>
              </CardContent>
            </Card>
          </div>

          <div className="space-y-6">
            <Card>
              <CardHeader><CardTitle>Cài đặt</CardTitle></CardHeader>
              <CardContent className="space-y-4">
                <div className="space-y-2">
                  <Label>Thứ tự</Label>
                  <Input type="number" value={order} onChange={(e) => setOrder(Number(e.target.value))} min={0} />
                </div>
                <div className="flex items-center gap-3">
                  <Checkbox id="isActive" checked={isActive} onCheckedChange={(c) => setIsActive(!!c)} />
                  <Label htmlFor="isActive">Kích hoạt</Label>
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardContent className="pt-6">
                <Button type="submit" className="w-full" disabled={isLoading}>
                  {isLoading ? <Loader2 className="h-4 w-4 mr-2 animate-spin" /> : <Save className="h-4 w-4 mr-2" />}
                  Lưu trang
                </Button>
              </CardContent>
            </Card>
          </div>
        </div>
      </form>
    </div>
  );
};
