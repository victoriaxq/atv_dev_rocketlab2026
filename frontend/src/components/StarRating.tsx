import { Star } from 'lucide-react'
import { cn } from '@/lib/utils'

interface StarRatingProps {
  rating: number
  maxRating?: number
  size?: 'sm' | 'md' | 'lg'
  showValue?: boolean
}

export default function StarRating({ 
  rating, 
  maxRating = 5, 
  size = 'md',
  showValue = false 
}: StarRatingProps) {
  const sizeClasses = {
    sm: 'h-3 w-3',
    md: 'h-4 w-4',
    lg: 'h-5 w-5',
  }

  return (
    <div className="flex items-center gap-1">
      {Array.from({ length: maxRating }).map((_, index) => {
        const isFilled = index < Math.floor(rating)
        const isPartial = index === Math.floor(rating) && rating % 1 > 0
        
        return (
          <div key={index} className="relative">
            <Star 
              className={cn(
                sizeClasses[size],
                'text-muted-foreground/30'
              )} 
            />
            {(isFilled || isPartial) && (
              <Star 
                className={cn(
                  sizeClasses[size],
                  'absolute inset-0 fill-yellow-400 text-yellow-400',
                  isPartial && 'clip-path-[inset(0_50%_0_0)]'
                )}
                style={isPartial ? { 
                  clipPath: `inset(0 ${100 - (rating % 1) * 100}% 0 0)` 
                } : undefined}
              />
            )}
          </div>
        )
      })}
      {showValue && (
        <span className="ml-1 text-sm font-medium">{rating.toFixed(1)}</span>
      )}
    </div>
  )
}
