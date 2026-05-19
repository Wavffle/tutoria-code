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
    </nav>
  )
}
