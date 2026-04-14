import { useState, useEffect } from "react"
import { useParams, useNavigate } from "react-router-dom"
import { ArrowLeft, Package, Ruler, Weight, ShoppingCart, TrendingUp, DollarSign } from "lucide-react"
import { Button } from "@/components/atoms/ui/button"
import { Badge } from "@/components/atoms/ui/badge"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/atoms/ui/card"
import { StarRating } from "@/components/atoms/StarRating"
import { PageLayout } from "@/components/templates/PageLayout"
import { produtosApi } from "@/api/produto"
import { avaliacoesApi } from "@/api/avaliacao"
import type { ProdutoDetail, AvaliacaoRead } from "@/types"

function StatCard({ icon: Icon, label, value }: { icon: React.ElementType; label: string; value: string }) {
  return (
    <Card>
      <CardContent className="flex items-center gap-4 pt-6">
        <div className="p-2 rounded-lg bg-primary/10">
          <Icon className="h-5 w-5 text-primary" />
        </div>
        <div>
          <p className="text-xs text-muted-foreground">{label}</p>
          <p className="text-lg font-semibold">{value}</p>
        </div>
      </CardContent>
    </Card>
  )
}

function AvaliacaoCard({ avaliacao }: { avaliacao: AvaliacaoRead }) {
  return (
    <Card>
      <CardContent className="pt-4 space-y-2">
        <div className="flex items-center justify-between">
          <StarRating value={avaliacao.avaliacao} size={14} showValue={false} />
          {avaliacao.data_comentario && (
            <span className="text-xs text-muted-foreground">
              {new Date(avaliacao.data_comentario).toLocaleDateString("pt-BR")}
            </span>
          )}
        </div>
        {avaliacao.titulo_comentario && (
          <p className="text-sm font-medium">{avaliacao.titulo_comentario}</p>
        )}
        {avaliacao.comentario && (
          <p className="text-sm text-muted-foreground">{avaliacao.comentario}</p>
        )}
      </CardContent>
    </Card>
  )
}

function SkeletonDetalhe() {
  return (
    <div className="space-y-6 animate-pulse">
      <div className="h-8 bg-muted rounded w-1/3" />
      <div className="h-4 bg-muted rounded w-1/4" />
      <div className="grid grid-cols-2 md:grid-cols-3 gap-4">
        {Array.from({ length: 3 }).map((_, i) => (
          <div key={i} className="h-24 bg-muted rounded-xl" />
        ))}
      </div>
      <div className="h-40 bg-muted rounded-xl" />
    </div>
  )
}

export function DetalhesProduto() {
  const { id } = useParams<{ id: string }>()
  const navigate = useNavigate()
  const [produto, setProduto] = useState<ProdutoDetail | null>(null)
  const [avaliacoes, setAvaliacoes] = useState<AvaliacaoRead[]>([])
  const [isLoading, setIsLoading] = useState(true)
  const [erro, setErro] = useState(false)

  useEffect(() => {
    if (!id) return
    const fetch = async () => {
      setIsLoading(true)
      try {
        const [{ data: prod }, { data: avals }] = await Promise.all([
          produtosApi.detalhar(id),
          avaliacoesApi.listar({ id_produto: id, limit: 10 }),
        ])
        setProduto(prod)
        // filtra avaliações relacionadas ao produto via itens de pedido
        // a API não filtra por produto diretamente, então trazemos todas
        setAvaliacoes(avals.slice(0, 10))
      } catch {
        setErro(true)
      } finally {
        setIsLoading(false)
      }
    }
    fetch()
  }, [id])

  return (
    <PageLayout>
      <div className="space-y-6">
        <Button variant="ghost" size="sm" onClick={() => navigate(-1)} className="-ml-2">
          <ArrowLeft className="h-4 w-4 mr-1" />
          Voltar
        </Button>

        {isLoading && <SkeletonDetalhe />}

        {erro && !isLoading && (
          <div className="flex flex-col items-center py-20 gap-3 text-center">
            <Package className="h-12 w-12 text-muted-foreground" />
            <h2 className="font-semibold">Produto não encontrado</h2>
            <Button variant="outline" onClick={() => navigate("/")}>
              Voltar ao catálogo
            </Button>
          </div>
        )}

        {produto && !isLoading && (
          <>
            {/* Header */}
            <div className="space-y-2">
              <div className="flex flex-wrap items-start gap-3">
                <h1 className="text-2xl font-semibold tracking-tight flex-1">
                  {produto.nome_produto}
                </h1>
                <Badge variant="secondary">{produto.categoria_produto}</Badge>
              </div>
              <StarRating value={produto.media_avaliacao} />
            </div>

            {/* Métricas */}
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
              <StatCard
                icon={ShoppingCart}
                label="Total de vendas"
                value={produto.total_vendas.toLocaleString("pt-BR")}
              />
              <StatCard
                icon={DollarSign}
                label="Receita total"
                value={produto.receita_total.toLocaleString("pt-BR", {
                  style: "currency",
                  currency: "BRL",
                })}
              />
              <StatCard
                icon={TrendingUp}
                label="Média de avaliação"
                value={produto.media_avaliacao ? `${produto.media_avaliacao.toFixed(1)} / 5` : "—"}
              />
            </div>

            {/* Medidas */}
            <Card>
              <CardHeader>
                <CardTitle className="text-base flex items-center gap-2">
                  <Ruler className="h-4 w-4" /> Dimensões e peso
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="grid grid-cols-2 sm:grid-cols-4 gap-4 text-sm">
                  {[
                    { label: "Comprimento", value: produto.comprimento_centimetros, unit: "cm" },
                    { label: "Altura", value: produto.altura_centimetros, unit: "cm" },
                    { label: "Largura", value: produto.largura_centimetros, unit: "cm" },
                    { label: "Peso", value: produto.peso_produto_gramas, unit: "g" },
                  ].map(({ label, value, unit }) => (
                    <div key={label} className="space-y-1">
                      <p className="text-xs text-muted-foreground">{label}</p>
                      <p className="font-medium flex items-center gap-1">
                        {value != null ? (
                          <>
                            {label === "Peso"
                              ? <Weight className="h-3.5 w-3.5 text-muted-foreground" />
                              : <Ruler className="h-3.5 w-3.5 text-muted-foreground" />}
                            {value} {unit}
                          </>
                        ) : "—"}
                      </p>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>

            {/* Avaliações */}
            <div className="space-y-3">
              <h2 className="text-lg font-semibold">Avaliações dos consumidores</h2>
              {avaliacoes.length === 0 ? (
                <p className="text-sm text-muted-foreground">Nenhuma avaliação ainda.</p>
              ) : (
                <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                  {avaliacoes.map((av) => (
                    <AvaliacaoCard key={av.id_avaliacao} avaliacao={av} />
                  ))}
                </div>
              )}
            </div>
          </>
        )}
      </div>
    </PageLayout>
  )
}