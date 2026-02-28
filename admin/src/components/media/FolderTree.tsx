import React, { useState, useEffect } from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import {
  Dialog,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog';
import {
  Folder,
  FolderOpen,
  FolderPlus,
  Plus,
  Pencil,
  Trash2,
  ChevronRight,
  ChevronDown,
  MoreHorizontal,
} from 'lucide-react';
import axios from 'axios';

const API_URL = import.meta.env.VITE_API_URL || 'http://localhost:5003/api';

interface FolderData {
  id: string;
  name: string;
  slug: string;
  parentId: string | null;
  children: FolderData[];
  _count: {
    media: number;
    children: number;
  };
}

interface FolderTreeProps {
  selectedFolderId: string | null;
  onSelectFolder: (folderId: string | null) => void;
}

export const FolderTree: React.FC<FolderTreeProps> = ({
  selectedFolderId,
  onSelectFolder,
}) => {
  const [folders, setFolders] = useState<FolderData[]>([]);
  const [loading, setLoading] = useState(false);
  const [showCreateModal, setShowCreateModal] = useState(false);
  const [showRenameModal, setShowRenameModal] = useState(false);
  const [showDeleteModal, setShowDeleteModal] = useState(false);
  const [newFolderName, setNewFolderName] = useState('');
  const [renameFolderName, setRenameFolderName] = useState('');
  const [parentFolderId, setParentFolderId] = useState<string | null>(null);
  const [renamingFolderId, setRenamingFolderId] = useState<string | null>(null);
  const [deletingFolderId, setDeletingFolderId] = useState<string | null>(null);
  const [expandedIds, setExpandedIds] = useState<Set<string>>(new Set());
  const [contextMenuId, setContextMenuId] = useState<string | null>(null);
  const [message, setMessage] = useState<{ type: 'success' | 'error'; text: string } | null>(null);

  const showMessage = (type: 'success' | 'error', text: string) => {
    setMessage({ type, text });
    setTimeout(() => setMessage(null), 3000);
  };

  useEffect(() => {
    fetchFolders();
  }, []);

  const fetchFolders = async () => {
    try {
      setLoading(true);
      const token = localStorage.getItem('token');
      const response = await axios.get(`${API_URL}/media-folders`, {
        headers: { Authorization: `Bearer ${token}` },
      });

      if (response.data.success) {
        setFolders(response.data.data);
      }
    } catch (error: any) {
      console.error('Error fetching folders:', error);
      showMessage('error', 'Không thể tải danh sách thư mục');
    } finally {
      setLoading(false);
    }
  };

  const handleCreateFolder = async () => {
    if (!newFolderName.trim()) {
      showMessage('error', 'Vui lòng nhập tên thư mục');
      return;
    }

    try {
      const token = localStorage.getItem('token');
      const response = await axios.post(
        `${API_URL}/media-folders`,
        { name: newFolderName, parentId: parentFolderId },
        { headers: { Authorization: `Bearer ${token}` } }
      );

      if (response.data.success) {
        showMessage('success', 'Tạo thư mục thành công!');
        setShowCreateModal(false);
        setNewFolderName('');
        setParentFolderId(null);
        await fetchFolders();
      }
    } catch (error: any) {
      console.error('Error creating folder:', error);
      showMessage('error', 'Không thể tạo thư mục');
    }
  };

  const handleRenameFolder = async () => {
    if (!renameFolderName.trim() || !renamingFolderId) {
      showMessage('error', 'Vui lòng nhập tên thư mục');
      return;
    }

    try {
      const token = localStorage.getItem('token');
      const response = await axios.put(
        `${API_URL}/media-folders/${renamingFolderId}`,
        { name: renameFolderName },
        { headers: { Authorization: `Bearer ${token}` } }
      );

      if (response.data.success) {
        showMessage('success', 'Đổi tên thư mục thành công!');
        setShowRenameModal(false);
        setRenameFolderName('');
        setRenamingFolderId(null);
        await fetchFolders();
      }
    } catch (error: any) {
      console.error('Error renaming folder:', error);
      showMessage('error', 'Không thể đổi tên thư mục');
    }
  };

  const handleDeleteFolder = async () => {
    if (!deletingFolderId) return;

    try {
      const token = localStorage.getItem('token');
      const response = await axios.delete(`${API_URL}/media-folders/${deletingFolderId}`, {
        headers: { Authorization: `Bearer ${token}` },
      });

      if (response.data.success) {
        showMessage('success', 'Xóa thư mục thành công!');
        if (selectedFolderId === deletingFolderId) {
          onSelectFolder(null);
        }
        setShowDeleteModal(false);
        setDeletingFolderId(null);
        await fetchFolders();
      }
    } catch (error: any) {
      console.error('Error deleting folder:', error);
      showMessage('error', error.response?.data?.message || 'Không thể xóa thư mục');
    }
  };

  const toggleExpand = (id: string) => {
    const newExpanded = new Set(expandedIds);
    if (newExpanded.has(id)) {
      newExpanded.delete(id);
    } else {
      newExpanded.add(id);
    }
    setExpandedIds(newExpanded);
  };

  const renderFolder = (folder: FolderData, level: number = 0) => {
    const isExpanded = expandedIds.has(folder.id);
    const isSelected = selectedFolderId === folder.id;
    const hasChildren = folder.children.length > 0;

    return (
      <div key={folder.id}>
        <div
          className={`flex items-center gap-1 px-2 py-1.5 cursor-pointer rounded-md text-sm ${isSelected ? 'bg-primary/10 text-primary' : 'hover:bg-accent'
            }`}
          style={{ paddingLeft: `${level * 16 + 8}px` }}
          onClick={() => onSelectFolder(folder.id)}
        >
          {hasChildren ? (
            <button
              onClick={(e) => {
                e.stopPropagation();
                toggleExpand(folder.id);
              }}
              className="p-0.5"
            >
              {isExpanded ? (
                <ChevronDown className="h-4 w-4" />
              ) : (
                <ChevronRight className="h-4 w-4" />
              )}
            </button>
          ) : (
            <span className="w-5" />
          )}

          {isExpanded ? (
            <FolderOpen className="h-4 w-4 text-amber-500" />
          ) : (
            <Folder className="h-4 w-4 text-amber-500" />
          )}

          <span className="flex-1 truncate">{folder.name}</span>
          <span className="text-xs text-muted-foreground">({folder._count.media})</span>

          <div className="relative">
            <button
              onClick={(e) => {
                e.stopPropagation();
                setContextMenuId(contextMenuId === folder.id ? null : folder.id);
              }}
              className="p-1 hover:bg-accent rounded"
            >
              <MoreHorizontal className="h-4 w-4" />
            </button>

            {contextMenuId === folder.id && (
              <div
                className="absolute right-0 top-full mt-1 py-1 w-40 rounded-md shadow-lg z-10 border"
                style={{ backgroundColor: 'var(--color-popover)', borderColor: 'var(--color-border)' }}
                onClick={(e) => e.stopPropagation()}
              >
                <button
                  onClick={() => {
                    setParentFolderId(folder.id);
                    setShowCreateModal(true);
                    setContextMenuId(null);
                  }}
                  className="flex items-center gap-2 w-full px-3 py-2 text-sm hover:bg-accent"
                >
                  <FolderPlus className="h-4 w-4" />
                  Tạo thư mục con
                </button>
                <button
                  onClick={() => {
                    setRenamingFolderId(folder.id);
                    setRenameFolderName(folder.name);
                    setShowRenameModal(true);
                    setContextMenuId(null);
                  }}
                  className="flex items-center gap-2 w-full px-3 py-2 text-sm hover:bg-accent"
                >
                  <Pencil className="h-4 w-4" />
                  Đổi tên
                </button>
                <div className="border-t my-1" style={{ borderColor: 'var(--color-border)' }} />
                <button
                  onClick={() => {
                    setDeletingFolderId(folder.id);
                    setShowDeleteModal(true);
                    setContextMenuId(null);
                  }}
                  className="flex items-center gap-2 w-full px-3 py-2 text-sm hover:bg-destructive/10 text-destructive"
                >
                  <Trash2 className="h-4 w-4" />
                  Xóa
                </button>
              </div>
            )}
          </div>
        </div>

        {isExpanded && hasChildren && (
          <div>
            {folder.children.map((child) => renderFolder(child, level + 1))}
          </div>
        )}
      </div>
    );
  };

  return (
    <div className="h-full">
      {/* Message Toast */}
      {message && (
        <div
          className={`fixed top-4 right-4 z-50 px-4 py-2 rounded-md shadow-lg ${message.type === 'success' ? 'bg-success text-white' : 'bg-destructive text-white'
            }`}
        >
          {message.text}
        </div>
      )}

      <div className="mb-4">
        <Button
          onClick={() => {
            setParentFolderId(null);
            setShowCreateModal(true);
          }}
          className="w-full"
          size="sm"
        >
          <Plus className="h-4 w-4 mr-2" />
          Tạo thư mục
        </Button>
      </div>

      <div className="space-y-1">
        {/* All media */}
        <div
          className={`flex items-center gap-2 px-2 py-1.5 cursor-pointer rounded-md text-sm ${selectedFolderId === null ? 'bg-primary/10 text-primary font-medium' : 'hover:bg-accent'
            }`}
          onClick={() => onSelectFolder(null)}
        >
          <Folder className="h-4 w-4" />
          <span>Tất cả</span>
        </div>

        {/* Folders */}
        {folders.map((folder) => renderFolder(folder))}
      </div>

      {/* Create Folder Modal */}
      <Dialog open={showCreateModal} onClose={() => {
        setShowCreateModal(false);
        setNewFolderName('');
        setParentFolderId(null);
      }}>
        <DialogHeader>
          <DialogTitle>Tạo thư mục mới</DialogTitle>
          <DialogDescription>Nhập tên cho thư mục mới</DialogDescription>
        </DialogHeader>
        <div className="px-6 py-4">
          <Input
            placeholder="Tên thư mục"
            value={newFolderName}
            onChange={(e) => setNewFolderName(e.target.value)}
            onKeyDown={(e) => e.key === 'Enter' && handleCreateFolder()}
          />
        </div>
        <DialogFooter>
          <Button variant="outline" onClick={() => {
            setShowCreateModal(false);
            setNewFolderName('');
          }}>
            Hủy
          </Button>
          <Button onClick={handleCreateFolder}>Tạo</Button>
        </DialogFooter>
      </Dialog>

      {/* Rename Folder Modal */}
      <Dialog open={showRenameModal} onClose={() => {
        setShowRenameModal(false);
        setRenameFolderName('');
        setRenamingFolderId(null);
      }}>
        <DialogHeader>
          <DialogTitle>Đổi tên thư mục</DialogTitle>
          <DialogDescription>Nhập tên mới cho thư mục</DialogDescription>
        </DialogHeader>
        <div className="px-6 py-4">
          <Input
            placeholder="Tên thư mục"
            value={renameFolderName}
            onChange={(e) => setRenameFolderName(e.target.value)}
            onKeyDown={(e) => e.key === 'Enter' && handleRenameFolder()}
          />
        </div>
        <DialogFooter>
          <Button variant="outline" onClick={() => {
            setShowRenameModal(false);
            setRenameFolderName('');
          }}>
            Hủy
          </Button>
          <Button onClick={handleRenameFolder}>Lưu</Button>
        </DialogFooter>
      </Dialog>

      {/* Delete Folder Modal */}
      <Dialog open={showDeleteModal} onClose={() => {
        setShowDeleteModal(false);
        setDeletingFolderId(null);
      }}>
        <DialogHeader>
          <DialogTitle>Xác nhận xóa</DialogTitle>
          <DialogDescription>
            Bạn có chắc muốn xóa thư mục này? Thư mục phải trống mới có thể xóa.
          </DialogDescription>
        </DialogHeader>
        <DialogFooter>
          <Button variant="outline" onClick={() => {
            setShowDeleteModal(false);
            setDeletingFolderId(null);
          }}>
            Hủy
          </Button>
          <Button variant="destructive" onClick={handleDeleteFolder}>Xóa</Button>
        </DialogFooter>
      </Dialog>
    </div>
  );
};
