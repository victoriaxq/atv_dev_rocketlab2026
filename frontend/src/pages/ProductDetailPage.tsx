import { useParams, useNavigate, Link } from 'react-router-dom'
import useSWR from 'swr'
import { 
  ArrowLeft, 
  Package, 
  Edit, 
  Trash2, 
  Scale, 
  Ruler, 
  TrendingUp, 
  DollarSign,
  Star,
  MessageSquare,
  Loader2,
  AlertCircle
} from 'lucide-react'
import { productsApi } from '@/api/products'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import { Button } from '@/components/ui/button'
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription, DialogFooter } from '@/components/ui/dialog'
import StarRating from '@/components/StarRating'
import ReviewCard from '@/components/ReviewCard'
import { formatCurrency } from '@/lib/utils'
import { useState } from 'react'

export default function ProductDetailPage() {
  const { id } = useParams<{ id: string }>()
  const navigate = useNavigate()
  const [showDeleteDialog, setShowDeleteDialog] = useState(false)
  const [isDeleting, setIsDeleting] = useState(false)

  const { data: product, error, isLoading } = useSWR(
    id ? ['product', id] : null,
    () => productsApi.getById(id!),
    { revalidateOnFocus: false }
  )

  const handleDelete = async () => {
    if (!id) return
    setIsDeleting(true)
    try {
      await productsApi.delete(id)
      navigate('/')
    } catch (err) {
      console.error('Erro ao excluir produto:', err)
      setIsDeleting(false)
    }
  }

  if (isLoading) {
    return (
      <div className="flex items-center justify-center py-20">
        <Loader2 className="h-8 w-8 animate-spin text-primary" />
      </div>
    )
  }

  if (error) {
    return (
      <div className="flex flex-col items-center justify-center py-20 text-center">
        <AlertCircle className="h-12 w-12 text-destructive mb-4" />
        <h3 className="text-lg font-semibold">Erro ao carregar produto</h3>
        <p className="text-muted-foreground mt-1">{error.message}</p>
        <Link to="/" className="mt-4">
          <Button variant="outline">
            <ArrowLeft className="h-4 w-4 mr-2" />
            Voltar ao catalogo
          </Button>
        </Link>
      </div>
    )
  }

  if (!product) {
    return (
      <div className="flex flex-col items-center justify-center py-20 text-center">
        <Package className="h-12 w-12 text-muted-foreground mb-4" />
        <h3 className="text-lg font-semibold">Produto nao encontrado</h3>
        <Link to="/" className="mt-4">
          <Button variant="outline">
            <ArrowLeft className="h-4 w-4 mr-2" />
            Voltar ao catalogo
          </Button>
        </Link>
      </div>
    )
  }

  const hasDimensions = 
    product.comprimento_centimetros || 
    product.altura_centimetros || 
    product.largura_centimetros

  return (
    <div className="space-y-8">
      <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
        <Link 
          to="/" 
          className="inline-flex items-center gap-2 text-sm text-muted-foreground hover:text-foreground transition-colors"
        >
          <ArrowLeft className="h-4 w-4" />
          Voltar ao catalogo
        </Link>
        
        <div className="flex gap-2">
          <Link to={`/produto/${id}/editar`}>
            <Button variant="outline" size="sm">
              <Edit className="h-4 w-4 mr-2" />
              Editar
            </Button>
          </Link>
          <Button 
            variant="destructive" 
            size="sm"
            onClick={() => setShowDeleteDialog(true)}
          >
            <Trash2 className="h-4 w-4 mr-2" />
            Excluir
          </Button>
        </div>
      </div>

      <div className="grid gap-6 lg:grid-cols-3">
        <div className="lg:col-span-2 space-y-6">
          <Card>
            <CardHeader>
              <div className="flex items-start gap-4">
                <div className="flex h-14 w-14 shrink-0 items-center justify-center rounded-xl bg-primary/10">
                  <Package className="h-7 w-7 text-primary" />
                </div>
                <div className="flex-1 min-w-0">
                  <Badge variant="secondary" className="mb-2">
                    {product.categoria_produto}
                  </Badge>
                  <CardTitle className="text-2xl">{product.nome_produto}</CardTitle>
                  <p className="text-sm text-muted-foreground mt-1">
                    ID: {product.id_produto}
                  </p>
                </div>
              </div>
            </CardHeader>
            
            <CardContent className="space-y-6">
              <div>
                <h3 className="font-semibold mb-3">Especificacoes</h3>
                <div className="grid gap-4 sm:grid-cols-2">
                  {product.peso_produto_gramas && (
                    <div className="flex items-center gap-3 p-3 rounded-lg bg-muted/50">
                      <Scale className="h-5 w-5 text-muted-foreground" />
                      <div>
                        <p className="text-sm text-muted-foreground">Peso</p>
                        <p className="font-medium">{product.peso_produto_gramas.toFixed(0)} gramas</p>
                      </div>
                    </div>
                  )}
                  {hasDimensions && (
                    <div className="flex items-center gap-3 p-3 rounded-lg bg-muted/50">
                      <Ruler className="h-5 w-5 text-muted-foreground" />
                      <div>
                        <p className="text-sm text-muted-foreground">Dimensoes (C x L x A)</p>
                        <p className="font-medium">
                          {product.comprimento_centimetros?.toFixed(0) || '-'} x{' '}
                          {product.largura_centimetros?.toFixed(0) || '-'} x{' '}
                          {product.altura_centimetros?.toFixed(0) || '-'} cm
                        </p>
                      </div>
                    </div>
                  )}
                </div>
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <div className="flex items-center justify-between">
                <CardTitle className="flex items-center gap-2">
                  <MessageSquare className="h-5 w-5" />
                  Avaliacoes dos Clientes
                </CardTitle>
                {product.media_avaliacao !== null && (
                  <div className="flex items-center gap-2">
                    <StarRating rating={product.media_avaliacao} showValue />
                    <span className="text-sm text-muted-foreground">
                      ({product.avaliacoes.length} avaliacoes)
                    </span>
                  </div>
                )}
              </div>
            </CardHeader>
            
            <CardContent>
              {product.avaliacoes.length === 0 ? (
                <div className="text-center py-8 text-muted-foreground">
                  <Star className="h-8 w-8 mx-auto mb-2 opacity-50" />
                  <p>Nenhuma avaliacao para este produto</p>
                </div>
              ) : (
                <div className="space-y-4 max-h-[500px] overflow-y-auto pr-2">
                  {product.avaliacoes.map((review) => (
                    <ReviewCard key={review.id_avaliacao} review={review} />
                  ))}
                </div>
              )}
            </CardContent>
          </Card>
        </div>

        <div className="space-y-6">
          <Card className="bg-primary/5 border-primary/20">
            <CardHeader>
              <CardTitle className="text-lg flex items-center gap-2">
                <TrendingUp className="h-5 w-5 text-primary" />
                Desempenho de Vendas
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="flex items-center justify-between p-4 rounded-lg bg-background">
                <div className="flex items-center gap-3">
                  <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-green-500/10">
                    <DollarSign className="h-5 w-5 text-green-500" />
                  </div>
                  <div>
                    <p className="text-sm text-muted-foreground">Receita Total</p>
                    <p className="text-xl font-bold text-green-500">
                      {formatCurrency(product.receita_total)}
                    </p>
                  </div>
                </div>
              </div>
              
              <div className="flex items-center justify-between p-4 rounded-lg bg-background">
                <div className="flex items-center gap-3">
                  <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-blue-500/10">
                    <Package className="h-5 w-5 text-blue-500" />
                  </div>
                  <div>
                    <p className="text-sm text-muted-foreground">Total de Vendas</p>
                    <p className="text-xl font-bold text-blue-500">
                      {product.total_vendas} unidades
                    </p>
                  </div>
                </div>
              </div>
              
              {product.media_avaliacao !== null && (
                <div className="flex items-center justify-between p-4 rounded-lg bg-background">
                  <div className="flex items-center gap-3">
                    <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-yellow-500/10">
                      <Star className="h-5 w-5 text-yellow-500" />
                    </div>
                    <div>
                      <p className="text-sm text-muted-foreground">Media de Avaliacao</p>
                      <div className="flex items-center gap-2">
                        <p className="text-xl font-bold text-yellow-500">
                          {product.media_avaliacao.toFixed(1)}
                        </p>
                        <StarRating rating={product.media_avaliacao} size="sm" />
                      </div>
                    </div>
                  </div>
                </div>
              )}
            </CardContent>
          </Card>
        </div>
      </div>

      <Dialog open={showDeleteDialog} onOpenChange={setShowDeleteDialog}>
        <DialogContent onClose={() => setShowDeleteDialog(false)}>
          <DialogHeader>
            <DialogTitle>Excluir Produto</DialogTitle>
            <DialogDescription>
              Tem certeza que deseja excluir este produto? Esta acao nao pode ser desfeita.
            </DialogDescription>
          </DialogHeader>
          <DialogFooter className="mt-4">
            <Button 
              variant="outline" 
              onClick={() => setShowDeleteDialog(false)}
              disabled={isDeleting}
            >
              Cancelar
            </Button>
            <Button 
              variant="destructive" 
              onClick={handleDelete}
              disabled={isDeleting}
            >
              {isDeleting ? (
                <>
                  <Loader2 className="h-4 w-4 mr-2 animate-spin" />
                  Excluindo...
                </>
              ) : (
                <>
                  <Trash2 className="h-4 w-4 mr-2" />
                  Excluir
                </>
              )}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  )
}
