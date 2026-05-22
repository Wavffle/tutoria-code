import { perfilData } from './perfilData'
import './PerfilHistorial.css'

export default function PerfilHistorial() {
  return (
    <div className="historial">
      <h2 className="historial__title">Historial</h2>
      <table className="historial__table">
        <thead>
          <tr>
            <th>Ejercicio</th>
            <th>Resultado</th>
            <th>Estado</th>
          </tr>
        </thead>
          <tbody>
          {perfilData.historial.length === 0 ? (
              <tr>
                  <td colSpan={3} className="historial__vacio">
                      Aún no has completado ningún ejercicio.
                  </td>
              </tr>
          ) : (
              perfilData.historial.map((item) => (
                  <tr key={item.id}>
                      <td>
                          <p className="historial__ejercicio">{item.ejercicio}</p>
                          <p className="historial__modulo">{item.modulo}</p>
                      </td>
                      <td className="historial__resultado">{item.resultado}%</td>
                      <td>
          <span className="historial__estado">
            <span className="historial__check">✓</span>
              {item.estado}
          </span>
                      </td>
                  </tr>
              ))
          )}
          </tbody>
      </table>
    </div>
  )
}
