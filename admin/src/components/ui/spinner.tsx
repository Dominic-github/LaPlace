import * as React from "react";
import { cn } from "@/lib/utils";
import { Loader2 } from "lucide-react";

interface SpinnerProps extends React.HTMLAttributes<HTMLDivElement> {
    size?: "sm" | "md" | "lg";
}

const Spinner = ({ className, size = "md", ...props }: SpinnerProps) => {
    const sizeClasses = {
        sm: "h-4 w-4",
        md: "h-8 w-8",
        lg: "h-12 w-12",
    };

    return (
        <div className={cn("flex items-center justify-center", className)} {...props}>
            <Loader2 className={cn("animate-spin text-primary", sizeClasses[size])} />
        </div>
    );
};

const LoadingOverlay = ({ className, ...props }: React.HTMLAttributes<HTMLDivElement>) => (
    <div
        className={cn(
            "absolute inset-0 flex items-center justify-center bg-background/50 z-10",
            className
        )}
        {...props}
    >
        <Spinner size="lg" />
    </div>
);

export { Spinner, LoadingOverlay };
