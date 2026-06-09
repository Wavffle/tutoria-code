import { BrowserRouter, Routes, Route } from 'react-router-dom'
import Home from './pages/Home'
import Dashboard from './pages/Dashboard'
import Perfil from './pages/Perfil'
import Ejercicio from './pages/Ejercicio'
import Feedback from './pages/Feedback'
import Error from './pages/Error'
import { EstudianteProvider } from './context/EstudianteContext'

function App() {
    return (
        <EstudianteProvider>
            <BrowserRouter>
                <Routes>
                    <Route path="/" element={<Home />} />
                    <Route path="/dashboard" element={<Dashboard />} />
                    <Route path="/perfil" element={<Perfil />} />
                    <Route path="/ejercicio" element={<Ejercicio />} />
                    <Route path="/feedback" element={<Feedback />} />
                    <Route path="/error" element={<Error />} />
                </Routes>
            </BrowserRouter>
        </EstudianteProvider>
    )
}

export default App