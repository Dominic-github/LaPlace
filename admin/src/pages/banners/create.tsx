import { useState } from "react";
import { useCreate, useNavigation } from "@refinedev/core";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Select } from "@/components/ui/select";
import { Checkbox } from "@/components/ui/checkbox";
import { FeaturedImageBox } from "../../components/posts";
import { ArrowLeft, Save, Loader2, ImageIcon, Bot, Zap, Search } from "lucide-react";
import { AIButton } from "@/components/ui/ai-coming-soon";
import axios from "axios";

const AI_ENABLED = false;

export const BannerCreate = () => {
  const { push, goBack } = useNavigation();
  const { mutate: create, isLoading } = useCreate();

  // Form state
  const [title, setTitle] = useState("");
  const [description, setDescription] = useState("");
  const [image, setImage] = useState("");
  const [link, setLink] = useState("");
  const [position, setPosition] = useState("HOME_MAIN");
  const [order, setOrder] = useState(0);
  const [startDate, setStartDate] = useState("");
  const [endDate, setEndDate] = useState("");
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

  // Generate AI content
  const handleGenerateAI = async () => {
    if (!AI_ENABLED) return;
    if (!focusKeyword || focusKeyword.trim() === "") {
      showMessage("warning", "Vui lòng nhập mô tả banner trước!");
      return;
    }

    setIsGeneratingAI(true);
    showMessage("info", "Đang tạo nội dung banner bằng AI...");

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
        showMessage("error", `Vui lòng cấu hình API Key cho ${aiProvider}!`);
        setIsGeneratingAI(false);
        return;
      }

      const prompt = `
Bạn là copywriter chuyên nghiệp. Tạo nội dung banner quảng cáo cho chủ đề:

**Chủ đề:** ${focusKeyword}

**Yêu cầu:**
1. Tiêu đề ngắn gọn, thu hút (tối đa 50 ký tự)
2. Mô tả hấp dẫn (tối đa 100 ký tự)
3. Viết bằng tiếng Việt, có tính marketing cao

Trả về JSON:
{
  "title": "Tiêu đề banner",
  "description": "Mô tả ngắn"
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
            generationConfig: { temperature: 0.9, maxOutputTokens: 500 }
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
              { role: "system", content: "You are a professional copywriter." },
              { role: "user", content: prompt }
            ],
            temperature: 0.9,
            max_tokens: 500
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

      if (aiResponse.title) setTitle(aiResponse.title);
      if (aiResponse.description) setDescription(aiResponse.description);

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

    if (!title) {
      showMessage("error", "Vui lòng nhập tiêu đề");
      return;
    }

    if (!image) {
      showMessage("error", "Vui lòng chọn ảnh banner");
      return;
    }

    create(
      {
        resource: "banners",
        values: {
          title,
          description,
          image,
          link,
          position,
          order: Number(order),
          startDate: startDate ? new Date(startDate).toISOString() : null,
          endDate: endDate ? new Date(endDate).toISOString() : null,
          isActive,
        },
      },
      {
        onSuccess: () => {
          showMessage("success", "Tạo banner thành công!");
          setTimeout(() => push("/banners"), 1000);
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
            <ImageIcon className="h-8 w-8" />
            Thêm banner mới
          </h1>
          <p className="text-muted-foreground mt-1">
            Tạo banner quảng cáo mới
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
                  <Label>Mô tả ngắn về banner</Label>
                  <div className="relative">
                    <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                    <Input
                      value={focusKeyword}
                      onChange={(e) => setFocusKeyword(e.target.value)}
                      placeholder="Ví dụ: Giảm giá 50% Black Friday, Khuyến mãi Tết"
                      className="pl-9 text-lg"
                    />
                  </div>
                </div>
              </CardContent>
            </Card>

            {/* Basic Info */}
            <Card>
              <CardHeader>
                <CardTitle>Thông tin banner</CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="space-y-2">
                  <Label htmlFor="title">Tiêu đề *</Label>
                  <Input
                    id="title"
                    value={title}
                    onChange={(e) => setTitle(e.target.value)}
                    placeholder="Tiêu đề banner"
                    required
                  />
                </div>

                <div className="space-y-2">
                  <Label htmlFor="description">Mô tả</Label>
                  <Textarea
                    id="description"
                    value={description}
                    onChange={(e) => setDescription(e.target.value)}
                    placeholder="Mô tả ngắn..."
                    rows={3}
                  />
                </div>

                <div className="space-y-2">
                  <Label htmlFor="link">Link</Label>
                  <Input
                    id="link"
                    value={link}
                    onChange={(e) => setLink(e.target.value)}
                    placeholder="https://example.com/promotion"
                  />
                </div>

                <div className="grid grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <Label htmlFor="position">Vị trí hiển thị</Label>
                    <Select
                      id="position"
                      value={position}
                      onChange={(e) => setPosition(e.target.value)}
                    >
                      <option value="HOME_MAIN">Trang chủ - Chính</option>
                      <option value="HOME_SECONDARY">Trang chủ - Phụ</option>
                      <option value="CATEGORY">Danh mục</option>
                      <option value="PRODUCT">Sản phẩm</option>
                      <option value="SIDEBAR">Sidebar</option>
                    </Select>
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="order">Thứ tự hiển thị</Label>
                    <Input
                      id="order"
                      type="number"
                      value={order}
                      onChange={(e) => setOrder(Number(e.target.value))}
                      min={0}
                    />
                  </div>
                </div>

                <div className="grid grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <Label htmlFor="startDate">Ngày bắt đầu</Label>
                    <Input
                      id="startDate"
                      type="datetime-local"
                      value={startDate}
                      onChange={(e) => setStartDate(e.target.value)}
                    />
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="endDate">Ngày kết thúc</Label>
                    <Input
                      id="endDate"
                      type="datetime-local"
                      value={endDate}
                      onChange={(e) => setEndDate(e.target.value)}
                    />
                  </div>
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
                  <Label htmlFor="isActive" className="cursor-pointer">Hoạt động</Label>
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
                  Lưu banner
                </Button>
              </CardContent>
            </Card>
          </div>
        </div>
      </form>
    </div>
  );
};
