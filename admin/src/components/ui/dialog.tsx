import * as React from "react";
import { cn } from "@/lib/utils";
import { X } from "lucide-react";

interface DialogProps {
    open: boolean;
    onClose: () => void;
    children: React.ReactNode;
    className?: string;
}

const Dialog = ({ open, onClose, children, className }: DialogProps) => {
    React.useEffect(() => {
        const handleEscape = (e: KeyboardEvent) => {
            if (e.key === "Escape") onClose();
        };
        if (open) {
            document.addEventListener("keydown", handleEscape);
            document.body.style.overflow = "hidden";
        }
        return () => {
            document.removeEventListener("keydown", handleEscape);
            document.body.style.overflow = "";
        };
    }, [open, onClose]);

    if (!open) return null;

    return (
        <div className="fixed inset-0 z-[9999] flex items-center justify-center">
            <div
                className="fixed inset-0 bg-black/50"
                onClick={onClose}
            />
            <div
                className={cn(
                    "relative bg-card rounded-lg shadow-lg max-w-lg w-full mx-4 max-h-[90vh] overflow-auto",
                    className
                )}
            >
                {children}
            </div>
        </div>
    );
};

const DialogHeader = ({
    className,
    children,
    ...props
}: React.HTMLAttributes<HTMLDivElement>) => (
    <div
        className={cn("flex flex-col space-y-1.5 p-6 pb-0", className)}
        {...props}
    >
        {children}
    </div>
);

const DialogTitle = ({
    className,
    children,
    ...props
}: React.HTMLAttributes<HTMLHeadingElement>) => (
    <h2
        className={cn("text-lg font-semibold leading-none tracking-tight", className)}
        {...props}
    >
        {children}
    </h2>
);

const DialogDescription = ({
    className,
    children,
    ...props
}: React.HTMLAttributes<HTMLParagraphElement>) => (
    <p
        className={cn("text-sm text-muted-foreground", className)}
        {...props}
    >
        {children}
    </p>
);

const DialogContent = ({
    className,
    children,
    ...props
}: React.HTMLAttributes<HTMLDivElement>) => (
    <div className={cn("p-6", className)} {...props}>
        {children}
    </div>
);

const DialogFooter = ({
    className,
    children,
    ...props
}: React.HTMLAttributes<HTMLDivElement>) => (
    <div
        className={cn("flex flex-col-reverse sm:flex-row sm:justify-end sm:space-x-2 p-6 pt-0", className)}
        {...props}
    >
        {children}
    </div>
);

const DialogClose = ({
    className,
    onClick,
    ...props
}: React.ButtonHTMLAttributes<HTMLButtonElement>) => (
    <button
        className={cn(
            "absolute right-4 top-4 rounded-sm opacity-70 ring-offset-background transition-opacity hover:opacity-100 focus:outline-none focus:ring-2 focus:ring-ring focus:ring-offset-2",
            className
        )}
        onClick={onClick}
        {...props}
    >
        <X className="h-4 w-4" />
        <span className="sr-only">Close</span>
    </button>
);

export {
    Dialog,
    DialogHeader,
    DialogTitle,
    DialogDescription,
    DialogContent,
    DialogFooter,
    DialogClose,
};
