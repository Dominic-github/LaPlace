import { useEffect, useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Spinner } from "@/components/ui/spinner";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { Package, AlertTriangle, XCircle, DollarSign, Download, RefreshCw, Search } from "lucide-react";

const API_URL = import.meta.env.VITE_API_URL || "http://localhost:5002/api";

interface InventoryReport {
  summary: {
    totalProducts: number;
    lowStockCount: number;
    outOfStockCount: number;
    totalInventoryValue: number;
  };
  lowStockProducts: Array<{
    id: string;
    name: string;
    sku: string;
    stock: number;
    price: number;
  }>;
  byCategory: Array<{
    category: string;
    count: number;
    totalStock: number;
    totalValue: number;
  }>;
}

export const InventoryReportPage = () => {
  const [loading, setLoading] = useState(true);
  const [report, setReport] = useState<InventoryReport | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [lowStockThreshold, setLowStockThreshold] = useState(10);
  const [searchTerm, setSearchTerm] = useState("");

  useEffect(() => {
    fetchReport();
  }, [lowStockThreshold]);

  const fetchReport = async () => {
    setLoading(true);
    setError(null);
    try {
      const token = localStorage.getItem("token");
      const response = await fetch(`${API_URL}/reports/inventory?lowStock=${lowStockThreshold}`, {
        headers: { Authorization: `Bearer ${token}` },
      });
      const data = await response.json();
      if (data.success) {
        setReport(data.data);
      } else {
        setError(data.message || "Không thể tải báo cáo");
      }
    } catch (error) {
      console.error("Failed to fetch inventory report:", error);
      setError("Lỗi kết nối đến server");
    } finally {
      setLoading(false);
    }
  };

  const exportToCSV = () => {
    if (!report) return;

    const rows = [
      ["Báo cáo tồn kho"],
      [],
      ["Tổng quan"],
      ["Tổng sản phẩm", summary.totalProducts || 0],
      ["Sắp hết hàng", summary.lowStockCount || 0],
      ["Hết hàng", summary.outOfStockCount || 0],
      ["Giá trị tồn kho", `${(summary.totalInventoryValue || 0).toLocaleString()} VNĐ`],
      [],
      ["Sản phẩm sắp hết hàng"],
      ["Tên sản phẩm", "SKU", "Tồn kho", "Giá"],
      ...filteredLowStock.map((p) => [
        p.name || "N/A",
        p.sku || "N/A",
        p.stock || 0,
        p.price || 0,
      ]),
      [],
      ["Tồn kho theo danh mục"],
      ["Danh mục", "Số sản phẩm", "Tổng tồn kho", "Giá trị"],
      ...byCategory.map((c) => [
        c.category || "N/A",
        c.count || 0,
        c.totalStock || 0,
        c.totalValue || 0,
      ]),
    ];

    const csvContent = rows.map((row) => row.join(",")).join("\n");
    const blob = new Blob(["\uFEFF" + csvContent], { type: "text/csv;charset=utf-8;" });
    const link = document.createElement("a");
    link.href = URL.createObjectURL(blob);
    link.download = `inventory-report-${new Date().toISOString().split("T")[0]}.csv`;
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
            <Package className="h-8 w-8" />
            Báo cáo tồn kho
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

  const summary = report?.summary || { totalProducts: 0, lowStockCount: 0, outOfStockCount: 0, totalInventoryValue: 0 };
  const lowStockProducts = report?.lowStockProducts || [];
  const byCategory = report?.byCategory || [];

  // Filter low stock products by search term
  const filteredLowStock = lowStockProducts.filter((p) =>
    (p.name || "").toLowerCase().includes(searchTerm.toLowerCase()) ||
    (p.sku || "").toLowerCase().includes(searchTerm.toLowerCase())
  );

  // Calculate max value for progress bars
  const maxCategoryValue = Math.max(...byCategory.map((c) => c.totalValue || 0), 1);

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold flex items-center gap-2">
            <Package className="h-8 w-8" />
            Báo cáo tồn kho
          </h1>
          <p className="text-muted-foreground mt-1">Phân tích hàng tồn kho</p>
        </div>
        <Button onClick={exportToCSV} variant="outline">
          <Download className="h-4 w-4 mr-2" />
          Xuất CSV
        </Button>
      </div>

      <Card>
        <CardContent className="pt-6">
          <div className="flex gap-4 items-end">
            <div className="space-y-2">
              <Label>Ngưỡng cảnh báo tồn kho thấp</Label>
              <Input
                type="number"
                value={lowStockThreshold}
                onChange={(e) => setLowStockThreshold(Number(e.target.value))}
                min={1}
                max={100}
                className="w-32"
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
                <Package className="h-6 w-6 text-primary" />
              </div>
              <div>
                <p className="text-sm text-muted-foreground">Tổng sản phẩm</p>
                <p className="text-2xl font-bold">{summary.totalProducts || 0}</p>
              </div>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="pt-6">
            <div className="flex items-center gap-4">
              <div className="p-3 rounded-full bg-warning/10">
                <AlertTriangle className="h-6 w-6 text-warning" />
              </div>
              <div>
                <p className="text-sm text-muted-foreground">Sắp hết hàng</p>
                <p className="text-2xl font-bold text-warning">{summary.lowStockCount || 0}</p>
              </div>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="pt-6">
            <div className="flex items-center gap-4">
              <div className="p-3 rounded-full bg-destructive/10">
                <XCircle className="h-6 w-6 text-destructive" />
              </div>
              <div>
                <p className="text-sm text-muted-foreground">Hết hàng</p>
                <p className="text-2xl font-bold text-destructive">{summary.outOfStockCount || 0}</p>
              </div>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="pt-6">
            <div className="flex items-center gap-4">
              <div className="p-3 rounded-full bg-success/10">
                <DollarSign className="h-6 w-6 text-success" />
              </div>
              <div>
                <p className="text-sm text-muted-foreground">Giá trị tồn kho</p>
                <p className="text-xl font-bold">{(summary.totalInventoryValue || 0).toLocaleString()} VNĐ</p>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>

      <Card>
        <CardHeader>
          <div className="flex items-center justify-between">
            <CardTitle>Sản phẩm sắp hết hàng / hết hàng</CardTitle>
            <div className="relative w-64">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
              <Input
                placeholder="Tìm sản phẩm..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="pl-9"
              />
            </div>
          </div>
        </CardHeader>
        <CardContent>
          {filteredLowStock.length === 0 ? (
            <div className="text-center py-12 text-muted-foreground">
              {searchTerm ? "Không tìm thấy sản phẩm" : "Không có sản phẩm nào sắp hết hàng"}
            </div>
          ) : (
            <div className="overflow-x-auto">
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>Tên sản phẩm</TableHead>
                    <TableHead>SKU</TableHead>
                    <TableHead className="text-center">Tồn kho</TableHead>
                    <TableHead className="text-right">Giá</TableHead>
                    <TableHead className="text-right">Giá trị tồn</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {filteredLowStock.map((product) => (
                    <TableRow key={product.id}>
                      <TableCell className="font-medium">{product.name || "N/A"}</TableCell>
                      <TableCell className="font-mono text-sm">{product.sku || "N/A"}</TableCell>
                      <TableCell className="text-center">
                        <Badge
                          variant={
                            (product.stock || 0) === 0
                              ? "destructive"
                              : (product.stock || 0) <= 5
                              ? "warning"
                              : "success"
                          }
                        >
                          {product.stock || 0}
                        </Badge>
                      </TableCell>
                      <TableCell className="text-right">
                        {(product.price || 0).toLocaleString()} VNĐ
                      </TableCell>
                      <TableCell className="text-right font-medium">
                        {((product.price || 0) * (product.stock || 0)).toLocaleString()} VNĐ
                      </TableCell>
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
          <CardTitle>Tồn kho theo danh mục</CardTitle>
        </CardHeader>
        <CardContent>
          {byCategory.length === 0 ? (
            <div className="text-center py-12 text-muted-foreground">
              Không có dữ liệu danh mục
            </div>
          ) : (
            <div className="space-y-4">
              {byCategory.map((item, index) => (
                <div key={item.category || index} className="space-y-2">
                  <div className="flex items-center justify-between">
                    <div className="flex-1">
                      <p className="font-medium">{item.category || "N/A"}</p>
                      <p className="text-sm text-muted-foreground">
                        {item.count || 0} sản phẩm • Tồn kho: {item.totalStock || 0}
                      </p>
                    </div>
                    <p className="font-bold text-success">
                      {(item.totalValue || 0).toLocaleString()} VNĐ
                    </p>
                  </div>
                  <div className="w-full bg-muted rounded-full h-2">
                    <div
                      className="bg-primary h-2 rounded-full transition-all"
                      style={{ width: `${((item.totalValue || 0) / maxCategoryValue) * 100}%` }}
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
