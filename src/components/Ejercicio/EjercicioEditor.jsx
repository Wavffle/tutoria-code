import CodeMirror from '@uiw/react-codemirror'
import { python } from '@codemirror/lang-python'
import { oneDark } from '@codemirror/theme-one-dark'
import { useState } from 'react'
import { ejercicioData } from './ejercicioData'
import './EjercicioEditor.css'

export default function EjercicioEditor({ onEjecutar, estado, cargando, onCodigoChange }) {
    const [code, setCode] = useState('')

    const enviado = estado === 'correcto' || estado === 'incorrecto'

    function handleChange(val) {
        setCode(val)
        if (onCodigoChange) onCodigoChange(val.trim().length > 0)
    }

    return (
        <div className="ej-editor">
            <div className="ej-editor__tabbar">
                <div className="ej-editor__tab">
                    <span className="ej-editor__tab-dot" />
                    {ejercicioData.archivo}
                </div>
                <button
                    className={`ej-editor__ejecutar-btn ${enviado ? 'ej-editor__ejecutar-btn--enviado' : ''}`}
                    onClick={() => onEjecutar(code)}
                    disabled={enviado || cargando}
                >
                    {cargando ? 'Cargando Python...' : enviado ? '✓ Enviado' : 'Ejecutar'}
                </button>
            </div>

            <CodeMirror
                value={code}
                onChange={handleChange}
                extensions={[python()]}
                theme={oneDark}
                editable={!enviado}
                basicSetup={{
                    lineNumbers: true,
                    foldGutter: false,
                    dropCursor: false,
                    allowMultipleSelections: false,
                    indentOnInput: true,
                    tabSize: 4,
                }}
                style={{ fontSize: '0.88rem', flex: 1 }}
            />
        </div>
    )
}