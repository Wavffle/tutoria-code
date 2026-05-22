import TutorIANavbar from '../components/shared/TutorIANavbar.jsx'
import MoodleBanner from '../components/Perfil/MoodleBanner'
import PerfilInfo from '../components/Perfil/PerfilInfo'
import PerfilHistorial from '../components/Perfil/PerfilHistorial'
import PerfilRecomendacion from '../components/Perfil/PerfilRecomendacion'
import PerfilAcciones from '../components/Perfil/PerfilAcciones'
import './Perfil.css'

export default function Perfil() {
    return (
        <div className="perfil-page">
            <TutorIANavbar breadcrumb={[
                { label: 'Dashboard', path: '/dashboard' },
                { label: 'Perfil' }
            ]} />
            <MoodleBanner />

            <div className="perfil-page__body">
                <PerfilInfo />

                <div className="perfil-page__bottom">
                    <PerfilHistorial />
                    <div className="perfil-page__bottom-right">
                        <PerfilRecomendacion />
                        <PerfilAcciones />
                    </div>
                </div>
            </div>
        </div>
    )
}