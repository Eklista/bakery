import { Routes, Route } from 'react-router-dom'
import { Layout } from './components/layout/Layout'
import { Home } from './views/Home'

function App() {
  return (
    <Layout>
      <Routes>
        <Route path="/" element={<Home />} />
        <Route path="/productos" element={<div>Productos - Próximamente</div>} />
        <Route path="/eventos" element={<div>Eventos - Próximamente</div>} />
        <Route path="/contacto" element={<div>Contacto - Próximamente</div>} />
      </Routes>
    </Layout>
  )
}

export default App