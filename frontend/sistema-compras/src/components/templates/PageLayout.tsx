import { Navbar } from "@/components/organisms/NavBar"

interface PageLayoutProps {
  children: React.ReactNode
}

export function PageLayout({ children }: PageLayoutProps) {
  return (
    <div className="min-h-screen bg-background">
      <Navbar />
      <main className="max-w-7xl mx-auto px-4 py-8">
        {children}
      </main>
    </div>
  )
}