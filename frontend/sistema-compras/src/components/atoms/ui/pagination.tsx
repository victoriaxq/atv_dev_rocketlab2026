import { ChevronLeft, ChevronRight, MoreHorizontal } from "lucide-react"
import { cn } from "@/lib/utils"
import { Button } from "./button"

interface PaginationProps {
  currentPage: number
  totalPages: number
  onPageChange: (page: number) => void
}

function getPageNumbers(current: number, total: number): (number | "...")[] {
  if (total <= 7) return Array.from({ length: total }, (_, i) => i + 1)

  if (current <= 4) return [1, 2, 3, 4, 5, "...", total]
  if (current >= total - 3) return [1, "...", total - 4, total - 3, total - 2, total - 1, total]

  return [1, "...", current - 1, current, current + 1, "...", total]
}

export function Pagination({ currentPage, totalPages, onPageChange }: PaginationProps) {
  if (totalPages <= 1) return null

  const pages = getPageNumbers(currentPage, totalPages)

  return (
    <div className="flex items-center justify-center gap-1">
      <Button
        variant="outline"
        size="icon"
        className="h-9 w-9"
        onClick={() => onPageChange(currentPage - 1)}
        disabled={currentPage === 1}
        aria-label="Página anterior"
      >
        <ChevronLeft className="h-4 w-4" />
      </Button>

      {pages.map((page, i) =>
        page === "..." ? (
          <span
            key={`ellipsis-${i}`}
            className="flex h-9 w-9 items-center justify-center text-muted-foreground"
          >
            <MoreHorizontal className="h-4 w-4" />
          </span>
        ) : (
          <Button
            key={page}
            variant={page === currentPage ? "default" : "outline"}
            size="icon"
            className={cn("h-9 w-9", page === currentPage && "pointer-events-none")}
            onClick={() => onPageChange(page as number)}
            aria-label={`Página ${page}`}
            aria-current={page === currentPage ? "page" : undefined}
          >
            {page}
          </Button>
        )
      )}

      <Button
        variant="outline"
        size="icon"
        className="h-9 w-9"
        onClick={() => onPageChange(currentPage + 1)}
        disabled={currentPage === totalPages}
        aria-label="Próxima página"
      >
        <ChevronRight className="h-4 w-4" />
      </Button>
    </div>
  )
}