import { useState } from "react"
import axios from "axios"
import { AlertTriangle } from "lucide-react"
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
} from "@/components/atoms/ui/dialog"
import { Button } from "@/components/atoms/ui/button"
import type { ProdutoRead } from "@/types"

interface DeleteDialogProps {
  open: boolean
  onOpenChange: (open: boolean) => void
  produto?: ProdutoRead
  onConfirm: () => Promise<void>
  isLoading?: boolean
}

export function DeleteDialog({
  open,
  onOpenChange,
  produto,
  onConfirm,
  isLoading,
}: DeleteDialogProps) {
  const [erro, setErro] = useState<string | null>(null)

  const handleConfirm = async () => {
    setErro(null)
    try {
      await onConfirm()
    } catch (e) {
      if (!axios.isAxiosError(e)) {
        setErro("Não foi possível remover o produto. Tente novamente.")
        return
      }

      const status = e.response?.status
      const detail = e.response?.data?.detail

      if (
        status === 409 ||
        (typeof detail === "string" && detail.toLowerCase().includes("pedido"))
      ) {
        setErro("Este produto possui pedidos associados e não pode ser removido.")
      } else if (status === 404) {
        setErro("Produto não encontrado.")
      } else if (status === 422) {
        setErro("Requisição inválida. Verifique os dados e tente novamente.")
      } else {
        setErro("Não foi possível remover o produto. Tente novamente.")
      }
    }
  }

  const handleOpenChange = (val: boolean) => {
    if (!val) setErro(null)
    onOpenChange(val)
  }

  return (
    <Dialog open={open} onOpenChange={handleOpenChange}>
      <DialogContent className="max-w-sm">
        <DialogHeader>
          <DialogTitle>Remover produto</DialogTitle>
          <DialogDescription>
            Tem certeza que deseja remover{" "}
            <span className="font-medium text-foreground">
              {produto?.nome_produto}
            </span>
            ? Esta ação não pode ser desfeita.
          </DialogDescription>
        </DialogHeader>

        {erro && (
          <div className="flex items-start gap-2.5 rounded-lg border border-destructive/30 bg-destructive/10 px-3 py-2.5 text-sm text-destructive">
            <AlertTriangle className="h-4 w-4 shrink-0 mt-0.5" />
            <span>{erro}</span>
          </div>
        )}

        <div className="flex justify-end gap-2 mt-2">
          <Button
            variant="outline"
            onClick={() => handleOpenChange(false)}
            disabled={isLoading}
          >
            Cancelar
          </Button>
          <Button
            variant="destructive"
            onClick={handleConfirm}
            disabled={isLoading}
          >
            {isLoading ? "Removendo..." : "Remover"}
          </Button>
        </div>
      </DialogContent>
    </Dialog>
  )
}