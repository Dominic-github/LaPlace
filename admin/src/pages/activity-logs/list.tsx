import { useState } from "react";
import { useList } from "@refinedev/core";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
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
import { Search, Activity } from "lucide-react";

interface ActivityLog {
  id: string;
  action: string;
  module: string;
  recordId?: string;
  description?: string;
  metadata?: object;
  ipAddress?: string;
  createdAt: string;
  user?: { email: string; fullName?: string };
}

export const ActivityLogList = () => {
  const [current, setCurrent] = useState(1);
  const [pageSize] = useState(20);
  const [search, setSearch] = useState("");

  const { data, isLoading } = useList<ActivityLog>({
    resource: "activity-logs",
    pagination: { current, pageSize },
    sorters: [{ field: "createdAt", order: "desc" }],
    filters: search ? [{ field: "action", operator: "contains", value: search }] : [],
  });

  const logs = data?.data || [];
  const total = data?.total || 0;

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-3xl font-bold flex items-center gap-2">
          <Activity className="h-8 w-8" />
          Activity Logs
        </h1>
        <p className="text-muted-foreground mt-1">Lịch sử hoạt động trong hệ thống</p>
      </div>

      <Card>
        <CardContent className="pt-6">
          <div className="relative flex-1 max-w-sm">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
            <Input
              placeholder="Tìm theo hành động..."
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              className="pl-9"
            />
          </div>
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle>Lịch sử hoạt động ({total})</CardTitle>
        </CardHeader>
        <CardContent>
          {isLoading ? (
            <div className="flex items-center justify-center h-64">
              <Spinner size="lg" />
            </div>
          ) : logs.length === 0 ? (
            <div className="text-center py-12 text-muted-foreground">
              Không có hoạt động nào
            </div>
          ) : (
            <>
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>Người dùng</TableHead>
                    <TableHead>Hành động</TableHead>
                    <TableHead>Đối tượng</TableHead>
                    <TableHead>ID</TableHead>
                    <TableHead className="max-w-xs">Chi tiết</TableHead>
                    <TableHead>IP</TableHead>
                    <TableHead>Thời gian</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {logs.map((log) => (
                    <TableRow key={log.id}>
                      <TableCell className="font-medium">
                        {log.user?.fullName || log.user?.email || "—"}
                      </TableCell>
                      <TableCell>
                        <Badge variant="default">{log.action}</Badge>
                      </TableCell>
                      <TableCell>{log.module}</TableCell>
                      <TableCell className="font-mono text-xs">
                        {log.recordId || "—"}
                      </TableCell>
                      <TableCell className="max-w-xs">
                        {log.metadata ? (
                          <pre className="text-xs whitespace-pre-wrap overflow-auto max-h-16 m-0 p-2 rounded" style={{ backgroundColor: 'var(--color-muted)' }}>
                            {JSON.stringify(log.metadata, null, 2)}
                          </pre>
                        ) : (
                          "—"
                        )}
                      </TableCell>
                      <TableCell className="font-mono text-xs">{log.ipAddress || "—"}</TableCell>
                      <TableCell>
                        {new Date(log.createdAt).toLocaleString("vi-VN")}
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
