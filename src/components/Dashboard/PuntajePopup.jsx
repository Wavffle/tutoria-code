import { useState } from 'react'
import './PuntajePopup.css'
import { useNavigate } from 'react-router-dom'

export default function PuntajePopup({ onClose }) {
    const navigate = useNavigate()
    const [cerrando, setCerrando] = useState(false)

    function handleClose() {
        setCerrando(true)
        setTimeout(() => onClose(), 200)
    }

    return (
        <div className={`puntaje-popup__overlay ${cerrando ? 'puntaje-popup__overlay--saliendo' : ''}`} onClick={handleClose}>
            <div className={`puntaje-popup__modal ${cerrando ? 'puntaje-popup__modal--saliendo' : ''}`} onClick={e => e.stopPropagation()}>

                <div className="puntaje-popup__header">
                    <img src="/iconos/iconoTrofeo.png" alt="Trofeo" className="puntaje-popup__header-icon" />
                    <div className="puntaje-popup__header-text">
                        <h2 className="puntaje-popup__titulo">Sistema de puntaje</h2>
                        <p className="puntaje-popup__subtitulo">Así ganas puntos y avanzas de nivel en TutorIA Code</p>
                    </div>
                </div>

                <div className="puntaje-popup__seccion-titulo">
                    <img src="/iconos/iconoEstrella.png" alt="Estrella" className="puntaje-popup__seccion-icon" />
                    <span>Puntos por ejercicio según nivel</span>
                </div>

                <div className="puntaje-popup__tabla-wrapper">
                    <table className="puntaje-popup__tabla">
                        <thead>
                        <tr>
                            <th className="puntaje-popup__tabla-th">Tipo de ejercicio</th>
                            <th className="puntaje-popup__tabla-th puntaje-popup__tabla-th--basico">BASICO<br/><span>(nivel 1)</span></th>
                            <th className="puntaje-popup__tabla-th puntaje-popup__tabla-th--intermedio">INTERMEDIO<br/><span>(Nivel 2)</span></th>
                            <th className="puntaje-popup__tabla-th puntaje-popup__tabla-th--avanzado">AVANZADO<br/><span>(NIVEL 3)</span></th>
                        </tr>
                        </thead>
                        <tbody>
                        <tr>
                            <td className="puntaje-popup__tabla-td">
                                <p className="puntaje-popup__tabla-tipo puntaje-popup__tabla-tipo--primera">Primera vez</p>
                                <p className="puntaje-popup__tabla-desc">(Ejercicio completado)</p>
                            </td>
                            <td className="puntaje-popup__tabla-td puntaje-popup__tabla-pts--basico">+80 pts</td>
                            <td className="puntaje-popup__tabla-td puntaje-popup__tabla-pts--intermedio">+120 pts</td>
                            <td className="puntaje-popup__tabla-td puntaje-popup__tabla-pts--avanzado">+160 pts</td>
                        </tr>
                        <tr>
                            <td className="puntaje-popup__tabla-td">
                                <p className="puntaje-popup__tabla-tipo puntaje-popup__tabla-tipo--refuerzo">Ejercicio de refuerzo</p>
                                <p className="puntaje-popup__tabla-desc">(Error al realizar el ejercicio)</p>
                            </td>
                            <td className="puntaje-popup__tabla-td puntaje-popup__tabla-pts--basico">+30 pts</td>
                            <td className="puntaje-popup__tabla-td puntaje-popup__tabla-pts--intermedio">+45 pts</td>
                            <td className="puntaje-popup__tabla-td puntaje-popup__tabla-pts--avanzado">+60 pts</td>
                        </tr>
                        <tr>
                            <td className="puntaje-popup__tabla-td">
                                <p className="puntaje-popup__tabla-tipo puntaje-popup__tabla-tipo--variacion">Variación con IA</p>
                                <p className="puntaje-popup__tabla-desc">(Repetir el ejercicio completado)</p>
                            </td>
                            <td className="puntaje-popup__tabla-td puntaje-popup__tabla-pts--basico">+40 pts</td>
                            <td className="puntaje-popup__tabla-td puntaje-popup__tabla-pts--intermedio">+60 pts</td>
                            <td className="puntaje-popup__tabla-td puntaje-popup__tabla-pts--avanzado">+80 pts</td>
                        </tr>
                        </tbody>
                    </table>
                </div>

                <div className="puntaje-popup__seccion-titulo">
                    <img src="/iconos/iconoMeta.png" alt="Meta" className="puntaje-popup__seccion-icon" />
                    <span>Metas para subir de nivel</span>
                </div>

                <div className="puntaje-popup__niveles">
                    <div className="puntaje-popup__nivel puntaje-popup__nivel--basico">
                        <p className="puntaje-popup__nivel-titulo">Nivel BASICO</p>
                        <p className="puntaje-popup__nivel-puntos">500 puntos</p>
                        <p className="puntaje-popup__nivel-desc">Para subir a<br/><strong>INTERMEDIO</strong></p>
                    </div>
                    <div className="puntaje-popup__nivel puntaje-popup__nivel--intermedio">
                        <p className="puntaje-popup__nivel-titulo">Nivel INTERMEDIO</p>
                        <p className="puntaje-popup__nivel-puntos">750 puntos</p>
                        <p className="puntaje-popup__nivel-desc">Para subir a<br/><strong>AVANZADO</strong></p>
                    </div>
                    <div className="puntaje-popup__nivel puntaje-popup__nivel--avanzado">
                        <p className="puntaje-popup__nivel-titulo">Nivel AVANZADO</p>
                        <p className="puntaje-popup__nivel-puntos">1000 puntos</p>
                        <p className="puntaje-popup__nivel-desc">¡Eres un maestro de la programación!</p>
                    </div>
                </div>

                <div className="puntaje-popup__nota">
                    <img src="/robotTutorIA/codiChibi.png" alt="Robot" className="puntaje-popup__nota-robot" />
                    <p className="puntaje-popup__nota-texto">
                        <strong>Recuerda que TutorIA es un tutor de reforzamiento:</strong><br/>
                        se enfoca en ayudarte a aprender y mejorar tus habilidades en programación.
                    </p>
                </div>

                <button className="puntaje-popup__btn" onClick={() => { handleClose(); navigate('/dashboard') }}>
                    ¡A ejercitar!
                </button>

            </div>
        </div>
    )
}