import { Fragment, useEffect, useState } from 'react'
import { useLanguage, t } from './Language.jsx'
import { proofCopy } from './proofCopy.js'
import { appendixCopy } from './appendixCopy.js'
import { shortestCopy } from './shortestCopy.js'
import { ArrowIcon } from './icons.jsx'
import { MiniTower } from './Tower.jsx'

function Sum() {
  return <span>1 + 2 + ··· + <span style={{ whiteSpace: 'nowrap' }}>2<sup>n − 1</sup></span></span>
}

function DiscCountText({ value }) {
  return value.split(/(\[\[(?:[TG](?:1|n|next)|counts|nextCounts)\]\])/).map((part, index) => {
    if (part === '[[counts]]') return <strong key={index}>1, 2, 2<sup>2</sup>, …, 2<sup>n − 1</sup></strong>
    if (part === '[[nextCounts]]') return <strong key={index}>1, 2 × 1, 2 × 2, 2 × 2<sup>2</sup>, …, 2 × 2<sup>n − 1</sup></strong>
    const match = part.match(/^\[\[([TG])(1|n|next)\]\]$/)
    if (match) return <span key={index} style={{ whiteSpace: 'nowrap' }}>{match[1]}<sub>{match[2] === 'next' ? 'n + 1' : match[2]}</sub></span>
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

export function MinimumProofScreen({ teacherLens, onBack, onNext, onOpenExistence }) {
  const locale = useLanguage()
  const common = proofCopy[locale]
  const copy = common.lower
  const routeCopy = appendixCopy[locale]
  const [routeFlash, setRouteFlash] = useState(0)
  const [recalling, setRecalling] = useState(false)
  const [highlightAttainment] = useState(() => new URLSearchParams(window.location.search).get('highlight') === 'attain-bound')
  useEffect(() => {
    if (!highlightAttainment) return
    const url = new URL(window.location.href)
    url.searchParams.delete('highlight')
    window.history.replaceState(null, '', `${url.pathname}${url.search}${url.hash}`)
  }, [highlightAttainment])
  const existenceUrl = new URL(window.location.href)
  existenceUrl.searchParams.set('stage', 'existence')
  existenceUrl.searchParams.set('highlight', 'existence-proof')
  const renderAttainment = (value) => value.split(/(\[\[existence\]\]|\[\[existenceContrast\]\]|\[\[sameMethod\]\]|\[\[routeMethod\]\])/).map((part, index) => {
    if (part === '[[sameMethod]]') return <strong key={index} className="same-method-emphasis">{locale === 'zh' ? '同样的搬法' : 'the same method'}</strong>
    if (part === '[[routeMethod]]') return <a key={index} className="appendix-page-link" href="#attainment-route" onClick={(event) => {
      if (event.button !== 0 || event.ctrlKey || event.metaKey || event.shiftKey || event.altKey) return
      event.preventDefault()
      document.getElementById('attainment-route')?.scrollIntoView({ block: 'start' })
      setRouteFlash(value => value + 1)
    }}>{locale === 'zh' ? '这套搬法' : 'this method'}</a>
    if (part === '[[existence]]' || part === '[[existenceContrast]]') return <a key={index} className="appendix-page-link" href={`${existenceUrl.pathname}${existenceUrl.search}`} onClick={(event) => {
      if (event.button !== 0 || event.ctrlKey || event.metaKey || event.shiftKey || event.altKey) return
      event.preventDefault()
      const targetUrl = new URL(window.location.href)
      targetUrl.searchParams.set('highlight', 'existence-proof')
      window.history.replaceState(null, '', `${targetUrl.pathname}${targetUrl.search}`)
      onOpenExistence()
    }}>{part === '[[existenceContrast]]' ? (locale === 'zh' ? '第三页的存在性证明' : 'the existence proof on page three') : (locale === 'zh' ? '“继续加盘，也一定能搬完吗？”' : '“Can we always finish as we add more discs?”')}</a>
    return <DiscCountText key={index} value={part} />
  })
  return <section className="sequence-screen sequence-proof-screen reasoning-page reasoning-lower">
    <header className="sequence-heading"><span className="sequence-eyebrow">{copy.eyebrow}</span><h1>{copy.title}</h1><p>{copy.intro}</p></header>
    <button className="sequence-button reasoning-toggle" type="button" aria-expanded={!recalling} aria-controls="reasoning-lower" onClick={() => setRecalling(!recalling)}>{recalling ? common.show : common.hide}</button>
    <details className="reasoning-visual-help">
      <summary>{common.visualHelp}</summary>
      <div className="reasoning-reference">{common.visualCaptions.map((caption, i) => <figure key={i}><MiniTower count={5} stage={['clear', 'largest', 'rebuild'][i]} /><div className="reasoning-peg-labels" aria-hidden="true"><span>A</span><span>B</span><span>C</span></div><figcaption>{caption}</figcaption></figure>)}</div>
    </details>
    <div id="reasoning-lower" hidden={recalling}>
        <details className="reasoning-connection"><summary>{copy.connect}</summary>
          <div className="reasoning-fitch-outer">
            <p>{copy.let}</p>
            <div className="reasoning-fitch-inner">
              <p><strong className="reasoning-fitch-assume">{copy.assumeLead}{copy.assumeColon}</strong> <DiscCountText value={copy.assumption} /></p>
              {copy.lowerSteps.map((step, index) => <p key={index}><DiscCountText value={step} /></p>)}
              <details><summary>{copy.bridgeTitle}</summary><p>{copy.bridge}</p></details>
              <p><DiscCountText value={copy.innerConclusion} /></p>
            </div>
            <p className="reasoning-fitch-result"><DiscCountText value={copy.scopeConclusion} /></p>
          </div>
          <p><DiscCountText value={copy.lowerBase} /></p>
          <p className="reasoning-fitch-universal"><DiscCountText value={copy.general} /></p>
          <div className="sequence-sum"><Sum /></div>
          <p><DiscCountText value={copy.boundName} /></p>
          <div className="sequence-sum"><span>T<sub>n</sub> = <Sum /></span></div>
        </details>
        <details id="attain-bound" className={`reasoning-connection${highlightAttainment ? ' is-highlighted' : ''}`}><summary>{copy.attainTitle}</summary>
          <p>{renderAttainment(locale === 'zh' ? '设 n 是一个正整数。在[[existence]]中，我们已经证明 n 个盘能搬完。' : 'Let n be a positive integer. On [[existence]], we proved that n discs can be moved.')}</p>
          <section id="attainment-route" key={routeFlash} style={{ scrollMarginTop: '150px', animation: routeFlash ? 'proof-entry-flash 1.5s ease-out' : undefined }}>
            <h3>{locale === 'zh' ? '现在给出一种搬法' : 'Now describe a method'}</h3>
            <p>{routeCopy.routeIntro}</p>
            <ol>{routeCopy.routeSteps.map(step => <li key={step}>{step}</li>)}</ol>
          </section>
          <p>{renderAttainment(copy.attainDefinition)}</p>
          <p>{renderAttainment(copy.attainRecurrence)}</p>
          <p className="reasoning-fitch-universal"><DiscCountText value={copy.attainGeneral} /></p>
          <div className="sequence-final-result"><strong>{copy.doneTitle}</strong><p><DiscCountText value={copy.done} /></p><div className="sequence-sum"><span>T<sub>n</sub> = G<sub>n</sub> = <Sum /></span></div></div>
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
    <aside className="appendix-alternative">
      <h2>{copy.alternativeTitle}</h2>
      <p>{copy.alternativeText}</p>
    </aside>
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
      <button className="sequence-button is-primary" type="button" onClick={onNext}>{t('APPENDIX 2')}<ArrowIcon /></button>
    </footer>
  </section>
}
