import { BrowserRouter, Routes, Route } from 'react-router-dom'
import Home from './pages/Home'
import Dashboard from './pages/Dashboard'
import Perfil from './pages/Perfil'
import Ejercicio from './pages/Ejercicio'

function App() {
    return (
        <BrowserRouter>
            <Routes>
                <Route path="/" element={<Home />} />
                <Route path="/dashboard" element={<Dashboard />} />
                <Route path="/perfil" element={<Perfil />} />
                <Route path="/ejercicio" element={<Ejercicio />} />
            </Routes>
        </BrowserRouter>
    )
}

export default App