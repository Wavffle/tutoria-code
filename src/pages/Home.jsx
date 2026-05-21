import Navbar from '../components/PaginaPrincipal/Navbar.jsx'
import Hero from '../components/PaginaPrincipal/Hero'
import Features from '../components/PaginaPrincipal/Features'
import Demo from '../components/PaginaPrincipal/Demo'
import Footer from '../components/PaginaPrincipal/Footer.jsx'

export default function Home() {
    return (
        <div className="app">
            <Navbar />
            <Hero />
            <Features />
            <Demo />
            <Footer />
        </div>
    )
}