import { useState, useEffect, useCallback } from "react"
import { Plus } from "lucide-react"
import { Button } from "@/components/atoms/ui/button"
import { SearchBar } from "@/components/molecules/SearchBar"
import { CategoryFilter } from "@/components/molecules/CategoryFilter"
import { ProductTable } from "@/components/organisms/ProductTable"
import { ProductDialog } from "@/components/organisms/ProductDialog"
import { DeleteDialog } from "@/components/organisms/DeleteDialog"
import { Pagination } from "@/components/atoms/ui/pagination"
import { PageLayout } from "@/components/templates/PageLayout"
import { produtosApi } from "@/api/produto"
import { usePagination } from "@/hooks/usePagination"
import type { ProdutoRead, ProdutoCreate } from "@/types"
import { toast } from "sonner"

export function Admin() {
  const [produtos, setProdutos] = useState<ProdutoRead[]>([])
  const [categorias, setCategorias] = useState<string[]>([])
  const [search, setSearch] = useState("")
  const [categoriasSel, setCategoriasSel] = useState<string[]>([])
  const [isLoading, setIsLoading] = useState(true)
  const [isSaving, setIsSaving] = useState(false)

  const [dialogOpen, setDialogOpen] = useState(false)
  const [deleteOpen, setDeleteOpen] = useState(false)
  const [editTarget, setEditTarget] = useState<ProdutoRead | undefined>()
  const [deleteTarget, setDeleteTarget] = useState<ProdutoRead | undefined>()

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

  const handleOpenCreate = () => {
    setEditTarget(undefined)
    setDialogOpen(true)
  }

  const handleOpenEdit = (produto: ProdutoRead) => {
    setEditTarget(produto)
    setDialogOpen(true)
  }

  const handleOpenDelete = (produto: ProdutoRead) => {
    setDeleteTarget(produto)
    setDeleteOpen(true)
  }

  const handleSubmit = async (data: ProdutoCreate) => {
  setIsSaving(true)
  try {
    if (editTarget) {
      await produtosApi.atualizar(editTarget.id_produto, data)
      toast.success("Produto atualizado com sucesso!")
    } else {
      await produtosApi.criar(data)
      toast.success("Produto criado com sucesso!")
    }
    setDialogOpen(false)
    await fetchProdutos()
    await fetchCategorias()
  } catch {
    toast.error("Não foi possível salvar o produto. Tente novamente.")
  } finally {
    setIsSaving(false)
  }
}

  const handleConfirmDelete = async () => {
    if (!deleteTarget) return
    setIsSaving(true)
    try {
      await produtosApi.remover(deleteTarget.id_produto)
      setDeleteOpen(false)
      if (produtos.length === 1 && currentPage > 1) {
        setCurrentPage(currentPage - 1)
      } else {
        await fetchProdutos()
      }
    } finally {
      setIsSaving(false)
    }
  }

  useEffect(() => { fetchCategorias() }, [fetchCategorias])

  useEffect(() => {
    const debounce = setTimeout(() => { fetchProdutos() }, 400)
    return () => clearTimeout(debounce)
  }, [fetchProdutos])

  return (
    <PageLayout>
      <div className="space-y-6">
        <div className="flex items-center justify-between gap-4">
          <div>
            <h1 className="text-2xl font-semibold tracking-tight">Gerenciar Produtos</h1>
            <p className="text-sm text-muted-foreground mt-1">
              {isLoading
                ? "Carregando..."
                : `${total} produto${total !== 1 ? "s" : ""} cadastrado${total !== 1 ? "s" : ""}`}
            </p>
          </div>
          <Button onClick={handleOpenCreate}>
            <Plus className="h-4 w-4 mr-1.5" />
            Novo produto
          </Button>
        </div>

        <div className="flex flex-col sm:flex-row gap-3 flex-wrap">
          <SearchBar value={search} onChange={handleSearch} />
          <CategoryFilter
            categorias={categorias}
            value={categoriasSel}
            onChange={handleCategoria}
          />
        </div>

        <ProductTable
          produtos={produtos}
          isLoading={isLoading}
          onEdit={handleOpenEdit}
          onDelete={handleOpenDelete}
        />

        <Pagination
          currentPage={currentPage}
          totalPages={totalPages}
          onPageChange={setCurrentPage}
        />

        <ProductDialog
          open={dialogOpen}
          onOpenChange={setDialogOpen}
          categorias={categorias}
          editTarget={editTarget}
          onSubmit={handleSubmit}
          isLoading={isSaving}
        />

        <DeleteDialog
          open={deleteOpen}
          onOpenChange={setDeleteOpen}
          produto={deleteTarget}
          onConfirm={handleConfirmDelete}
          isLoading={isSaving}
        />
      </div>
    </PageLayout>
  )
}