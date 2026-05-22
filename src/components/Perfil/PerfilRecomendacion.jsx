import { useNavigate } from 'react-router-dom'
import { perfilData } from './perfilData'
import './PerfilRecomendacion.css'

export default function PerfilRecomendacion() {
    const navigate = useNavigate()

    return (
        <div className="recomendacion">
            <h2 className="recomendacion__title">Recomendación TutorIA</h2>

            <div className="recomendacion__body">
                <img src="/robotLampara.png" alt="TutorIA recomienda" className="recomendacion__robot" />
                <div className="recomendacion__texto-wrap">
                    <p className="recomendacion__texto">
                        {perfilData.recomendacion.texto}{' '}
                        <strong>{perfilData.recomendacion.tema}</strong>
                    </p>
                    <button
                        className="recomendacion__btn"
                        onClick={() => navigate('/dashboard')}
                    >
                        Ir ahora →
                    </button>
                </div>
            </div>
        </div>
    )
}