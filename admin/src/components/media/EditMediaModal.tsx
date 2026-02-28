import React, { useState, useEffect } from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import {
  Dialog,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog';
import { Pencil, Loader2 } from 'lucide-react';
import axios from 'axios';

const API_URL = import.meta.env.VITE_API_URL || 'http://localhost:5003/api';

interface EditMediaModalProps {
  visible: boolean;
  media: any | null;
  onClose: () => void;
  onSuccess: () => void;
}

export const EditMediaModal: React.FC<EditMediaModalProps> = ({
  visible,
  media,
  onClose,
  onSuccess,
}) => {
  const [alt, setAlt] = useState('');
  const [caption, setCaption] = useState('');
  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState<{ type: 'success' | 'error'; text: string } | null>(null);

  useEffect(() => {
    if (media) {
      setAlt(media.alt || '');
      setCaption(media.caption || '');
    }
  }, [media]);

  const showMessage = (type: 'success' | 'error', text: string) => {
    setMessage({ type, text });
    setTimeout(() => setMessage(null), 3000);
  };

  const handleSubmit = async () => {
    try {
      setLoading(true);

      const token = localStorage.getItem('token');
      await axios.put(
        `${API_URL}/media/${media.id}`,
        { alt, caption },
        { headers: { Authorization: `Bearer ${token}` } }
      );

      showMessage('success', 'Cập nhật thông tin ảnh thành công!');
      onSuccess();
      onClose();
    } catch (error: any) {
      console.error('Error updating media:', error);
      showMessage('error', 'Không thể cập nhật thông tin ảnh');
    } finally {
      setLoading(false);
    }
  };

  const handleCancel = () => {
    setAlt('');
    setCaption('');
    onClose();
  };

  if (!media) return null;

  const baseUrl = API_URL.replace('/api', '');
  const imageUrl = media.url.startsWith('http')
    ? media.url
    : `${baseUrl}${media.url}`;

  const isImage = media.mimeType?.startsWith('image/');

  return (
    <Dialog open={visible} onClose={handleCancel}>
      {/* Message Toast */}
      {message && (
        <div
          className={`fixed top-4 right-4 z-50 px-4 py-2 rounded-md shadow-lg ${message.type === 'success' ? 'bg-success text-white' : 'bg-destructive text-white'
            }`}
        >
          {message.text}
        </div>
      )}

      <DialogHeader>
        <DialogTitle className="flex items-center gap-2">
          <Pencil className="h-5 w-5" />
          Chỉnh sửa thông tin ảnh
        </DialogTitle>
        <DialogDescription>
          Cập nhật thông tin SEO và metadata cho ảnh
        </DialogDescription>
      </DialogHeader>

      <div className="space-y-4 px-6 py-4">
        {/* Image Preview */}
        {isImage && (
          <div className="rounded-lg overflow-hidden border" style={{ borderColor: 'var(--color-border)' }}>
            <img
              src={imageUrl}
              alt={media.alt || media.originalName}
              className="w-full max-h-60 object-contain"
              style={{ backgroundColor: 'var(--color-muted)' }}
            />
          </div>
        )}

        {/* Filename (readonly) */}
        <div className="space-y-2">
          <Label>Tên file</Label>
          <Input value={media.filename} disabled />
        </div>

        {/* Alt Text */}
        <div className="space-y-2">
          <Label htmlFor="alt">Alt Text (Văn bản thay thế)</Label>
          <Input
            id="alt"
            value={alt}
            onChange={(e) => setAlt(e.target.value)}
            placeholder="Nhập mô tả ảnh..."
          />
          <p className="text-xs text-muted-foreground">
            Mô tả ảnh cho SEO và accessibility. Ví dụ: 'Laptop Dell XPS 13 màu bạc'
          </p>
        </div>

        {/* Caption */}
        <div className="space-y-2">
          <Label htmlFor="caption">Caption (Chú thích)</Label>
          <Textarea
            id="caption"
            value={caption}
            onChange={(e) => setCaption(e.target.value)}
            placeholder="Nhập chú thích cho ảnh..."
            rows={3}
          />
          <p className="text-xs text-muted-foreground">
            Chú thích hiển thị dưới ảnh (tùy chọn)
          </p>
        </div>

        {/* File Info */}
        <div className="p-3 rounded-lg text-sm space-y-1" style={{ backgroundColor: 'var(--color-muted)' }}>
          <p>
            <strong>Kích thước:</strong> {(media.size / 1024).toFixed(1)} KB
          </p>
          <p>
            <strong>Loại:</strong> {media.mimeType}
          </p>
          <p>
            <strong>Ngày tải lên:</strong> {new Date(media.createdAt).toLocaleString('vi-VN')}
          </p>
        </div>
      </div>

      <DialogFooter>
        <Button variant="outline" onClick={handleCancel}>
          Hủy
        </Button>
        <Button onClick={handleSubmit} disabled={loading}>
          {loading && <Loader2 className="h-4 w-4 mr-2 animate-spin" />}
          Lưu
        </Button>
      </DialogFooter>
    </Dialog>
  );
};
