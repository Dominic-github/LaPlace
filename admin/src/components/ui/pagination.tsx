import * as React from "react";
import { cn } from "@/lib/utils";
import { ChevronLeft, ChevronRight, MoreHorizontal } from "lucide-react";
import { Button } from "./button";

interface PaginationProps {
    current: number;
    total: number;
    pageSize: number;
    onChange: (page: number) => void;
    className?: string;
}

const Pagination = ({
    current,
    total,
    pageSize,
    onChange,
    className,
}: PaginationProps) => {
    const totalPages = Math.ceil(total / pageSize);

    const getPageNumbers = () => {
        const pages: (number | string)[] = [];
        const showEllipsisStart = current > 3;
        const showEllipsisEnd = current < totalPages - 2;

        if (totalPages <= 7) {
            for (let i = 1; i <= totalPages; i++) {
                pages.push(i);
            }
        } else {
            pages.push(1);
            if (showEllipsisStart) {
                pages.push("...");
            }
            for (
                let i = Math.max(2, current - 1);
                i <= Math.min(totalPages - 1, current + 1);
                i++
            ) {
                if (!pages.includes(i)) {
                    pages.push(i);
                }
            }
            if (showEllipsisEnd) {
                pages.push("...");
            }
            if (!pages.includes(totalPages)) {
                pages.push(totalPages);
            }
        }
        return pages;
    };

    if (totalPages <= 1) return null;

    return (
        <nav
            className={cn("flex items-center justify-center gap-1", className)}
            aria-label="Pagination"
        >
            <Button
                variant="outline"
                size="sm"
                onClick={() => onChange(current - 1)}
                disabled={current === 1}
            >
                <ChevronLeft className="h-4 w-4" />
            </Button>

            {getPageNumbers().map((page, index) => (
                <React.Fragment key={index}>
                    {page === "..." ? (
                        <span className="px-2">
                            <MoreHorizontal className="h-4 w-4" />
                        </span>
                    ) : (
                        <Button
                            variant={current === page ? "default" : "outline"}
                            size="sm"
                            onClick={() => onChange(page as number)}
                        >
                            {page}
                        </Button>
                    )}
                </React.Fragment>
            ))}

            <Button
                variant="outline"
                size="sm"
                onClick={() => onChange(current + 1)}
                disabled={current === totalPages}
            >
                <ChevronRight className="h-4 w-4" />
            </Button>
        </nav>
    );
};

export { Pagination };
