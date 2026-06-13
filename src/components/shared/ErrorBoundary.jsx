import { Component } from 'react'

export default class ErrorBoundary extends Component {
    constructor(props) {
        super(props)
        this.state = { tieneError: false }
    }

    static getDerivedStateFromError() {
        return { tieneError: true }
    }

    componentDidCatch(error, info) {
        console.error('Error capturado por ErrorBoundary:', error, info)
    }

    render() {
        if (this.state.tieneError) {
            return (
                <div style={{ minHeight: '100vh', background: '#eeeee9', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                    <div style={{ textAlign: 'center', padding: '40px', maxWidth: '480px' }}>
                        <img src="/robotTutorIA/tutorIAProblema.png" alt="Error" style={{ width: '400px'}} />
                        <h1 style={{ fontFamily: 'Inter', fontSize: '1.6rem', fontWeight: '700', color: '#1c1c1c', marginBottom: '12px' }}>
                            ¡Ups! Algo salió mal
                        </h1>
                        <p style={{ color: '#666', marginBottom: '8px', fontSize: '0.95rem', lineHeight: '1.6' }}>
                            Ocurrió un error inesperado en TutorIA.
                        </p>
                        <p style={{ color: '#888', marginBottom: '32px', fontSize: '0.88rem', lineHeight: '1.6' }}>
                            Puedes intentar <strong>recargar la página</strong> o revisar tu <strong>conexión a internet</strong>. Si el problema persiste, vuelve al inicio e ingresa de nuevo.
                        </p>
                        <div style={{ display: 'flex', gap: '12px', justifyContent: 'center' }}>
                            <button
                                onClick={() => window.location.reload()}
                                style={{ background: '#76885b', color: '#fff', border: 'none', borderRadius: '8px', padding: '12px 28px', fontFamily: 'Inter', fontSize: '0.9rem', fontWeight: '600', cursor: 'pointer' }}
                            >
                                Recargar página
                            </button>
                            <button
                                onClick={() => window.location.href = '/'}
                                style={{ background: 'transparent', color: '#76885b', border: '2px solid #76885b', borderRadius: '8px', padding: '12px 28px', fontFamily: 'Inter', fontSize: '0.9rem', fontWeight: '600', cursor: 'pointer' }}
                            >
                                ← Volver al inicio
                            </button>
                        </div>
                    </div>
                </div>
            )
        }
        return this.props.children
    }
}