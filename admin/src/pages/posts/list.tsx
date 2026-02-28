import { useState } from "react";
import { useList, useDelete, useNavigation } from "@refinedev/core";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
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
import { Plus, Pencil, Trash2, Search, FileText, Eye } from "lucide-react";

interface Post {
  id: string;
  title: string;
  slug: string;
  thumbnail?: string;
  status: string;
  viewCount: number;
  category?: { name: string };
  author?: { email: string };
  createdAt: string;
}

export const PostList = () => {
  const { push } = useNavigation();
  const [current, setCurrent] = useState(1);
  const [pageSize] = useState(10);
  const [search, setSearch] = useState("");
  const [deleteId, setDeleteId] = useState<string | null>(null);

  const { data, isLoading } = useList<Post>({
    resource: "posts",
    pagination: { current, pageSize },
    filters: search ? [{ field: "title", operator: "contains", value: search }] : [],
    sorters: [{ field: "createdAt", order: "desc" }],
  });

  const { mutate: deleteItem, isLoading: isDeleting } = useDelete();

  const posts = data?.data || [];
  const total = data?.total || 0;

  const handleDelete = () => {
    if (deleteId) {
      deleteItem(
        { resource: "posts", id: deleteId },
        { onSuccess: () => setDeleteId(null) }
      );
    }
  };

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold flex items-center gap-2">
            <FileText className="h-8 w-8" />
            Bài viết
          </h1>
          <p className="text-muted-foreground mt-1">
            Quản lý bài viết blog
          </p>
        </div>
        <Button onClick={() => push("/posts/create")}>
          <Plus className="h-4 w-4 mr-2" />
          Thêm bài viết
        </Button>
      </div>

      <Card>
        <CardContent className="pt-6">
          <div className="relative flex-1 max-w-sm">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
            <Input
              placeholder="Tìm bài viết..."
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              className="pl-9"
            />
          </div>
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle>Danh sách bài viết ({total})</CardTitle>
        </CardHeader>
        <CardContent>
          {isLoading ? (
            <div className="flex items-center justify-center h-64">
              <Spinner size="lg" />
            </div>
          ) : posts.length === 0 ? (
            <div className="text-center py-12 text-muted-foreground">
              Không có bài viết nào
            </div>
          ) : (
            <>
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead className="w-16">Ảnh</TableHead>
                    <TableHead>Tiêu đề</TableHead>
                    <TableHead>Chuyên mục</TableHead>
                    <TableHead className="text-center">Trạng thái</TableHead>
                    <TableHead className="text-center">Lượt xem</TableHead>
                    <TableHead>Ngày tạo</TableHead>
                    <TableHead className="text-right w-28">Thao tác</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {posts.map((post) => (
                    <TableRow key={post.id}>
                      <TableCell>
                        {post.thumbnail ? (
                          <img
                            src={post.thumbnail}
                            alt={post.title}
                            className="w-12 h-12 object-cover rounded"
                          />
                        ) : (
                          <div className="w-12 h-12 bg-muted rounded flex items-center justify-center">
                            <FileText className="h-6 w-6 text-muted-foreground" />
                          </div>
                        )}
                      </TableCell>
                      <TableCell>
                        <div className="font-medium">{post.title}</div>
                        <div className="text-sm text-muted-foreground">{post.slug}</div>
                      </TableCell>
                      <TableCell>{post.category?.name || "—"}</TableCell>
                      <TableCell className="text-center">
                        <Badge variant={post.status === "PUBLISHED" ? "success" : "warning"}>
                          {post.status === "PUBLISHED" ? "Đã xuất bản" : "Nháp"}
                        </Badge>
                      </TableCell>
                      <TableCell className="text-center">
                        <span className="flex items-center justify-center gap-1">
                          <Eye className="h-4 w-4" />
                          {post.viewCount || 0}
                        </span>
                      </TableCell>
                      <TableCell>
                        {new Date(post.createdAt).toLocaleDateString("vi-VN")}
                      </TableCell>
                      <TableCell className="text-right">
                        <div className="flex items-center justify-end gap-1">
                          <Button
                            variant="ghost"
                            size="sm"
                            onClick={() => push(`/posts/edit/${post.id}`)}
                          >
                            <Pencil className="h-4 w-4" />
                          </Button>
                          <Button
                            variant="ghost"
                            size="sm"
                            onClick={() => setDeleteId(post.id)}
                            className="text-destructive hover:text-destructive"
                          >
                            <Trash2 className="h-4 w-4" />
                          </Button>
                        </div>
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

      <Dialog open={!!deleteId} onClose={() => setDeleteId(null)}>
        <DialogHeader>
          <DialogTitle>Xác nhận xóa</DialogTitle>
          <DialogDescription>
            Bạn có chắc chắn muốn xóa bài viết này?
          </DialogDescription>
        </DialogHeader>
        <DialogFooter>
          <Button variant="outline" onClick={() => setDeleteId(null)}>
            Hủy
          </Button>
          <Button variant="destructive" onClick={handleDelete} disabled={isDeleting}>
            {isDeleting ? "Đang xóa..." : "Xóa"}
          </Button>
        </DialogFooter>
      </Dialog>
    </div>
  );
};
