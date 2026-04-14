import { Link } from 'react-router-dom'
import { Package, Scale, Ruler } from 'lucide-react'
import { Card, CardContent, CardHeader, CardTitle } from './ui/card'
import { Badge } from './ui/badge'
import { Button } from './ui/button'
import type { Product } from '@/types'

interface ProductCardProps {
  product: Product
}

export default function ProductCard({ product }: ProductCardProps) {
  const hasDimensions = 
    product.comprimento_centimetros || 
    product.altura_centimetros || 
    product.largura_centimetros

  return (
    <Card className="group transition-all hover:border-primary/50 hover:shadow-md">
      <CardHeader className="pb-3">
        <div className="flex items-start justify-between gap-2">
          <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-lg bg-primary/10">
            <Package className="h-5 w-5 text-primary" />
          </div>
          <Badge variant="secondary" className="text-xs">
            {product.categoria_produto}
          </Badge>
        </div>
        <CardTitle className="line-clamp-2 text-base leading-tight mt-3">
          {product.nome_produto}
        </CardTitle>
      </CardHeader>
      
      <CardContent className="space-y-4">
        <div className="flex flex-wrap gap-3 text-sm text-muted-foreground">
          {product.peso_produto_gramas && (
            <div className="flex items-center gap-1.5">
              <Scale className="h-3.5 w-3.5" />
              <span>{product.peso_produto_gramas.toFixed(0)}g</span>
            </div>
          )}
          {hasDimensions && (
            <div className="flex items-center gap-1.5">
              <Ruler className="h-3.5 w-3.5" />
              <span>
                {product.comprimento_centimetros?.toFixed(0) || '-'} x{' '}
                {product.largura_centimetros?.toFixed(0) || '-'} x{' '}
                {product.altura_centimetros?.toFixed(0) || '-'} cm
              </span>
            </div>
          )}
        </div>
        
        <Link to={`/produto/${product.id_produto}`}>
          <Button variant="outline" className="w-full">
            Ver Detalhes
          </Button>
        </Link>
      </CardContent>
    </Card>
  )
}
