import { useOne } from "@refinedev/core";
import { useNavigate, useParams } from "react-router-dom";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { ArrowLeft, Edit, Building2, MapPin, User, Calendar } from "lucide-react";

export const ProjectShow = () => {
  const navigate = useNavigate();
  const { id } = useParams<{ id: string }>();
  const { data, isLoading } = useOne({ resource: "projects", id: id || "" });

  const project = data?.data as any;

  if (isLoading) {
    return (
      <div className="flex items-center justify-center h-64">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary"></div>
      </div>
    );
  }

  if (!project) {
    return (
      <div className="text-center py-12">
        <p className="text-muted-foreground">Không tìm thấy dự án</p>
        <Button onClick={() => navigate("/projects")} className="mt-4">
          Quay lại danh sách
        </Button>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-4">
          <Button variant="ghost" onClick={() => navigate("/projects")}>
            <ArrowLeft className="h-4 w-4 mr-2" />
            Quay lại
          </Button>
          <h1 className="text-3xl font-bold">{project.name}</h1>
        </div>
        <Button onClick={() => navigate(`/projects/edit/${id}`)}>
          <Edit className="h-4 w-4 mr-2" />
          Chỉnh sửa
        </Button>
      </div>

      <div className="grid gap-6 md:grid-cols-3">
        {/* Main Content */}
        <div className="md:col-span-2 space-y-6">
          {/* Thumbnail */}
          <Card>
            <CardContent className="pt-6">
              {project.thumbnail ? (
                <img
                  src={project.thumbnail}
                  alt={project.name}
                  className="w-full h-64 object-cover rounded-lg"
                />
              ) : (
                <div className="w-full h-64 bg-muted rounded-lg flex items-center justify-center">
                  <Building2 className="h-16 w-16 text-muted-foreground" />
                </div>
              )}
            </CardContent>
          </Card>

          {/* Description */}
          <Card>
            <CardHeader>
              <CardTitle>Mô tả dự án</CardTitle>
            </CardHeader>
            <CardContent>
              <p className="text-muted-foreground whitespace-pre-wrap">
                {project.description || 'Chưa có mô tả'}
              </p>
            </CardContent>
          </Card>
        </div>

        {/* Sidebar */}
        <div className="space-y-6">
          {/* Info Card */}
          <Card>
            <CardHeader>
              <CardTitle className="text-lg">Thông tin chung</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="flex items-start gap-3">
                <User className="h-5 w-5 text-muted-foreground mt-0.5" />
                <div>
                  <p className="text-sm text-muted-foreground">Chủ đầu tư</p>
                  <p className="font-medium">{project.developer || 'N/A'}</p>
                </div>
              </div>
              <div className="flex items-start gap-3">
                <MapPin className="h-5 w-5 text-muted-foreground mt-0.5" />
                <div>
                  <p className="text-sm text-muted-foreground">Địa chỉ</p>
                  <p className="font-medium">{project.address || 'N/A'}</p>
                  <p className="text-sm text-muted-foreground">{project.province?.name}</p>
                </div>
              </div>
              <div className="flex items-start gap-3">
                <Calendar className="h-5 w-5 text-muted-foreground mt-0.5" />
                <div>
                  <p className="text-sm text-muted-foreground">Ngày tạo</p>
                  <p className="font-medium">
                    {new Date(project.createdAt).toLocaleDateString('vi-VN')}
                  </p>
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Status */}
          <Card>
            <CardHeader>
              <CardTitle className="text-lg">Trạng thái</CardTitle>
            </CardHeader>
            <CardContent>
              <span className={`px-3 py-1 rounded text-sm ${
                project.isActive
                  ? 'bg-green-500/20 text-green-500'
                  : 'bg-red-500/20 text-red-500'
              }`}>
                {project.isActive ? 'Đang hoạt động' : 'Đã tắt'}
              </span>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
};
