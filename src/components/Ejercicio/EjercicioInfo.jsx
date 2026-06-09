import './EjercicioInfo.css'

export default function EjercicioInfo({ estado, errores, ejercicioSeleccionado, moduloSeleccionado, numeroEjercicio, totalEjercicios, data }) {
    const esIncorrecto = estado === 'incorrecto'

    // Obtenemos los títulos del dashboard inmediatamente, incluso antes de que responda la IA
    const tituloModulo    = moduloSeleccionado?.titulo?.toUpperCase() || data?.moduloSlug || 'MÓDULO'
    const tituloEjercicio = ejercicioSeleccionado?.texto || data?.titulo || 'Cargando práctica...'
    const nivelEjercicio  = data?.nivel || moduloSeleccionado?.nivelMinimo?.toUpperCase().replace('BASICO', 'BÁSICO') || 'BÁSICO'

    return (
        <div className="ej-info">
            <p className="ej-info__modulo">MODULO - {tituloModulo}</p>
            <h1 className="ej-info__titulo">{tituloEjercicio}</h1>
            <div className="ej-info__meta">
                <span className="ej-info__num">
                    Ejercicio {numeroEjercicio}/{totalEjercicios}
                </span>
                <span className="ej-info__nivel">Nivel: {nivelEjercicio}</span>
            </div>

            <div className={`ej-info__ia-box ${esIncorrecto ? 'ej-info__ia-box--error' : ''}`}>
                <div className="ej-info__ia-header">
                    {esIncorrecto && data ? (
                        <>
                            <img src="/iconos/xIcono.png" alt="Error" className="ej-info__ia-icon" />
                            <span className="ej-info__ia-title ej-info__ia-title--error">Se han detectado errores</span>
                        </>
                    ) : (
                        <>
                            <img src="/iconos/iAIcono.png" alt="IA" className="ej-info__ia-icon" />
                            <span className="ej-info__ia-title">Ejercicio generado por IA</span>
                        </>
                    )}
                </div>

                {/* Si no hay data (está cargando), mostramos el mensaje simple. Si ya cargó, mostramos el checklist */}
                {!data ? (
                    <p className="ej-info__ia-generado" style={{ marginTop: '6px', color: '#888' }}>
                        Generando Ejercicio...
                    </p>
                ) : (
                    <>
                        <p className="ej-info__ia-generado">
                            {esIncorrecto ? 'Se generará un ejercicio de refuerzo segun:' : 'Generado segun:'}
                        </p>
                        <ul className="ej-info__ia-lista">
                            <li><span className="ej-info__check">✓</span> <strong>Modulo:</strong> {moduloSeleccionado?.titulo || data.modulo}</li>
                            <li><span className="ej-info__check">✓</span> <strong>Lenguaje:</strong> {data.lenguaje || 'Python'}</li>
                            <li><span className="ej-info__check">✓</span> <strong>Práctica:</strong> {ejercicioSeleccionado?.texto || data.practica}</li>
                            <li><span className="ej-info__check">✓</span> <strong>Nivel:</strong> {data.nivel}</li>
                            <li>
                                <span className={esIncorrecto ? 'ej-info__x' : 'ej-info__check'}>
                                    {esIncorrecto ? '✗' : '✓'}
                                </span>
                                {' '}<strong>Errores:</strong> {errores}
                            </li>
                        </ul>
                    </>
                )}
            </div>

            <h2 className="ej-info__section-title">DESCRIPCIÓN</h2>
            <p className="ej-info__desc">
                {!data ? 'Prepárate para recibir el contexto del ejercicio.' : data.descripcion}
            </p>

            {/* Ocultamos la salida y el consejo hasta que la IA haya generado el contenido */}
            {data && (
                <>
                    <h2 className="ej-info__section-title">EJEMPLO DE SALIDA ESPERADA</h2>
                    <div className="ej-info__salida">
                        <span className="ej-info__salida-num">1</span>
                        <span className="ej-info__salida-texto">{data.salidaEsperada}</span>
                    </div>

                    <div className="ej-info__consejo-box">
                        <img src="/iconos/cerebroIcon.png" alt="Consejo" className="ej-info__consejo-icon" />
                        <p className="ej-info__consejo-texto"><strong>Recuerda:</strong> {data.consejo}</p>
                    </div>
                </>
            )}
        </div>
    )
}