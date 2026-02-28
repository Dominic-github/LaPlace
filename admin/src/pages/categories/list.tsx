import { useList, useDelete } from "@refinedev/core";
import { useNavigate } from "react-router-dom";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { useState } from "react";
import { Plus, Eye, Edit, Trash2, Search, RefreshCw, FolderTree } from "lucide-react";

export const CategoryList = () => {
  const navigate = useNavigate();
  const [searchText, setSearchText] = useState("");
  const { mutate: deleteCategory } = useDelete();

  const { data, isLoading, refetch } = useList({
    resource: "categories",
    pagination: { current: 1, pageSize: 50 },
    sorters: [{ field: "order", order: "asc" }],
  });

  const categories = data?.data || [];

  const handleDelete = (id: string) => {
    if (confirm("Xóa danh mục này? Lưu ý: Các tin đăng thuộc danh mục sẽ bị ảnh hưởng.")) {
      deleteCategory({ resource: "categories", id }, { onSuccess: () => refetch() });
    }
  };

  const filteredCategories = categories.filter((c: any) =>
    c.name?.toLowerCase().includes(searchText.toLowerCase())
  );

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold">Danh mục BĐS</h1>
          <p className="text-muted-foreground mt-1">Tổng: {categories.length} danh mục</p>
        </div>
        <div className="flex gap-2">
          <Button variant="outline" onClick={() => refetch()}>
            <RefreshCw className="h-4 w-4 mr-2" />
            Làm mới
          </Button>
          <Button onClick={() => navigate("/categories/create")}>
            <Plus className="h-4 w-4 mr-2" />
            Thêm danh mục
          </Button>
        </div>
      </div>

      <Card>
        <CardContent className="pt-4">
          <div className="flex gap-4 mb-4">
            <div className="relative flex-1">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
              <Input
                placeholder="Tìm kiếm danh mục..."
                value={searchText}
                onChange={(e) => setSearchText(e.target.value)}
                className="pl-10"
              />
            </div>
          </div>

          {isLoading ? (
            <div className="flex items-center justify-center h-32">
              <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary"></div>
            </div>
          ) : filteredCategories.length === 0 ? (
            <div className="text-center py-12 text-muted-foreground">Chưa có danh mục nào</div>
          ) : (
            <div className="overflow-x-auto">
              <table className="w-full">
                <thead>
                  <tr className="border-b">
                    <th className="text-left py-3 px-2">Thứ tự</th>
                    <th className="text-left py-3 px-2">Danh mục</th>
                    <th className="text-left py-3 px-2">Slug</th>
                    <th className="text-left py-3 px-2">Mô tả</th>
                    <th className="text-left py-3 px-2">Trạng thái</th>
                    <th className="text-left py-3 px-2">Thao tác</th>
                  </tr>
                </thead>
                <tbody>
                  {filteredCategories.map((category: any) => (
                    <tr key={category.id} className="border-b hover:bg-muted/50">
                      <td className="py-3 px-2 text-center font-mono">{category.order}</td>
                      <td className="py-3 px-2">
                        <div className="flex items-center gap-3">
                          <div className="w-10 h-10 rounded-lg bg-primary/10 flex items-center justify-center">
                            {category.image ? (
                              <img src={category.image} alt={category.name} className="w-full h-full object-cover rounded-lg" />
                            ) : (
                              <FolderTree className="h-5 w-5 text-primary" />
                            )}
                          </div>
                          <span className="font-medium">{category.name}</span>
                        </div>
                      </td>
                      <td className="py-3 px-2">
                        <code className="text-xs bg-muted px-2 py-1 rounded">{category.slug}</code>
                      </td>
                      <td className="py-3 px-2 text-sm text-muted-foreground max-w-[200px] truncate">
                        {category.description || '-'}
                      </td>
                      <td className="py-3 px-2">
                        <span className={`px-2 py-1 rounded text-xs ${
                          category.isActive 
                            ? 'bg-green-500/20 text-green-500' 
                            : 'bg-red-500/20 text-red-500'
                        }`}>
                          {category.isActive ? 'Hoạt động' : 'Tắt'}
                        </span>
                      </td>
                      <td className="py-3 px-2">
                        <div className="flex gap-1">
                          <Button size="sm" variant="ghost" onClick={() => navigate(`/categories/edit/${category.id}`)}>
                            <Edit className="h-4 w-4" />
                          </Button>
                          <Button size="sm" variant="ghost" onClick={() => handleDelete(category.id)}>
                            <Trash2 className="h-4 w-4 text-red-500" />
                          </Button>
                        </div>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  );
};
