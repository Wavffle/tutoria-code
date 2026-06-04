import './PuntajeInfo.css'

export default function PuntajeInfo({ onVerMas }) {
    return (
        <div className="puntaje-info">
            <div className="puntaje-info__content">
                <img
                    src="/iconos/iconoNivel.png"
                    alt="Nivel"
                    className="puntaje-info__icon"
                />
                <div className="puntaje-info__texto">
                    <p className="puntaje-info__titulo">
                        Gana puntos completando, repitiendo y resolviendo ejercicios de reforzamiento.
                    </p>
                    <p className="puntaje-info__desc">
                        Al alcanzar el puntaje requerido, subirás de nivel y desbloquearás el siguiente modulo
                    </p>
                </div>
            </div>
            <button className="puntaje-info__link" onClick={onVerMas}>
                ¿Como funciona el puntaje?
            </button>
        </div>
    )
}