import { useState } from 'react'
import { useLanguage, t } from './Language.jsx'
import { proofCopy } from './proofCopy.js'
import { shortestCopy } from './shortestCopy.js'
import { ArrowIcon, ResetIcon } from './icons.jsx'
import { MiniTower } from './Tower.jsx'

function Sum() {
  return <>1 + 2 + ··· + 2<sup>n − 1</sup></>
}

function ConditionalLines({ copy }) {
  return <details className="reasoning-conditionals">
    <summary>{copy.barTitle}</summary>
    <p>{copy.barHelp}</p>
    <ul className="reasoning-conditional-list">{copy.bars.map((statement, i) => <li key={i}>
      <span className="reasoning-conditional-stroke" aria-hidden="true" />
      <p>{statement}</p>
    </li>)}</ul>
    <p>{copy.barWhy}</p>
  </details>
}

export function LowerBoundLadder({ compact = false }) {
  const locale = useLanguage()
  const copy = proofCopy[locale].lower
  const activity = shortestCopy[locale]
  return <section className={`reasoning-growth reasoning-ladder${compact ? ' is-compact' : ''}`}>
    <h2>{activity.practiceTitle}</h2>
    <p className="reasoning-start">{copy.start}</p>
    {activity.practice.map((item, i) => <article className="reasoning-disc-question" key={i}>
      <h3>{item.title}</h3><p>{item.prompt}</p>
      <details><summary>{activity.answerLabel}</summary>
        {item.reasons.map((paragraph, index) => <p key={index}>{paragraph}</p>)}
        <p className="reasoning-disc-count">{item.count}</p>
      </details>
    </article>)}
  </section>
}

export function MinimumProofScreen({ teacherLens, onBack, onNext }) {
  const locale = useLanguage()
  const common = proofCopy[locale]
  const copy = common.lower
  const [recalling, setRecalling] = useState(false)
  return <section className="sequence-screen sequence-proof-screen reasoning-page reasoning-lower">
    <header className="sequence-heading"><span className="sequence-eyebrow">{copy.eyebrow}</span><h1>{copy.title}</h1><p>{copy.intro}</p></header>
    <button className="sequence-button reasoning-toggle" type="button" aria-expanded={!recalling} aria-controls="reasoning-lower" onClick={() => setRecalling(!recalling)}>{recalling ? common.show : common.hide}</button>
    <details className="reasoning-visual-help">
      <summary>{common.visualHelp}</summary><p>{common.visualNote}</p>
      <div className="reasoning-reference">{common.visualCaptions.map((caption, i) => <figure key={i}><MiniTower count={5} stage={['clear', 'largest', 'rebuild'][i]} /><div className="reasoning-peg-labels" aria-hidden="true"><span>A</span><span>B</span><span>C</span></div><figcaption>{caption}</figcaption></figure>)}</div>
    </details>
    <div id="reasoning-lower" hidden={recalling}>
        <details className="reasoning-connection"><summary>{copy.connect}</summary>
          <p>{copy.let}</p><p>{copy.assumption}</p><p>{copy.consequence}</p>
          <p className="reasoning-disc-count">{copy.counting}</p><p>{copy.meaning}</p>
          <details><summary>{copy.bridgeTitle}</summary><p>{copy.bridge}</p></details>
          <details><summary>{copy.detoursTitle}</summary>{copy.detours.map((paragraph, i) => <p key={i}>{paragraph}</p>)}</details>
          <ConditionalLines copy={copy} />
          <p>{copy.general}</p><div className="sequence-sum"><Sum /></div>
          <p className="reasoning-sum-note">{copy.sumNote}</p>
        </details>
        <details className="reasoning-connection"><summary>{copy.attainTitle}</summary>
          {copy.attain.map((paragraph, index) => <p key={index}>{paragraph}</p>)}
        </details>
        <div className="sequence-final-result"><strong>{copy.doneTitle}</strong><p>{copy.done}</p><div className="sequence-sum"><Sum /></div></div>
    </div>
    <section className="reasoning-recall"><h2>{copy.recallTitle}</h2><p>{copy.recall}</p></section>
    {teacherLens && <aside className="sequence-teacher-cue" aria-label={t('Teacher lens')}><strong>{t('TEACHER LENS')}</strong><p>{copy.teacher}</p></aside>}
    <footer className="sequence-footer">
      <button className="sequence-button" type="button" onClick={onBack}><ArrowIcon direction="left" />{common.back}</button>
      <button className="sequence-button is-primary" type="button" onClick={onNext}>{common.restart}<ResetIcon /></button>
    </footer>
  </section>
}
