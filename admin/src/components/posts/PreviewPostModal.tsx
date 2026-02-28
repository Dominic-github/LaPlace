import React from 'react';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import {
  Dialog,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog';
import { Eye, Calendar, User, Folder, Tags } from 'lucide-react';

interface PreviewPostModalProps {
  visible: boolean;
  onClose: () => void;
  data: {
    title?: string;
    content?: string;
    excerpt?: string;
    featuredImage?: string;
    categoryName?: string;
    tags?: string[];
    metaDescription?: string;
    metaKeywords?: string;
    focusKeyword?: string;
  };
}

export const PreviewPostModal: React.FC<PreviewPostModalProps> = ({
  visible,
  onClose,
  data,
}) => {
  const {
    title = 'Chưa có tiêu đề',
    content = '<p>Chưa có nội dung</p>',
    excerpt,
    featuredImage,
    categoryName,
    tags = [],
    metaDescription,
    metaKeywords,
    focusKeyword,
  } = data;

  return (
    <Dialog open={visible} onClose={onClose}>
      <DialogHeader>
        <DialogTitle className="flex items-center gap-2">
          <Eye className="h-5 w-5" />
          Xem trước bài viết
        </DialogTitle>
      </DialogHeader>

      <div className="max-h-[70vh] overflow-y-auto py-4">
        {/* Featured Image */}
        {featuredImage && (
          <div className="mb-6 rounded-lg overflow-hidden">
            <img src={featuredImage} alt={title} className="w-full h-auto" />
          </div>
        )}

        {/* Title */}
        <h1 className="text-2xl font-bold mb-4">{title}</h1>

        {/* Meta Info */}
        <div className="flex flex-wrap gap-4 text-sm text-muted-foreground mb-4">
          <span className="flex items-center gap-1">
            <Calendar className="h-4 w-4" />
            {new Date().toLocaleDateString('vi-VN')}
          </span>
          <span className="flex items-center gap-1">
            <User className="h-4 w-4" />
            Admin
          </span>
          {categoryName && (
            <span className="flex items-center gap-1">
              <Folder className="h-4 w-4" />
              {categoryName}
            </span>
          )}
        </div>

        {/* Excerpt */}
        {excerpt && (
          <div className="p-4 rounded-lg mb-6" style={{ backgroundColor: 'var(--color-muted)' }}>
            <strong className="text-sm">Tóm tắt:</strong>
            <p className="text-sm mt-1">{excerpt}</p>
          </div>
        )}

        <hr className="my-6" style={{ borderColor: 'var(--color-border)' }} />

        {/* Content */}
        <div
          className="prose prose-sm max-w-none"
          dangerouslySetInnerHTML={{ __html: content }}
        />

        {/* Tags */}
        {tags.length > 0 && (
          <>
            <hr className="my-6" style={{ borderColor: 'var(--color-border)' }} />
            <div>
              <div className="flex items-center gap-2 mb-2">
                <Tags className="h-4 w-4" />
                <strong className="text-sm">Tags:</strong>
              </div>
              <div className="flex flex-wrap gap-2">
                {tags.map((tag, index) => (
                  <Badge key={index} variant="default">{tag}</Badge>
                ))}
              </div>
            </div>
          </>
        )}

        {/* SEO Info */}
        {(metaDescription || metaKeywords || focusKeyword) && (
          <>
            <hr className="my-6" style={{ borderColor: 'var(--color-border)' }} />
            <div className="p-4 rounded-lg" style={{ backgroundColor: 'var(--color-muted)' }}>
              <h3 className="text-base font-semibold mb-3">📊 Thông tin SEO</h3>
              {focusKeyword && (
                <div className="mb-3">
                  <strong className="text-sm">Từ khóa chính:</strong>
                  <Badge variant="success" className="ml-2">{focusKeyword}</Badge>
                </div>
              )}
              {metaDescription && (
                <div className="mb-3">
                  <strong className="text-sm block">Meta Description:</strong>
                  <p className="text-sm text-muted-foreground mt-1">{metaDescription}</p>
                </div>
              )}
              {metaKeywords && (
                <div>
                  <strong className="text-sm block">Meta Keywords:</strong>
                  <p className="text-sm text-muted-foreground mt-1">{metaKeywords}</p>
                </div>
              )}
            </div>
          </>
        )}
      </div>

      <DialogFooter>
        <Button onClick={onClose}>Đóng</Button>
      </DialogFooter>
    </Dialog>
  );
};
