import { Fragment, useState } from 'react'
import { useLanguage, t } from './Language.jsx'
import { proofCopy } from './proofCopy.js'
import { appendixCopy } from './appendixCopy.js'
import { shortestCopy } from './shortestCopy.js'
import { ArrowIcon, ResetIcon } from './icons.jsx'
import { MiniTower } from './Tower.jsx'

function Sum() {
  return <>1 + 2 + ··· + 2<sup>(n − 1)</sup></>
}

function DiscCountText({ value }) {
  return value.split(/(\[\[counts\]\]|\[\[nextCounts\]\])/).map((part, index) => {
    if (part === '[[counts]]') return <strong key={index}>1, 2, 2<sup>2</sup>, …, 2<sup>n − 1</sup></strong>
    if (part === '[[nextCounts]]') return <strong key={index}>1, 2 × 1, 2 × 2, 2 × 2<sup>2</sup>, …, 2 × 2<sup>n − 1</sup></strong>
    return part
  })
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
      <summary>{common.visualHelp}</summary>
      <div className="reasoning-reference">{common.visualCaptions.map((caption, i) => <figure key={i}><MiniTower count={5} stage={['clear', 'largest', 'rebuild'][i]} /><div className="reasoning-peg-labels" aria-hidden="true"><span>A</span><span>B</span><span>C</span></div><figcaption>{caption}</figcaption></figure>)}</div>
    </details>
    <div id="reasoning-lower" hidden={recalling}>
        <details className="reasoning-connection"><summary>{copy.connect}</summary>
          <p>{copy.lowerBase}</p>
          <div className="reasoning-fitch-outer">
            <p>{copy.let}</p>
            <div className="reasoning-fitch-inner">
              <p><strong className="reasoning-fitch-assume">{copy.assumeLead}{copy.assumeColon}</strong> <DiscCountText value={copy.assumption} /></p>
              {copy.lowerSteps.map((step, index) => <p key={index}>{step}</p>)}
              <details><summary>{copy.bridgeTitle}</summary><p>{copy.bridge}</p></details>
              <p><DiscCountText value={copy.innerConclusion} /></p>
            </div>
            <p className="reasoning-fitch-result"><DiscCountText value={copy.scopeConclusion} /></p>
          </div>
          <p className="reasoning-fitch-universal"><DiscCountText value={copy.general} /></p>
          <div className="sequence-sum"><Sum /></div>
        </details>
        <details className="reasoning-connection"><summary>{copy.attainTitle}</summary>
          <p>{copy.attainBase}</p>
          <div className="reasoning-fitch-outer">
            <p>{copy.attainLet}</p>
            <div className="reasoning-fitch-inner">
              <p><strong className="reasoning-fitch-assume">{common.lower.assumeLead}{common.lower.assumeColon}</strong> {copy.attainAssumption}</p>
              <p>{copy.attainStep}</p>
            </div>
            <p className="reasoning-fitch-result">{copy.attainResult}</p>
          </div>
          <p className="reasoning-fitch-universal">{copy.attainGeneral}</p>
          <div className="sequence-final-result"><strong>{copy.doneTitle}</strong><p>{copy.done}</p><div className="sequence-sum"><Sum /></div></div>
        </details>
    </div>
    {teacherLens && <aside className="sequence-teacher-cue" aria-label={t('Teacher lens')}><strong>{t('TEACHER LENS')}</strong><p>{copy.teacher}</p></aside>}
    <footer className="sequence-footer">
      <button className="sequence-button" type="button" onClick={onBack}><ArrowIcon direction="left" />{common.back}</button>
      <button className="sequence-button is-primary" type="button" onClick={onNext}>{locale === 'zh' ? '查看附录' : 'Open the appendix'}<ArrowIcon /></button>
    </footer>
  </section>
}

function LinkedFourthText({ value, href, label, onOpen }) {
  return value.split('[[shortest]]').map((part, index) => <Fragment key={index}>{index > 0 && <a className="appendix-page-link" href={href} onClick={onOpen}>{label}</a>}{part}</Fragment>)
}

export function AppendixProofScreen({ onBack, onNext, onOpenQuestion }) {
  const copy = appendixCopy[useLanguage()]
  const fourthUrl = new URL(window.location.href)
  fourthUrl.searchParams.set('stage', 'prove')
  const fourthHref = `${fourthUrl.pathname}${fourthUrl.search}`
  const openFourth = (event) => {
    if (event.button !== 0 || event.ctrlKey || event.metaKey || event.shiftKey || event.altKey) return
    event.preventDefault()
    onOpenQuestion()
  }
  return <section className="sequence-screen sequence-proof-screen reasoning-page reasoning-appendix">
    <header className="sequence-heading"><span className="sequence-eyebrow">{copy.eyebrow}</span><h1><a className="appendix-page-link" href={fourthHref} onClick={openFourth}>{copy.title}</a></h1><p><LinkedFourthText value={copy.intro} href={fourthHref} label={copy.shortestPageLabel} onOpen={openFourth} /></p></header>
    <section className="appendix-route">
      <h2>{copy.routeTitle}</h2>
      <p>{copy.routeIntro}</p>
      <ol>{copy.routeSteps.map((step) => <li key={step}>{step}</li>)}</ol>
    </section>
    <h2 className="appendix-proof-label">{copy.proofLabel}</h2>
    <p className="appendix-base">{copy.base}</p>
    <div className="reasoning-fitch-outer">
      <h2>{copy.let}</h2>
      <div className="reasoning-fitch-inner">
        <p><strong className="reasoning-fitch-assume">{copy.assumptionLead}</strong> {copy.assumption}</p>
        <p>{copy.extension}</p>
        <ol>{copy.steps.map((step) => <li key={step}>{step}</li>)}</ol>
        <p><strong className="reasoning-fitch-assume">{copy.resultLead}</strong><LinkedFourthText value={copy.result} href={fourthHref} label={copy.shortestPageLabel} onOpen={openFourth} /></p>
      </div>
      <p className="reasoning-fitch-result"><strong>{copy.implicationLead}</strong>{copy.implication}</p>
    </div>
    <p className="appendix-conclusion"><LinkedFourthText value={copy.conclusion} href={fourthHref} label={copy.shortestPageLabel} onOpen={openFourth} /><span className="appendix-qed" aria-label={copy.proofEnd}>□</span></p>
    <footer className="sequence-footer">
      <button className="sequence-button" type="button" onClick={onBack}><ArrowIcon direction="left" />{copy.back}</button>
      <button className="sequence-button is-primary" type="button" onClick={onNext}>{copy.restart}<ResetIcon /></button>
    </footer>
  </section>
}
