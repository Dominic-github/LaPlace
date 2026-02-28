import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { MediaManager } from "../../components/media";
import { ImageIcon } from "lucide-react";

export const MediaList = () => {
  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-3xl font-bold flex items-center gap-2">
          <ImageIcon className="h-8 w-8" />
          Thư viện Media
        </h1>
        <p className="text-muted-foreground mt-1">Quản lý hình ảnh và file</p>
      </div>

      <Card>
        <CardContent className="p-0">
          <MediaManager selectable={false} />
        </CardContent>
      </Card>
    </div>
  );
};
