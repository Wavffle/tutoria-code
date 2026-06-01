import './Navbar.css'

export default function Navbar() {
    return (
        <nav className="navbar">
            <div
                className="navbar__logo"
                onClick={() => {
                    const duration = 1200
                    const start = window.scrollY
                    const startTime = performance.now()

                    function scroll(currentTime) {
                        const elapsed = currentTime - startTime
                        const progress = Math.min(elapsed / duration, 1)
                        const ease = 1 - Math.pow(1 - progress, 4)
                        window.scrollTo(0, start * (1 - ease))
                        if (progress < 1) requestAnimationFrame(scroll)
                    }

                    requestAnimationFrame(scroll)
                }}
                style={{ cursor: 'pointer' }}
            >
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