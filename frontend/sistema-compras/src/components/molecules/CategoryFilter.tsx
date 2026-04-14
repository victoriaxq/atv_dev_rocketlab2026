import { useState } from "react"
import { Filter, X, ChevronDown } from "lucide-react"
import { Popover, PopoverContent, PopoverTrigger } from "@/components/atoms/ui/popover"
import { Checkbox } from "@/components/atoms/ui/checkbox"
import { Button } from "@/components/atoms/ui/button"
import { Badge } from "@/components/atoms/ui/badge"
import { cn } from "@/lib/utils"

interface CategoryFilterProps {
  categorias: string[]
  value: string[]
  onChange: (value: string[]) => void
}

export function CategoryFilter({ categorias, value, onChange }: CategoryFilterProps) {
  const [open, setOpen] = useState(false)
  const [search, setSearch] = useState("")

  const filtered = categorias.filter((cat) =>
    cat.toLowerCase().includes(search.toLowerCase())
  )

  const toggle = (cat: string) => {
    if (value.includes(cat)) {
      onChange(value.filter((c) => c !== cat))
    } else {
      onChange([...value, cat])
    }
  }

  const clearAll = () => {
    onChange([])
    setSearch("")
  }

  return (
    <div className="flex items-center gap-2 flex-wrap">
      <Popover open={open} onOpenChange={setOpen}>
        <PopoverTrigger asChild>
          <Button
            variant="outline"
            className={cn(
              "gap-2",
              value.length > 0 && "border-primary text-primary"
            )}
          >
            <Filter className="h-4 w-4" />
            Categorias
            {value.length > 0 && (
              <Badge className="ml-1 h-5 px-1.5 text-xs">
                {value.length}
              </Badge>
            )}
            <ChevronDown className={cn("h-4 w-4 transition-transform", open && "rotate-180")} />
          </Button>
        </PopoverTrigger>

        <PopoverContent className="w-72 p-0">
          {/* Search dentro do popover */}
          <div className="p-2 border-b">
            <input
              className="w-full rounded-md border border-input bg-background px-3 py-1.5 text-sm placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring"
              placeholder="Buscar categoria..."
              value={search}
              onChange={(e) => setSearch(e.target.value)}
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
                <label
                  key={cat}
                  className="flex items-center gap-2.5 rounded-md px-2 py-2 text-sm cursor-pointer hover:bg-accent transition-colors"
                >
                  <Checkbox
                    checked={value.includes(cat)}
                    onCheckedChange={() => toggle(cat)}
                    id={`cat-${cat}`}
                  />
                  <span className="flex-1 leading-none">{cat}</span>
                </label>
              ))
            )}
          </div>

          {/* Footer */}
          {value.length > 0 && (
            <div className="border-t p-2">
              <Button
                variant="ghost"
                size="sm"
                className="w-full text-muted-foreground"
                onClick={clearAll}
              >
                <X className="h-3.5 w-3.5 mr-1.5" />
                Limpar filtros
              </Button>
            </div>
          )}
        </PopoverContent>
      </Popover>

      {/* Badges das categorias selecionadas */}
      {value.map((cat) => (
        <Badge
          key={cat}
          variant="secondary"
          className="gap-1 cursor-pointer hover:bg-destructive/10 hover:text-destructive transition-colors"
          onClick={() => toggle(cat)}
        >
          {cat}
          <X className="h-3 w-3" />
        </Badge>
      ))}
    </div>
  )
}