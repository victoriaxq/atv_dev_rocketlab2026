import { Routes, Route } from 'react-router-dom'
import Layout from './components/Layout'
import ProductsPage from './pages/ProductsPage'
import ProductDetailPage from './pages/ProductDetailPage'
import ProductFormPage from './pages/ProductFormPage'

function App() {
  return (
    <Routes>
      <Route path="/" element={<Layout />}>
        <Route index element={<ProductsPage />} />
        <Route path="produto/novo" element={<ProductFormPage />} />
        <Route path="produto/:id" element={<ProductDetailPage />} />
        <Route path="produto/:id/editar" element={<ProductFormPage />} />
      </Route>
    </Routes>
  )
}

export default App
