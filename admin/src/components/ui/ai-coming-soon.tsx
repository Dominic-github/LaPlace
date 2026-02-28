import { Construction, Sparkles } from "lucide-react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import {
    Tooltip,
    TooltipContent,
    TooltipProvider,
    TooltipTrigger,
} from "@/components/ui/tooltip";
import { cn } from "@/lib/utils";

interface AIComingSoonProps {
    featureName?: string;
}

export const AIComingSoon = ({ featureName = "AI Content Generator" }: AIComingSoonProps) => {
    return (
        <Card className="border-dashed border-2 border-muted-foreground/30 bg-muted/20">
            <CardHeader className="pb-2">
                <CardTitle className="flex items-center gap-2 text-base text-muted-foreground">
                    <Construction className="h-5 w-5" />
                    {featureName}
                </CardTitle>
            </CardHeader>
            <CardContent>
                <div className="text-center py-4">
                    <div className="inline-flex items-center justify-center w-12 h-12 rounded-full bg-muted mb-3">
                        <Construction className="h-6 w-6 text-muted-foreground" />
                    </div>
                    <p className="text-sm text-muted-foreground font-medium">
                        🚧 Tính năng đang phát triển
                    </p>
                    <p className="text-xs text-muted-foreground/70 mt-1">
                        Coming Soon
                    </p>
                </div>
            </CardContent>
        </Card>
    );
};

interface AIButtonProps {
    children?: React.ReactNode;
    className?: string;
    variant?: "default" | "outline" | "ghost" | "secondary";
    size?: "default" | "sm" | "lg" | "icon";
}

export const AIButton = ({
    children = "Tạo với AI",
    className = "",
    variant = "outline",
    size = "default"
}: AIButtonProps) => {
    return (
        <TooltipProvider>
            <Tooltip delayDuration={100}>
                <TooltipTrigger asChild>
                    <span className="inline-block">
                        <Button
                            variant={variant}
                            size={size}
                            disabled
                            className={`gap-2 cursor-not-allowed ${className}`}
                        >
                            <Sparkles className="h-4 w-4" />
                            {children}
                        </Button>
                    </span>
                </TooltipTrigger>
                <TooltipContent side="top" className="bg-amber-500 text-white border-amber-600">
                    <p className="flex items-center gap-1.5">
                        <Construction className="h-4 w-4" />
                        🚧 Tính năng đang phát triển
                    </p>
                </TooltipContent>
            </Tooltip>
        </TooltipProvider>
    );
};
