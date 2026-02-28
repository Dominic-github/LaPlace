import { useState, useEffect, useRef } from "react";
import { useList } from "@refinedev/core";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Separator } from "@/components/ui/separator";
import { Save, RefreshCw, Loader2, Upload, X, Image as ImageIcon } from "lucide-react";
import { cn } from "@/lib/utils";

const API_URL = import.meta.env.VITE_API_URL || "http://localhost:5003/api";
const BACKEND_URL = API_URL.replace('/api', '');

// Helper to get full image URL
const getFullImageUrl = (url: string) => {
  if (!url) return '';
  if (url.startsWith('http')) return url;
  return `${BACKEND_URL}${url}`;
};

// Timezones
const TIMEZONES = [
  { value: 'Asia/Ho_Chi_Minh', label: 'Việt Nam (GMT+7)' },
  { value: 'Asia/Bangkok', label: 'Bangkok (GMT+7)' },
  { value: 'Asia/Singapore', label: 'Singapore (GMT+8)' },
  { value: 'Asia/Tokyo', label: 'Tokyo (GMT+9)' },
  { value: 'Asia/Seoul', label: 'Seoul (GMT+9)' },
  { value: 'Asia/Shanghai', label: 'Shanghai (GMT+8)' },
  { value: 'Europe/London', label: 'London (GMT+0)' },
  { value: 'Europe/Paris', label: 'Paris (GMT+1)' },
  { value: 'America/New_York', label: 'New York (GMT-5)' },
  { value: 'America/Los_Angeles', label: 'Los Angeles (GMT-8)' },
];

const LANGUAGES = [
  { value: 'vi', label: '🇻🇳 Tiếng Việt' },
  { value: 'en', label: '🇬🇧 English' },
  { value: 'zh', label: '🇨🇳 中文' },
  { value: 'ja', label: '🇯🇵 日本語' },
  { value: 'ko', label: '🇰🇷 한국어' },
];

// Tab configuration - Updated for Real Estate
const TABS = [
  { key: 'general', label: '🏠 Cấu hình chung' },
  { key: 'listing', label: '📋 Tin đăng' },
  { key: 'vip', label: '⭐ Gói VIP' },
  { key: 'broker', label: '🎫 Môi giới' },
  { key: 'payment', label: '💰 Thanh toán' },
  { key: 'seo', label: '🔍 SEO' },
  { key: 'social', label: '📱 Social' },
  { key: 'email', label: '📧 Email' },
];

