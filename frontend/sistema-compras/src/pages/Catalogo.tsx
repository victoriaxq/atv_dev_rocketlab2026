import { useState, useEffect, useCallback } from "react"
import { SearchBar } from "@/components/molecules/SearchBar"
import { CategoryFilter } from "@/components/molecules/CategoryFilter"
import { ProductGrid } from "@/components/organisms/ProductGrid"
import { Pagination } from "@/components/atoms/ui/pagination"
import { PageLayout } from "@/components/templates/PageLayout"
import { produtosApi } from "@/api/produto"
import { usePagination } from "@/hooks/usePagination"
import type { ProdutoRead } from "@/types"

export function Catalogo() {
  const [produtos, setProdutos] = useState<ProdutoRead[]>([])
  const [categorias, setCategorias] = useState<string[]>([])
  const [search, setSearch] = useState("")
  const [categoriasSel, setCategoriasSel] = useState<string[]>([])
  const [isLoading, setIsLoading] = useState(true)

  const {
    currentPage,
    totalPages,
    total,
    skip,
    limit,
    setTotal,
    setCurrentPage,
    reset,
  } = usePagination()

  const fetchCategorias = useCallback(async () => {
    const { data } = await produtosApi.listarCategorias()
    setCategorias(data)
  }, [])

  const fetchProdutos = useCallback(async () => {
    setIsLoading(true)
    try {
      const { data } = await produtosApi.listar({
        search: search || undefined,
        categoria: categoriasSel.length > 0 ? categoriasSel : undefined,
        skip,
        limit,
      })
      setProdutos(data.items)
      setTotal(data.total)
    } finally {
      setIsLoading(false)
    }
  }, [search, categoriasSel, skip, limit, setTotal])

  const handleSearch = (val: string) => {
    setSearch(val)
    reset()
  }

  const handleCategoria = (val: string[]) => {
    setCategoriasSel(val)
    reset()
  }

  useEffect(() => { fetchCategorias() }, [fetchCategorias])

  useEffect(() => {
    const debounce = setTimeout(() => { fetchProdutos() }, 400)
    return () => clearTimeout(debounce)
  }, [fetchProdutos])

  return (
    <PageLayout>
      <div className="space-y-6">
        <div>
          <h1 className="text-2xl font-semibold tracking-tight">Catálogo de Produtos</h1>
          <p className="text-sm text-muted-foreground mt-1">
            {isLoading
              ? "Carregando..."
              : `${total} produto${total !== 1 ? "s" : ""} encontrado${total !== 1 ? "s" : ""}`}
          </p>
        </div>

        <div className="flex flex-col sm:flex-row gap-3 flex-wrap">
          <SearchBar value={search} onChange={handleSearch} />
          <CategoryFilter
            categorias={categorias}
            value={categoriasSel}
            onChange={handleCategoria}
          />
        </div>

        <ProductGrid produtos={produtos} isLoading={isLoading} />

        <Pagination
          currentPage={currentPage}
          totalPages={totalPages}
          onPageChange={setCurrentPage}
        />
      </div>
    </PageLayout>
  )
}