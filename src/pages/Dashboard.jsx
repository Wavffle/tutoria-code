import { useState } from 'react'
import DashboardNavbar from '../components/Dashboard/DashboardNavbar'
import RutaIA from '../components/Dashboard/RutaIA'
import ModulosGrid from '../components/Dashboard/ModulosGrid'
import IAPopup from '../components/Dashboard/IAPopup'
import PuntajeInfo from '../components/Dashboard/PuntajeInfo'
import PuntajePopup from '../components/Dashboard/PuntajePopup'
import { modulos } from '../components/Dashboard/dashboardData'
import './Dashboard.css'

export default function Dashboard() {
    const [popupModulo, setPopupModulo] = useState(null)
    const [mostrarPuntaje, setMostrarPuntaje] = useState(false)

    return (
        <div className="dashboard">
            <DashboardNavbar />
            <RutaIA />
            <div className="dashboard__grid-wrapper">
                <ModulosGrid
                    modulos={modulos}
                    onIAClick={(modulo) => setPopupModulo(modulo)}
                />
            </div>
            <PuntajeInfo onVerMas={() => setMostrarPuntaje(true)} />
            {popupModulo && (
                <IAPopup
                    modulo={popupModulo}
                    onClose={() => setPopupModulo(null)}
                />
            )}
            {mostrarPuntaje && (
                <PuntajePopup onClose={() => setMostrarPuntaje(false)} />
            )}
        </div>
    )
}