import { useEffect, useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Spinner } from "@/components/ui/spinner";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { Users, UserCheck, UserPlus, Download, RefreshCw, TrendingUp, Star } from "lucide-react";

const API_URL = import.meta.env.VITE_API_URL || "http://localhost:5002/api";

interface CustomerReport {
  summary: {
    totalCustomers: number;
    activeCustomers: number;
    newCustomers: number;
    averageLifetimeValue?: number;
  };
  topCustomers: Array<{
    id: string;
    email: string;
    firstName?: string;
    lastName?: string;
    totalSpent: number;
    orderCount: number;
    reviewCount: number;
    averageOrderValue: number;
  }>;
}

export const CustomerReportPage = () => {
  const [loading, setLoading] = useState(true);
  const [report, setReport] = useState<CustomerReport | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [startDate, setStartDate] = useState(() => {
    const d = new Date();
    d.setDate(d.getDate() - 30);
    return d.toISOString().split("T")[0];
  });
  const [endDate, setEndDate] = useState(() => new Date().toISOString().split("T")[0]);

  useEffect(() => {
    fetchReport();
  }, [startDate, endDate]);

  const fetchReport = async () => {
    setLoading(true);
    setError(null);
    try {
      const token = localStorage.getItem("token");
      const params = new URLSearchParams({
        startDate: new Date(startDate).toISOString(),
        endDate: new Date(endDate).toISOString(),
      });

      const response = await fetch(`${API_URL}/reports/customers?${params}`, {
        headers: { Authorization: `Bearer ${token}` },
      });
      const data = await response.json();
      if (data.success) {
        setReport(data.data);
      } else {
        setError(data.message || "Không thể tải báo cáo");
      }
    } catch (error) {
      console.error("Failed to fetch customer report:", error);
      setError("Lỗi kết nối đến server");
    } finally {
      setLoading(false);
    }
  };

  const exportToCSV = () => {
    if (!report) return;

    const rows = [
      ["Báo cáo khách hàng"],
      [`Từ ${startDate} đến ${endDate}`],
      [],
      ["Tổng quan"],
      ["Tổng khách hàng", summary.totalCustomers || 0],
      ["Khách hàng hoạt động", summary.activeCustomers || 0],
      ["Khách hàng mới", summary.newCustomers || 0],
      summary.averageLifetimeValue ? ["Giá trị TB/khách", `${(summary.averageLifetimeValue || 0).toLocaleString()} VNĐ`] : [],
      [],
      ["Top khách hàng VIP"],
      ["Email", "Họ tên", "Tổng chi tiêu", "Số đơn", "Số đánh giá", "Giá trị đơn TB"],
      ...topCustomers.map((c) => [
        c.email || "N/A",
        `${c.firstName || ""} ${c.lastName || ""}`.trim() || "N/A",
        c.totalSpent || 0,
        c.orderCount || 0,
        c.reviewCount || 0,
        c.averageOrderValue || 0,
      ]),
    ].filter(row => row.length > 0);

    const csvContent = rows.map((row) => row.join(",")).join("\n");
    const blob = new Blob(["\uFEFF" + csvContent], { type: "text/csv;charset=utf-8;" });
    const link = document.createElement("a");
    link.href = URL.createObjectURL(blob);
    link.download = `customer-report-${startDate}-${endDate}.csv`;
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
            <Users className="h-8 w-8" />
            Báo cáo khách hàng
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

  const summary = report?.summary || { totalCustomers: 0, activeCustomers: 0, newCustomers: 0 };
  const topCustomers = report?.topCustomers || [];

  // Calculate max spent for progress bars
  const maxSpent = Math.max(...topCustomers.map((c) => c.totalSpent || 0), 1);

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold flex items-center gap-2">
            <Users className="h-8 w-8" />
            Báo cáo khách hàng
          </h1>
          <p className="text-muted-foreground mt-1">Phân tích khách hàng</p>
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
            <Button onClick={fetchReport} variant="outline">
              <RefreshCw className="h-4 w-4 mr-2" />
              Làm mới
            </Button>
          </div>
        </CardContent>
      </Card>

      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        <Card>
          <CardContent className="pt-6">
            <div className="flex items-center gap-4">
              <div className="p-3 rounded-full bg-primary/10">
                <Users className="h-6 w-6 text-primary" />
              </div>
              <div>
                <p className="text-sm text-muted-foreground">Tổng khách hàng</p>
                <p className="text-2xl font-bold">{summary.totalCustomers || 0}</p>
              </div>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="pt-6">
            <div className="flex items-center gap-4">
              <div className="p-3 rounded-full bg-success/10">
                <UserCheck className="h-6 w-6 text-success" />
              </div>
              <div>
                <p className="text-sm text-muted-foreground">Khách hàng hoạt động</p>
                <p className="text-2xl font-bold">{summary.activeCustomers || 0}</p>
              </div>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="pt-6">
            <div className="flex items-center gap-4">
              <div className="p-3 rounded-full bg-warning/10">
                <UserPlus className="h-6 w-6 text-warning" />
              </div>
              <div>
                <p className="text-sm text-muted-foreground">Khách hàng mới</p>
                <p className="text-2xl font-bold">{summary.newCustomers || 0}</p>
              </div>
            </div>
          </CardContent>
        </Card>

        {summary.averageLifetimeValue !== undefined && (
          <Card>
            <CardContent className="pt-6">
              <div className="flex items-center gap-4">
                <div className="p-3 rounded-full bg-purple-500/10">
                  <TrendingUp className="h-6 w-6 text-purple-500" />
                </div>
                <div>
                  <p className="text-sm text-muted-foreground">Giá trị TB/khách</p>
                  <p className="text-xl font-bold">{(summary.averageLifetimeValue || 0).toLocaleString()} VNĐ</p>
                </div>
              </div>
            </CardContent>
          </Card>
        )}
      </div>

      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Star className="h-5 w-5 text-yellow-500" />
            Top 10 khách hàng VIP
          </CardTitle>
        </CardHeader>
        <CardContent>
          {topCustomers.length === 0 ? (
            <div className="text-center py-12 text-muted-foreground">
              Không có dữ liệu khách hàng trong khoảng thời gian này
            </div>
          ) : (
            <div className="space-y-4">
              {topCustomers.map((customer, index) => (
                <div key={customer.id} className="space-y-2">
                  <div className="flex items-center gap-4">
                    <div className="flex items-center justify-center w-8 h-8 rounded-full bg-primary/10 font-bold text-primary">
                      {index + 1}
                    </div>
                    <div className="flex-1">
                      <div className="flex items-center gap-2">
                        <p className="font-medium">{customer.email}</p>
                        {(customer.firstName || customer.lastName) && (
                          <Badge variant="secondary">
                            {`${customer.firstName || ""} ${customer.lastName || ""}`.trim()}
                          </Badge>
                        )}
                      </div>
                      <div className="flex gap-4 text-sm text-muted-foreground mt-1">
                        <span>{customer.orderCount || 0} đơn hàng</span>
                        <span>•</span>
                        <span>{customer.reviewCount || 0} đánh giá</span>
                        <span>•</span>
                        <span>Đơn TB: {(customer.averageOrderValue || 0).toLocaleString()} VNĐ</span>
                      </div>
                    </div>
                    <div className="text-right">
                      <p className="font-bold text-success text-lg">
                        {(customer.totalSpent || 0).toLocaleString()} VNĐ
                      </p>
                      <p className="text-xs text-muted-foreground">Tổng chi tiêu</p>
                    </div>
                  </div>
                  <div className="w-full bg-muted rounded-full h-2 ml-12">
                    <div
                      className="bg-gradient-to-r from-purple-500 to-pink-500 h-2 rounded-full transition-all"
                      style={{ width: `${((customer.totalSpent || 0) / maxSpent) * 100}%` }}
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
