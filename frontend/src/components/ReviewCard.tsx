import { MessageSquare, Calendar } from 'lucide-react'
import { Card, CardContent, CardHeader } from './ui/card'
import StarRating from './StarRating'
import { formatDate } from '@/lib/utils'
import type { Review } from '@/types'

interface ReviewCardProps {
  review: Review
}

export default function ReviewCard({ review }: ReviewCardProps) {
  return (
    <Card className="border-border/50">
      <CardHeader className="pb-3">
        <div className="flex items-start justify-between">
          <div className="space-y-1">
            <StarRating rating={review.avaliacao} size="sm" />
            {review.titulo_comentario && (
              <p className="font-medium text-sm">{review.titulo_comentario}</p>
            )}
          </div>
          {review.data_comentario && (
            <div className="flex items-center gap-1.5 text-xs text-muted-foreground">
              <Calendar className="h-3 w-3" />
              {formatDate(review.data_comentario)}
            </div>
          )}
        </div>
      </CardHeader>
      
      {review.comentario && (
        <CardContent className="pt-0">
          <div className="flex gap-2">
            <MessageSquare className="h-4 w-4 shrink-0 text-muted-foreground mt-0.5" />
            <p className="text-sm text-muted-foreground leading-relaxed">
              {review.comentario}
            </p>
          </div>
        </CardContent>
      )}
    </Card>
  )
}
