import { useState, useEffect } from 'react'
import { useParams, useNavigate, Link } from 'react-router-dom'
import useSWR from 'swr'
import { ArrowLeft, Save, Loader2, AlertCircle, Package } from 'lucide-react'
import { productsApi, type ProductCreate, type ProductUpdate } from '@/api/products'
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Select } from '@/components/ui/select'

interface FormData {
  nome_produto: string
  categoria_produto: string
  peso_produto_gramas: string
  comprimento_centimetros: string
  altura_centimetros: string
  largura_centimetros: string
}

const initialFormData: FormData = {
  nome_produto: '',
  categoria_produto: '',
  peso_produto_gramas: '',
  comprimento_centimetros: '',
  altura_centimetros: '',
  largura_centimetros: '',
}

export default function ProductFormPage() {
  const { id } = useParams<{ id: string }>()
  const navigate = useNavigate()
  const isEditing = Boolean(id)
  
  const [formData, setFormData] = useState<FormData>(initialFormData)
  const [newCategory, setNewCategory] = useState('')
  const [isSubmitting, setIsSubmitting] = useState(false)
  const [error, setError] = useState<string | null>(null)

  const { data: categories } = useSWR(
    'categories',
    () => productsApi.getCategories(),
    { revalidateOnFocus: false }
  )

  const { data: existingProduct, isLoading: isLoadingProduct, error: loadError } = useSWR(
    id ? ['product', id] : null,
    async () => {
      try {
        return await productsApi.getById(id!)
      } catch (err) {
        console.log('[v0] Error loading product for edit:', err)
        throw err
      }
    },
    { 
      revalidateOnFocus: false,
      shouldRetryOnError: false
    }
  )

  useEffect(() => {
    if (existingProduct) {
      setFormData({
        nome_produto: existingProduct.nome_produto,
        categoria_produto: existingProduct.categoria_produto,
        peso_produto_gramas: existingProduct.peso_produto_gramas?.toString() || '',
        comprimento_centimetros: existingProduct.comprimento_centimetros?.toString() || '',
        altura_centimetros: existingProduct.altura_centimetros?.toString() || '',
        largura_centimetros: existingProduct.largura_centimetros?.toString() || '',
      })
    }
  }, [existingProduct])

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target
    setFormData((prev) => ({ ...prev, [name]: value }))
    setError(null)
  }

  const handleCategoryChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
    const value = e.target.value
    if (value === '__new__') {
      setFormData((prev) => ({ ...prev, categoria_produto: '' }))
    } else {
      setFormData((prev) => ({ ...prev, categoria_produto: value }))
      setNewCategory('')
    }
  }

  const handleNewCategoryChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setNewCategory(e.target.value)
    setFormData((prev) => ({ ...prev, categoria_produto: e.target.value }))
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setError(null)

    if (!formData.nome_produto.trim()) {
      setError('Nome do produto e obrigatorio')
      return
    }
    if (!formData.categoria_produto.trim()) {
      setError('Categoria do produto e obrigatoria')
      return
    }

    setIsSubmitting(true)

    try {
      const parseNumber = (value: string) => {
        const num = parseFloat(value)
        return isNaN(num) ? null : num
      }

      const payload: ProductCreate | ProductUpdate = {
        nome_produto: formData.nome_produto.trim(),
        categoria_produto: formData.categoria_produto.trim(),
        peso_produto_gramas: parseNumber(formData.peso_produto_gramas),
        comprimento_centimetros: parseNumber(formData.comprimento_centimetros),
        altura_centimetros: parseNumber(formData.altura_centimetros),
        largura_centimetros: parseNumber(formData.largura_centimetros),
      }

      if (isEditing && id) {
        await productsApi.update(id, payload)
        navigate(`/produto/${id}`, { replace: true })
      } else {
        const created = await productsApi.create(payload as ProductCreate)
        console.log('[v0] Product created:', created)
        // Redireciona para a lista ao criar um novo produto
        navigate('/', { replace: true })
      }
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Erro ao salvar produto')
      setIsSubmitting(false)
    }
  }

  if (isEditing && isLoadingProduct) {
    return (
      <div className="flex items-center justify-center py-20">
        <Loader2 className="h-8 w-8 animate-spin text-primary" />
      </div>
    )
  }

  if (isEditing && loadError) {
    return (
      <div className="max-w-2xl mx-auto space-y-6">
        <Link 
          to="/"
          className="inline-flex items-center gap-2 text-sm text-muted-foreground hover:text-foreground transition-colors"
        >
          <ArrowLeft className="h-4 w-4" />
          Voltar ao catalogo
        </Link>
        <Card>
          <CardContent className="flex flex-col items-center justify-center py-12">
            <AlertCircle className="h-12 w-12 text-destructive mb-4" />
            <h3 className="text-lg font-semibold">Erro ao carregar produto</h3>
            <p className="text-muted-foreground mt-1 text-center">
              Nao foi possivel carregar as informacoes do produto para edicao.
            </p>
            <Button 
              variant="outline" 
              className="mt-4"
              onClick={() => navigate('/')}
            >
              Voltar ao catalogo
            </Button>
          </CardContent>
        </Card>
      </div>
    )
  }

  const categoryOptions = [
    ...(categories || []).map((cat) => ({ value: cat, label: cat })),
    { value: '__new__', label: '+ Nova categoria' },
  ]

  const showNewCategoryInput = !categories?.includes(formData.categoria_produto) && formData.categoria_produto !== '' || 
    (categories && !categories.includes(formData.categoria_produto))

  return (
    <div className="max-w-2xl mx-auto space-y-6">
      <Link 
        to={isEditing && id ? `/produto/${id}` : '/'}
        className="inline-flex items-center gap-2 text-sm text-muted-foreground hover:text-foreground transition-colors"
      >
        <ArrowLeft className="h-4 w-4" />
        {isEditing ? 'Voltar ao produto' : 'Voltar ao catalogo'}
      </Link>

      <Card>
        <CardHeader>
          <div className="flex items-center gap-3">
            <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-primary/10">
              <Package className="h-5 w-5 text-primary" />
            </div>
            <div>
              <CardTitle>{isEditing ? 'Editar Produto' : 'Novo Produto'}</CardTitle>
              <CardDescription>
                {isEditing 
                  ? 'Atualize as informacoes do produto' 
                  : 'Preencha as informacoes para adicionar um novo produto'}
              </CardDescription>
            </div>
          </div>
        </CardHeader>
        
        <CardContent>
          <form onSubmit={handleSubmit} className="space-y-6">
            {error && (
              <div className="flex items-center gap-2 p-3 rounded-lg bg-destructive/10 text-destructive text-sm">
                <AlertCircle className="h-4 w-4 shrink-0" />
                {error}
              </div>
            )}

            <div className="space-y-4">
              <div className="space-y-2">
                <Label htmlFor="nome_produto">Nome do Produto *</Label>
                <Input
                  id="nome_produto"
                  name="nome_produto"
                  value={formData.nome_produto}
                  onChange={handleInputChange}
                  placeholder="Ex: Smartphone Samsung Galaxy"
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="categoria_produto">Categoria *</Label>
                <Select
                  id="categoria_produto"
                  value={categories?.includes(formData.categoria_produto) ? formData.categoria_produto : '__new__'}
                  onChange={handleCategoryChange}
                  options={categoryOptions}
                  placeholder="Selecione uma categoria"
                />
                {(showNewCategoryInput || newCategory) && (
                  <Input
                    value={newCategory || formData.categoria_produto}
                    onChange={handleNewCategoryChange}
                    placeholder="Digite o nome da nova categoria"
                    className="mt-2"
                  />
                )}
              </div>
            </div>

            <div className="space-y-4">
              <h3 className="font-medium text-sm text-muted-foreground">Especificacoes (opcional)</h3>
              
              <div className="space-y-2">
                <Label htmlFor="peso_produto_gramas">Peso (gramas)</Label>
                <Input
                  id="peso_produto_gramas"
                  name="peso_produto_gramas"
                  type="number"
                  step="0.01"
                  min="0"
                  value={formData.peso_produto_gramas}
                  onChange={handleInputChange}
                  placeholder="Ex: 500"
                />
              </div>

              <div className="grid gap-4 sm:grid-cols-3">
                <div className="space-y-2">
                  <Label htmlFor="comprimento_centimetros">Comprimento (cm)</Label>
                  <Input
                    id="comprimento_centimetros"
                    name="comprimento_centimetros"
                    type="number"
                    step="0.01"
                    min="0"
                    value={formData.comprimento_centimetros}
                    onChange={handleInputChange}
                    placeholder="Ex: 20"
                  />
                </div>
                
                <div className="space-y-2">
                  <Label htmlFor="largura_centimetros">Largura (cm)</Label>
                  <Input
                    id="largura_centimetros"
                    name="largura_centimetros"
                    type="number"
                    step="0.01"
                    min="0"
                    value={formData.largura_centimetros}
                    onChange={handleInputChange}
                    placeholder="Ex: 10"
                  />
                </div>
                
                <div className="space-y-2">
                  <Label htmlFor="altura_centimetros">Altura (cm)</Label>
                  <Input
                    id="altura_centimetros"
                    name="altura_centimetros"
                    type="number"
                    step="0.01"
                    min="0"
                    value={formData.altura_centimetros}
                    onChange={handleInputChange}
                    placeholder="Ex: 5"
                  />
                </div>
              </div>
            </div>

            <div className="flex gap-3 pt-4">
              <Button
                type="button"
                variant="outline"
                onClick={() => navigate(isEditing && id ? `/produto/${id}` : '/')}
                disabled={isSubmitting}
              >
                Cancelar
              </Button>
              <Button type="submit" disabled={isSubmitting}>
                {isSubmitting ? (
                  <>
                    <Loader2 className="h-4 w-4 mr-2 animate-spin" />
                    Salvando...
                  </>
                ) : (
                  <>
                    <Save className="h-4 w-4 mr-2" />
                    {isEditing ? 'Salvar Alteracoes' : 'Criar Produto'}
                  </>
                )}
              </Button>
            </div>
          </form>
        </CardContent>
      </Card>
    </div>
  )
}
