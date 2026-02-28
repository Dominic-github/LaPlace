import { useList, useDelete } from "@refinedev/core";
import { useNavigate } from "react-router-dom";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { useState } from "react";
import { Plus, Edit, Trash2, Search, RefreshCw, Menu as MenuIcon } from "lucide-react";

export const MenuList = () => {
    const navigate = useNavigate();
    const [searchText, setSearchText] = useState("");
    const { mutate: deleteMenu } = useDelete();

    const { data, isLoading, refetch } = useList({
        resource: "menus",
        pagination: { current: 1, pageSize: 50 },
    });

    const menus = data?.data || [];

    const handleDelete = (id: string) => {
        if (confirm("Xóa menu này? Tất cả các mục trong menu cũng sẽ bị xóa.")) {
            deleteMenu({ resource: "menus", id }, { onSuccess: () => refetch() });
        }
    };

    const filteredMenus = menus.filter((m: any) =>
        m.name?.toLowerCase().includes(searchText.toLowerCase()) ||
        m.location?.toLowerCase().includes(searchText.toLowerCase())
    );

    return (
        <div className="space-y-6">
            <div className="flex items-center justify-between">
                <div>
                    <h1 className="text-3xl font-bold">Quản lý Menu</h1>
                    <p className="text-muted-foreground mt-1">Điều hướng và Menu hệ thống</p>
                </div>
                <div className="flex gap-2">
                    <Button variant="outline" onClick={() => refetch()}>
                        <RefreshCw className="h-4 w-4 mr-2" />
                        Làm mới
                    </Button>
                    <Button onClick={() => navigate("/menus/create")}>
                        <Plus className="h-4 w-4 mr-2" />
                        Thêm Menu
                    </Button>
                </div>
            </div>

            <Card>
                <CardContent className="pt-4">
                    <div className="flex gap-4 mb-4">
                        <div className="relative flex-1">
                            <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                            <Input
                                placeholder="Tìm kiếm menu..."
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
                    ) : filteredMenus.length === 0 ? (
                        <div className="text-center py-12 text-muted-foreground">Chưa có menu nào</div>
                    ) : (
                        <div className="overflow-x-auto">
                            <table className="w-full">
                                <thead>
                                    <tr className="border-b">
                                        <th className="text-left py-3 px-2">Tên Menu</th>
                                        <th className="text-left py-3 px-2">Vị trí (Slug)</th>
                                        <th className="text-left py-3 px-2">Số lượng Item</th>
                                        <th className="text-left py-3 px-2">Ngày tạo</th>
                                        <th className="text-left py-3 px-2 text-right">Thao tác</th>
                                    </tr>
                                </thead>
                                <tbody>
                                    {filteredMenus.map((menu: any) => (
                                        <tr key={menu.id} className="border-b hover:bg-muted/50">
                                            <td className="py-3 px-2 font-medium">
                                                <div className="flex items-center gap-2">
                                                    <MenuIcon className="h-4 w-4 text-primary" />
                                                    {menu.name}
                                                </div>
                                            </td>
                                            <td className="py-3 px-2">
                                                <code className="text-xs bg-muted px-2 py-1 rounded">{menu.location || 'N/A'}</code>
                                            </td>
                                            <td className="py-3 px-2">
                                                {menu._count?.items || 0} items
                                            </td>
                                            <td className="py-3 px-2 text-sm text-muted-foreground">
                                                {new Date(menu.createdAt).toLocaleDateString('vi-VN')}
                                            </td>
                                            <td className="py-3 px-2 text-right">
                                                <div className="flex justify-end gap-1">
                                                    <Button size="sm" variant="ghost" onClick={() => navigate(`/menus/edit/${menu.id}`)}>
                                                        <Edit className="h-4 w-4" />
                                                    </Button>
                                                    <Button size="sm" variant="ghost" onClick={() => handleDelete(menu.id)}>
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
