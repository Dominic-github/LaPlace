import { useEffect, useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Select } from "@/components/ui/select";
import { Button } from "@/components/ui/button";
import { Spinner } from "@/components/ui/spinner";
import { Badge } from "@/components/ui/badge";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { DollarSign, ShoppingCart, TrendingUp, BarChart3, Download, RefreshCw } from "lucide-react";

const API_URL = import.meta.env.VITE_API_URL || "http://localhost:5002/api";

interface ReportData {
  summary: {
    totalRevenue: number;
    totalOrders: number;
    averageOrderValue: number;
    growth?: number;
  };
  timeline: Array<{ date: string; revenue: number; orders: number }>;
  topProducts: Array<{
    product: { id: string; name: string; sku: string };
    quantity: number;
    revenue: number;
  }>;
}

export const SalesReportPage = () => {
  const [loading, setLoading] = useState(true);
  const [report, setReport] = useState<ReportData | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [startDate, setStartDate] = useState(() => {
    const d = new Date();
    d.setDate(d.getDate() - 30);
    return d.toISOString().split("T")[0];
  });
  const [endDate, setEndDate] = useState(() => new Date().toISOString().split("T")[0]);
  const [groupBy, setGroupBy] = useState("day");

  useEffect(() => {
    fetchReport();
  }, [startDate, endDate, groupBy]);

  const fetchReport = async () => {
    setLoading(true);
    setError(null);
    try {
      const token = localStorage.getItem("token");
      const params = new URLSearchParams({
        groupBy,
        startDate: new Date(startDate).toISOString(),
        endDate: new Date(endDate).toISOString(),
      });

      const response = await fetch(`${API_URL}/reports/sales?${params}`, {
        headers: { Authorization: `Bearer ${token}` },
      });
      const data = await response.json();
      if (data.success) {
        setReport(data.data);
      } else {
        setError(data.message || "Không thể tải báo cáo");
      }
    } catch (error) {
      console.error("Failed to fetch sales report:", error);
      setError("Lỗi kết nối đến server");
    } finally {
      setLoading(false);
    }
  };

  const exportToCSV = () => {
    if (!report) return;

    const rows = [
      ["Báo cáo bán hàng"],
      [`Từ ${startDate} đến ${endDate}`],
      [],
      ["Tổng quan"],
      ["Tổng doanh thu", `${(summary.totalRevenue || 0).toLocaleString()} VNĐ`],
      ["Tổng đơn hàng", summary.totalOrders || 0],
      ["Giá trị đơn TB", `${Math.round(summary.averageOrderValue || 0).toLocaleString()} VNĐ`],
      [],
      ["Xu hướng doanh thu"],
      ["Ngày", "Doanh thu", "Đơn hàng"],
      ...timeline.map((item) => [item.date, item.revenue || 0, item.orders || 0]),
      [],
      ["Top sản phẩm bán chạy"],
      ["Sản phẩm", "SKU", "Số lượng", "Doanh thu"],
      ...topProducts.map((item) => [
        item.product?.name || "N/A",
        item.product?.sku || "N/A",
        item.quantity || 0,
        item.revenue || 0,
      ]),
    ];

    const csvContent = rows.map((row) => row.join(",")).join("\n");
    const blob = new Blob(["\uFEFF" + csvContent], { type: "text/csv;charset=utf-8;" });
    const link = document.createElement("a");
    link.href = URL.createObjectURL(blob);
    link.download = `sales-report-${startDate}-${endDate}.csv`;
    link.click();
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center h-96">
        <Spinner size="lg" />
      </div>
    );
  }

  if (error) {
    return (
      <div className="space-y-6">
        <div>
          <h1 className="text-3xl font-bold flex items-center gap-2">
            <BarChart3 className="h-8 w-8" />
            Báo cáo bán hàng
          </h1>
        </div>
        <Card>
          <CardContent className="pt-6">
            <div className="text-center py-12">
              <p className="text-destructive mb-4">{error}</p>
              <Button onClick={fetchReport}>
                <RefreshCw className="h-4 w-4 mr-2" />
                Thử lại
              </Button>
            </div>
          </CardContent>
        </Card>
      </div>
    );
  }

  const summary = report?.summary || { totalRevenue: 0, totalOrders: 0, averageOrderValue: 0 };
  const timeline = report?.timeline || [];
  const topProducts = report?.topProducts || [];

  // Calculate max revenue for progress bars
  const maxRevenue = Math.max(...topProducts.map((p) => p.revenue || 0), 1);

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold flex items-center gap-2">
            <BarChart3 className="h-8 w-8" />
            Báo cáo bán hàng
          </h1>
          <p className="text-muted-foreground mt-1">Phân tích doanh thu và đơn hàng</p>
        </div>
        <Button onClick={exportToCSV} variant="outline">
          <Download className="h-4 w-4 mr-2" />
          Xuất CSV
        </Button>
      </div>

      <Card>
        <CardContent className="pt-6">
          <div className="flex flex-wrap gap-4 items-end">
            <div className="space-y-2">
              <Label>Từ ngày</Label>
              <Input
                type="date"
                value={startDate}
                onChange={(e) => setStartDate(e.target.value)}
              />
            </div>
            <div className="space-y-2">
              <Label>Đến ngày</Label>
              <Input
                type="date"
                value={endDate}
                onChange={(e) => setEndDate(e.target.value)}
              />
            </div>
            <div className="space-y-2">
              <Label>Nhóm theo</Label>
              <Select value={groupBy} onChange={(e) => setGroupBy(e.target.value)}>
                <option value="day">Ngày</option>
                <option value="month">Tháng</option>
                <option value="year">Năm</option>
              </Select>
            </div>
            <Button onClick={fetchReport} variant="outline">
              <RefreshCw className="h-4 w-4 mr-2" />
              Làm mới
            </Button>
          </div>
        </CardContent>
      </Card>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <Card>
          <CardContent className="pt-6">
            <div className="flex items-center gap-4">
              <div className="p-3 rounded-full bg-success/10">
                <DollarSign className="h-6 w-6 text-success" />
              </div>
              <div className="flex-1">
                <p className="text-sm text-muted-foreground">Tổng doanh thu</p>
                <p className="text-2xl font-bold">{(summary.totalRevenue || 0).toLocaleString()} VNĐ</p>
                {summary.growth !== undefined && (
                  <Badge variant={summary.growth >= 0 ? "success" : "destructive"} className="mt-1">
                    {summary.growth >= 0 ? "+" : ""}{summary.growth}%
                  </Badge>
                )}
              </div>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="pt-6">
            <div className="flex items-center gap-4">
              <div className="p-3 rounded-full bg-primary/10">
                <ShoppingCart className="h-6 w-6 text-primary" />
              </div>
              <div>
                <p className="text-sm text-muted-foreground">Tổng đơn hàng</p>
                <p className="text-2xl font-bold">{summary.totalOrders || 0}</p>
              </div>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="pt-6">
            <div className="flex items-center gap-4">
              <div className="p-3 rounded-full bg-warning/10">
                <TrendingUp className="h-6 w-6 text-warning" />
              </div>
              <div>
                <p className="text-sm text-muted-foreground">Giá trị đơn TB</p>
                <p className="text-2xl font-bold">{Math.round(summary.averageOrderValue || 0).toLocaleString()} VNĐ</p>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>

      <Card>
        <CardHeader>
          <CardTitle>Xu hướng doanh thu</CardTitle>
        </CardHeader>
        <CardContent>
          {timeline.length === 0 ? (
            <div className="text-center py-12 text-muted-foreground">
              Không có dữ liệu trong khoảng thời gian này
            </div>
          ) : (
            <div className="overflow-x-auto">
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>Ngày</TableHead>
                    <TableHead className="text-right">Doanh thu</TableHead>
                    <TableHead className="text-right">Đơn hàng</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {timeline.map((item) => (
                    <TableRow key={item.date}>
                      <TableCell className="font-medium">{item.date}</TableCell>
                      <TableCell className="text-right font-medium text-success">
                        {(item.revenue || 0).toLocaleString()} VNĐ
                      </TableCell>
                      <TableCell className="text-right">{item.orders || 0}</TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </div>
          )}
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle>Top 10 sản phẩm bán chạy</CardTitle>
        </CardHeader>
        <CardContent>
          {topProducts.length === 0 ? (
            <div className="text-center py-12 text-muted-foreground">
              Không có dữ liệu sản phẩm
            </div>
          ) : (
            <div className="space-y-4">
              {topProducts.map((item, index) => (
                <div key={item.product?.id || index} className="space-y-2">
                  <div className="flex items-center justify-between">
                    <div className="flex-1">
                      <p className="font-medium">{item.product?.name || "N/A"}</p>
                      <p className="text-sm text-muted-foreground">
                        SKU: {item.product?.sku || "N/A"} • Số lượng: {item.quantity || 0}
                      </p>
                    </div>
                    <p className="font-bold text-success">
                      {(item.revenue || 0).toLocaleString()} VNĐ
                    </p>
                  </div>
                  <div className="w-full bg-muted rounded-full h-2">
                    <div
                      className="bg-success h-2 rounded-full transition-all"
                      style={{ width: `${((item.revenue || 0) / maxRevenue) * 100}%` }}
                    />
                  </div>
                </div>
              ))}
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  );
};
