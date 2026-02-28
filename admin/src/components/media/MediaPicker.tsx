import React, { useState } from 'react';
import { Button } from '@/components/ui/button';
import { MediaManager } from './MediaManager';
import { X, Image } from 'lucide-react';

interface MediaPickerProps {
  value?: string | string[];
  onChange: (value: string | string[]) => void;
  multiple?: boolean;
  label?: string;
}

const API_URL = import.meta.env.VITE_API_URL || 'http://localhost:5003/api';
const BASE_URL = API_URL.replace('/api', '');

export const MediaPicker: React.FC<MediaPickerProps> = ({
  value,
  onChange,
  multiple = false,
  label = 'Chọn ảnh'
}) => {
  const [showModal, setShowModal] = useState(false);

  const getImageUrl = (url: string) => {
    if (url.startsWith('http')) return url;
    return `${BASE_URL}${url}`;
  };

  const handleSelect = (media: any) => {
    if (multiple) {
      const currentValues = Array.isArray(value) ? value : value ? [value] : [];
      // Toggle: if already selected, remove it; otherwise add it
      if (currentValues.includes(media.url)) {
        onChange(currentValues.filter(v => v !== media.url));
      } else {
        onChange([...currentValues, media.url]);
      }
    } else {
      onChange(media.url);
      setShowModal(false);
    }
  };

  const handleRemove = (url: string) => {
    if (multiple && Array.isArray(value)) {
      onChange(value.filter(v => v !== url));
    } else {
      onChange('');
    }
  };

  const images = multiple 
    ? (Array.isArray(value) ? value : value ? [value] : [])
    : (value ? [value as string] : []);

  return (
    <div className="space-y-3">
      {/* Preview area */}
      {images.length > 0 && (
        <div className={`grid gap-2 ${multiple ? 'grid-cols-4 md:grid-cols-6' : ''}`}>
          {images.map((url, idx) => (
            <div key={idx} className="relative group">
              <img
                src={getImageUrl(url)}
                alt={`Selected ${idx + 1}`}
                className={`object-cover rounded-lg border ${
                  multiple ? 'w-full h-20' : 'w-full h-40'
                }`}
              />
              <button
                type="button"
                onClick={() => handleRemove(url)}
                className="absolute -top-2 -right-2 bg-destructive text-destructive-foreground rounded-full p-1 opacity-0 group-hover:opacity-100 transition-opacity shadow"
              >
                <X className="h-3 w-3" />
              </button>
              {multiple && idx === 0 && (
                <span className="absolute bottom-1 left-1 bg-primary text-primary-foreground text-xs px-1 rounded">
                  Chính
                </span>
              )}
            </div>
          ))}
        </div>
      )}

      {/* Button to open picker */}
      <Button
        type="button"
        variant="outline"
        onClick={() => setShowModal(true)}
        className="w-full border-dashed"
      >
        <Image className="h-4 w-4 mr-2" />
        {images.length > 0 ? (multiple ? 'Thêm ảnh' : 'Đổi ảnh') : label}
      </Button>

      {/* Modal */}
      {showModal && (
        <div className="fixed inset-0 z-50 bg-black/50 flex items-center justify-center p-4">
          <div className="bg-background rounded-lg shadow-xl w-full max-w-5xl max-h-[85vh] flex flex-col">
            {/* Header */}
            <div className="flex items-center justify-between p-4 border-b">
              <h3 className="text-lg font-semibold">Chọn ảnh từ Media</h3>
              <div className="flex items-center gap-2">
                {multiple && (
                  <Button 
                    size="sm" 
                    onClick={() => setShowModal(false)}
                  >
                    Xong ({images.length} ảnh)
                  </Button>
                )}
                <Button 
                  variant="ghost" 
                  size="sm" 
                  onClick={() => setShowModal(false)}
                >
                  <X className="h-4 w-4" />
                </Button>
              </div>
            </div>
            
            {/* Content */}
            <div className="flex-1 overflow-auto">
              <MediaManager
                onSelect={handleSelect}
                selectedUrls={images}
                selectable={true}
                multiple={multiple}
                showFolderTree={true}
                compact={true}
              />
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
