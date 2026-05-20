import Navbar from './components/Navbar'
import Hero from './components/Hero'
import Features from './components/Features'
import Demo from './components/Demo'
import './App.css'

function App() {
  return (
    <div className="app">
      <Navbar />
      <Hero />
      <Features />
      <Demo />
    </div>
  )
}

export default App