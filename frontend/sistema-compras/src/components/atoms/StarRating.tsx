import { Star } from "lucide-react"
import { cn } from "@/lib/utils"

interface StarRatingProps {
  value: number | null
  max?: number
  size?: number
  showValue?: boolean
}

export function StarRating({ value, max = 5, size = 16, showValue = true }: StarRatingProps) {
  if (value === null || value === undefined) {
    return <span className="text-sm text-muted-foreground">Sem avaliações</span>
  }

  return (
    <div className="flex items-center gap-1.5">
      <div className="flex items-center gap-0.5">
        {Array.from({ length: max }).map((_, i) => (
          <Star
            key={i}
            size={size}
            className={cn(
              i < Math.round(value)
                ? "fill-yellow-400 text-yellow-400"
                : "fill-muted text-muted-foreground"
            )}
          />
        ))}
      </div>
      {showValue && (
        <span className="text-sm text-muted-foreground">
          {value.toFixed(1)}
        </span>
      )}
    </div>
  )
}