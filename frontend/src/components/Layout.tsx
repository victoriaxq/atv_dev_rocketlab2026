import { Outlet, Link, useLocation } from 'react-router-dom'
import { Package, LayoutDashboard, Plus } from 'lucide-react'
import { Button } from './ui/button'

export default function Layout() {
  const location = useLocation()
  
  return (
    <div className="min-h-screen bg-background">
      <header className="sticky top-0 z-40 border-b bg-card/95 backdrop-blur supports-[backdrop-filter]:bg-card/60">
        <div className="container mx-auto flex h-16 items-center justify-between px-4">
          <Link to="/" className="flex items-center gap-2">
            <div className="flex h-9 w-9 items-center justify-center rounded-lg bg-primary">
              <Package className="h-5 w-5 text-primary-foreground" />
            </div>
            <span className="text-lg font-semibold">E-Commerce Manager</span>
          </Link>
          
          <nav className="flex items-center gap-6">
            <Link
              to="/"
              className={`flex items-center gap-2 text-sm font-medium transition-colors hover:text-primary ${
                location.pathname === '/' ? 'text-primary' : 'text-muted-foreground'
              }`}
            >
              <LayoutDashboard className="h-4 w-4" />
              Produtos
            </Link>
            
            <Link to="/produto/novo">
              <Button size="sm" className="gap-2">
                <Plus className="h-4 w-4" />
                Novo Produto
              </Button>
            </Link>
          </nav>
        </div>
      </header>
      
      <main className="container mx-auto px-4 py-8">
        <Outlet />
      </main>
    </div>
  )
}
