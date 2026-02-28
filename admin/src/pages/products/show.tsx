import { useOne, useNavigation } from "@refinedev/core";
import { useParams } from "react-router-dom";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Spinner } from "@/components/ui/spinner";
import { ArrowLeft, Pencil, Package } from "lucide-react";

export const ProductShow = () => {
    const { id } = useParams();
    const { push, goBack } = useNavigation();
    const { data, isLoading } = useOne({
        resource: "products",
        id: id!,
    });

    const product = data?.data;

    if (isLoading) {
        return (
            <div className="flex items-center justify-center h-96">
                <Spinner size="lg" />
            </div>
        );
    }

    if (!product) {
        return (
            <div className="text-center py-12">
                <p className="text-muted-foreground">Không tìm thấy sản phẩm</p>
            </div>
        );
    }

    return (
        <div className="space-y-6">
            {/* Header */}
            <div className="flex items-center justify-between">
                <div className="flex items-center gap-4">
                    <Button variant="ghost" size="sm" onClick={goBack}>
                        <ArrowLeft className="h-4 w-4 mr-2" />
                        Quay lại
                    </Button>
                    <div>
                        <h1 className="text-3xl font-bold">{product.name}</h1>
                        <p className="text-muted-foreground mt-1">{product.slug}</p>
                    </div>
                </div>
                <Button onClick={() => push(`/products/edit/${id}`)}>
                    <Pencil className="h-4 w-4 mr-2" />
                    Chỉnh sửa
                </Button>
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
                {/* Main Info */}
                <div className="lg:col-span-2 space-y-6">
                    <Card>
                        <CardHeader>
                            <CardTitle>Thông tin sản phẩm</CardTitle>
                        </CardHeader>
                        <CardContent className="space-y-4">
                            <div className="grid grid-cols-2 gap-4">
                                <div>
                                    <p className="text-sm text-muted-foreground">Tên sản phẩm</p>
                                    <p className="font-medium">{product.name}</p>
                                </div>
                                <div>
                                    <p className="text-sm text-muted-foreground">Slug</p>
                                    <p className="font-medium">{product.slug}</p>
                                </div>
                                <div>
                                    <p className="text-sm text-muted-foreground">SKU</p>
                                    <p className="font-medium">{product.sku || "—"}</p>
                                </div>
                                <div>
                                    <p className="text-sm text-muted-foreground">Danh mục</p>
                                    <p className="font-medium">{product.category?.name || "—"}</p>
                                </div>
                            </div>

                            {product.description && (
                                <div>
                                    <p className="text-sm text-muted-foreground mb-2">Mô tả</p>
                                    <p className="whitespace-pre-wrap">{product.description}</p>
                                </div>
                            )}
                        </CardContent>
                    </Card>

                    <Card>
                        <CardHeader>
                            <CardTitle>Giá & Kho hàng</CardTitle>
                        </CardHeader>
                        <CardContent>
                            <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                                <div>
                                    <p className="text-sm text-muted-foreground">Giá bán</p>
                                    <p className="font-medium text-lg">
                                        {product.price?.toLocaleString()} VNĐ
                                    </p>
                                </div>
                                <div>
                                    <p className="text-sm text-muted-foreground">Giá so sánh</p>
                                    <p className="font-medium text-lg text-muted-foreground line-through">
                                        {product.comparePrice ? `${product.comparePrice?.toLocaleString()} VNĐ` : "—"}
                                    </p>
                                </div>
                                <div>
                                    <p className="text-sm text-muted-foreground">Tồn kho</p>
                                    <Badge variant={product.stock > 0 ? "success" : "destructive"}>
                                        {product.stock}
                                    </Badge>
                                </div>
                                <div>
                                    <p className="text-sm text-muted-foreground">Đã bán</p>
                                    <p className="font-medium">{product.soldCount || 0}</p>
                                </div>
                            </div>
                        </CardContent>
                    </Card>

                    {/* Images */}
                    {product.images && product.images.length > 0 && (
                        <Card>
                            <CardHeader>
                                <CardTitle>Hình ảnh</CardTitle>
                            </CardHeader>
                            <CardContent>
                                <div className="grid grid-cols-4 gap-4">
                                    {product.images.map((image: string, index: number) => (
                                        <img
                                            key={index}
                                            src={image}
                                            alt={`${product.name} ${index + 1}`}
                                            className="w-full aspect-square object-cover rounded-lg"
                                        />
                                    ))}
                                </div>
                            </CardContent>
                        </Card>
                    )}
                </div>

                {/* Sidebar */}
                <div className="space-y-6">
                    {/* Product Image */}
                    <Card>
                        <CardHeader>
                            <CardTitle>Hình ảnh</CardTitle>
                        </CardHeader>
                        <CardContent>
                            {(product.thumbnail || product.images?.[0]) ? (
                                <img
                                    src={product.thumbnail || product.images?.[0]}
                                    alt={product.name}
                                    className="w-full aspect-square object-cover rounded-lg"
                                />
                            ) : (
                                <div className="w-full aspect-square bg-muted rounded-lg flex items-center justify-center">
                                    <Package className="h-16 w-16 text-muted-foreground" />
                                </div>
                            )}
                            {/* Additional Images */}
                            {product.images && product.images.length > 1 && (
                                <div className="grid grid-cols-4 gap-2 mt-3">
                                    {product.images.slice(1, 5).map((image: string, index: number) => (
                                        <img
                                            key={index}
                                            src={image}
                                            alt={`${product.name} ${index + 2}`}
                                            className="w-full aspect-square object-cover rounded"
                                        />
                                    ))}
                                </div>
                            )}
                        </CardContent>
                    </Card>

                    <Card>
                        <CardHeader>
                            <CardTitle>Trạng thái</CardTitle>
                        </CardHeader>
                        <CardContent className="space-y-4">
                            <div className="flex items-center justify-between">
                                <span className="text-muted-foreground">Trạng thái</span>
                                <Badge variant={product.isActive ? "success" : "secondary"}>
                                    {product.isActive ? "Đang bán" : "Ẩn"}
                                </Badge>
                            </div>
                            <div className="flex items-center justify-between">
                                <span className="text-muted-foreground">Nổi bật</span>
                                <Badge variant={product.isFeatured ? "default" : "secondary"}>
                                    {product.isFeatured ? "Có" : "Không"}
                                </Badge>
                            </div>
                        </CardContent>
                    </Card>

                    <Card>
                        <CardHeader>
                            <CardTitle>Thông tin khác</CardTitle>
                        </CardHeader>
                        <CardContent className="space-y-4 text-sm">
                            <div className="flex justify-between">
                                <span className="text-muted-foreground">ID</span>
                                <span className="font-mono">{product.id}</span>
                            </div>
                            <div className="flex justify-between">
                                <span className="text-muted-foreground">Ngày tạo</span>
                                <span>{new Date(product.createdAt).toLocaleDateString("vi-VN")}</span>
                            </div>
                            <div className="flex justify-between">
                                <span className="text-muted-foreground">Cập nhật</span>
                                <span>{new Date(product.updatedAt).toLocaleDateString("vi-VN")}</span>
                            </div>
                        </CardContent>
                    </Card>
                </div>
            </div>
        </div>
    );
};
