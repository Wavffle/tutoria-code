import { useNavigate } from 'react-router-dom'
import { perfilData } from '../Perfil/perfilData'
import './PerfilNavbar.css'

export default function PerfilNavbar({ breadcrumb }) {
    const navigate = useNavigate()

    return (
        <header className="perfil-navbar">
            <div className="perfil-navbar__logo">
                <div className="perfil-navbar__logo-line">
                    <span className="perfil-navbar__logo-tutor">Tutor</span>
                    <span className="perfil-navbar__logo-ia">IA</span>
                </div>
                <span className="perfil-navbar__logo-sub">Code</span>
            </div>

            <nav className="perfil-navbar__breadcrumb">
                {breadcrumb.map((item, i) => (
                    <span key={i} className="perfil-navbar__breadcrumb-item">
            {item.path ? (
                <button
                    className="perfil-navbar__breadcrumb-link"
                    onClick={() => navigate(item.path)}
                >
                    {item.label}
                </button>
            ) : (
                <span className="perfil-navbar__breadcrumb-current">{item.label}</span>
            )}
                        {i < breadcrumb.length - 1 && (
                            <span className="perfil-navbar__breadcrumb-sep">›</span>
                        )}
          </span>
                ))}
            </nav>

            <div className="perfil-navbar__right">
                <div className="perfil-navbar__nivel">
                    Nivel: <strong>{perfilData.nivelActual}</strong>
                </div>
                <div className="perfil-navbar__avatar">
                    {perfilData.iniciales}
                </div>
            </div>
        </header>
    )
}