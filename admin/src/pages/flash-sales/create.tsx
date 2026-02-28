import { useState } from "react";
import { useCreate, useNavigation, useList } from "@refinedev/core";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Select } from "@/components/ui/select";
import { ArrowLeft, Save, Loader2, Zap, Bot, Search } from "lucide-react";
import { AIButton } from "@/components/ui/ai-coming-soon";
import axios from "axios";

const AI_ENABLED = false;

export const FlashSaleCreate = () => {
  const { push, goBack } = useNavigation();
  const { mutate: create, isLoading } = useCreate();

  // Form state
  const [name, setName] = useState("");
  const [description, setDescription] = useState("");
  const [startDate, setStartDate] = useState("");
  const [endDate, setEndDate] = useState("");
  const [status, setStatus] = useState("UPCOMING");
  const [discountPercent, setDiscountPercent] = useState<number>(0);

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
      showMessage("warning", "Vui lòng nhập từ khóa chính trước!");
      return;
    }

    setIsGeneratingAI(true);
    showMessage("info", "Đang tạo nội dung Flash Sale bằng AI...");

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
Bạn là chuyên gia marketing e-commerce. Hãy tạo nội dung cho chương trình Flash Sale với các yêu cầu:

**Từ khóa/Chủ đề:** ${focusKeyword}

**Yêu cầu:**
1. Tên chương trình hấp dẫn, thu hút
2. Mô tả ngắn gọn về chương trình
3. Viết bằng tiếng Việt, có tính marketing cao

Trả về JSON:
{
  "name": "Tên Flash Sale",
  "description": "Mô tả chương trình"
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
              temperature: 0.8,
              maxOutputTokens: 1000
            }
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
              { role: "system", content: "You are a marketing expert." },
              { role: "user", content: prompt }
            ],
            temperature: 0.8,
            max_tokens: 1000
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
      showMessage("error", "Vui lòng nhập tên chương trình");
      return;
    }

    if (!startDate || !endDate) {
      showMessage("error", "Vui lòng chọn thời gian bắt đầu và kết thúc");
      return;
    }

    create(
      {
        resource: "flash-sales",
        values: {
          name,
          description,
          startDate: new Date(startDate).toISOString(),
          endDate: new Date(endDate).toISOString(),
          status,
          discountPercent: Number(discountPercent),
        },
      },
      {
        onSuccess: () => {
          showMessage("success", "Tạo Flash Sale thành công!");
          setTimeout(() => push("/flash-sales"), 1000);
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
            <Zap className="h-8 w-8 text-yellow-500" />
            Tạo Flash Sale mới
          </h1>
          <p className="text-muted-foreground mt-1">
            Tạo chương trình flash sale khuyến mãi
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
                  <Label>Từ khóa/Chủ đề</Label>
                  <div className="relative">
                    <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                    <Input
                      value={focusKeyword}
                      onChange={(e) => setFocusKeyword(e.target.value)}
                      placeholder="Ví dụ: Black Friday, 11.11, Tết Nguyên Đán"
                      className="pl-9 text-lg"
                    />
                  </div>
                </div>
              </CardContent>
            </Card>

            {/* Basic Info */}
            <Card>
              <CardHeader>
                <CardTitle>Thông tin chương trình</CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="space-y-2">
                  <Label htmlFor="name">Tên chương trình *</Label>
                  <Input
                    id="name"
                    value={name}
                    onChange={(e) => setName(e.target.value)}
                    placeholder="Ví dụ: Flash Sale 11/11"
                    required
                  />
                </div>

                <div className="space-y-2">
                  <Label htmlFor="description">Mô tả</Label>
                  <Textarea
                    id="description"
                    value={description}
                    onChange={(e) => setDescription(e.target.value)}
                    placeholder="Mô tả về chương trình flash sale..."
                    rows={4}
                  />
                </div>

                <div className="grid grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <Label htmlFor="startDate">Ngày bắt đầu *</Label>
                    <Input
                      id="startDate"
                      type="datetime-local"
                      value={startDate}
                      onChange={(e) => setStartDate(e.target.value)}
                      required
                    />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="endDate">Ngày kết thúc *</Label>
                    <Input
                      id="endDate"
                      type="datetime-local"
                      value={endDate}
                      onChange={(e) => setEndDate(e.target.value)}
                      required
                    />
                  </div>
                </div>

                <div className="space-y-2">
                  <Label htmlFor="discountPercent">Giảm giá mặc định (%)</Label>
                  <Input
                    id="discountPercent"
                    type="number"
                    value={discountPercent}
                    onChange={(e) => setDiscountPercent(Number(e.target.value))}
                    min={0}
                    max={100}
                    placeholder="0"
                  />
                  <p className="text-xs text-muted-foreground">
                    Có thể tùy chỉnh giảm giá cho từng sản phẩm sau khi tạo
                  </p>
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
              <CardContent>
                <Select
                  value={status}
                  onChange={(e) => setStatus(e.target.value)}
                >
                  <option value="UPCOMING">Sắp diễn ra</option>
                  <option value="ACTIVE">Đang diễn ra</option>
                  <option value="ENDED">Đã kết thúc</option>
                </Select>
              </CardContent>
            </Card>

            <Card>
              <CardContent className="pt-6">
                <div className="p-3 rounded-lg mb-4" style={{ backgroundColor: 'var(--color-muted)' }}>
                  <p className="text-sm">
                    💡 Sau khi tạo, bạn có thể thêm sản phẩm vào flash sale trong trang chỉnh sửa
                  </p>
                </div>
                <Button type="submit" className="w-full" disabled={isLoading}>
                  {isLoading ? (
                    <Loader2 className="h-4 w-4 mr-2 animate-spin" />
                  ) : (
                    <Save className="h-4 w-4 mr-2" />
                  )}
                  Tạo Flash Sale
                </Button>
              </CardContent>
            </Card>
          </div>
        </div>
      </form>
    </div>
  );
};
