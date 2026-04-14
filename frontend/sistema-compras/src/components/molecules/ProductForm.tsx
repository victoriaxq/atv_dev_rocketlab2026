import { useEffect } from "react"
import { useForm, useWatch } from "react-hook-form"
import { Button } from "@/components/atoms/ui/button"
import { Input } from "@/components/atoms/ui/input"
import { Label } from "@/components/atoms/ui/label"
import { CategorySelect } from "@/components/molecules/CategorySelect" // ✅ novo
import type { ProdutoCreate, ProdutoRead } from "@/types"

interface ProductFormProps {
  categorias: string[]
  defaultValues?: ProdutoRead
  onSubmit: (data: ProdutoCreate) => Promise<void>
  isLoading?: boolean
}

export function ProductForm({ categorias, defaultValues, onSubmit, isLoading }: ProductFormProps) {
  const { register, handleSubmit, setValue, control, reset, formState: { errors } } = useForm<ProdutoCreate>()

  const categoriaValue = useWatch({ control, name: "categoria_produto" })

  useEffect(() => {
    if (defaultValues) {
      reset({
        nome_produto: defaultValues.nome_produto,
        categoria_produto: defaultValues.categoria_produto,
        peso_produto_gramas: defaultValues.peso_produto_gramas ?? undefined,
        comprimento_centimetros: defaultValues.comprimento_centimetros ?? undefined,
        altura_centimetros: defaultValues.altura_centimetros ?? undefined,
        largura_centimetros: defaultValues.largura_centimetros ?? undefined,
      })
    }
  }, [defaultValues, reset])

  return (
    <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
      <div className="space-y-1.5">
        <Label htmlFor="nome_produto">Nome do produto *</Label>
        <Input
          id="nome_produto"
          placeholder="Ex: Camiseta Básica"
          {...register("nome_produto", { required: "Nome é obrigatório" })}
        />
        {errors.nome_produto && (
          <p className="text-xs text-destructive">{errors.nome_produto.message}</p>
        )}
      </div>

      {/* ✅ CategorySelect no lugar do Select */}
      <div className="space-y-1.5">
        <Label>Categoria *</Label>
        <CategorySelect
          categorias={categorias}
          value={categoriaValue ?? ""}
          onChange={(val) => setValue("categoria_produto", val, { shouldValidate: true })}
          error={!!errors.categoria_produto}
        />
        {errors.categoria_produto && (
          <p className="text-xs text-destructive">Categoria é obrigatória</p>
        )}
      </div>

      <div className="grid grid-cols-2 gap-3">
        <div className="space-y-1.5">
          <Label htmlFor="peso_produto_gramas">Peso (g)</Label>
          <Input
            id="peso_produto_gramas"
            type="number"
            placeholder="Ex: 500"
            {...register("peso_produto_gramas", {
              valueAsNumber: true,
              min: { value: 0, message: "Deve ser positivo" },
            })}
          />
          {errors.peso_produto_gramas && (
            <p className="text-xs text-destructive">{errors.peso_produto_gramas.message}</p>
          )}
        </div>
        <div className="space-y-1.5">
          <Label htmlFor="comprimento_centimetros">Comprimento (cm)</Label>
          <Input
            id="comprimento_centimetros"
            type="number"
            placeholder="Ex: 30"
            {...register("comprimento_centimetros", {
              valueAsNumber: true,
              min: { value: 0, message: "Deve ser positivo" },
            })}
          />
          {errors.comprimento_centimetros && (
            <p className="text-xs text-destructive">{errors.comprimento_centimetros.message}</p>
          )}
        </div>
        <div className="space-y-1.5">
          <Label htmlFor="altura_centimetros">Altura (cm)</Label>
          <Input
            id="altura_centimetros"
            type="number"
            placeholder="Ex: 10"
            {...register("altura_centimetros", {
              valueAsNumber: true,
              min: { value: 0, message: "Deve ser positivo" },
            })}
          />
          {errors.altura_centimetros && (
            <p className="text-xs text-destructive">{errors.altura_centimetros.message}</p>
          )}
        </div>
        <div className="space-y-1.5">
          <Label htmlFor="largura_centimetros">Largura (cm)</Label>
          <Input
            id="largura_centimetros"
            type="number"
            placeholder="Ex: 20"
            {...register("largura_centimetros", {
              valueAsNumber: true,
              min: { value: 0, message: "Deve ser positivo" },
            })}
          />
          {errors.largura_centimetros && (
            <p className="text-xs text-destructive">{errors.largura_centimetros.message}</p>
          )}
        </div>
      </div>

      <Button type="submit" className="w-full" disabled={isLoading}>
        {isLoading ? "Salvando..." : "Salvar produto"}
      </Button>
    </form>
  )
}