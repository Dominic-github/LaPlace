import { useOne, useUpdate, useDelete, useCreate, useList } from "@refinedev/core";
import { useNavigate, useParams } from "react-router-dom";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { ArrowLeft, Save, Plus, Trash2, GripVertical, Edit2 } from "lucide-react";
import { useState, useEffect } from "react";

export const MenuEdit = () => {
    const { id } = useParams();
    const navigate = useNavigate();
    const { mutate: updateMenu } = useUpdate();
    const { mutate: createItem } = useCreate();
    const { mutate: updateItem } = useUpdate();
    const { mutate: deleteItem } = useDelete();

    const { data: menuData, isLoading: menuLoading, refetch: refetchMenu } = useOne({
        resource: "menus",
        id: id as string,
    });

    const { data: itemsData, isLoading: itemsLoading, refetch: refetchItems } = useList({
        resource: "menus/items",
        filters: [{ field: "menuId", operator: "eq", value: id }],
        sorters: [{ field: "order", order: "asc" }],
        pagination: { pageSize: 1000 },
        queryOptions: {
            enabled: !!id
        }
    });

    const [editingItem, setEditingItem] = useState<any>(null);
    const [menuName, setMenuName] = useState("");
    const [menuLocation, setMenuLocation] = useState("");

    const menu = menuData?.data || {} as any;
    const items = (itemsData?.data || []) as any[];

    useEffect(() => {
        if (menu.name) {
            setMenuName(menu.name);
            setMenuLocation(menu.location || "");
        }
    }, [menu]);

    const onUpdateMenu = (e: React.FormEvent<HTMLFormElement>) => {
        e.preventDefault();
        updateMenu({
            resource: "menus",
            id: id as string,
            values: { name: menuName, location: menuLocation },
        });
    };

    const handleSaveItem = (data: any) => {
        if (editingItem) {
            updateItem({
                resource: "menus/items",
                id: editingItem.id,
                values: { ...data, menuId: id },
            }, {
                onSuccess: () => {
                    setEditingItem(null);
                    refetchItems();
                }
            });
        } else {
            createItem({
                resource: "menus/items",
                values: { ...data, menuId: id, order: items.length },
            }, {
                onSuccess: () => {
                    refetchItems();
                }
            });
        }
    };

    const handleDeleteItem = (itemId: string) => {
        if (confirm("Xóa mục menu này?")) {
            deleteItem({ resource: "menus/items", id: itemId }, { onSuccess: () => refetchItems() });
        }
    };

    if (menuLoading) return <div>Loading...</div>;

    return (
        <div className="space-y-6">
            <div className="flex items-center gap-4">
                <Button variant="ghost" size="icon" onClick={() => navigate("/menus")}>
                    <ArrowLeft className="h-5 w-5" />
                </Button>
                <h1 className="text-3xl font-bold">Chỉnh sửa Menu</h1>
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
                {/* Menu Settings */}
                <div className="lg:col-span-1 space-y-6">
                    <Card>
                        <CardHeader>
                            <CardTitle>Cấu hình Menu</CardTitle>
                        </CardHeader>
                        <CardContent>
                            <form onSubmit={onUpdateMenu} className="space-y-4">
                                <div className="space-y-2">
                                    <Label htmlFor="name">Tên Menu</Label>
                                    <Input
                                        id="name"
                                        value={menuName}
                                        onChange={e => setMenuName(e.target.value)}
                                        required
                                    />
                                </div>
                                <div className="space-y-2">
                                    <Label htmlFor="location">Vị trí (Location ID)</Label>
                                    <Input
                                        id="location"
                                        value={menuLocation}
                                        onChange={e => setMenuLocation(e.target.value)}
                                    />
                                </div>
                                <Button type="submit" className="w-full">
                                    <Save className="h-4 w-4 mr-2" />
                                    Lưu Cấu Hình
                                </Button>
                            </form>
                        </CardContent>
                    </Card>

                    <Card>
                        <CardHeader>
                            <CardTitle>{editingItem ? "Sửa Menu Item" : "Thêm Menu Item"}</CardTitle>
                        </CardHeader>
                        <CardContent>
                            <form
                                onSubmit={(e) => {
                                    e.preventDefault();
                                    const formData = new FormData(e.currentTarget);
                                    const data = Object.fromEntries(formData.entries());
                                    handleSaveItem(data);
                                    if (!editingItem) {
                                        (e.currentTarget as HTMLFormElement).reset();
                                    }
                                }}
                                key={editingItem?.id || 'new'}
                                className="space-y-4"
                            >
                                <div className="space-y-2">
                                    <Label htmlFor="label">Nhãn hiển thị</Label>
                                    <Input id="label" name="label" defaultValue={editingItem?.label} required />
                                </div>
                                <div className="space-y-2">
                                    <Label htmlFor="href">Đường dẫn (URL)</Label>
                                    <Input id="href" name="href" defaultValue={editingItem?.href} required placeholder="/vi-du" />
                                </div>
                                <div className="space-y-2">
                                    <Label htmlFor="icon">Icon (Lucide name)</Label>
                                    <Input id="icon" name="icon" defaultValue={editingItem?.icon} placeholder="Home, Settings..." />
                                </div>
                                <div className="space-y-2">
                                    <Label htmlFor="parentId">Cấp cha (Nếu có)</Label>
                                    <select
                                        id="parentId"
                                        name="parentId"
                                        className="w-full border rounded-md p-2 bg-background"
                                        defaultValue={editingItem?.parentId || ""}
                                    >
                                        <option value="">-- Cấp cao nhất --</option>
                                        {items.filter((i: any) => i.id !== editingItem?.id && !i.parentId).map((i: any) => (
                                            <option key={i.id} value={i.id}>{i.label}</option>
                                        ))}
                                    </select>
                                </div>
                                <div className="space-y-2">
                                    <Label htmlFor="order">Thứ tự</Label>
                                    <Input id="order" name="order" type="number" defaultValue={editingItem?.order || 0} />
                                </div>

                                <div className="flex gap-2">
                                    {editingItem && (
                                        <Button type="button" variant="outline" className="flex-1" onClick={() => setEditingItem(null)}>
                                            Hủy
                                        </Button>
                                    )}
                                    <Button type="submit" className="flex-1">
                                        {editingItem ? "Cập nhật" : "Thêm vào Menu"}
                                    </Button>
                                </div>
                            </form>
                        </CardContent>
                    </Card>
                </div>

                {/* Items List */}
                <div className="lg:col-span-2">
                    <Card>
                        <CardHeader>
                            <CardTitle>Cấu trúc Menu</CardTitle>
                        </CardHeader>
                        <CardContent>
                            {itemsLoading ? (
                                <div className="py-10 text-center">Đang tải item...</div>
                            ) : items.length === 0 ? (
                                <div className="py-20 text-center border-2 border-dashed rounded-xl text-muted-foreground">
                                    <Plus className="h-10 w-10 mx-auto mb-2 opacity-20" />
                                    Chưa có mục nào trong menu này
                                </div>
                            ) : (
                                <div className="space-y-2">
                                    {items.filter((i: any) => !i.parentId).map((item: any) => (
                                        <div key={item.id} className="space-y-2">
                                            <div className="flex items-center gap-3 p-3 bg-muted/30 rounded-lg border group">
                                                <GripVertical className="h-4 w-4 text-muted-foreground opacity-30 cursor-grab" />
                                                <div className="flex-1 flex items-center justify-between">
                                                    <div>
                                                        <span className="font-semibold">{item.label}</span>
                                                        <span className="ml-3 text-xs text-muted-foreground font-mono">{item.href}</span>
                                                    </div>
                                                    <div className="flex items-center gap-1 opacity-0 group-hover:opacity-100 transition-opacity">
                                                        <Button size="sm" variant="ghost" onClick={() => setEditingItem(item)}>
                                                            <Edit2 className="h-3 w-3" />
                                                        </Button>
                                                        <Button size="sm" variant="ghost" onClick={() => handleDeleteItem(item.id)}>
                                                            <Trash2 className="h-3 w-3 text-red-500" />
                                                        </Button>
                                                    </div>
                                                </div>
                                            </div>

                                            {/* Children */}
                                            <div className="ml-8 space-y-2 border-l-2 pl-4">
                                                {items.filter((i: any) => i.parentId === item.id).map((child: any) => (
                                                    <div key={child.id} className="flex items-center justify-between p-2 bg-muted/10 rounded border group">
                                                        <div>
                                                            <span className="text-sm font-medium">{child.label}</span>
                                                            <span className="ml-3 text-[10px] text-muted-foreground font-mono">{child.href}</span>
                                                        </div>
                                                        <div className="flex items-center gap-1 opacity-0 group-hover:opacity-100 transition-opacity">
                                                            <Button size="sm" variant="ghost" onClick={() => setEditingItem(child)}>
                                                                <Edit2 className="h-3 w-3" />
                                                            </Button>
                                                            <Button size="sm" variant="ghost" onClick={() => handleDeleteItem(child.id)}>
                                                                <Trash2 className="h-3 w-3 text-red-500" />
                                                            </Button>
                                                        </div>
                                                    </div>
                                                ))}
                                            </div>
                                        </div>
                                    ))}
                                </div>
                            )}
                        </CardContent>
                    </Card>
                </div>
            </div>
        </div>
    );
};
