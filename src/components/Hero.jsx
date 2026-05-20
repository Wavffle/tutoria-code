import './Hero.css'

const codeSnippetsLeft = [
  '#include <cmath>',
  'import random',
  'def add_point()',
  'boolean = true',
  'return a + b',
  'message = "Hello!"',
  'if operator == "+"',
  'else',
]

const codeSnippetsRight = [
  'int main()',
  'x = {"a":1,"b",2}',
  'return null',
  'int sum1, sum2;',
  'print(z)',
  'if number ≤',
  'def calc(price, tot)',
  'while command ≠ "q"',
]

const randomBetween = (min, max) => Math.random() * (max - min) + min

export default function Hero() {
  return (
    <section className="hero">
      {/* Decorativo izquierda */}
      <div className="hero__code hero__code--left" aria-hidden="true">
        {codeSnippetsLeft.map((line, i) => (
            <span
                key={i}
                className="hero__code-line"
                style={{
                  '--delay': `${i * 0.08}s`,
                  paddingLeft: `${randomBetween(0, 60)}px`,
                  fontSize: `${randomBetween(0.72, 1.0)}rem`,
                }}
            >
              {line}
            </span>
          ))}
      </div>

      {/* Main content */}
      <div className="hero__content">
        <h1 className="hero__title">
          Aprende a programar
          <span className="hero__title--accent"> junto a un tutor</span>
          <br />que se adapta a ti
        </h1>
        <p className="hero__subtitle">
          Resuelve ejercicios, recibe retroalimentación automática y<br />
          avanza según tu nivel
        </p>
        <div className="hero__actions">
          <button className="btn btn--primary">Comenzar sin cuenta</button>
          <button className="btn btn--outline">Iniciar sesión</button>
        </div>
      </div>

      {/* Decorative code — right */}
      <div className="hero__code hero__code--right" aria-hidden="true">
        {codeSnippetsRight.map((line, i) => (
            <span
                key={i}
                className="hero__code-line"
                style={{
                  '--delay': `${i * 0.08 + 0.04}s`,
                  paddingRight: `${randomBetween(0, 60)}px`,
                  fontSize: `${randomBetween(0.72, 1.0)}rem`,
                }}
            >
              {line}
            </span>
        ))}
      </div>
    </section>
  )
}
