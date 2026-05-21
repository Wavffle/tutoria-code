import { useState } from 'react'
import DashboardNavbar from '../components/Dashboard/DashboardNavbar'
import RutaIA from '../components/Dashboard/RutaIA'
import ModulosGrid from '../components/Dashboard/ModulosGrid'
import IAPopup from '../components/Dashboard/IAPopup'
import { modulos } from '../components/Dashboard/dashboardData'
import './Dashboard.css'

export default function Dashboard() {
    const [popupModulo, setPopupModulo] = useState(null)

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
            {popupModulo && (
                <IAPopup
                    modulo={popupModulo}
                    onClose={() => setPopupModulo(null)}
                />
            )}
        </div>
    )
}