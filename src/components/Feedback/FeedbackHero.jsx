import './FeedbackHero.css'

function colorPorPuntaje(puntaje) {
    if (puntaje >= 80) return '#a8d878'
    if (puntaje >= 50) return '#f0d080'
    return '#e07060'
}

export default function FeedbackHero({ data }) {
    if (!data) return null;

    const radio = 42
    const circunferencia = 2 * Math.PI * radio
    const progreso = circunferencia * data.puntaje / 100

    return (
        <div className="fb-hero">
            <div className="fb-hero__left">
                <img src="/robotTutorIA/robotFeedback.png" alt="Robot" className="fb-hero__robot" />
                <div className="fb-hero__texto">
                    <h1 className="fb-hero__titulo">¡Excelente trabajo!</h1>
                    <p className="fb-hero__desc">
                        Has completado correctamente el ejercicio.
                        Aqui tienes la retroalimentacion de la IA para seguir aprendiendo.
                    </p>
                </div>
            </div>

            <div className="fb-hero__derecha">
                <div className="fb-hero__puntaje">
                    <svg className="fb-hero__puntaje-svg" viewBox="0 0 100 100">
                        <circle cx="50" cy="50" r={radio} fill="#4F5C43" />
                        <circle
                            cx="50" cy="50" r={radio}
                            fill="none"
                            stroke={colorPorPuntaje(data.puntaje)}
                            strokeWidth="5"
                            strokeLinecap="round"
                            strokeDasharray={`${progreso} ${circunferencia}`}
                            transform="rotate(-90 50 50)"
                        />
                        <text x="50" y="47" textAnchor="middle" fill="white" fontSize="18" fontWeight="400" fontFamily="Inter">
                            {data.puntaje}%
                        </text>
                        <text x="50" y="62" textAnchor="middle" fill="rgba(255,255,255,0.75)" fontSize="10" fontFamily="Inter">
                            Puntaje
                        </text>
                    </svg>
                </div>

                <div className="fb-hero__puntos-card">
                    <img src="/iconos/tarjetaPuntos.png" alt="Puntos" className="fb-hero__puntos-bg" />
                    <div className="fb-hero__puntos-content">
                        <img src="/iconos/iconoEstrella.png" alt="Estrella" className="fb-hero__puntos-estrella" />
                        <p className="fb-hero__puntos-valor">+{data.puntosGanados}</p>
                        <p className="fb-hero__puntos-label">puntos</p>
                    </div>
                </div>
            </div>
        </div>
    )
}