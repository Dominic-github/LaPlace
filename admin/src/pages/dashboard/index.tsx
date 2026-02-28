import { useEffect, useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import {
  Home,
  Users,
  DollarSign,
  Building2,
  UserCheck,
  TrendingUp,
} from "lucide-react";
import {
  LineChart,
  Line,
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
  Legend,
  PieChart,
  Pie,
  Cell,
} from "recharts";

const API_URL = import.meta.env.VITE_API_URL || "http://localhost:5003/api";

interface StatsCardProps {
  title: string;
  value: string | number;
  icon: React.ReactNode;
  trend?: string;
}

function StatsCard({ title, value, icon, trend }: StatsCardProps) {
  return (
    <Card>
      <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
        <CardTitle className="text-sm font-medium text-muted-foreground">{title}</CardTitle>
        <div className="text-primary">{icon}</div>
      </CardHeader>
      <CardContent>
        <div className="text-2xl font-bold">{value}</div>
        {trend && (
          <p className="text-xs text-muted-foreground mt-1">
            {trend}
          </p>
        )}
      </CardContent>
    </Card>
  );
}

export const DashboardPage = () => {
  const [loading, setLoading] = useState(true);
  const [stats, setStats] = useState<any>({
    totalListings: 0,
    totalUsers: 0,
    totalBrokers: 0,
    totalProjects: 0,
    totalTransactions: 0,
    totalRevenue: 0,
  });

  useEffect(() => {
    fetchStats();
  }, []);

  const fetchStats = async () => {
    try {
      // Simulate API call - Replace with real API when available
      setTimeout(() => {
        setStats({
          totalListings: 156,
          activeListings: 98,
          pendingListings: 23,
          totalUsers: 1247,
          newUsers: 45,
          totalBrokers: 89,
          verifiedBrokers: 67,
          totalProjects: 34,
          totalTransactions: 892,
          totalRevenue: 45600000,
        });
        setLoading(false);
      }, 500);
    } catch (error) {
      console.error("Failed to fetch stats:", error);
      setLoading(false);
    }
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center h-64">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary"></div>
      </div>
    );
  }

  // Mock data for charts
  const listingsTrendData = [
    { date: '01/01', 'Tin đăng': 12, 'Duyệt': 8 },
    { date: '05/01', 'Tin đăng': 15, 'Duyệt': 11 },
    { date: '10/01', 'Tin đăng': 18, 'Duyệt': 14 },
    { date: '15/01', 'Tin đăng': 22, 'Duyệt': 18 },
    { date: '20/01', 'Tin đăng': 19, 'Duyệt': 15 },
    { date: '25/01', 'Tin đăng': 25, 'Duyệt': 20 },
    { date: '30/01', 'Tin đăng': 28, 'Duyệt': 23 },
  ];

  const listingsByTypeData = [
    { type: 'Nhà phố', value: 45, color: '#E03C31' },
    { type: 'Căn hộ', value: 38, color: '#F97316' },
    { type: 'Biệt thự', value: 28, color: '#EAB308' },
    { type: 'Đất nền', value: 25, color: '#22C55E' },
    { type: 'Văn phòng', value: 12, color: '#3B82F6' },
    { type: 'Phòng trọ', value: 8, color: '#8B5CF6' },
  ];

  const transactionsTrendData = [
    { date: '01/01', 'Giao dịch': 45, 'Doanh thu': 2.5 },
    { date: '05/01', 'Giao dịch': 52, 'Doanh thu': 3.2 },
    { date: '10/01', 'Giao dịch': 48, 'Doanh thu': 2.8 },
    { date: '15/01', 'Giao dịch': 65, 'Doanh thu': 4.1 },
    { date: '20/01', 'Giao dịch': 58, 'Doanh thu': 3.5 },
    { date: '25/01', 'Giao dịch': 72, 'Doanh thu': 4.8 },
    { date: '30/01', 'Giao dịch': 68, 'Doanh thu': 4.2 },
  ];

  const topLocationsData = [
    { location: 'TP.HCM', 'Tin đăng': 45 },
    { location: 'Hà Nội', 'Tin đăng': 38 },
    { location: 'Đà Nẵng', 'Tin đăng': 22 },
    { location: 'Bình Dương', 'Tin đăng': 18 },
    { location: 'Đồng Nai', 'Tin đăng': 15 },
  ];

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <h1 className="text-3xl font-bold">Dashboard - LaPlace</h1>
        <p className="text-sm text-muted-foreground">Cập nhật: {new Date().toLocaleDateString('vi-VN')}</p>
      </div>

      {/* Stats Cards */}
      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-6">
        <StatsCard
          title="Tin đăng"
          value={stats.totalListings}
          icon={<Home size={20} />}
          trend={`${stats.activeListings} đang hiển thị`}
        />
        <StatsCard
          title="Chờ duyệt"
          value={stats.pendingListings}
          icon={<TrendingUp size={20} />}
          trend="Cần xử lý"
        />
        <StatsCard
          title="Người dùng"
          value={stats.totalUsers}
          icon={<Users size={20} />}
          trend={`+${stats.newUsers} mới`}
        />
        <StatsCard
          title="Môi giới"
          value={stats.totalBrokers}
          icon={<UserCheck size={20} />}
          trend={`${stats.verifiedBrokers} đã KYC`}
        />
        <StatsCard
          title="Dự án"
          value={stats.totalProjects}
          icon={<Building2 size={20} />}
          trend="Đang hoạt động"
        />
        <StatsCard
          title="Doanh thu"
          value={`${(stats.totalRevenue / 1000000).toFixed(1)}M`}
          icon={<DollarSign size={20} />}
          trend={`${stats.totalTransactions} giao dịch`}
        />
      </div>

      {/* Charts Row 1 */}
      <div className="grid gap-6 lg:grid-cols-3">
        <Card className="lg:col-span-2">
          <CardHeader>
            <CardTitle>📈 Xu hướng tin đăng (30 ngày)</CardTitle>
          </CardHeader>
          <CardContent>
            <ResponsiveContainer width="100%" height={300}>
              <LineChart data={listingsTrendData}>
                <CartesianGrid strokeDasharray="3 3" stroke="#333" />
                <XAxis dataKey="date" stroke="#888" />
                <YAxis stroke="#888" />
                <Tooltip contentStyle={{ backgroundColor: '#1a1a1a', border: '1px solid #333' }} />
                <Legend />
                <Line type="monotone" dataKey="Tin đăng" stroke="#E03C31" strokeWidth={2} />
                <Line type="monotone" dataKey="Duyệt" stroke="#22C55E" strokeWidth={2} />
              </LineChart>
            </ResponsiveContainer>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>🏠 Tin đăng theo loại</CardTitle>
          </CardHeader>
          <CardContent>
            <ResponsiveContainer width="100%" height={300}>
              <PieChart>
                <Pie
                  data={listingsByTypeData}
                  cx="50%"
                  cy="50%"
                  labelLine={false}
                  label={({ type, percent }) => `${type}: ${(percent * 100).toFixed(0)}%`}
                  outerRadius={80}
                  fill="#8884d8"
                  dataKey="value"
                >
                  {listingsByTypeData.map((entry, index) => (
                    <Cell key={`cell-${index}`} fill={entry.color} />
                  ))}
                </Pie>
                <Tooltip contentStyle={{ backgroundColor: '#1a1a1a', border: '1px solid #333' }} />
              </PieChart>
            </ResponsiveContainer>
          </CardContent>
        </Card>
      </div>

      {/* Charts Row 2 */}
      <div className="grid gap-6 lg:grid-cols-2">
        <Card>
          <CardHeader>
            <CardTitle>💰 Giao dịch & Doanh thu</CardTitle>
          </CardHeader>
          <CardContent>
            <ResponsiveContainer width="100%" height={300}>
              <BarChart data={transactionsTrendData}>
                <CartesianGrid strokeDasharray="3 3" stroke="#333" />
                <XAxis dataKey="date" stroke="#888" />
                <YAxis stroke="#888" />
                <Tooltip contentStyle={{ backgroundColor: '#1a1a1a', border: '1px solid #333' }} />
                <Legend />
                <Bar dataKey="Giao dịch" fill="#E03C31" />
                <Bar dataKey="Doanh thu" fill="#F97316" name="Doanh thu (Triệu VNĐ)" />
              </BarChart>
            </ResponsiveContainer>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>📍 Top địa điểm</CardTitle>
          </CardHeader>
          <CardContent>
            <ResponsiveContainer width="100%" height={300}>
              <BarChart data={topLocationsData} layout="vertical">
                <CartesianGrid strokeDasharray="3 3" stroke="#333" />
                <XAxis type="number" stroke="#888" />
                <YAxis dataKey="location" type="category" width={80} stroke="#888" />
                <Tooltip contentStyle={{ backgroundColor: '#1a1a1a', border: '1px solid #333' }} />
                <Bar dataKey="Tin đăng" fill="#E03C31" barSize={20} />
              </BarChart>
            </ResponsiveContainer>
          </CardContent>
        </Card>
      </div>

      {/* Quick Actions */}
      <Card>
        <CardHeader>
          <CardTitle>⚡ Thao tác nhanh</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
            <button className="p-4 border border-border rounded-lg hover:bg-accent transition-colors text-left">
              <div className="text-2xl mb-2">📝</div>
              <div className="font-semibold">Duyệt tin đăng</div>
              <div className="text-sm text-muted-foreground">{stats.pendingListings} tin chờ duyệt</div>
            </button>
            <button className="p-4 border border-border rounded-lg hover:bg-accent transition-colors text-left">
              <div className="text-2xl mb-2">🎫</div>
              <div className="font-semibold">Xét duyệt KYC</div>
              <div className="text-sm text-muted-foreground">{stats.totalBrokers - stats.verifiedBrokers} chờ xét duyệt</div>
            </button>
            <button className="p-4 border border-border rounded-lg hover:bg-accent transition-colors text-left">
              <div className="text-2xl mb-2">👥</div>
              <div className="font-semibold">Người dùng mới</div>
              <div className="text-sm text-muted-foreground">{stats.newUsers} người dùng mới</div>
            </button>
            <button className="p-4 border border-border rounded-lg hover:bg-accent transition-colors text-left">
              <div className="text-2xl mb-2">⚙️</div>
              <div className="font-semibold">Cài đặt</div>
              <div className="text-sm text-muted-foreground">Cấu hình hệ thống</div>
            </button>
          </div>
        </CardContent>
      </Card>
    </div>
  );
};
