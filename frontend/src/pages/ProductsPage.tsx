import { useState, useEffect, useMemo } from 'react'
import useSWR from 'swr'
import { Package, AlertCircle, Loader2 } from 'lucide-react'
import { productsApi } from '@/api/products'
import ProductCard from '@/components/ProductCard'
import SearchFilters from '@/components/SearchFilters'

export default function ProductsPage() {
  const [search, setSearch] = useState('')
  const [category, setCategory] = useState('')
  const [debouncedSearch, setDebouncedSearch] = useState('')

  useEffect(() => {
    const timer = setTimeout(() => {
      setDebouncedSearch(search)
    }, 300)
    return () => clearTimeout(timer)
  }, [search])

  const { data: products, error, isLoading } = useSWR(
    ['products', debouncedSearch, category],
    () => productsApi.list({ 
      search: debouncedSearch || undefined, 
      categoria: category || undefined,
      limit: 100,
    }),
    { revalidateOnFocus: false }
  )

  const { data: categories } = useSWR(
    'categories',
    () => productsApi.getCategories(),
    { revalidateOnFocus: false }
  )

  const handleClear = () => {
    setSearch('')
    setCategory('')
  }

  const stats = useMemo(() => {
    if (!products) return null
    const categoriesCount = new Set(products.map(p => p.categoria_produto)).size
    return {
      total: products.length,
      categories: categoriesCount,
    }
  }, [products])

  return (
    <div className="space-y-8">
      <div className="flex flex-col gap-4 md:flex-row md:items-end md:justify-between">
        <div>
          <h1 className="text-3xl font-bold tracking-tight">Produtos</h1>
          <p className="text-muted-foreground mt-1">
            Gerencie o catalogo de produtos da sua loja
          </p>
        </div>
        
        {stats && (
          <div className="flex gap-6 text-sm">
            <div className="flex items-center gap-2">
              <div className="h-2 w-2 rounded-full bg-primary" />
              <span className="text-muted-foreground">
                {stats.total} produtos
              </span>
            </div>
            <div className="flex items-center gap-2">
              <div className="h-2 w-2 rounded-full bg-green-500" />
              <span className="text-muted-foreground">
                {stats.categories} categorias
              </span>
            </div>
          </div>
        )}
      </div>

      <SearchFilters
        search={search}
        onSearchChange={setSearch}
        category={category}
        onCategoryChange={setCategory}
        categories={categories || []}
        onClear={handleClear}
      />

      {isLoading && (
        <div className="flex items-center justify-center py-20">
          <Loader2 className="h-8 w-8 animate-spin text-primary" />
        </div>
      )}

      {error && (
        <div className="flex flex-col items-center justify-center py-20 text-center">
          <AlertCircle className="h-12 w-12 text-destructive mb-4" />
          <h3 className="text-lg font-semibold">Erro ao carregar produtos</h3>
          <p className="text-muted-foreground mt-1">{error.message}</p>
        </div>
      )}

      {!isLoading && !error && products?.length === 0 && (
        <div className="flex flex-col items-center justify-center py-20 text-center">
          <Package className="h-12 w-12 text-muted-foreground mb-4" />
          <h3 className="text-lg font-semibold">Nenhum produto encontrado</h3>
          <p className="text-muted-foreground mt-1">
            {search || category 
              ? 'Tente ajustar os filtros de busca'
              : 'Adicione produtos ao seu catalogo'}
          </p>
        </div>
      )}

      {products && products.length > 0 && (
        <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
          {products.map((product) => (
            <ProductCard key={product.id_produto} product={product} />
          ))}
        </div>
      )}
    </div>
  )
}
