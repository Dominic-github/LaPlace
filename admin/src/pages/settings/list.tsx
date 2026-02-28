import { useState } from "react";
import { useList, useCreate, useNavigation } from "@refinedev/core";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Badge } from "@/components/ui/badge";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { Pagination } from "@/components/ui/pagination";
import { Spinner } from "@/components/ui/spinner";
import {
  Dialog,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Plus, Pencil, Search, Settings } from "lucide-react";

interface Setting {
  id: string;
  key: string;
  value: string;
  group?: string;
  label?: string;
  description?: string;
  updatedAt: string;
}

export const SettingList = () => {
  const { push } = useNavigation();
  const [current, setCurrent] = useState(1);
  const [pageSize] = useState(10);
  const [search, setSearch] = useState("");
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [newSetting, setNewSetting] = useState({
    key: "",
    value: "",
    group: "",
    label: "",
    description: "",
    type: "text",
  });

  const { data, isLoading, refetch } = useList<Setting>({
    resource: "settings",
    pagination: { current, pageSize },
    filters: search ? [{ field: "key", operator: "contains", value: search }] : [],
  });

  const { mutate: create, isLoading: isCreating } = useCreate();

  const settings = data?.data || [];
  const total = data?.total || 0;

  const handleCreate = () => {
    create(
      { resource: "settings", values: newSetting },
      {
        onSuccess: () => {
          setIsModalOpen(false);
          setNewSetting({ key: "", value: "", group: "", label: "", description: "", type: "text" });
          refetch();
        },
      }
    );
  };

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold flex items-center gap-2">
            <Settings className="h-8 w-8" />
            Cài đặt hệ thống
          </h1>
          <p className="text-muted-foreground mt-1">Quản lý cấu hình hệ thống</p>
        </div>
        <Button onClick={() => setIsModalOpen(true)}>
          <Plus className="h-4 w-4 mr-2" />
          Thêm cấu hình
        </Button>
      </div>

      <Card>
        <CardContent className="pt-6">
          <div className="relative flex-1 max-w-sm">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
            <Input
              placeholder="Tìm theo key..."
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              className="pl-9"
            />
          </div>
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle>Danh sách cấu hình ({total})</CardTitle>
        </CardHeader>
        <CardContent>
          {isLoading ? (
            <div className="flex items-center justify-center h-64">
              <Spinner size="lg" />
            </div>
          ) : settings.length === 0 ? (
            <div className="text-center py-12 text-muted-foreground">
              Không có cấu hình nào
            </div>
          ) : (
            <>
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>Key</TableHead>
                    <TableHead className="max-w-xs">Value</TableHead>
                    <TableHead>Nhóm</TableHead>
                    <TableHead>Nhãn</TableHead>
                    <TableHead>Cập nhật</TableHead>
                    <TableHead className="text-right w-20">Thao tác</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {settings.map((setting) => (
                    <TableRow key={setting.id}>
                      <TableCell className="font-mono font-medium">{setting.key}</TableCell>
                      <TableCell className="max-w-xs">
                        <pre className="text-xs whitespace-pre-wrap overflow-auto max-h-20 m-0 p-2 rounded" style={{ backgroundColor: 'var(--color-muted)' }}>
                          {setting.value}
                        </pre>
                      </TableCell>
                      <TableCell>
                        {setting.group ? (
                          <Badge variant="default">{setting.group}</Badge>
                        ) : (
                          "—"
                        )}
                      </TableCell>
                      <TableCell>{setting.label || "—"}</TableCell>
                      <TableCell>
                        {new Date(setting.updatedAt).toLocaleString("vi-VN")}
                      </TableCell>
                      <TableCell className="text-right">
                        <Button
                          variant="ghost"
                          size="sm"
                          onClick={() => push(`/settings/edit/${setting.id}`)}
                        >
                          <Pencil className="h-4 w-4" />
                        </Button>
                      </TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>

              <div className="mt-4 flex justify-center">
                <Pagination
                  current={current}
                  total={total}
                  pageSize={pageSize}
                  onChange={setCurrent}
                />
              </div>
            </>
          )}
        </CardContent>
      </Card>

      <Dialog open={isModalOpen} onClose={() => setIsModalOpen(false)}>
        <DialogHeader>
          <DialogTitle>Thêm cấu hình mới</DialogTitle>
          <DialogDescription>Tạo cấu hình hệ thống mới</DialogDescription>
        </DialogHeader>
        <div className="space-y-4 py-4">
          <div className="space-y-2">
            <Label htmlFor="key">Key *</Label>
            <Input
              id="key"
              value={newSetting.key}
              onChange={(e) => setNewSetting({ ...newSetting, key: e.target.value })}
              placeholder="site_name"
            />
          </div>
          <div className="space-y-2">
            <Label htmlFor="value">Value *</Label>
            <Textarea
              id="value"
              value={newSetting.value}
              onChange={(e) => setNewSetting({ ...newSetting, value: e.target.value })}
              placeholder="My Shop"
              rows={3}
            />
          </div>
          <div className="grid grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label htmlFor="group">Nhóm</Label>
              <Input
                id="group"
                value={newSetting.group}
                onChange={(e) => setNewSetting({ ...newSetting, group: e.target.value })}
                placeholder="general"
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="label">Nhãn</Label>
              <Input
                id="label"
                value={newSetting.label}
                onChange={(e) => setNewSetting({ ...newSetting, label: e.target.value })}
                placeholder="Tên website"
              />
            </div>
          </div>
          <div className="space-y-2">
            <Label htmlFor="description">Mô tả</Label>
            <Input
              id="description"
              value={newSetting.description}
              onChange={(e) => setNewSetting({ ...newSetting, description: e.target.value })}
              placeholder="Mô tả chi tiết"
            />
          </div>
        </div>
        <DialogFooter>
          <Button variant="outline" onClick={() => setIsModalOpen(false)}>
            Hủy
          </Button>
          <Button onClick={handleCreate} disabled={isCreating || !newSetting.key || !newSetting.value}>
            {isCreating ? "Đang tạo..." : "Tạo cấu hình"}
          </Button>
        </DialogFooter>
      </Dialog>
    </div>
  );
};
