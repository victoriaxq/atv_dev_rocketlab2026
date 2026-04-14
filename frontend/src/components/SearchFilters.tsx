import { Search, X } from 'lucide-react'
import { Input } from './ui/input'
import { Select } from './ui/select'
import { Button } from './ui/button'

interface SearchFiltersProps {
  search: string
  onSearchChange: (value: string) => void
  category: string
  onCategoryChange: (value: string) => void
  categories: string[]
  onClear: () => void
}

export default function SearchFilters({
  search,
  onSearchChange,
  category,
  onCategoryChange,
  categories,
  onClear,
}: SearchFiltersProps) {
  const hasFilters = search || category

  return (
    <div className="flex flex-col gap-4 sm:flex-row sm:items-center">
      <div className="relative flex-1">
        <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
        <Input
          placeholder="Buscar produtos..."
          value={search}
          onChange={(e) => onSearchChange(e.target.value)}
          className="pl-9"
        />
      </div>
      
      <div className="flex gap-2">
        <Select
          value={category}
          onChange={(e) => onCategoryChange(e.target.value)}
          options={categories.map((cat) => ({ value: cat, label: cat }))}
          placeholder="Todas categorias"
          className="w-[200px]"
        />
        
        {hasFilters && (
          <Button variant="ghost" size="icon" onClick={onClear}>
            <X className="h-4 w-4" />
            <span className="sr-only">Limpar filtros</span>
          </Button>
        )}
      </div>
    </div>
  )
}
