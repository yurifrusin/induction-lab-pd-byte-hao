import { useLanguage } from './Language.jsx'
import { existenceCopy } from './existenceCopy.js'
import { MiniTower } from './Tower.jsx'

export function ExistenceProof() {
  const copy = existenceCopy[useLanguage()]
  return <section className="existence-proof" aria-labelledby="existence-title">
    <h1 id="existence-title">{copy.title}</h1>
    <p>{copy.intro}</p>
    <p>{copy.lead}</p>
    <p>{copy.leadQuestion}</p>
    <div className="shortest-diagrams existence-diagrams">
      {['clear', 'largest', 'rebuild'].map((stage, index) => <div key={stage}>
        <div className="stage-title"><span>{index + 1}</span><p>{copy.diagramCaptions[index]}</p></div>
        <MiniTower count={5} stage={stage} />
        <div className="shortest-peg-labels" aria-hidden="true"><span>A</span><span>B</span><span>C</span></div>
      </div>)}
    </div>
    <details>
      <summary>{copy.reveal}</summary>
      <h3 className="existence-assumption-title">{copy.stepTitle}</h3><p>{copy.setup}</p>
      <ol>{copy.steps.map((step, index) => <li key={index}>{step}</li>)}</ol>
      <p className="existence-implication"><strong>{copy.implication}</strong></p>
      <h3>{copy.startTitle}</h3><p>{copy.start}</p>
      <p>{copy.conclusion}</p>
      <p className="existence-name">{copy.name}</p>
    </details>
    <p className="reasoning-pending">{copy.next}</p>
  </section>
}
