import './App.css'

function App() {
  return (
      <main className="home-page">
        <header className="navbar">
          <h1>TutorIA Code</h1>
          <button>Ingresar</button>
        </header>

        <section className="hero">
          <div className="hero-text">
            <h2>Aprende a programar <div className="altColor"><span>junto a un tutor</span></div> que se adapta a ti</h2>
            <p>
              Resuelve ejercicios, recibe retroalimentacion automatica y avanza segun tu nivel.
            </p>

            <div className="buttons">
              <button>Comenzar sin cuenta</button>
              <button className="secondary">Iniciar sesión</button>
            </div>
          </div>

          <div className="preview-card">
            <span>Ejercicio generado por IA</span>
            <h3>Uso de variables en cálculos</h3>
            <p>Dificultad: Básico</p>
          </div>
        </section>
      </main>
  )
}

export default App