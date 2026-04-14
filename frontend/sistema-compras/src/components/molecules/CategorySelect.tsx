import { useState } from "react"
import { Check, ChevronsUpDown } from "lucide-react"
import { Popover, PopoverContent, PopoverTrigger } from "@/components/atoms/ui/popover"
import { Button } from "@/components/atoms/ui/button"
import { cn } from "@/lib/utils"

interface CategorySelectProps {
  categorias: string[]
  value: string
  onChange: (value: string) => void
  error?: boolean
}

export function CategorySelect({ categorias, value, onChange, error }: CategorySelectProps) {
  const [open, setOpen] = useState(false)
  const [search, setSearch] = useState("")

  const filtered = categorias.filter((cat) =>
    cat.toLowerCase().includes(search.toLowerCase())
  )

  const handleSelect = (cat: string) => {
    onChange(cat)
    setOpen(false)
    setSearch("")
  }

  return (
    <Popover open={open} onOpenChange={setOpen}>
      <PopoverTrigger asChild>
        <Button
          type="button"
          variant="outline"
          className={cn(
            "w-full justify-between font-normal",
            !value && "text-muted-foreground",
            error && "border-destructive"
          )}
        >
          {value || "Selecione uma categoria"}
          <ChevronsUpDown className="h-4 w-4 opacity-50" />
        </Button>
      </PopoverTrigger>

      <PopoverContent className="w-[--radix-popover-trigger-width] p-0">
        {/* Busca */}
        <div className="p-2 border-b">
          <input
            className="w-full rounded-md border border-input bg-background px-3 py-1.5 text-sm placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring"
            placeholder="Buscar categoria..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            autoFocus
          />
        </div>

        {/* Lista com scroll */}
        <div className="max-h-60 overflow-y-auto p-1">
          {filtered.length === 0 ? (
            <p className="py-4 text-center text-sm text-muted-foreground">
              Nenhuma categoria encontrada
            </p>
          ) : (
            filtered.map((cat) => (
              <button
                key={cat}
                type="button"
                className="flex w-full items-center gap-2 rounded-md px-2 py-2 text-sm hover:bg-accent transition-colors text-left"
                onClick={() => handleSelect(cat)}
              >
                <Check
                  className={cn(
                    "h-4 w-4 shrink-0",
                    value === cat ? "opacity-100 text-primary" : "opacity-0"
                  )}
                />
                {cat}
              </button>
            ))
          )}
        </div>
      </PopoverContent>
    </Popover>
  )
}