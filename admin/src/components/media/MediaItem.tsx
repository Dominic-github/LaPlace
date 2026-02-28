import React, { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import {
  Dialog,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog';
import { DocumentViewer } from './DocumentViewer';
import {
  Trash2,
  Pencil,
  Eye,
  CheckCircle,
  Image as ImageIcon,
  Copy,
  FileText,
  FileVideo,
  File,
} from 'lucide-react';

interface MediaItemProps {
  media: {
    id: string;
    filename: string;
    originalName: string;
    url: string;
    mimeType: string;
    size: number;
    alt?: string;
    caption?: string;
    createdAt: string;
  };
  selected?: boolean;
  onSelect?: (id: string) => void;
  onDelete?: (id: string) => void;
  onEdit?: (media: any) => void;
  selectable?: boolean;
  compact?: boolean; // Hide info and actions for cleaner picker UI
}

export const MediaItem: React.FC<MediaItemProps> = ({
  media,
  selected = false,
  onSelect,
  onDelete,
  onEdit,
  selectable = true,
  compact = false,
}) => {
  const [imageError, setImageError] = useState(false);
  const [showViewer, setShowViewer] = useState(false);
  const [showDeleteConfirm, setShowDeleteConfirm] = useState(false);
  const [copied, setCopied] = useState(false);

  const formatFileSize = (bytes: number) => {
    if (bytes < 1024) return bytes + ' B';
    if (bytes < 1024 * 1024) return (bytes / 1024).toFixed(1) + ' KB';
    return (bytes / (1024 * 1024)).toFixed(1) + ' MB';
  };

  const formatDate = (dateString: string) => {
    const date = new Date(dateString);
    return date.toLocaleDateString('vi-VN', {
      day: '2-digit',
      month: '2-digit',
      year: 'numeric',
    });
  };

  const API_URL = import.meta.env.VITE_API_URL || 'http://localhost:5003/api';
  const baseUrl = API_URL.replace('/api', '');
  const fileUrl = media.url.startsWith('http')
    ? media.url
    : `${baseUrl}${media.url}`;

  const isImage = media.mimeType.startsWith('image/');
  const isVideo = media.mimeType.startsWith('video/');
  const isPDF = media.mimeType === 'application/pdf';
  const isDoc = media.mimeType.includes('word') || media.mimeType.includes('document');

  const getFileIcon = () => {
    if (isPDF) return <FileText className="h-12 w-12 text-red-500" />;
    if (isDoc) return <FileText className="h-12 w-12 text-blue-500" />;
    if (isVideo) return <FileVideo className="h-12 w-12 text-green-500" />;
    return <File className="h-12 w-12 text-muted-foreground" />;
  };

  const handleCopyUrl = () => {
    navigator.clipboard.writeText(fileUrl);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  const renderPreview = () => {
    const previewHeight = compact ? 'h-24' : 'h-48';

    if (isImage) {
      return !imageError ? (
        <img
          src={fileUrl}
          alt={media.alt || media.originalName}
          onError={() => setImageError(true)}
          loading="lazy"
          className={`w-full ${previewHeight} object-cover`}
        />
      ) : (
        <div className={`w-full ${previewHeight} flex flex-col items-center justify-center`} style={{ backgroundColor: 'var(--color-muted)' }}>
          <ImageIcon className="h-10 w-10 text-muted-foreground" />
          <span className="text-xs text-muted-foreground mt-1">Không thể tải</span>
        </div>
      );
    }

    if (isVideo) {
      return (
        <div className={`relative w-full ${previewHeight} bg-black`}>
          <video
            src={fileUrl}
            className="w-full h-full object-contain"
          />
          <div className="absolute inset-0 flex items-center justify-center">
            <FileVideo className="h-12 w-12 text-white opacity-80" />
          </div>
        </div>
      );
    }

    return (
      <div className={`w-full ${previewHeight} flex flex-col items-center justify-center`} style={{ backgroundColor: 'var(--color-muted)' }}>
        {getFileIcon()}
        <span className="text-xs text-muted-foreground mt-2">
          {isPDF ? 'PDF' : isDoc ? 'DOC' : 'File'}
        </span>
      </div>
    );
  };

  return (
    <>
      <div
        className={`rounded-lg border overflow-hidden transition-all cursor-pointer hover:ring-2 hover:ring-primary/50 ${selected ? 'ring-2 ring-primary' : ''
          }`}
        style={{
          backgroundColor: 'var(--color-card)',
          borderColor: 'var(--color-border)'
        }}
        onClick={() => selectable && onSelect?.(media.id)}
      >
        {/* Preview */}
        <div className="relative">
          {renderPreview()}

          {selected && (
            <div className="absolute inset-0 flex items-center justify-center bg-black/30">
              <CheckCircle className="h-8 w-8 text-success" />
            </div>
          )}

          {selectable && !compact && (
            <div className="absolute top-2 left-2">
              <input
                type="checkbox"
                checked={selected}
                onChange={() => onSelect?.(media.id)}
                className="h-4 w-4 rounded"
              />
            </div>
          )}
        </div>

        {/* Info - Only show when not compact */}
        {!compact && (
          <div className="p-3">
            <p className="text-sm font-medium truncate" title={media.originalName}>
              {media.originalName}
            </p>
            <div className="flex items-center gap-2 mt-1">
              <Badge variant="secondary" className="text-xs">
                {formatFileSize(media.size)}
              </Badge>
              <span className="text-xs text-muted-foreground">
                {formatDate(media.createdAt)}
              </span>
            </div>
          </div>
        )}

        {/* Actions - Only show when not compact */}
        {!compact && (
          <div className="flex border-t" style={{ borderColor: 'var(--color-border)' }}>
            <button
              onClick={(e) => { e.stopPropagation(); setShowViewer(true); }}
              className="flex-1 p-2 hover:bg-accent flex items-center justify-center"
              title="Xem chi tiết"
            >
              <Eye className="h-4 w-4" />
            </button>
            <button
              onClick={(e) => { e.stopPropagation(); handleCopyUrl(); }}
              className="flex-1 p-2 hover:bg-accent flex items-center justify-center"
              title="Copy URL"
            >
              {copied ? (
                <CheckCircle className="h-4 w-4 text-success" />
              ) : (
                <Copy className="h-4 w-4" />
              )}
            </button>
            <button
              onClick={(e) => { e.stopPropagation(); onEdit?.(media); }}
              className="flex-1 p-2 hover:bg-accent flex items-center justify-center"
              title="Chỉnh sửa"
            >
              <Pencil className="h-4 w-4" />
            </button>
            <button
              onClick={(e) => { e.stopPropagation(); setShowDeleteConfirm(true); }}
              className="flex-1 p-2 hover:bg-destructive/10 flex items-center justify-center text-destructive"
              title="Xóa"
            >
              <Trash2 className="h-4 w-4" />
            </button>
          </div>
        )}
      </div>

      {/* Delete Confirmation Dialog */}
      <Dialog open={showDeleteConfirm} onClose={() => setShowDeleteConfirm(false)}>
        <DialogHeader>
          <DialogTitle>Xóa ảnh này?</DialogTitle>
          <DialogDescription>
            Bạn có chắc chắn muốn xóa ảnh này? Hành động này không thể hoàn tác.
          </DialogDescription>
        </DialogHeader>
        <DialogFooter>
          <Button variant="outline" onClick={() => setShowDeleteConfirm(false)}>
            Hủy
          </Button>
          <Button
            variant="destructive"
            onClick={() => {
              onDelete?.(media.id);
              setShowDeleteConfirm(false);
            }}
          >
            Xóa
          </Button>
        </DialogFooter>
      </Dialog>

      {/* Document Viewer Modal */}
      <DocumentViewer
        visible={showViewer}
        fileUrl={media.url}
        fileName={media.originalName}
        mimeType={media.mimeType}
        onClose={() => setShowViewer(false)}
      />
    </>
  );
};
