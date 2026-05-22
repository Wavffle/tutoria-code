import './MoodleBanner.css'

export default function MoodleBanner() {
  return (
    <div className="moodle-banner">
      <div className="moodle-banner__inner">

        <div className="moodle-banner__item moodle-banner__item--main">
          <img src="/logos/LogoMoodle.png" alt="Moodle" className="moodle-banner__icon moodle-banner__icon--lg" />
          <div>
            <p className="moodle-banner__label">Integrado con Moodle</p>
            <p className="moodle-banner__sub">Estas accediendo desde tu curso en Moodle</p>
          </div>
        </div>

        <div className="moodle-banner__divider" />

        <div className="moodle-banner__item">
          <img src="/iconos/accesoIcono.png" alt="Acceso seguro" className="moodle-banner__icon" />
          <div>
            <p className="moodle-banner__label">Acceso seguro</p>
            <p className="moodle-banner__sub">Tu cuenta está sincronizada con Moodle</p>
          </div>
        </div>

        <div className="moodle-banner__item">
          <img src="/iconos/SincronizacionIcono.png" alt="Sincronización" className="moodle-banner__icon" />
          <div>
            <p className="moodle-banner__label">Sincronización</p>
            <p className="moodle-banner__sub">Tu progreso se guarda y se sincroniza con tu curso</p>
          </div>
        </div>

        <div className="moodle-banner__item">
          <img src="/iconos/resultadosIcono.png" alt="Resultados" className="moodle-banner__icon" />
          <div>
            <p className="moodle-banner__label">Resultados</p>
            <p className="moodle-banner__sub">Tus resultados y nivel pueden ser visibles para tu docente</p>
          </div>
        </div>

      </div>
    </div>
  )
}
