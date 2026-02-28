import React, { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import {
  Dialog,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog';
import { MediaManager } from '../media';
import { Image, Upload, Link, Trash2, FolderOpen, Loader2 } from 'lucide-react';
import axios from 'axios';

const API_URL = import.meta.env.VITE_API_URL || 'http://localhost:5002/api';

interface FeaturedImageBoxProps {
  imageUrl?: string;
  onImageChange?: (url: string) => void;
  onImageRemove?: () => void;
}

export const FeaturedImageBox: React.FC<FeaturedImageBoxProps> = ({
  imageUrl,
  onImageChange,
  onImageRemove,
}) => {
  const [isModalVisible, setIsModalVisible] = useState(false);
  const [inputUrl, setInputUrl] = useState('');
  const [uploading, setUploading] = useState(false);
  const [previewUrl, setPreviewUrl] = useState<string>('');
  const [activeTab, setActiveTab] = useState<'library' | 'upload' | 'url'>('library');
  const [message, setMessage] = useState<{ type: 'success' | 'error'; text: string } | null>(null);

  const showMessage = (type: 'success' | 'error', text: string) => {
    setMessage({ type, text });
    setTimeout(() => setMessage(null), 3000);
  };

  const handleSetImageFromUrl = () => {
    if (inputUrl && onImageChange) {
      onImageChange(inputUrl);
      setInputUrl('');
      setPreviewUrl('');
      setIsModalVisible(false);
    }
  };

  const handleUploadFile = async (file: File) => {
    try {
      setUploading(true);

      const formData = new FormData();
      formData.append('file', file);

      const token = localStorage.getItem('token');
      const response = await axios.post(`${API_URL}/upload/single`, formData, {
        headers: {
          'Content-Type': 'multipart/form-data',
          Authorization: `Bearer ${token}`,
        },
      });

      if (response.data.success) {
        const uploadedUrl = `http://localhost:5002${response.data.data.url}`;
        setPreviewUrl(uploadedUrl);
        if (onImageChange) {
          onImageChange(uploadedUrl);
        }
        showMessage('success', 'Upload ảnh thành công!');
        setIsModalVisible(false);
      }
    } catch (error: any) {
      console.error('Upload error:', error);
      showMessage('error', error.response?.data?.message || 'Upload ảnh thất bại!');
    } finally {
      setUploading(false);
    }
  };

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    const isImage = file.type.startsWith('image/');
    if (!isImage) {
      showMessage('error', 'Chỉ được upload file ảnh!');
      return;
    }

    const isLt5M = file.size / 1024 / 1024 < 5;
    if (!isLt5M) {
      showMessage('error', 'Ảnh phải nhỏ hơn 5MB!');
      return;
    }

    handleUploadFile(file);
    e.target.value = '';
  };

  const handleRemoveImage = () => {
    if (onImageRemove) {
      onImageRemove();
    }
    setPreviewUrl('');
  };

  const handleModalClose = () => {
    setIsModalVisible(false);
    setInputUrl('');
    setPreviewUrl('');
    setActiveTab('library');
  };

  const handleSelectFromLibrary = (media: any) => {
    const fullUrl = media.url.startsWith('http')
      ? media.url
      : `http://localhost:5002${media.url}`;

    if (onImageChange) {
      onImageChange(fullUrl);
    }
    setIsModalVisible(false);
    showMessage('success', 'Đã chọn ảnh từ thư viện');
  };

  return (
    <Card>
      {/* Toast Message */}
      {message && (
        <div
          className={`fixed top-4 right-4 z-50 px-4 py-2 rounded-md shadow-lg ${message.type === 'success' ? 'bg-success text-white' : 'bg-destructive text-white'
            }`}
        >
          {message.text}
        </div>
      )}

      <CardHeader className="pb-3">
        <CardTitle className="text-base flex items-center gap-2">
          <Image className="h-4 w-4" />
          Ảnh đại diện
        </CardTitle>
      </CardHeader>

      <CardContent className="space-y-3">
        {imageUrl ? (
          <>
            {/* Image Preview */}
            <div className="rounded-lg overflow-hidden border" style={{ borderColor: 'var(--color-border)' }}>
              <img
                src={imageUrl}
                alt="Featured"
                className="w-full h-auto object-cover"
              />
            </div>

            {/* Actions */}
            <div className="space-y-2">
              <Button
                variant="outline"
                onClick={() => setIsModalVisible(true)}
                className="w-full"
              >
                <Link className="h-4 w-4 mr-2" />
                Thay đổi ảnh
              </Button>
              <Button
                variant="destructive"
                onClick={handleRemoveImage}
                className="w-full"
              >
                <Trash2 className="h-4 w-4 mr-2" />
                Xóa ảnh
              </Button>
            </div>
          </>
        ) : (
          <>
            {/* Placeholder */}
            <div
              className="border-2 border-dashed rounded-lg p-8 text-center cursor-pointer hover:bg-accent/50 transition-colors"
              style={{ borderColor: 'var(--color-border)' }}
              onClick={() => setIsModalVisible(true)}
            >
              <Image className="h-12 w-12 mx-auto mb-2 text-muted-foreground" />
              <span className="text-sm text-muted-foreground">Chọn ảnh đại diện</span>
            </div>

            <Button
              onClick={() => setIsModalVisible(true)}
              className="w-full"
            >
              <Upload className="h-4 w-4 mr-2" />
              Thêm ảnh đại diện
            </Button>
          </>
        )}

        {/* Help Text */}
        <p className="text-xs text-muted-foreground italic">
          💡 Kích thước đề xuất: 1200x630px
        </p>
      </CardContent>

      {/* Modal for Upload/URL Input */}
      <Dialog open={isModalVisible} onClose={handleModalClose} className="max-w-6xl w-[90vw]">
        <DialogHeader>
          <DialogTitle>Thêm ảnh đại diện</DialogTitle>
          <DialogDescription>Chọn ảnh từ thư viện, upload mới hoặc nhập URL</DialogDescription>
        </DialogHeader>

        {/* Tabs */}
        <div className="flex border-b mb-4" style={{ borderColor: 'var(--color-border)' }}>
          <button
            onClick={() => setActiveTab('library')}
            className={`flex-1 py-2 px-4 text-sm font-medium ${activeTab === 'library' ? 'border-b-2 border-primary text-primary' : 'text-muted-foreground'
              }`}
          >
            <FolderOpen className="h-4 w-4 inline mr-2" />
            Thư viện ảnh
          </button>
          <button
            onClick={() => setActiveTab('upload')}
            className={`flex-1 py-2 px-4 text-sm font-medium ${activeTab === 'upload' ? 'border-b-2 border-primary text-primary' : 'text-muted-foreground'
              }`}
          >
            <Upload className="h-4 w-4 inline mr-2" />
            Upload từ máy
          </button>
          <button
            onClick={() => setActiveTab('url')}
            className={`flex-1 py-2 px-4 text-sm font-medium ${activeTab === 'url' ? 'border-b-2 border-primary text-primary' : 'text-muted-foreground'
              }`}
          >
            <Link className="h-4 w-4 inline mr-2" />
            Nhập URL
          </button>
        </div>

        {/* Tab Content */}
        <div className="min-h-[500px]">
          {activeTab === 'library' && (
            <MediaManager
              onSelect={handleSelectFromLibrary}
              selectable={true}
              multiple={false}
              showFolderTree={true}
              compact={false}
            />
          )}

          {activeTab === 'upload' && (
            <div className="py-4">
              <div
                className="border-2 border-dashed rounded-lg p-12 text-center cursor-pointer hover:bg-accent/50 transition-colors"
                style={{ borderColor: 'var(--color-border)' }}
              >
                <input
                  type="file"
                  id="featured-image-upload"
                  accept="image/*"
                  className="hidden"
                  onChange={handleFileChange}
                  disabled={uploading}
                />
                <label htmlFor="featured-image-upload" className="cursor-pointer">
                  {uploading ? (
                    <Loader2 className="h-12 w-12 mx-auto mb-4 text-primary animate-spin" />
                  ) : (
                    <Upload className="h-12 w-12 mx-auto mb-4 text-muted-foreground" />
                  )}
                  <p className="text-base font-medium">
                    {uploading ? 'Đang upload...' : 'Click để chọn ảnh'}
                  </p>
                  <p className="text-sm text-muted-foreground mt-1">
                    Hỗ trợ: JPG, PNG, WebP, GIF. Tối đa 5MB
                  </p>
                </label>
              </div>

              {previewUrl && !uploading && (
                <div className="mt-4">
                  <Label className="block mb-2">Xem trước:</Label>
                  <img
                    src={previewUrl}
                    alt="Preview"
                    className="w-full rounded-lg"
                  />
                </div>
              )}
            </div>
          )}

          {activeTab === 'url' && (
            <div className="py-4 space-y-4">
              <div className="space-y-2">
                <Label>URL ảnh:</Label>
                <div className="relative">
                  <Link className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                  <Input
                    placeholder="https://example.com/image.jpg"
                    value={inputUrl}
                    onChange={(e) => setInputUrl(e.target.value)}
                    className="pl-9"
                  />
                </div>
              </div>

              {inputUrl && (
                <div>
                  <Label className="block mb-2">Xem trước:</Label>
                  <img
                    src={inputUrl}
                    alt="Preview"
                    className="w-full rounded-lg"
                    onError={(e) => {
                      (e.target as HTMLImageElement).src = 'data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAAAEAAAABCAYAAAAfFcSJAAAADUlEQVR42mNk+M9QDwADhgGAWjR9awAAAABJRU5ErkJggg==';
                    }}
                  />
                </div>
              )}

              <Button onClick={handleSetImageFromUrl} disabled={!inputUrl} className="w-full">
                Thêm ảnh
              </Button>
            </div>
          )}
        </div>

        {activeTab !== 'url' && (
          <DialogFooter>
            <Button variant="outline" onClick={handleModalClose}>
              Hủy
            </Button>
          </DialogFooter>
        )}
      </Dialog>
    </Card>
  );
};
