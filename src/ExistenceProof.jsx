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
    <figure className="existence-start-tower">
      <MiniTower count={6} stage="start" />
      <div className="shortest-peg-labels" aria-hidden="true"><span>A</span><span>B</span><span>C</span></div>
      <figcaption>{copy.startDiagramCaption}</figcaption>
    </figure>
    <details>
      <summary>{copy.reveal}</summary>
      <div className="shortest-diagrams existence-diagrams">
        {['clear', 'largest', 'rebuild'].map((stage, index) => <div key={stage}>
          <div className="stage-title"><span>{index + 1}</span><p>{copy.diagramCaptions[index]}</p></div>
          <MiniTower count={5} stage={stage} />
          <div className="shortest-peg-labels" aria-hidden="true"><span>A</span><span>B</span><span>C</span></div>
        </div>)}
      </div>
      <div className="existence-fitch-scope">
        <h3 className="existence-assumption-title">{copy.stepTitle}</h3>
        <div className="existence-fitch-inner">
          <p><strong className="existence-logic-marker">{copy.assumptionLead}</strong>{copy.assumptionBody}</p>
          <p>{copy.extension}</p>
          <ol>{copy.steps.map((step, index) => <li key={index}>{step}</li>)}</ol>
          <p className="existence-fitch-result"><strong className="existence-logic-marker">{copy.constructionLead}</strong>{copy.constructionResult}</p>
        </div>
        <p><strong className="existence-logic-marker">{copy.specificLead}</strong>{copy.specificImplication}</p>
      </div>
      <h3 className="existence-implication">{copy.implication}</h3>
      <p>{copy.start}</p>
      <p className="existence-conclusion">{copy.conclusionLead}{copy.conclusion}</p>
    </details>
    <p className="reasoning-pending">{copy.next}</p>
  </section>
}
