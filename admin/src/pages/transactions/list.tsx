import { useList } from "@refinedev/core";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { useState } from "react";
import { 
  Search, RefreshCw, DollarSign, TrendingUp, TrendingDown, 
  User, Calendar, CreditCard, Download
} from "lucide-react";

const typeLabels: Record<string, string> = {
  DEPOSIT: "Nạp điểm",
  WITHDRAW: "Rút điểm",
  PURCHASE_VIP: "Mua VIP",
  PURCHASE_LISTING: "Đăng tin",
  REFUND: "Hoàn tiền",
  BONUS: "Thưởng",
};

const typeColors: Record<string, string> = {
  DEPOSIT: "text-green-500",
  WITHDRAW: "text-red-500",
  PURCHASE_VIP: "text-purple-500",
  PURCHASE_LISTING: "text-blue-500",
  REFUND: "text-yellow-500",
  BONUS: "text-cyan-500",
};

const statusLabels: Record<string, string> = {
  PENDING: "Chờ xử lý",
  COMPLETED: "Hoàn thành",
  FAILED: "Thất bại",
  CANCELLED: "Đã hủy",
};

const statusColors: Record<string, string> = {
  PENDING: "bg-yellow-500/20 text-yellow-500",
  COMPLETED: "bg-green-500/20 text-green-500",
  FAILED: "bg-red-500/20 text-red-500",
  CANCELLED: "bg-gray-500/20 text-gray-500",
};

