import { PackageSearch } from "lucide-react"
import { ProductCard } from "@/components/molecules/ProductCard"
import type { ProdutoRead } from "@/types"

interface ProductGridProps {
  produtos: ProdutoRead[]
  isLoading?: boolean
}

function SkeletonCard() {
  return (
    <div className="rounded-xl border bg-card p-6 space-y-3 animate-pulse">
      <div className="h-4 bg-muted rounded w-3/4" />
      <div className="h-3 bg-muted rounded w-1/3" />
      <div className="h-3 bg-muted rounded w-1/2" />
      <div className="h-3 bg-muted rounded w-2/5" />
      <div className="h-9 bg-muted rounded mt-4" />
    </div>
  )
}

export function ProductGrid({ produtos, isLoading }: ProductGridProps) {
  if (isLoading) {
    return (
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4">
        {Array.from({ length: 8 }).map((_, i) => <SkeletonCard key={i} />)}
      </div>
    )
  }

  if (produtos.length === 0) {
    return (
      <div className="flex flex-col items-center justify-center py-20 text-center gap-3">
        <PackageSearch className="h-12 w-12 text-muted-foreground" />
        <h3 className="font-semibold text-foreground">Nenhum produto encontrado</h3>
        <p className="text-sm text-muted-foreground max-w-xs">
          Tente ajustar os filtros ou a busca para encontrar o que procura.
        </p>
      </div>
    )
  }

  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4">
      {produtos.map((produto) => (
        <ProductCard key={produto.id_produto} produto={produto} />
      ))}
    </div>
  )
}