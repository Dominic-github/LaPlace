import React, { useState, useEffect, useCallback } from 'react';
import { Card, CardContent } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Select } from '@/components/ui/select';
import { Pagination } from '@/components/ui/pagination';
import { Spinner } from '@/components/ui/spinner';
import { MediaItem } from './MediaItem';
import { EditMediaModal } from './EditMediaModal';
import { FolderTree } from './FolderTree';
import {
  Search,
  Upload,
  RefreshCw,
  ImageIcon
} from 'lucide-react';
import axios from 'axios';

const API_URL = import.meta.env.VITE_API_URL || 'http://localhost:5003/api';

interface MediaManagerProps {
  onSelect?: (media: any) => void;
  selectedId?: string;
  selectedUrls?: string[]; // For multiple mode, URLs of selected media
  selectable?: boolean;
  multiple?: boolean;
  showFolderTree?: boolean;
  compact?: boolean; // Compact mode for picker display
}

export const MediaManager: React.FC<MediaManagerProps> = ({
  onSelect,
  selectedId,
  selectedUrls = [],
  selectable = true,
  multiple = false,
  showFolderTree = true,
  compact = false,
}) => {
  const [media, setMedia] = useState<any[]>([]);
  const [loading, setLoading] = useState(false);
  const [uploading, setUploading] = useState(false);
  const [search, setSearch] = useState('');
  const [mimeType, setMimeType] = useState('');
  const [sortBy, setSortBy] = useState('createdAt-desc');
  const [selectedFolderId, setSelectedFolderId] = useState<string | null>(null);
  const [page, setPage] = useState(1);
  const [total, setTotal] = useState(0);
  const [limit] = useState(20);
  const [selectedIds, setSelectedIds] = useState<string[]>(selectedId ? [selectedId] : []);
  const [editingMedia, setEditingMedia] = useState<any | null>(null);
  const [showEditModal, setShowEditModal] = useState(false);
  const [message, setMessage] = useState<{ type: 'success' | 'error'; text: string } | null>(null);

  const showMessage = (type: 'success' | 'error', text: string) => {
    setMessage({ type, text });
    setTimeout(() => setMessage(null), 3000);
  };

  const fetchMedia = useCallback(async () => {
    try {
      setLoading(true);
      const token = localStorage.getItem('token');
      const [field, order] = sortBy.split('-');

      const params: any = {
        page,
        limit,
        sortBy: field,
        sortOrder: order,
      };

      if (search) params.search = search;
      if (mimeType) params.mimeType = mimeType;
      if (selectedFolderId !== null) {
        params.folderId = selectedFolderId || '';
      }

      const response = await axios.get(`${API_URL}/media`, {
        params,
        headers: { Authorization: `Bearer ${token}` },
      });

      if (response.data.success) {
        setMedia(response.data.data);
        setTotal(response.data.pagination.total);
      }
    } catch (error: any) {
      console.error('Error fetching media:', error);
      showMessage('error', 'Không thể tải danh sách media');
    } finally {
      setLoading(false);
    }
  }, [page, search, mimeType, sortBy, selectedFolderId, limit]);

  // Debounce search
  useEffect(() => {
    const timer = setTimeout(() => {
      if (page === 1) {
        fetchMedia();
      } else {
        setPage(1);
      }
    }, 500);

    return () => clearTimeout(timer);
  }, [search]);

  // Fetch when other filters change
  useEffect(() => {
    fetchMedia();
  }, [page, mimeType, sortBy, selectedFolderId]);

  const handleUpload = async (file: File) => {
    try {
      setUploading(true);

      const formData = new FormData();
      formData.append('file', file);
      if (selectedFolderId) {
        formData.append('folderId', selectedFolderId);
      }

      const token = localStorage.getItem('token');
      const response = await axios.post(`${API_URL}/upload/single`, formData, {
        headers: {
          'Content-Type': 'multipart/form-data',
          Authorization: `Bearer ${token}`,
        },
      });

      if (response.data.success) {
        showMessage('success', 'Upload thành công!');
        await fetchMedia();
      } else {
        showMessage('error', 'Upload thất bại!');
      }
    } catch (error: any) {
      console.error('Upload error:', error);
      showMessage('error', `Upload thất bại: ${error.response?.data?.message || error.message}`);
    } finally {
      setUploading(false);
    }
  };

  const handleDelete = async (id: string) => {
    try {
      const token = localStorage.getItem('token');
      await axios.delete(`${API_URL}/media/${id}`, {
        headers: { Authorization: `Bearer ${token}` },
      });

      showMessage('success', 'Đã xóa ảnh');
      fetchMedia();
    } catch (error: any) {
      console.error('Delete error:', error);
      showMessage('error', 'Không thể xóa ảnh');
    }
  };

  const handleSelect = (id: string) => {
    if (!selectable) return;

    const selectedMedia = media.find(m => m.id === id);
    if (!selectedMedia) return;

    if (multiple) {
      const newSelected = selectedIds.includes(id)
        ? selectedIds.filter(sid => sid !== id)
        : [...selectedIds, id];
      setSelectedIds(newSelected);
      // Also call onSelect in multiple mode for immediate feedback
      if (onSelect) {
        onSelect(selectedMedia);
      }
    } else {
      setSelectedIds([id]);
      if (onSelect) {
        onSelect(selectedMedia);
      }
    }
  };

  const handleEdit = (media: any) => {
    setEditingMedia(media);
    setShowEditModal(true);
  };

  const handleEditSuccess = () => {
    fetchMedia();
    setShowEditModal(false);
    setEditingMedia(null);
  };

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    const isValid =
      file.type.startsWith('image/') ||
      file.type.startsWith('video/') ||
      file.type === 'application/pdf' ||
      file.type === 'application/msword' ||
      file.type === 'application/vnd.openxmlformats-officedocument.wordprocessingml.document';

    if (!isValid) {
      showMessage('error', 'Chỉ được upload ảnh, video, PDF hoặc DOC!');
      return;
    }

    const isLt50M = file.size / 1024 / 1024 < 50;
    if (!isLt50M) {
      showMessage('error', 'File phải nhỏ hơn 50MB!');
      return;
    }

    handleUpload(file);
    e.target.value = '';
  };

  return (
    <div className="flex h-full" style={{ backgroundColor: 'var(--color-background)' }}>
      {showFolderTree && (
        <div className="w-72 border-r p-4" style={{ borderColor: 'var(--color-border)' }}>
          <FolderTree
            selectedFolderId={selectedFolderId}
            onSelectFolder={(folderId) => {
              setSelectedFolderId(folderId);
              setPage(1);
            }}
          />
        </div>
      )}

      <div className="flex-1 p-4 space-y-4">
        {/* Message Toast */}
        {message && (
          <div
            className={`fixed top-4 right-4 z-50 px-4 py-2 rounded-md shadow-lg ${message.type === 'success' ? 'bg-success text-white' : 'bg-destructive text-white'
              }`}
          >
            {message.text}
          </div>
        )}

        {/* Toolbar */}
        <div className="flex flex-wrap gap-3 items-center justify-between">
          <div className="flex flex-wrap gap-2 items-center">
            <div className="relative">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
              <Input
                placeholder="Tìm kiếm..."
                value={search}
                onChange={(e) => setSearch(e.target.value)}
                className="pl-9 w-48"
              />
            </div>

            <Select
              value={mimeType}
              onChange={(e) => setMimeType(e.target.value)}
              className="w-32"
            >
              <option value="">Tất cả loại</option>
              <option value="image/jpeg">JPEG</option>
              <option value="image/png">PNG</option>
              <option value="image/webp">WebP</option>
              <option value="image/gif">GIF</option>
              <option value="video/">Video</option>
              <option value="application/pdf">PDF</option>
            </Select>

            <Select
              value={sortBy}
              onChange={(e) => setSortBy(e.target.value)}
              className="w-36"
            >
              <option value="createdAt-desc">Mới nhất</option>
              <option value="createdAt-asc">Cũ nhất</option>
              <option value="filename-asc">Tên A-Z</option>
              <option value="filename-desc">Tên Z-A</option>
              <option value="size-desc">Lớn nhất</option>
              <option value="size-asc">Nhỏ nhất</option>
            </Select>

            <Button variant="outline" size="sm" onClick={fetchMedia} disabled={loading}>
              <RefreshCw className={`h-4 w-4 mr-1 ${loading ? 'animate-spin' : ''}`} />
              Làm mới
            </Button>
          </div>

          <div>
            <input
              type="file"
              id="media-upload"
              accept="image/*,video/*,application/pdf,.doc,.docx"
              className="hidden"
              onChange={handleFileChange}
              disabled={uploading}
            />
            <Button asChild disabled={uploading}>
              <label htmlFor="media-upload" className="cursor-pointer">
                {uploading ? (
                  <Spinner size="sm" className="mr-2" />
                ) : (
                  <Upload className="h-4 w-4 mr-2" />
                )}
                Upload file
              </label>
            </Button>
          </div>
        </div>

        {/* Media Grid */}
        <div className="min-h-96">
          {loading ? (
            <div className="flex items-center justify-center h-64">
              <Spinner size="lg" />
            </div>
          ) : media.length === 0 ? (
            <div className="flex flex-col items-center justify-center h-64 text-muted-foreground">
              <ImageIcon className="h-16 w-16 mb-4 opacity-50" />
              <p className="mb-4">Chưa có ảnh nào</p>
              <input
                type="file"
                id="media-upload-empty"
                accept="image/*"
                className="hidden"
                onChange={handleFileChange}
              />
              <Button asChild>
                <label htmlFor="media-upload-empty" className="cursor-pointer">
                  <Upload className="h-4 w-4 mr-2" />
                  Upload ảnh đầu tiên
                </label>
              </Button>
            </div>
          ) : (
            <div className="grid grid-cols-2 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
              {media.map((item) => (
                <MediaItem
                  key={item.id}
                  media={item}
                  selected={multiple ? selectedUrls.includes(item.url) : selectedIds.includes(item.id)}
                  onSelect={handleSelect}
                  onDelete={handleDelete}
                  onEdit={handleEdit}
                  selectable={selectable}
                  compact={compact}
                />
              ))}
            </div>
          )}
        </div>

        {/* Pagination */}
        {total > limit && (
          <div className="flex items-center justify-between border-t pt-4" style={{ borderColor: 'var(--color-border)' }}>
            <p className="text-sm text-muted-foreground">Tổng {total} ảnh</p>
            <Pagination
              current={page}
              total={total}
              pageSize={limit}
              onChange={setPage}
            />
          </div>
        )}

        {/* Edit Media Modal */}
        <EditMediaModal
          visible={showEditModal}
          media={editingMedia}
          onClose={() => {
            setShowEditModal(false);
            setEditingMedia(null);
          }}
          onSuccess={handleEditSuccess}
        />
      </div>
    </div>
  );
};
