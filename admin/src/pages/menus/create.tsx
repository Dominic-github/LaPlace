import { useCreate } from "@refinedev/core";
import { useNavigate } from "react-router-dom";
import { useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { ArrowLeft, Save } from "lucide-react";

export const MenuCreate = () => {
    const navigate = useNavigate();
    const { mutate } = useCreate();
    const [errors, setErrors] = useState<Record<string, string>>({});

    const onSubmit = (e: React.FormEvent<HTMLFormElement>) => {
        e.preventDefault();
        const formData = new FormData(e.currentTarget);
        const name = formData.get("name") as string;
        const location = formData.get("location") as string;

        // Validate
        const newErrors: Record<string, string> = {};
        if (!name?.trim()) {
            newErrors.name = "Vui lòng nhập tên menu";
        }
        if (Object.keys(newErrors).length > 0) {
            setErrors(newErrors);
            return;
        }
        setErrors({});

        mutate({
            resource: "menus",
            values: { name: name.trim(), location: location?.trim() || "" },
        }, {
            onSuccess: (result: any) => {
                navigate(`/menus/edit/${result.data.id}`);
            }
        });
    };

    return (
        <div className="space-y-6 max-w-2xl mx-auto">
            <div className="flex items-center gap-4">
                <Button variant="ghost" size="icon" onClick={() => navigate("/menus")}>
                    <ArrowLeft className="h-5 w-5" />
                </Button>
                <h1 className="text-3xl font-bold">Thêm Menu Mới</h1>
            </div>

            <Card>
                <CardHeader>
                    <CardTitle>Thông tin cơ bản</CardTitle>
                </CardHeader>
                <CardContent>
                    <form onSubmit={onSubmit} className="space-y-4">
                        <div className="space-y-2">
                            <Label htmlFor="name">Tên Menu</Label>
                            <Input
                                id="name"
                                name="name"
                                placeholder="VD: Header Menu, Footer Main"
                            />
                            {errors.name && <p className="text-xs text-red-500">{errors.name}</p>}
                        </div>

                        <div className="space-y-2">
                            <Label htmlFor="location">Vị trí (Location ID)</Label>
                            <Input
                                id="location"
                                name="location"
                                placeholder="VD: HEADER, FOOTER"
                            />
                            <p className="text-xs text-muted-foreground">Sử dụng ID này để truy xuất từ frontend.</p>
                        </div>

                        <div className="flex justify-end gap-2 pt-4">
                            <Button type="button" variant="outline" onClick={() => navigate("/menus")}>
                                Hủy
                            </Button>
                            <Button type="submit">
                                <Save className="h-4 w-4 mr-2" />
                                Tiếp tục & Thêm Item
                            </Button>
                        </div>
                    </form>
                </CardContent>
            </Card>
        </div>
    );
};
