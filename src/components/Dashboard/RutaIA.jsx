import './RutaIA.css'

export default function RutaIA() {
    return (
        <div className="ruta-ia">
            <img src="/robotTutorIA/robotSaludando.png" alt="Robot TutorIA" className="ruta-ia__robot" />

            <div className="ruta-ia__left">
                <div className="ruta-ia__text">
                    <h2 className="ruta-ia__titulo">
                        Ruta adaptativa basada en IA
                        <span className="ruta-ia__spark"> ✦</span>
                    </h2>
                    <p className="ruta-ia__desc">
                        TutorIA crea y ajusta ejercicios según tu nivel, errores e intentos
                    </p>
                </div>
            </div>

            <div className="ruta-ia__divider" />

            <div className="ruta-ia__right">
                <img src="/iconos/targetIcon.png" alt="Objetivo" className="ruta-ia__target" />
                <p className="ruta-ia__right-text">
                    El contenido se genera en cada practica para que siempre sea diferente y desafiante
                </p>
            </div>
        </div>
    )
}