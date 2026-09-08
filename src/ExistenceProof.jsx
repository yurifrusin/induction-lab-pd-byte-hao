import { useLanguage } from './Language.jsx'
import { existenceCopy } from './existenceCopy.js'

export function ExistenceProof() {
  const copy = existenceCopy[useLanguage()]
  return <section className="existence-proof" aria-labelledby="existence-title">
    <h2 id="existence-title">{copy.title}</h2>
    <p>{copy.intro}</p>
    <details>
      <summary>{copy.reveal}</summary>
      <h3>{copy.startTitle}</h3><p>{copy.start}</p>
      <h3>{copy.stepTitle}</h3><p>{copy.setup}</p>
      <ol>{copy.steps.map((step, index) => <li key={index}>{step}</li>)}</ol>
      <p className="existence-implication"><strong>{copy.implication}</strong></p>
      <p>{copy.conclusion}</p><p>{copy.noException}</p>
      <p className="existence-name">{copy.name}</p>
    </details>
    <p className="reasoning-pending">{copy.next}</p>
  </section>
}
