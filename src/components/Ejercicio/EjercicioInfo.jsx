import { ejercicioData } from './ejercicioData'
import './EjercicioInfo.css'

export default function EjercicioInfo({ estado, errores, ejercicioSeleccionado, moduloSeleccionado, numeroEjercicio, totalEjercicios, data }) {
    const esIncorrecto = estado === 'incorrecto'

    const tituloModulo    = moduloSeleccionado?.titulo?.toUpperCase() || ejercicioData.moduloSlug
    const tituloEjercicio = ejercicioSeleccionado?.texto || ejercicioData.titulo

    const cargando = !data

    return (
        <div className="ej-info">
            <p className="ej-info__modulo">MODULO - {tituloModulo}</p>
            <h1 className="ej-info__titulo">{tituloEjercicio}</h1>
            <div className="ej-info__meta">
                <span className="ej-info__num">
                    Ejercicio {numeroEjercicio}/{totalEjercicios}
                </span>
                <span className="ej-info__nivel">Nivel: {moduloSeleccionado?.nivelMinimo?.toUpperCase() || ejercicioData.nivel}</span>
            </div>

            <div className={`ej-info__ia-box ${esIncorrecto ? 'ej-info__ia-box--error' : ''}`}>
                <div className="ej-info__ia-header">
                    {esIncorrecto ? (
                        <>
                            <img src="/iconos/xIcono.png" alt="Error" className="ej-info__ia-icon" />
                            <span className="ej-info__ia-title ej-info__ia-title--error">Se han detectado errores</span>
                        </>
                    ) : (
                        <>
                            <img src="/iconos/iAIcono.png" alt="IA" className="ej-info__ia-icon" />
                            <span className="ej-info__ia-title">
                                {cargando ? 'Generando ejercicio con IA...' : 'Ejercicio generado por IA'}
                            </span>
                        </>
                    )}
                </div>
                <p className="ej-info__ia-generado">
                    {esIncorrecto ? 'Se generará un ejercicio de refuerzo segun:' : 'Generado segun:'}
                </p>
                <ul className="ej-info__ia-lista">
                    <li><span className="ej-info__check">✓</span> <strong>Modulo:</strong> {moduloSeleccionado?.titulo || ejercicioData.modulo}</li>
                    <li><span className="ej-info__check">✓</span> <strong>Lenguaje:</strong> {ejercicioData.lenguaje}</li>
                    <li><span className="ej-info__check">✓</span> <strong>Práctica:</strong> {ejercicioSeleccionado?.texto || ejercicioData.practica}</li>
                    <li><span className="ej-info__check">✓</span> <strong>Nivel:</strong> {moduloSeleccionado?.nivelMinimo?.toUpperCase() || ejercicioData.nivel}</li>
                    <li>
                        <span className={esIncorrecto ? 'ej-info__x' : 'ej-info__check'}>
                            {esIncorrecto ? '✗' : '✓'}
                        </span>
                        {' '}<strong>Errores:</strong> {errores}
                    </li>
                </ul>
            </div>

            <h2 className="ej-info__section-title">DESCRIPCIÓN</h2>
            <p className="ej-info__desc">
                {cargando ? 'TutorIA está generando tu ejercicio...' : (data?.descripcion || 'Lee el ejemplo de salida esperada para entender qué debe hacer tu programa.')}
            </p>

            <h2 className="ej-info__section-title">EJEMPLO DE SALIDA ESPERADA</h2>
            <div className="ej-info__salida">
                {cargando ? (
                    <span className="ej-info__salida-texto">...</span>
                ) : (
                    (data?.salidaEsperada || data?.salida_esperada || data?.salida || '(Sin salida esperada)')
                        .split('\n')
                        .map((linea, i) => (
                            <div key={i} className="ej-info__salida-linea">
                                <span className="ej-info__salida-num">{i + 1}</span>
                                <span className="ej-info__salida-texto">{linea}</span>
                            </div>
                        ))
                )}
            </div>

            <div className="ej-info__consejo-box">
                <img src="/iconos/cerebroIcon.png" alt="Consejo" className="ej-info__consejo-icon" />
                <p className="ej-info__consejo-texto">
                    <strong>Recuerda:</strong> {cargando ? 'Cargando consejo...' : (data?.consejo?.replace(/^recuerda que\s*/i, '').replace(/^recuerda\s*/i, '') || 'Revisa bien la descripción antes de escribir tu código.')}
                </p>
            </div>
        </div>
    )
}