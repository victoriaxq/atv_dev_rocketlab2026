import { useNavigate } from "react-router-dom"
import { Package, Ruler, Weight } from "lucide-react"
import { Card, CardContent, CardFooter, CardHeader, CardTitle } from "@/components/atoms/ui/card"
import { Badge } from "@/components/atoms/ui/badge"
import { Button } from "@/components/atoms/ui/button"
import type { ProdutoRead } from "@/types"

interface ProductCardProps {
  produto: ProdutoRead
}

export function ProductCard({ produto }: ProductCardProps) {
  const navigate = useNavigate()

  return (
    <Card className="flex flex-col hover:shadow-md transition-shadow">
      <CardHeader className="pb-3">
        <div className="flex items-start justify-between gap-2">
          <CardTitle className="text-base leading-snug line-clamp-2">
            {produto.nome_produto}
          </CardTitle>
          <Package className="h-5 w-5 shrink-0 text-muted-foreground mt-0.5" />
        </div>
        <Badge variant="secondary" className="w-fit text-xs">
          {produto.categoria_produto}
        </Badge>
      </CardHeader>

      <CardContent className="flex-1 space-y-2">
        {(produto.comprimento_centimetros || produto.altura_centimetros || produto.largura_centimetros) && (
          <div className="flex items-center gap-1.5 text-xs text-muted-foreground">
            <Ruler className="h-3.5 w-3.5" />
            <span>
              {[produto.comprimento_centimetros, produto.altura_centimetros, produto.largura_centimetros]
                .filter(Boolean)
                .join(" × ")} cm
            </span>
          </div>
        )}
        {produto.peso_produto_gramas && (
          <div className="flex items-center gap-1.5 text-xs text-muted-foreground">
            <Weight className="h-3.5 w-3.5" />
            <span>{produto.peso_produto_gramas}g</span>
          </div>
        )}
      </CardContent>

      <CardFooter>
        <Button
          className="w-full"
          variant="outline"
          size="sm"
          onClick={() => navigate(`/produto/${produto.id_produto}`)}
        >
          Ver detalhes
        </Button>
      </CardFooter>
    </Card>
  )
}