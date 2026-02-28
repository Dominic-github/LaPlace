import { useState } from "react";
import { useList, useUpdate, useNavigation } from "@refinedev/core";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
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
import { Star, Check, X, MessageSquare, Eye } from "lucide-react";

interface Review {
  id: string;
  rating: number;
  comment: string;
  isApproved: boolean;
  product?: { id: string; name: string };
  user?: { email: string; firstName?: string; lastName?: string };
  createdAt: string;
}

// Star Rating Component
const StarRating = ({ rating }: { rating: number }) => {
  return (
    <div className="flex items-center gap-0.5">
      {[1, 2, 3, 4, 5].map((star) => (
        <Star
          key={star}
          className={`h-4 w-4 ${star <= rating
            ? "fill-yellow-400 text-yellow-400"
            : "text-muted-foreground"
            }`}
        />
      ))}
    </div>
  );
};

export const ReviewList = () => {
  const [current, setCurrent] = useState(1);
  const [pageSize] = useState(10);

  const { data, isLoading, refetch, isError, error } = useList<Review>({
    resource: "product-reviews",
    pagination: { current, pageSize },
    sorters: [{ field: "createdAt", order: "desc" }],
  });

  // Debug
  if (isError) {
    console.error('Error loading reviews:', error);
  }

  const { mutate: update, isLoading: isUpdating } = useUpdate();
  const { push } = useNavigation();

  const reviews = data?.data || [];
  const total = data?.total || 0;

  // Debug: Log API response
  console.log('Reviews data:', data);
  console.log('Reviews array:', reviews);
  console.log('Total:', total);

  const handleApprove = (id: string, approve: boolean) => {
    update(
      {
        resource: "product-reviews",
        id,
        values: { action: approve ? "approve" : "unapprove" },
      },
      { onSuccess: () => refetch() }
    );
  };

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-3xl font-bold flex items-center gap-2">
          <MessageSquare className="h-8 w-8" />
          Đánh giá sản phẩm
        </h1>
        <p className="text-muted-foreground mt-1">
          Quản lý đánh giá của khách hàng
        </p>
      </div>

      <Card>
        <CardHeader>
          <CardTitle>Danh sách đánh giá ({total})</CardTitle>
        </CardHeader>
        <CardContent>
          {isLoading ? (
            <div className="flex items-center justify-center h-64">
              <Spinner size="lg" />
            </div>
          ) : isError ? (
            <div className="text-center py-12 text-destructive">
              <p>Lỗi tải dữ liệu: {(error as any)?.message || 'Unknown error'}</p>
              <Button variant="outline" onClick={() => refetch()} className="mt-4">
                Thử lại
              </Button>
            </div>
          ) : reviews.length === 0 ? (
            <div className="text-center py-12 text-muted-foreground">
              Không có đánh giá nào
            </div>
          ) : (
            <>
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>Sản phẩm</TableHead>
                    <TableHead>Người đánh giá</TableHead>
                    <TableHead className="text-center">Đánh giá</TableHead>
                    <TableHead className="max-w-xs">Nội dung</TableHead>
                    <TableHead className="text-center">Trạng thái</TableHead>
                    <TableHead className="text-right w-28">Thao tác</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {reviews.map((review) => (
                    <TableRow key={review.id}>
                      <TableCell className="font-medium">
                        {review.product?.name || "—"}
                      </TableCell>
                      <TableCell>
                        <div className="font-medium">
                          {review.user?.firstName} {review.user?.lastName}
                        </div>
                        <div className="text-sm text-muted-foreground">
                          {review.user?.email}
                        </div>
                      </TableCell>
                      <TableCell className="text-center">
                        <StarRating rating={review.rating} />
                      </TableCell>
                      <TableCell className="max-w-xs truncate">
                        {review.comment}
                      </TableCell>
                      <TableCell className="text-center">
                        <Badge variant={review.isApproved ? "success" : "warning"}>
                          {review.isApproved ? "Đã duyệt" : "Chờ duyệt"}
                        </Badge>
                      </TableCell>
                      <TableCell className="text-right">
                        <div className="flex items-center justify-end gap-1">
                          <Button
                            variant="ghost"
                            size="sm"
                            onClick={() => push(`/product-reviews/show/${review.id}`)}
                            title="Xem chi tiết / Trả lời"
                          >
                            <Eye className="h-4 w-4" />
                          </Button>
                          {!review.isApproved ? (
                            <Button
                              variant="ghost"
                              size="sm"
                              onClick={() => handleApprove(review.id, true)}
                              disabled={isUpdating}
                              className="text-green-600"
                              title="Duyệt"
                            >
                              <Check className="h-4 w-4" />
                            </Button>
                          ) : (
                            <Button
                              variant="ghost"
                              size="sm"
                              onClick={() => handleApprove(review.id, false)}
                              disabled={isUpdating}
                              className="text-destructive"
                              title="Bỏ duyệt"
                            >
                              <X className="h-4 w-4" />
                            </Button>
                          )}
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
    </div>
  );
};


export { ReviewShow } from "./show";
