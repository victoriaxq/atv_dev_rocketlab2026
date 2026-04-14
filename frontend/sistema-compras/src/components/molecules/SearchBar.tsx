import { Search, X } from "lucide-react"
import { Input } from "@/components/atoms/ui/input"
import { Button } from "@/components/atoms/ui/button"

interface SearchBarProps {
  value: string
  onChange: (value: string) => void
  placeholder?: string
}

export function SearchBar({ value, onChange, placeholder = "Buscar produtos..." }: SearchBarProps) {
  return (
    <div className="relative flex items-center w-full max-w-sm">
      <Search className="absolute left-3 h-4 w-4 text-muted-foreground pointer-events-none" />
      <Input
        value={value}
        onChange={(e) => onChange(e.target.value)}
        placeholder={placeholder}
        className="pl-9 pr-9"
      />
      {value && (
        <Button
          type="button"
          variant="ghost"
          size="icon"
          className="absolute right-1 h-7 w-7"
          onClick={() => onChange("")}
        >
          <X className="h-3.5 w-3.5" />
          <span className="sr-only">Limpar busca</span>
        </Button>
      )}
    </div>
  )
}