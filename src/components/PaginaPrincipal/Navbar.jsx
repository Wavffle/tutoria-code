import './Navbar.css'

export default function Navbar() {
    return (
        <nav className="navbar">
            <div className="navbar__logo">
                <div className="navbar__logo-line1">
                    <span className="navbar__logo-tutor">Tutor</span>
                    <span className="navbar__logo-ia">IA</span>
                </div>
                <span className="navbar__logo-sub">Code</span>
            </div>

            <div className="navbar__moodle">
                <img
                    src="/iconos/gorroIcono.png"
                    alt="Moodle"
                    className="navbar__moodle-icon"
                />
                <div className="navbar__moodle-text">
                    <span className="navbar__moodle-title">Integrado con Moodle</span>
                    <span className="navbar__moodle-sub">Accede desde tu curso</span>
                </div>
            </div>
        </nav>
    )
}