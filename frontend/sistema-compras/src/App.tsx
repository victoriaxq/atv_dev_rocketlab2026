import { BrowserRouter, Routes, Route, Navigate } from "react-router-dom"
import { Catalogo } from "@/pages/Catalogo"
import { DetalhesProduto } from "@/pages/DetalhesProduto"
import { Admin } from "@/pages/Admin"

export default function App() {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<Catalogo />} />
        <Route path="/produto/:id" element={<DetalhesProduto />} />
        <Route path="/admin" element={<Admin />} />
        <Route path="*" element={<Navigate to="/" replace />} />
      </Routes>
    </BrowserRouter>
  )
}