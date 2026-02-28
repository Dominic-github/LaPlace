import React, { useState } from 'react';
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
import { Tags, Loader2 } from 'lucide-react';
import axios from 'axios';

interface CreateTagModalProps {
  visible: boolean;
  onClose: () => void;
  onSuccess: (tag: any) => void;
}

export const CreateTagModal: React.FC<CreateTagModalProps> = ({
  visible,
  onClose,
  onSuccess,
}) => {
  const [name, setName] = useState('');
  const [slug, setSlug] = useState('');
  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState<{ type: 'success' | 'error'; text: string } | null>(null);

  const showMessage = (type: 'success' | 'error', text: string) => {
    setMessage({ type, text });
    setTimeout(() => setMessage(null), 3000);
  };

  const handleSubmit = async () => {
    if (!name || !slug) {
      showMessage('error', 'Vui lòng nhập đầy đủ thông tin');
      return;
    }

    try {
      setLoading(true);

      const token = localStorage.getItem('token');
      const response = await axios.post(
        'http://localhost:5002/api/post-tags',
        { name, slug },
        {
          headers: { Authorization: `Bearer ${token}` },
        }
      );

      showMessage('success', 'Tạo tag thành công!');
      resetForm();
      onSuccess(response.data.data);
      onClose();
    } catch (error: any) {
      console.error('Error creating tag:', error);
      showMessage('error', error.response?.data?.message || 'Có lỗi xảy ra khi tạo tag');
    } finally {
      setLoading(false);
    }
  };

  const resetForm = () => {
    setName('');
    setSlug('');
  };

  const handleCancel = () => {
    resetForm();
    onClose();
  };

  const handleNameChange = (value: string) => {
    setName(value);
    const generatedSlug = value
      .toLowerCase()
      .normalize('NFD')
      .replace(/[\u0300-\u036f]/g, '')
      .replace(/đ/g, 'd')
      .replace(/Đ/g, 'D')
      .replace(/[^a-z0-9\s-]/g, '')
      .replace(/\s+/g, '-')
      .replace(/-+/g, '-')
      .trim();
    setSlug(generatedSlug);
  };

  return (
    <Dialog open={visible} onClose={handleCancel}>
      {/* Toast Message */}
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
          <Tags className="h-5 w-5" />
          Thêm Tag mới
        </DialogTitle>
        <DialogDescription>Tạo tag bài viết mới</DialogDescription>
      </DialogHeader>

      <div className="space-y-4 py-4">
        <div className="space-y-2">
          <Label htmlFor="name">Tên tag *</Label>
          <Input
            id="name"
            value={name}
            onChange={(e) => handleNameChange(e.target.value)}
            placeholder="Ví dụ: React, TypeScript, SEO"
          />
        </div>

        <div className="space-y-2">
          <Label htmlFor="slug">Slug (URL) *</Label>
          <Input
            id="slug"
            value={slug}
            onChange={(e) => setSlug(e.target.value)}
            placeholder="react-typescript-seo"
          />
          <p className="text-xs text-muted-foreground">
            Tự động tạo từ tên, có thể chỉnh sửa
          </p>
        </div>
      </div>

      <DialogFooter>
        <Button variant="outline" onClick={handleCancel}>
          Hủy
        </Button>
        <Button onClick={handleSubmit} disabled={loading || !name || !slug}>
          {loading && <Loader2 className="h-4 w-4 mr-2 animate-spin" />}
          Tạo mới
        </Button>
      </DialogFooter>
    </Dialog>
  );
};
