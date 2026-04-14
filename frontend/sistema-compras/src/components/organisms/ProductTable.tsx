import { useNavigate } from "react-router-dom"
import { Pencil, Trash2, Ruler, Weight, Eye } from "lucide-react"
import { Badge } from "@/components/atoms/ui/badge"
import { Button } from "@/components/atoms/ui/button"
import type { ProdutoRead } from "@/types"

interface ProductTableProps {
  produtos: ProdutoRead[]
  isLoading?: boolean
  onEdit: (produto: ProdutoRead) => void
  onDelete: (produto: ProdutoRead) => void
}

function SkeletonRow() {
  return (
    <tr className="border-b animate-pulse">
      {Array.from({ length: 5 }).map((_, i) => (
        <td key={i} className="px-4 py-3">
          <div className="h-4 bg-muted rounded w-full" />
        </td>
      ))}
    </tr>
  )
}

export function ProductTable({ produtos, isLoading, onEdit, onDelete }: ProductTableProps) {
  const navigate = useNavigate()

  return (
    <div className="rounded-xl border overflow-hidden">
      <div className="overflow-x-auto">
        <table className="w-full text-sm">
          <thead className="bg-muted/50 text-muted-foreground">
            <tr>
              <th className="text-left px-4 py-3 font-medium">Nome</th>
              <th className="text-left px-4 py-3 font-medium">Categoria</th>
              <th className="text-left px-4 py-3 font-medium">Dimensões (cm)</th>
              <th className="text-left px-4 py-3 font-medium">Peso (g)</th>
              <th className="text-right px-4 py-3 font-medium">Ações</th>
            </tr>
          </thead>
          <tbody>
            {isLoading
              ? Array.from({ length: 5 }).map((_, i) => <SkeletonRow key={i} />)
              : produtos.map((produto) => (
                  <tr
                    key={produto.id_produto}
                    className="border-b last:border-0 hover:bg-muted/30 transition-colors"
                  >
                    <td className="px-4 py-3 font-medium max-w-50 truncate">
                      {produto.nome_produto}
                    </td>
                    <td className="px-4 py-3">
                      <Badge variant="secondary">{produto.categoria_produto}</Badge>
                    </td>
                    <td className="px-4 py-3 text-muted-foreground">
                      {produto.comprimento_centimetros && produto.altura_centimetros && produto.largura_centimetros ? (
                        <span className="flex items-center gap-1">
                          <Ruler className="h-3.5 w-3.5" />
                          {produto.comprimento_centimetros} × {produto.altura_centimetros} × {produto.largura_centimetros}
                        </span>
                      ) : "—"}
                    </td>
                    <td className="px-4 py-3 text-muted-foreground">
                      {produto.peso_produto_gramas ? (
                        <span className="flex items-center gap-1">
                          <Weight className="h-3.5 w-3.5" />
                          {produto.peso_produto_gramas}
                        </span>
                      ) : "—"}
                    </td>
                    <td className="px-4 py-3">
                      <div className="flex items-center justify-end gap-1">
                        <Button
                          variant="ghost"
                          size="icon"
                          onClick={() => navigate(`/produto/${produto.id_produto}`)}
                          aria-label="Ver detalhes"
                        >
                          <Eye className="h-4 w-4" />
                        </Button>
                        <Button
                          variant="ghost"
                          size="icon"
                          onClick={() => onEdit(produto)}
                          aria-label="Editar produto"
                        >
                          <Pencil className="h-4 w-4" />
                        </Button>
                        <Button
                          variant="ghost"
                          size="icon"
                          className="text-destructive hover:text-destructive hover:bg-destructive/10"
                          onClick={() => onDelete(produto)}
                          aria-label="Remover produto"
                        >
                          <Trash2 className="h-4 w-4" />
                        </Button>
                      </div>
                    </td>
                  </tr>
                ))}
          </tbody>
        </table>
      </div>
    </div>
  )
}