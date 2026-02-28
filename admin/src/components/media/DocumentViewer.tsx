import React from 'react';
import { Button } from '@/components/ui/button';
import {
  Dialog,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog';
import { Download, X } from 'lucide-react';

interface DocumentViewerProps {
  visible: boolean;
  fileUrl: string;
  fileName: string;
  mimeType: string;
  onClose: () => void;
}

export const DocumentViewer: React.FC<DocumentViewerProps> = ({
  visible,
  fileUrl,
  fileName,
  mimeType,
  onClose,
}) => {
  const API_URL = import.meta.env.VITE_API_URL || 'http://localhost:5003/api';
  const baseUrl = API_URL.replace('/api', '');
  const fullUrl = fileUrl.startsWith('http')
    ? fileUrl
    : `${baseUrl}${fileUrl}`;

  const isPDF = mimeType === 'application/pdf';
  const isDoc = mimeType.includes('word') || mimeType.includes('document');
  const isImage = mimeType.startsWith('image/');
  const isVideo = mimeType.startsWith('video/');

  const handleDownload = () => {
    const link = document.createElement('a');
    link.href = fullUrl;
    link.download = fileName;
    link.click();
  };

  const renderContent = () => {
    if (isImage) {
      return (
        <div className="flex items-center justify-center p-4">
          <img
            src={fullUrl}
            alt={fileName}
            className="max-w-full max-h-[70vh] object-contain"
          />
        </div>
      );
    }

    if (isVideo) {
      return (
        <div className="flex items-center justify-center p-4 bg-black">
          <video
            src={fullUrl}
            controls
            className="max-w-full max-h-[70vh]"
          >
            Trình duyệt không hỗ trợ video.
          </video>
        </div>
      );
    }

    if (isPDF) {
      return (
        <iframe
          src={fullUrl}
          className="w-full h-[70vh] border-0"
          title={fileName}
        />
      );
    }

    if (isDoc) {
      const googleViewerUrl = `https://docs.google.com/viewer?url=${encodeURIComponent(fullUrl)}&embedded=true`;
      return (
        <iframe
          src={googleViewerUrl}
          className="w-full h-[70vh] border-0"
          title={fileName}
        />
      );
    }

    return (
      <div className="text-center py-10">
        <p className="mb-4 text-muted-foreground">Không thể xem trước file này.</p>
        <Button onClick={handleDownload}>
          <Download className="h-4 w-4 mr-2" />
          Tải xuống để xem
        </Button>
      </div>
    );
  };

  return (
    <Dialog open={visible} onClose={onClose}>
      <DialogHeader>
        <DialogTitle className="truncate max-w-lg">{fileName}</DialogTitle>
      </DialogHeader>

      <div className="mt-4">
        {renderContent()}
      </div>

      <DialogFooter className="mt-4">
        <Button variant="outline" onClick={handleDownload}>
          <Download className="h-4 w-4 mr-2" />
          Tải xuống
        </Button>
        <Button onClick={onClose}>
          Đóng
        </Button>
      </DialogFooter>
    </Dialog>
  );
};
