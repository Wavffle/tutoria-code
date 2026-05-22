import { ejercicioData } from './ejercicioData'
import './EjercicioInfo.css'

export default function EjercicioInfo({ estado, errores }) {
  const esIncorrecto = estado === 'incorrecto'

  return (
    <div className="ej-info">
      {/* Título */}
      <p className="ej-info__modulo">{ejercicioData.moduloSlug}</p>
      <h1 className="ej-info__titulo">{ejercicioData.titulo}</h1>
      <div className="ej-info__meta">
        <span className="ej-info__num">Ejercicio {ejercicioData.ejercicioNum}/{ejercicioData.ejercicioTotal}</span>
        <span className="ej-info__nivel">Nivel: {ejercicioData.nivel}</span>
      </div>

      {/* Box IA */}
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
              <span className="ej-info__ia-title">Ejercicio generado por IA</span>
            </>
          )}
        </div>
        <p className="ej-info__ia-generado">
          {esIncorrecto ? 'Se generará un ejercicio de refuerzo segun:' : 'Generado segun:'}
        </p>
        <ul className="ej-info__ia-lista">
          <li><span className="ej-info__check">✓</span> <strong>Modulo:</strong> {ejercicioData.modulo}</li>
          <li><span className="ej-info__check">✓</span> <strong>Lenguaje:</strong> {ejercicioData.lenguaje}</li>
          <li><span className="ej-info__check">✓</span> <strong>Práctica:</strong> {ejercicioData.practica}</li>
          <li><span className="ej-info__check">✓</span> <strong>Nivel:</strong> {ejercicioData.nivel}</li>
          <li>
            <span className={esIncorrecto ? 'ej-info__x' : 'ej-info__check'}>
              {esIncorrecto ? '✗' : '✓'}
            </span>
            {' '}<strong>Errores:</strong> {errores}
          </li>
        </ul>
      </div>

      {/* Descripción */}
      <h2 className="ej-info__section-title">DESCRIPCIÓN</h2>
      <p className="ej-info__desc">{ejercicioData.descripcion}</p>

      {/* Salida esperada */}
      <h2 className="ej-info__section-title">EJEMPLO DE SALIDA ESPERADA</h2>
      <div className="ej-info__salida">
        <span className="ej-info__salida-num">1</span>
        <span className="ej-info__salida-texto">{ejercicioData.salidaEsperada}</span>
      </div>

      {/* Pista del tutor */}
      <div className="ej-info__pista-box">
          <img src="/iconos/ampolletaIcono.png" alt="Tip" className="ej-info__pista-robot" />
          <p className="ej-info__pista-texto">
              {ejercicioData.pista}
          </p>
      </div>
    </div>
  )
}
