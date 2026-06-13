import { BrowserRouter, Routes, Route } from 'react-router-dom'
import Home from './pages/Home'
import Dashboard from './pages/Dashboard'
import Perfil from './pages/Perfil'
import Ejercicio from './pages/Ejercicio'
import Feedback from './pages/Feedback'
import MoodleLogin from './pages/MoodleLogin'
import { EstudianteProvider } from './context/EstudianteContext'
import ErrorBoundary from './components/shared/ErrorBoundary'

function App() {
    return (
        <ErrorBoundary>
            <EstudianteProvider>
                <BrowserRouter>
                    <Routes>
                        <Route path="/" element={<Home />} />
                        <Route path="/dashboard" element={<Dashboard />} />
                        <Route path="/perfil" element={<Perfil />} />
                        <Route path="/ejercicio" element={<Ejercicio />} />
                        <Route path="/feedback" element={<Feedback />} />
                        <Route path="/moodle" element={<MoodleLogin />} />
                    </Routes>
                </BrowserRouter>
            </EstudianteProvider>
        </ErrorBoundary>
    )
}

export default App