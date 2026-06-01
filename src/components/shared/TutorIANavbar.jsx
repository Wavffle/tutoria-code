import { useNavigate } from 'react-router-dom'
import { perfilData } from '../Perfil/perfilData'
import './TutorIANavbar.css'

export default function TutorIANavbar({ breadcrumb, onLogoClick, onAvatarClick, onBreadcrumbClick }) {
    const navigate = useNavigate()

    function handleLogo() {
        if (onLogoClick) onLogoClick()
        else navigate('/dashboard')
    }

    function handleAvatar() {
        if (onAvatarClick) onAvatarClick()
        else navigate('/perfil')
    }

    function handleBreadcrumb(path) {
        if (onBreadcrumbClick) onBreadcrumbClick(path)
        else navigate(path)
    }

    return (
        <header className="perfil-navbar">
            <div className="perfil-navbar__logo" onClick={handleLogo} style={{ cursor: 'pointer' }}>
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
                    onClick={() => handleBreadcrumb(item.path)}
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
                <div className="perfil-navbar__avatar" onClick={handleAvatar} style={{ cursor: 'pointer' }}>
                    {perfilData.iniciales}
                </div>
            </div>
        </header>
    )
}