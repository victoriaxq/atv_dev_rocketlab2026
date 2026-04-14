import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
} from "@/components/atoms/ui/dialog"
import { ProductForm } from "@/components/molecules/ProductForm"
import type { ProdutoCreate, ProdutoRead } from "@/types"

interface ProductDialogProps {
  open: boolean
  onOpenChange: (open: boolean) => void
  categorias: string[]
  editTarget?: ProdutoRead
  onSubmit: (data: ProdutoCreate) => Promise<void>
  isLoading?: boolean
}

export function ProductDialog({
  open,
  onOpenChange,
  categorias,
  editTarget,
  onSubmit,
  isLoading,
}: ProductDialogProps) {
  const isEditing = !!editTarget

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-lg max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle>
            {isEditing ? "Editar produto" : "Novo produto"}
          </DialogTitle>
          <DialogDescription>
            {isEditing
              ? "Atualize as informações do produto abaixo."
              : "Preencha as informações para cadastrar um novo produto."}
          </DialogDescription>
        </DialogHeader>
        <ProductForm
          categorias={categorias}
          defaultValues={editTarget}
          onSubmit={onSubmit}
          isLoading={isLoading}
        />
      </DialogContent>
    </Dialog>
  )
}