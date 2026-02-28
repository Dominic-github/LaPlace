import { useList, useDelete } from "@refinedev/core";
import { useNavigate } from "react-router-dom";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { useState } from "react";
import { Plus, Eye, Edit, Trash2, Search, RefreshCw, Building2, MapPin, DollarSign } from "lucide-react";

const statusLabels: Record<string, string> = {
  UPCOMING: "Sắp mở bán",
  SELLING: "Đang bán",
  COMPLETED: "Đã bàn giao",
  SOLD_OUT: "Đã bán hết",
};

const statusColors: Record<string, string> = {
  UPCOMING: "bg-blue-500/20 text-blue-500",
  SELLING: "bg-green-500/20 text-green-500",
  COMPLETED: "bg-gray-500/20 text-gray-500",
  SOLD_OUT: "bg-red-500/20 text-red-500",
};

export const ProjectList = () => {
  const navigate = useNavigate();
  const [searchText, setSearchText] = useState("");
  const { mutate: deleteProject } = useDelete();

  const { data, isLoading, refetch } = useList({
    resource: "projects",
    pagination: { current: 1, pageSize: 50 },
    sorters: [{ field: "createdAt", order: "desc" }],
  });

  const projects = data?.data || [];

  const handleDelete = (id: string) => {
    if (confirm("Xóa dự án này?")) {
      deleteProject({ resource: "projects", id }, { onSuccess: () => refetch() });
    }
  };

  const formatPrice = (price: number) => {
    if (price >= 1000000000) return `${(price / 1000000000).toFixed(1)} tỷ`;
    return `${(price / 1000000).toFixed(0)} triệu`;
  };

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold">Quản lý dự án</h1>
          <p className="text-muted-foreground mt-1">Tổng: {projects.length} dự án</p>
        </div>
        <div className="flex gap-2">
          <Button variant="outline" onClick={() => refetch()}>
            <RefreshCw className="h-4 w-4 mr-2" />
            Làm mới
          </Button>
          <Button onClick={() => navigate("/projects/create")}>
            <Plus className="h-4 w-4 mr-2" />
            Thêm dự án
          </Button>
        </div>
      </div>

      <Card>
        <CardContent className="pt-4">
          <div className="flex gap-4 mb-4">
            <div className="relative flex-1">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
              <Input
                placeholder="Tìm kiếm dự án..."
                value={searchText}
                onChange={(e) => setSearchText(e.target.value)}
                className="pl-10"
              />
            </div>
          </div>

          {isLoading ? (
            <div className="flex items-center justify-center h-32">
              <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary"></div>
            </div>
          ) : projects.length === 0 ? (
            <div className="text-center py-12 text-muted-foreground">Chưa có dự án nào</div>
          ) : (
            <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
              {projects.filter((p: any) => 
                p.name?.toLowerCase().includes(searchText.toLowerCase())
              ).map((project: any) => (
                <Card key={project.id} className="overflow-hidden hover:shadow-lg transition-shadow">
                  <div className="h-40 bg-gradient-to-br from-primary/20 to-primary/5 flex items-center justify-center">
                    {project.thumbnail ? (
                      <img src={project.thumbnail} alt={project.name} className="w-full h-full object-cover" />
                    ) : (
                      <Building2 className="h-16 w-16 text-primary/50" />
                    )}
                  </div>
                  <CardContent className="p-4">
                    <div className="flex items-start justify-between mb-2">
                      <h3 className="font-semibold line-clamp-1">{project.name}</h3>
                      <span className={`px-2 py-0.5 rounded text-xs ${statusColors[project.status] || ''}`}>
                        {statusLabels[project.status] || project.status}
                      </span>
                    </div>
                    <p className="text-sm text-muted-foreground line-clamp-2 mb-3">{project.description}</p>
                    <div className="space-y-1 text-sm">
                      <div className="flex items-center gap-1 text-muted-foreground">
                        <MapPin className="h-3 w-3" />
                        <span className="line-clamp-1">{project.address || 'N/A'}</span>
                      </div>
                      <div className="flex items-center gap-1 text-primary font-semibold">
                        <DollarSign className="h-3 w-3" />
                        {project.priceFrom ? `${formatPrice(project.priceFrom)} - ${formatPrice(project.priceTo)}` : 'Liên hệ'}
                      </div>
                    </div>
                    <div className="flex gap-1 mt-4">
                      <Button size="sm" variant="ghost" onClick={() => navigate(`/projects/show/${project.id}`)}>
                        <Eye className="h-4 w-4" />
                      </Button>
                      <Button size="sm" variant="ghost" onClick={() => navigate(`/projects/edit/${project.id}`)}>
                        <Edit className="h-4 w-4" />
                      </Button>
                      <Button size="sm" variant="ghost" onClick={() => handleDelete(project.id)}>
                        <Trash2 className="h-4 w-4 text-red-500" />
                      </Button>
                    </div>
                  </CardContent>
                </Card>
              ))}
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  );
};
