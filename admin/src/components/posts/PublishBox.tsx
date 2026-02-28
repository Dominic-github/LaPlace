import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Select } from '@/components/ui/select';
import { Badge } from '@/components/ui/badge';
import { Save, Eye, Clock, CheckCircle, FileText, Loader2 } from 'lucide-react';

interface PublishBoxProps {
  status?: 'DRAFT' | 'PUBLISHED' | 'ARCHIVED';
  publishedAt?: string | null;
  onStatusChange?: (status: string) => void;
  onPublishedAtChange?: (date: Date | null) => void;
  onSave?: () => void;
  onPreview?: () => void;
  isSubmitting?: boolean;
}

export const PublishBox: React.FC<PublishBoxProps> = ({
  status = 'DRAFT',
  publishedAt,
  onStatusChange,
  onPublishedAtChange,
  onSave,
  onPreview,
  isSubmitting = false,
}) => {
  const getStatusIcon = () => {
    switch (status) {
      case 'PUBLISHED':
        return <CheckCircle className="h-4 w-4 text-success" />;
      case 'ARCHIVED':
        return <FileText className="h-4 w-4 text-muted-foreground" />;
      default:
        return <Clock className="h-4 w-4 text-warning" />;
    }
  };

  const getStatusText = () => {
    switch (status) {
      case 'PUBLISHED':
        return 'Đã xuất bản';
      case 'ARCHIVED':
        return 'Đã lưu trữ';
      default:
        return 'Bản nháp';
    }
  };

  const getStatusVariant = (): "default" | "success" | "warning" | "secondary" => {
    switch (status) {
      case 'PUBLISHED':
        return 'success';
      case 'ARCHIVED':
        return 'secondary';
      default:
        return 'warning';
    }
  };

  return (
    <Card>
      <CardHeader className="pb-3">
        <CardTitle className="text-base flex items-center gap-2">
          <Save className="h-4 w-4" />
          Xuất bản
        </CardTitle>
      </CardHeader>

      <CardContent className="space-y-4">
        {/* Status */}
        <div className="flex items-center gap-2">
          {getStatusIcon()}
          <span className="text-sm">Trạng thái:</span>
          <Badge variant={getStatusVariant()}>{getStatusText()}</Badge>
        </div>

        {/* Status Select */}
        <div className="space-y-2">
          <Label className="text-sm font-medium">Thay đổi trạng thái:</Label>
          <Select
            value={status}
            onChange={(e) => onStatusChange?.(e.target.value)}
          >
            <option value="DRAFT">📝 Bản nháp</option>
            <option value="PUBLISHED">✅ Xuất bản</option>
            <option value="ARCHIVED">📦 Lưu trữ</option>
          </Select>
        </div>

        {/* Publish Date */}
        <div className="space-y-2">
          <Label className="text-sm font-medium flex items-center gap-1">
            <Clock className="h-3 w-3" />
            Ngày xuất bản:
          </Label>
          <Input
            type="datetime-local"
            value={publishedAt ? new Date(publishedAt).toISOString().slice(0, 16) : ''}
            onChange={(e) => {
              const date = e.target.value ? new Date(e.target.value) : null;
              onPublishedAtChange?.(date);
            }}
          />
          <p className="text-xs text-muted-foreground">
            Để trống để xuất bản ngay
          </p>
        </div>

        {/* Actions */}
        <div className="space-y-2 pt-2 border-t" style={{ borderColor: 'var(--color-border)' }}>
          <Button
            onClick={onSave}
            disabled={isSubmitting}
            className="w-full"
          >
            {isSubmitting ? (
              <Loader2 className="h-4 w-4 mr-2 animate-spin" />
            ) : (
              <Save className="h-4 w-4 mr-2" />
            )}
            {status === 'PUBLISHED' ? 'Cập nhật' : 'Lưu'}
          </Button>

          <Button
            variant="outline"
            onClick={onPreview}
            className="w-full"
          >
            <Eye className="h-4 w-4 mr-2" />
            Xem trước
          </Button>
        </div>
      </CardContent>
    </Card>
  );
};
