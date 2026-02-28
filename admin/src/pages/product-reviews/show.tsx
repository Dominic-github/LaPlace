import { useShow, useUpdate, useDelete, useNavigation } from "@refinedev/core";
import { useParams } from "react-router-dom";
import { useState, useEffect } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Textarea } from "@/components/ui/textarea";
import { Spinner } from "@/components/ui/spinner";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import {
    ArrowLeft,
    Star,
    CheckCircle,
    Trash2,
    Send,
    User,
    Package,
    Clock,
    MessageSquare,
} from "lucide-react";

export const ReviewShow = () => {
    const { id } = useParams();
    const { goBack, push } = useNavigation();
    const { queryResult } = useShow({
        resource: "product-reviews",
        id: id!,
    });
    const { data, isLoading, refetch } = queryResult;
    const review = data?.data;

    const { mutate: updateReview, isLoading: isUpdating } = useUpdate();
    const { mutate: deleteReview, isLoading: isDeleting } = useDelete();

    const [replyContent, setReplyContent] = useState("");
    const [isEditingReply, setIsEditingReply] = useState(false);

    useEffect(() => {
        // Only populate textarea on initial load, not after submitting
        if (review?.adminReply && !isEditingReply) {
            setReplyContent(review.adminReply);
        }
    }, [review?.adminReply]);

    if (isLoading) {
        return (
            <div className="flex items-center justify-center h-96">
                <Spinner size="lg" />
            </div>
        );
    }

    if (!review) {
        return (
            <div className="text-center py-12">
                <p className="text-muted-foreground">Không tìm thấy đánh giá</p>
            </div>
        );
    }

    const handleApprove = () => {
        updateReview(
            {
                resource: "product-reviews",
                id: id!,
                values: { action: "approve" },
            },
            {
                onSuccess: () => refetch(),
            }
        );
    };

    const handleReply = () => {
        if (!replyContent.trim()) return;

        updateReview(
            {
                resource: "product-reviews",
                id: id!,
                values: { action: "reply", reply: replyContent },
            },
            {
                onSuccess: () => {
                    refetch();
                    setReplyContent(""); // Clear textarea after successful reply
                    setIsEditingReply(true); // Prevent useEffect from repopulating
                },
            }
        );
    };

    const handleDelete = () => {
        if (confirm("Bạn có chắc chắn muốn xóa đánh giá này?")) {
            deleteReview(
                {
                    resource: "product-reviews",
                    id: id!,
                },
                {
                    onSuccess: () => push("/product-reviews"),
                }
            );
        }
    };

    return (
        <div className="space-y-6 max-w-5xl mx-auto">
            {/* Header */}
            <div className="flex items-center justify-between">
                <div className="flex items-center gap-4">
                    <Button variant="ghost" size="sm" onClick={goBack}>
                        <ArrowLeft className="h-4 w-4 mr-2" />
                        Quay lại
                    </Button>
                    <div>
                        <h1 className="text-2xl font-bold">Chi tiết đánh giá</h1>
                        <p className="text-muted-foreground text-sm">
                            ID: {review.id}
                        </p>
                    </div>
                </div>
                <div className="flex items-center gap-2">
                    {!review.isApproved && (
                        <Button
                            onClick={handleApprove}
                            disabled={isUpdating}
                            className="bg-green-600 hover:bg-green-700"
                        >
                            <CheckCircle className="h-4 w-4 mr-2" />
                            Duyệt đánh giá
                        </Button>
                    )}
                    <Button
                        variant="destructive"
                        onClick={handleDelete}
                        disabled={isDeleting}
                    >
                        <Trash2 className="h-4 w-4 mr-2" />
                        Xóa
                    </Button>
                </div>
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
                {/* Main Content */}
                <div className="lg:col-span-2 space-y-6">
                    {/* Review Content */}
                    <Card>
                        <CardHeader className="flex flex-row items-center justify-between">
                            <CardTitle className="flex items-center gap-2">
                                <Star className="h-5 w-5 text-yellow-500" />
                                Nội dung đánh giá
                            </CardTitle>
                            <Badge variant={review.isApproved ? "success" : "warning"}>
                                {review.isApproved ? "Đã duyệt" : "Chờ duyệt"}
                            </Badge>
                        </CardHeader>
                        <CardContent className="space-y-4">
                            {/* Rating */}
                            <div className="flex items-center gap-2">
                                {Array.from({ length: 5 }).map((_, i) => (
                                    <Star
                                        key={i}
                                        className={`h-6 w-6 ${i < review.rating
                                                ? "fill-yellow-400 text-yellow-400"
                                                : "text-gray-300"
                                            }`}
                                    />
                                ))}
                                <span className="text-muted-foreground ml-2">
                                    ({review.rating}/5 sao)
                                </span>
                            </div>

                            {/* Title */}
                            {review.title && (
                                <h3 className="text-xl font-semibold">{review.title}</h3>
                            )}

                            {/* Comment */}
                            <p className="text-muted-foreground whitespace-pre-wrap">
                                {review.comment}
                            </p>

                            {/* Review Images */}
                            {review.images && review.images.length > 0 && (
                                <div className="flex gap-2 flex-wrap mt-4">
                                    {review.images.map((img: string, idx: number) => (
                                        <img
                                            key={idx}
                                            src={img}
                                            alt={`Review image ${idx + 1}`}
                                            className="w-24 h-24 object-cover rounded-lg border"
                                        />
                                    ))}
                                </div>
                            )}

                            {/* Timestamp */}
                            <div className="flex items-center gap-2 text-sm text-muted-foreground pt-4 border-t">
                                <Clock className="h-4 w-4" />
                                Đánh giá vào{" "}
                                {new Date(review.createdAt).toLocaleString("vi-VN")}
                            </div>
                        </CardContent>
                    </Card>

                    {/* Admin Reply Section */}
                    <Card>
                        <CardHeader>
                            <CardTitle className="flex items-center gap-2">
                                <MessageSquare className="h-5 w-5" />
                                Phản hồi của quản trị viên
                            </CardTitle>
                        </CardHeader>
                        <CardContent className="space-y-4">
                            {review.adminReply && (
                                <div className="p-4 bg-blue-50 dark:bg-blue-950/30 rounded-lg border border-blue-200 dark:border-blue-800">
                                    <div className="flex items-center gap-2 mb-2">
                                        <Badge variant="secondary">Admin</Badge>
                                        {review.adminReplyAt && (
                                            <span className="text-xs text-muted-foreground">
                                                {new Date(review.adminReplyAt).toLocaleString("vi-VN")}
                                            </span>
                                        )}
                                    </div>
                                    <p className="text-sm">{review.adminReply}</p>
                                </div>
                            )}

                            <Textarea
                                placeholder="Nhập nội dung phản hồi cho khách hàng..."
                                value={replyContent}
                                onChange={(e) => setReplyContent(e.target.value)}
                                rows={4}
                            />

                            <div className="flex justify-end">
                                <Button
                                    onClick={handleReply}
                                    disabled={isUpdating || !replyContent.trim()}
                                >
                                    <Send className="h-4 w-4 mr-2" />
                                    {isUpdating ? "Đang gửi..." : review.adminReply ? "Cập nhật phản hồi" : "Gửi phản hồi"}
                                </Button>
                            </div>
                        </CardContent>
                    </Card>
                </div>

                {/* Sidebar */}
                <div className="space-y-6">
                    {/* Customer Info */}
                    <Card>
                        <CardHeader>
                            <CardTitle className="text-sm flex items-center gap-2">
                                <User className="h-4 w-4" />
                                Thông tin khách hàng
                            </CardTitle>
                        </CardHeader>
                        <CardContent>
                            <div className="flex flex-col items-center text-center">
                                <Avatar className="h-16 w-16 mb-3">
                                    <AvatarImage src={review.user?.avatar} />
                                    <AvatarFallback className="text-lg">
                                        {review.user?.firstName?.[0] || "U"}
                                    </AvatarFallback>
                                </Avatar>
                                <h4 className="font-semibold">
                                    {review.user?.firstName} {review.user?.lastName}
                                </h4>
                                <p className="text-sm text-muted-foreground">
                                    {review.user?.email}
                                </p>
                            </div>
                        </CardContent>
                    </Card>

                    {/* Product Info */}
                    <Card>
                        <CardHeader>
                            <CardTitle className="text-sm flex items-center gap-2">
                                <Package className="h-4 w-4" />
                                Sản phẩm được đánh giá
                            </CardTitle>
                        </CardHeader>
                        <CardContent>
                            <div className="flex flex-col gap-3">
                                <div className="aspect-square relative rounded-lg overflow-hidden bg-muted">
                                    {review.product?.thumbnail ? (
                                        <img
                                            src={review.product.thumbnail}
                                            alt={review.product.name}
                                            className="object-cover w-full h-full"
                                        />
                                    ) : (
                                        <div className="flex items-center justify-center w-full h-full">
                                            <Package className="h-12 w-12 text-muted-foreground" />
                                        </div>
                                    )}
                                </div>
                                <div>
                                    <h4 className="font-medium text-sm line-clamp-2">
                                        {review.product?.name}
                                    </h4>
                                    {review.product?.slug && (
                                        <Button
                                            variant="link"
                                            className="px-0 h-auto text-xs"
                                            onClick={() =>
                                                window.open(
                                                    `/products/show/${review.product.id}`,
                                                    "_blank"
                                                )
                                            }
                                        >
                                            Xem chi tiết sản phẩm
                                        </Button>
                                    )}
                                </div>
                            </div>
                        </CardContent>
                    </Card>
                </div>
            </div>
        </div>
    );
};