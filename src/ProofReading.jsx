import { useState } from 'react'
import { useLanguage, t } from './Language.jsx'
import { proofCopy } from './proofCopy.js'
import { shortestCopy } from './shortestCopy.js'
import { ArrowIcon, ResetIcon } from './icons.jsx'
import { MiniTower } from './Tower.jsx'

function Sum() {
  return <>1 + 2 + ··· + 2<sup>n − 1</sup></>
}

function Questions({ questions, reveal, numbered = true, prompt }) {
  return <div className={`reasoning-questions${numbered ? '' : ' is-unnumbered'}`}>{questions.map(({ title, answer, supplement }, i) => <article key={i}>
    {numbered && <span className="reasoning-number">0{i + 1}</span>}
    <div><h2>{title}</h2>{prompt && <p>{prompt}</p>}<details><summary>{reveal}</summary>{(Array.isArray(answer) ? answer : [answer]).map((paragraph, index) => <p key={index}>{paragraph}</p>)}{supplement}</details></div>
  </article>)}</div>
}

function GrowingSum({ copy }) {
  return <section className="reasoning-growth">
    <h2>{copy.growTitle}</h2><p>{copy.start}</p>
    <ConditionalLines copy={copy} />
    <p>{copy.general}</p><div className="sequence-sum"><Sum /></div>
    {copy.sumNote && <p className="reasoning-sum-note">{copy.sumNote}</p>}
  </section>
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
    <details className="reasoning-comparison"><summary>{copy.compareTitle}</summary><p>{copy.compare}</p></details>
    <p className="reasoning-pending">{copy.compactNext}</p>
  </section>
}

function ReadingPage({ kind, teacherLens, onBack, onNext }) {
  const locale = useLanguage()
  const common = proofCopy[locale]
  const copy = common[kind]
  const [recalling, setRecalling] = useState(false)
  const lower = kind === 'lower'
  return <section className={`sequence-screen sequence-proof-screen reasoning-page reasoning-${kind}`}>
    <header className="sequence-heading"><span className="sequence-eyebrow">{copy.eyebrow}</span><h1>{copy.title}</h1><p>{copy.intro}</p></header>
    <button className="sequence-button reasoning-toggle" type="button" aria-expanded={!recalling} aria-controls={`reasoning-${kind}`} onClick={() => setRecalling(!recalling)}>{recalling ? common.show : common.hide}</button>
    <details className="reasoning-visual-help">
      <summary>{common.visualHelp}</summary><p>{common.visualNote}</p>
      <div className="reasoning-reference">{common.visualCaptions.map((caption, i) => <figure key={i}><MiniTower count={3} stage={['clear', 'largest', 'rebuild'][i]} /><div className="reasoning-peg-labels" aria-hidden="true"><span>A</span><span>B</span><span>C</span></div><figcaption>{caption}</figcaption></figure>)}</div>
    </details>
    <div id={`reasoning-${kind}`} hidden={recalling}>
      {!lower && <section className="reasoning-bridge"><h2>{copy.setupTitle}</h2><p>{copy.setup}</p></section>}
      {lower ? <>
        <details className="reasoning-structure"><summary>{copy.structureTitle}</summary>
          {copy.structure.map((paragraph, i) => <p key={i}>{paragraph}</p>)}
          <details><summary>{copy.bridgeTitle}</summary><p>{copy.bridge}</p></details>
          <details><summary>{copy.detoursTitle}</summary>{copy.detours.map((paragraph, i) => <p key={i}>{paragraph}</p>)}</details>
        </details>
        <details className="reasoning-connection"><summary>{copy.connect}</summary>
          <p>{copy.let}</p><p>{copy.assumption}</p><p>{copy.consequence}</p>
          <p className="reasoning-disc-count">{copy.counting}</p><p>{copy.meaning}</p>
          <ConditionalLines copy={copy} />
          <p>{copy.general}</p><div className="sequence-sum"><Sum /></div>
          <p className="reasoning-sum-note">{copy.sumNote}</p>
          <p className="reasoning-pending">{copy.pending}</p>
        </details>
      </> : <>
        <Questions questions={copy.questions} reveal={common.reveal} />
        <section className="reasoning-bridge"><h2>{copy.countTitle}</h2><p>{copy.count}</p></section>
        <GrowingSum copy={copy} />
        <div className="sequence-final-result"><strong>{copy.doneTitle}</strong><p>{copy.done}</p><div className="sequence-sum"><Sum /></div></div>
      </>}
    </div>
    <section className="reasoning-recall"><h2>{copy.recallTitle}</h2><p>{copy.recall}</p></section>
    {teacherLens && <aside className="sequence-teacher-cue" aria-label={t('Teacher lens')}><strong>{t('TEACHER LENS')}</strong><p>{copy.teacher}</p></aside>}
    <footer className="sequence-footer">
      <button className="sequence-button" type="button" onClick={onBack}><ArrowIcon direction="left" />{common.back}</button>
      <button className="sequence-button is-primary" type="button" onClick={onNext}>{lower ? common.next : common.restart}{lower ? <ArrowIcon /> : <ResetIcon />}</button>
    </footer>
  </section>
}

export function MinimumProofScreen({ teacherLens, onBack, onNext }) {
  return <ReadingPage kind="lower" teacherLens={teacherLens} onBack={onBack} onNext={onNext} />
}

export function CanScreen({ teacherLens, onBack, onRestart }) {
  return <ReadingPage kind="can" teacherLens={teacherLens} onBack={onBack} onNext={onRestart} />
}