export const TransactionList = () => {
  const [searchText, setSearchText] = useState("");
  const [typeFilter, setTypeFilter] = useState("");

  const { data, isLoading, refetch } = useList({
    resource: "transactions",
    pagination: { current: 1, pageSize: 100 },
    sorters: [{ field: "createdAt", order: "desc" }],
  });

  const transactions = data?.data || [];

  // Calculate stats (no status field in Transaction model)
  const totalDeposit = transactions
    .filter((t: any) => t.type === "DEPOSIT")
    .reduce((sum: number, t: any) => sum + (t.amount || 0), 0);
  
  const totalSpent = transactions
    .filter((t: any) => ["UPGRADE_VIP", "POST_LISTING"].includes(t.type))
    .reduce((sum: number, t: any) => sum + (t.amount || 0), 0);

  const filteredTransactions = transactions.filter((t: any) => {
    const matchSearch = t.user?.fullName?.toLowerCase().includes(searchText.toLowerCase()) ||
                       t.user?.email?.toLowerCase().includes(searchText.toLowerCase());
    const matchType = !typeFilter || t.type === typeFilter;
    return matchSearch && matchType;
  });

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold">Quản lý giao dịch</h1>
          <p className="text-muted-foreground mt-1">Lịch sử nạp điểm và mua gói VIP</p>
        </div>
        <div className="flex gap-2">
          <Button variant="outline" onClick={() => refetch()}>
            <RefreshCw className="h-4 w-4 mr-2" />
            Làm mới
          </Button>
          <Button variant="outline">
            <Download className="h-4 w-4 mr-2" />
            Xuất Excel
          </Button>
        </div>
      </div>

      {/* Stats Cards */}
      <div className="grid gap-4 md:grid-cols-4">
        <Card>
          <CardContent className="pt-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-muted-foreground">Tổng nạp</p>
                <p className="text-2xl font-bold text-green-500">
                  {totalDeposit.toLocaleString()}đ
                </p>
              </div>
              <TrendingUp className="h-8 w-8 text-green-500/50" />
            </div>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="pt-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-muted-foreground">Tổng chi tiêu</p>
                <p className="text-2xl font-bold text-blue-500">
                  {totalSpent.toLocaleString()}đ
                </p>
              </div>
              <TrendingDown className="h-8 w-8 text-blue-500/50" />
            </div>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="pt-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-muted-foreground">Tổng GD</p>
                <p className="text-2xl font-bold">{transactions.length}</p>
              </div>
              <CreditCard className="h-8 w-8 text-primary/50" />
            </div>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="pt-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-muted-foreground">Chờ xử lý</p>
                <p className="text-2xl font-bold text-yellow-500">
                  {transactions.filter((t: any) => t.status === "PENDING").length}
                </p>
              </div>
              <DollarSign className="h-8 w-8 text-yellow-500/50" />
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Filters */}
      <Card>
        <CardContent className="pt-4">
          <div className="flex gap-4 flex-wrap">
            <div className="flex-1 min-w-[200px]">
              <div className="relative">
                <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                <Input
                  placeholder="Tìm theo tên, email..."
                  value={searchText}
                  onChange={(e) => setSearchText(e.target.value)}
                  className="pl-10"
                />
              </div>
            </div>
            <select
              value={typeFilter}
              onChange={(e) => setTypeFilter(e.target.value)}
              className="h-10 rounded-md border border-input bg-background px-3"
            >
              <option value="">Tất cả loại</option>
              <option value="DEPOSIT">Nạp điểm</option>
              <option value="PURCHASE_VIP">Mua VIP</option>
              <option value="PURCHASE_LISTING">Đăng tin</option>
              <option value="REFUND">Hoàn tiền</option>
              <option value="BONUS">Thưởng</option>
            </select>
          </div>
        </CardContent>
      </Card>

      {/* Transactions Table */}
      <Card>
        <CardContent className="pt-4">
          {isLoading ? (
            <div className="flex items-center justify-center h-32">
              <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary"></div>
            </div>
          ) : filteredTransactions.length === 0 ? (
            <div className="text-center py-12 text-muted-foreground">
              Chưa có giao dịch nào
            </div>
          ) : (
            <div className="overflow-x-auto">
              <table className="w-full">
                <thead>
                  <tr className="border-b">
                    <th className="text-left py-3 px-2">Mã GD</th>
                    <th className="text-left py-3 px-2">Người dùng</th>
                    <th className="text-left py-3 px-2">Loại</th>
                    <th className="text-right py-3 px-2">Số điểm</th>
                    <th className="text-left py-3 px-2">Trạng thái</th>
                    <th className="text-left py-3 px-2">Ghi chú</th>
                    <th className="text-left py-3 px-2">Thời gian</th>
                  </tr>
                </thead>
                <tbody>
                  {filteredTransactions.map((transaction: any) => (
                    <tr key={transaction.id} className="border-b hover:bg-muted/50">
                      <td className="py-3 px-2">
                        <code className="text-xs bg-muted px-2 py-1 rounded">
                          {transaction.id?.substring(0, 8)}...
                        </code>
                      </td>
                      <td className="py-3 px-2">
                        <div className="flex items-center gap-2">
                          <div className="w-8 h-8 rounded-full bg-primary/20 flex items-center justify-center">
                            <User className="h-4 w-4 text-primary" />
                          </div>
                          <div>
                            <div className="font-medium">{transaction.user?.fullName || 'N/A'}</div>
                            <div className="text-xs text-muted-foreground">{transaction.user?.email}</div>
                          </div>
                        </div>
                      </td>
                      <td className="py-3 px-2">
                        <span className={`font-medium ${typeColors[transaction.type] || ''}`}>
                          {typeLabels[transaction.type] || transaction.type}
                        </span>
                      </td>
                      <td className="py-3 px-2 text-right">
                        <span className={`font-bold ${
                          ["DEPOSIT", "REFUND", "BONUS"].includes(transaction.type) 
                            ? 'text-green-500' 
                            : 'text-red-500'
                        }`}>
                          {["DEPOSIT", "REFUND", "BONUS"].includes(transaction.type) ? '+' : '-'}
                          {transaction.amount?.toLocaleString()}
                        </span>
                      </td>
                      <td className="py-3 px-2">
                        <span className={`px-2 py-1 rounded text-xs ${statusColors[transaction.status] || ''}`}>
                          {statusLabels[transaction.status] || transaction.status}
                        </span>
                      </td>
                      <td className="py-3 px-2 text-sm text-muted-foreground max-w-[150px] truncate">
                        {transaction.description || '-'}
                      </td>
                      <td className="py-3 px-2 text-sm text-muted-foreground whitespace-nowrap">
                        {new Date(transaction.createdAt).toLocaleString('vi-VN')}
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
