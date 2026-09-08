import { useState } from 'react'
import { useLanguage, t } from './Language.jsx'
import { proofCopy } from './proofCopy.js'
import { ArrowIcon, ResetIcon } from './icons.jsx'
import { MiniTower } from './Tower.jsx'

function Sum() {
  return <>1 + 2 + ··· + 2<sup>n − 1</sup></>
}

function Questions({ questions, reveal }) {
  return <div className="reasoning-questions">{questions.map(({ title, answer }, i) => <article key={i}>
    <span className="reasoning-number">0{i + 1}</span>
    <div><h2>{title}</h2><details><summary>{reveal}</summary><p>{answer}</p></details></div>
  </article>)}</div>
}

function GrowingSum({ copy }) {
  return <section className="reasoning-growth">
    <h2>{copy.growTitle}</h2><p>{copy.start}</p>
    <div className="reasoning-bars"><h3>{copy.barTitle}</h3><p>{copy.barHelp}</p>
      {copy.bars.map((statement, i) => <details className="reasoning-bar" key={i}>
        <summary><span>{copy.barLabels[i]}</span><span className="reasoning-bar-stroke" aria-hidden="true" /></summary><p>{statement}</p>
      </details>)}
      <span className="reasoning-continuation" aria-hidden="true">⋮</span><p>{copy.barWhy}</p>
    </div>
    <p>{copy.general}</p><div className="sequence-sum"><Sum /></div>
    {copy.sumNote && <p className="reasoning-sum-note">{copy.sumNote}</p>}
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
      <Questions questions={copy.questions} reveal={copy.reveal || common.reveal} />
      {lower ? <>
        <details className="reasoning-visual-help"><summary>{copy.detoursTitle}</summary>{copy.detours.map((paragraph, i) => <p key={i}>{paragraph}</p>)}</details>
        <section className="reasoning-bridge"><h2>{copy.bridgeTitle}</h2><p>{copy.bridge}</p></section>
        <details className="reasoning-connection"><summary>{copy.connect}</summary>
          <p>{copy.let}</p><p>{copy.assumption}</p><p>{copy.consequence}</p>
          <div className="sequence-sum">{copy.counting}</div><p>{copy.meaning}</p>
          <GrowingSum copy={copy} />
          <p className="reasoning-pending">{copy.pending}</p>
        </details>
      </> : <>
        <section className="reasoning-bridge"><h2>{copy.countTitle}</h2><p>{copy.count}</p><div className="sequence-sum">a + 1 + a = 1 + 2a</div></section>
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
