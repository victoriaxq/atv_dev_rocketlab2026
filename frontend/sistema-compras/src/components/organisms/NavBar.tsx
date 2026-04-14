import { Link, useLocation } from "react-router-dom"
import { LayoutGrid, ShieldCheck } from "lucide-react"
import { cn } from "@/lib/utils"

export function Navbar() {
  const { pathname } = useLocation()

  const links = [
    { to: "/", label: "Catálogo", icon: LayoutGrid },
    { to: "/admin", label: "Admin", icon: ShieldCheck },
  ]

  return (
    <header className="sticky top-0 z-40 border-b bg-background/95 backdrop-blur">
      <div className="max-w-7xl mx-auto px-4 h-14 flex items-center justify-between">
        <Link to="/" className="font-semibold text-base tracking-tight">
          🛍️ Sistema de Compras
        </Link>
        <nav className="flex items-center gap-1">
          {links.map(({ to, label, icon: Icon }) => (
            <Link
              key={to}
              to={to}
              className={cn(
                "flex items-center gap-1.5 px-3 py-1.5 rounded-md text-sm font-medium transition-colors",
                pathname === to
                  ? "bg-primary text-primary-foreground"
                  : "text-muted-foreground hover:text-foreground hover:bg-accent"
              )}
            >
              <Icon className="h-4 w-4" />
              {label}
            </Link>
          ))}
        </nav>
      </div>
    </header>
  )
}

export default Navbar