export const GeneralConfig = () => {
  const [formData, setFormData] = useState<Record<string, string>>({});
  const [loading, setLoading] = useState(false);
  const [activeTab, setActiveTab] = useState("general");
  const [saveSuccess, setSaveSuccess] = useState(false);

  // Fetch all settings
  const { data: settingsData, isLoading, refetch } = useList({
    resource: "settings",
    pagination: {
      current: 1,
      pageSize: 1000,
    },
  });

  const settings = settingsData?.data || [];

  // Group settings by group
  const groupedSettings = settings.reduce((acc: Record<string, any[]>, setting: any) => {
    const group = setting.group || "general";
    if (!acc[group]) acc[group] = [];
    acc[group].push(setting);
    return acc;
  }, {});

  // Load settings into form when data changes
  useEffect(() => {
    if (settings.length > 0) {
      const newFormData: Record<string, string> = {};
      settings.forEach((setting: any) => {
        newFormData[setting.key] = setting.value || "";
      });
      setFormData(newFormData);
    }
  }, [settings]);

  // Handle input change
  const handleChange = (key: string, value: string) => {
    setFormData(prev => ({ ...prev, [key]: value }));
  };

  // Handle save
  const handleSave = async () => {
    try {
      setLoading(true);
      setSaveSuccess(false);

      const response = await fetch(`${API_URL}/settings/bulk`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${localStorage.getItem('token')}`,
        },
        body: JSON.stringify({ settings: formData }),
      });

      if (response.ok) {
        setSaveSuccess(true);
        refetch();
        setTimeout(() => setSaveSuccess(false), 3000);
      }
    } catch (error) {
      console.error('Failed to save settings:', error);
    } finally {
      setLoading(false);
    }
  };

  // Handle image upload
  const handleImageUpload = async (key: string, file: File) => {
    try {
      const formData = new FormData();
      formData.append('file', file);
      formData.append('folder', 'settings');

      const response = await fetch(`${API_URL}/upload/single`, {
        method: 'POST',
        headers: {
          'Authorization': `Bearer ${localStorage.getItem('token')}`,
        },
        body: formData,
      });

      const data = await response.json();
      if (data.success && data.data?.url) {
        handleChange(key, data.data.url);
      } else {
        alert('Upload failed: ' + (data.message || 'Unknown error'));
      }
    } catch (error) {
      console.error('Upload error:', error);
      alert('Upload failed. Please try again.');
    }
  };

  const renderFormFields = (group: string) => {
    const groupSettings = groupedSettings[group] || [];

    if (groupSettings.length === 0) {
      return (
        <div className="text-center py-8 text-muted-foreground">
          Chưa có cấu hình nào trong nhóm này
        </div>
      );
    }

    return (
      <div className="space-y-6">
        {groupSettings.map((setting: any) => {
          const isTextarea = setting.type === 'textarea' || setting.type === 'json';
          const isPassword = setting.type === 'password' || setting.key.includes('api_key') || setting.key.includes('password');
          const isSelect = setting.type === 'select' || setting.key === 'timezone' || setting.key === 'language';
          const isBoolean = setting.type === 'boolean';
          const isImage = setting.type === 'image' || setting.key.includes('logo') || setting.key.includes('favicon') || setting.key.includes('image');

          return (
            <div key={setting.key} className="space-y-2">
              <Label htmlFor={setting.key} className="text-sm font-medium">
                {setting.label || setting.key}
              </Label>

              {isImage ? (
                <div className="space-y-3">
                  {/* Preview */}
                  {formData[setting.key] && (
                    <div className="relative inline-block">
                      <img
                        src={getFullImageUrl(formData[setting.key])}
                        alt={setting.label || setting.key}
                        className="h-20 w-auto object-contain border rounded-md bg-black/5 p-2"
                        onError={(e) => (e.currentTarget.style.display = 'none')}
                      />
                      <button
                        type="button"
                        onClick={() => handleChange(setting.key, '')}
                        className="absolute -top-2 -right-2 bg-red-500 text-white rounded-full p-1 hover:bg-red-600"
                      >
                        <X size={14} />
                      </button>
                    </div>
                  )}

                  {/* Upload area */}
                  <div
                    className="border-2 border-dashed rounded-lg p-6 text-center hover:border-primary transition-colors cursor-pointer"
                    onClick={() => {
                      const input = document.createElement('input');
                      input.type = 'file';
                      input.accept = 'image/*';
                      input.onchange = (e) => {
                        const file = (e.target as HTMLInputElement).files?.[0];
                        if (file) handleImageUpload(setting.key, file);
                      };
                      input.click();
                    }}
                    onDragOver={(e) => {
                      e.preventDefault();
                      e.currentTarget.classList.add('border-primary');
                    }}
                    onDragLeave={(e) => {
                      e.currentTarget.classList.remove('border-primary');
                    }}
                    onDrop={(e) => {
                      e.preventDefault();
                      e.currentTarget.classList.remove('border-primary');
                      const file = e.dataTransfer.files?.[0];
                      if (file && file.type.startsWith('image/')) {
                        handleImageUpload(setting.key, file);
                      }
                    }}
                  >
                    <ImageIcon className="h-8 w-8 mx-auto text-muted-foreground mb-2" />
                    <p className="text-sm text-muted-foreground">
                      Kéo thả hoặc click để upload ảnh
                    </p>
                    <p className="text-xs text-muted-foreground mt-1">
                      PNG, JPG, GIF, SVG (Max 2MB)
                    </p>
                  </div>

                  {/* Or enter URL */}
                  <div className="flex items-center gap-2">
                    <span className="text-xs text-muted-foreground">Hoặc nhập URL:</span>
                    <Input
                      type="url"
                      value={formData[setting.key] || ''}
                      onChange={(e) => handleChange(setting.key, e.target.value)}
                      placeholder="https://example.com/logo.png"
                      className="flex-1"
                    />
                  </div>
                </div>
              ) : isSelect && setting.key === 'timezone' ? (
                <select
                  id={setting.key}
                  value={formData[setting.key] || ''}
                  onChange={(e) => handleChange(setting.key, e.target.value)}
                  className="flex h-10 w-full rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring"
                >
                  <option value="">-- Chọn múi giờ --</option>
                  {TIMEZONES.map(tz => (
                    <option key={tz.value} value={tz.value}>{tz.label}</option>
                  ))}
                </select>
              ) : isSelect && setting.key === 'language' ? (
                <select
                  id={setting.key}
                  value={formData[setting.key] || ''}
                  onChange={(e) => handleChange(setting.key, e.target.value)}
                  className="flex h-10 w-full rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring"
                >
                  <option value="">-- Chọn ngôn ngữ --</option>
                  {LANGUAGES.map(lang => (
                    <option key={lang.value} value={lang.value}>{lang.label}</option>
                  ))}
                </select>
              ) : isBoolean ? (
                <div className="flex items-center gap-3">
                  <input
                    type="checkbox"
                    id={setting.key}
                    checked={formData[setting.key] === 'true'}
                    onChange={(e) => handleChange(setting.key, e.target.checked ? 'true' : 'false')}
                    className="h-4 w-4 rounded border-input"
                  />
                  <span className="text-sm text-muted-foreground">{setting.description}</span>
                </div>
              ) : isTextarea ? (
                <textarea
                  id={setting.key}
                  value={formData[setting.key] || ''}
                  onChange={(e) => handleChange(setting.key, e.target.value)}
                  placeholder={setting.description}
                  rows={4}
                  className="flex w-full rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring"
                />
              ) : (
                <Input
                  id={setting.key}
                  type={isPassword ? 'password' : setting.type === 'number' ? 'number' : 'text'}
                  value={formData[setting.key] || ''}
                  onChange={(e) => handleChange(setting.key, e.target.value)}
                  placeholder={setting.description}
                />
              )}

              {setting.description && !isBoolean && (
                <p className="text-xs text-muted-foreground">{setting.description}</p>
              )}
            </div>
          );
        })}
      </div>
    );
  };

  if (isLoading) {
    return (
      <div className="flex items-center justify-center h-64">
        <Loader2 className="h-8 w-8 animate-spin text-primary" />
      </div>
    );
  }

  // Get available tabs based on settings
  const availableTabs = TABS.filter(tab => groupedSettings[tab.key]?.length > 0);

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold">Cấu hình hệ thống</h1>
          <p className="text-muted-foreground mt-1">Quản lý các cài đặt chung của hệ thống</p>
        </div>
        <div className="flex gap-2">
          <Button variant="outline" onClick={() => refetch()}>
            <RefreshCw className="h-4 w-4 mr-2" />
            Làm mới
          </Button>
          <Button onClick={handleSave} disabled={loading}>
            {loading ? (
              <Loader2 className="h-4 w-4 mr-2 animate-spin" />
            ) : (
              <Save className="h-4 w-4 mr-2" />
            )}
            Lưu cấu hình
          </Button>
        </div>
      </div>

      {saveSuccess && (
        <div className="bg-green-500/10 border border-green-500/20 text-green-500 px-4 py-3 rounded-md">
          ✅ Lưu cấu hình thành công!
        </div>
      )}

      {settings.length === 0 ? (
        <Card>
          <CardContent className="py-12 text-center">
            <p className="text-muted-foreground mb-4">
              Chưa có cấu hình nào. Vui lòng chạy seed để tạo dữ liệu mẫu.
            </p>
            <code className="bg-muted px-3 py-2 rounded text-sm">
              docker-compose exec -T backend npm run seed:system-settings
            </code>
          </CardContent>
        </Card>
      ) : (
        <div className="flex gap-6">
          {/* Sidebar Tabs */}
          <div className="w-56 shrink-0">
            <div className="space-y-1">
              {availableTabs.map((tab) => (
                <button
                  key={tab.key}
                  onClick={() => setActiveTab(tab.key)}
                  className={cn(
                    "w-full text-left px-4 py-3 rounded-lg text-sm font-medium transition-colors",
                    activeTab === tab.key
                      ? "bg-primary text-primary-foreground"
                      : "hover:bg-accent text-muted-foreground hover:text-foreground"
                  )}
                >
                  {tab.label}
                </button>
              ))}
            </div>
          </div>

          {/* Content Area */}
          <Card className="flex-1">
            <CardHeader>
              <CardTitle>
                {availableTabs.find(t => t.key === activeTab)?.label || activeTab}
              </CardTitle>
              <CardDescription>
                Cấu hình các thông số cho nhóm {activeTab}
              </CardDescription>
            </CardHeader>
            <CardContent>
              {renderFormFields(activeTab)}
            </CardContent>
          </Card>
        </div>
      )}
    </div>
  );
};
