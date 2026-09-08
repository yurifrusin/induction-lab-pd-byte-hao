import { t, useLanguage } from './Language.jsx'
import { useEffect, useMemo, useRef, useState } from 'react'
import { isComplete, makePegs, moveDisk } from './game.js'
import { ArrowIcon, PlayIcon, ResetIcon } from './icons.jsx'
import { Tower } from './Tower.jsx'
import { discCountsCopy } from './discCountsCopy.js'
import './sequence.css'
import './discCounts.css'

function construction(count, from = 0, to = 2, temporary = 1) {
  if (count === 0) return []
  return [
    ...construction(count - 1, from, temporary, to),
    { from, to },
    ...construction(count - 1, temporary, to, from),
  ]
}

function newWalkthrough(count) {
  return {
    count, pegs: makePegs(count), moves: 0, cursor: 0, discMoves: Array(count).fill(0),
    selectedPeg: null, playing: false, deviated: false, feedback: '',
  }
}

function countDiscMove(current, from) {
  const disc = current.pegs[from].at(-1)
  return current.discMoves.map((value, index) => value + (index === disc - 1 ? 1 : 0))
}

function DiscCounts({ count, discMoves, moves, copy }) {
  const discs = Array.from({ length: count }, (_, index) => count - index)
  const colors = ['sky', 'teal', 'green', 'amber', 'coral']
  return (
    <section className="disc-counts" aria-label={copy.title}>
      <h2>{copy.title}</h2>
      <p className="disc-counts-note">{copy.note}</p>
      <ol>
        {discs.map((disc, index) => (
          <li key={disc}>
            <span className="disc-counts-shape" aria-hidden="true"><i className={`disk-${colors[colors.length - count + disc - 1]}`} style={{ width: `${40 + 60 * disc / count}%` }} /></span>
            <span className="disc-counts-label">{count === 1 ? copy.only : disc === 1 ? copy.smallest : copy.labels[index]}</span>
            <span className="disc-counts-value"><strong>{discMoves[disc - 1]}</strong><small>{copy.unit(discMoves[disc - 1])}</small></span>
          </li>
        ))}
      </ol>
      <div className="disc-counts-total"><span>{copy.total}</span><strong>{count > 1 && `${discs.map((disc) => discMoves[disc - 1]).join(' + ')} = `}{moves}</strong></div>
    </section>
  )
}

function expandedSum(count) {
  if (count < 1) return '0'
  return Array.from({ length: count }, (_, index) => (
    <span key={index}>{index > 0 && ' + '}{t(index === 0 ? '1' : index === 1 ? '2' : <>2<sup>{index}</sup></>)}</span>
  ))
}

function TeacherCue({ children }) {
  useLanguage()
  return <aside className="sequence-teacher-cue" aria-label={t("Teacher lens")}><strong>{t("TEACHER LENS")}</strong><p>{children}</p></aside>
}

function SequenceButton({ children, onClick, disabled, primary, icon }) {
  useLanguage()
  return <button className={`sequence-button${primary ? ' is-primary' : ''}`} disabled={disabled} onClick={onClick} type="button">{icon}{children}</button>
}

function SequenceFooter({ onBack, onNext, nextLabel, restart }) {
  useLanguage()
  return (
    <footer className="sequence-footer">
      <SequenceButton icon={<ArrowIcon direction="left" />} onClick={onBack}>{t("Back")}</SequenceButton>
      <SequenceButton icon={restart ? <ResetIcon /> : <ArrowIcon />} onClick={onNext} primary>{t(nextLabel)}</SequenceButton>
    </footer>
  )
}

export function StepsScreen({ teacherLens, onBack, onNext, onProgress, initialProgress }) {
  const language = useLanguage()
  const copy = discCountsCopy[language]
  const [walkthrough, setWalkthrough] = useState(() => newWalkthrough(
    [1, 2, 3, 4].includes(initialProgress?.disc_count) ? initialProgress.disc_count : 4,
  ))
  const [reducedMotion, setReducedMotion] = useState(false)
  const progressCallback = useRef(onProgress)
  const { count, pegs, moves, cursor, selectedPeg, playing, deviated, feedback, discMoves } = walkthrough
  const route = useMemo(() => construction(count), [count])
  const smallerMoves = Math.floor(route.length / 2)
  const completed = isComplete(pegs, count)

  useEffect(() => { progressCallback.current = onProgress }, [onProgress])
  useEffect(() => {
    progressCallback.current?.({ disc_count: count, move_count: moves, hint_count: 0, completed })
  }, [completed, count, moves])

  useEffect(() => {
    const preference = window.matchMedia('(prefers-reduced-motion: reduce)')
    const update = () => {
      setReducedMotion(preference.matches)
      if (preference.matches) setWalkthrough((current) => ({ ...current, playing: false }))
    }
    update()
    preference.addEventListener('change', update)
    return () => preference.removeEventListener('change', update)
  }, [])

  const advance = (current, continuePlaying = false) => {
    if (current.deviated || current.cursor >= route.length) return { ...current, playing: false }
    const move = route[current.cursor]
    const nextPegs = moveDisk(current.pegs, move.from, move.to)
    if (!nextPegs) return { ...current, playing: false, deviated: true }
    const nextCursor = current.cursor + 1
    const mustPause = nextCursor === smallerMoves || nextCursor === smallerMoves + 1 || nextCursor === route.length
    return {
      ...current, pegs: nextPegs, moves: current.moves + 1, cursor: nextCursor,
      discMoves: countDiscMove(current, move.from),
      selectedPeg: null, playing: continuePlaying && !mustPause, feedback: '',
    }
  }

  useEffect(() => {
    if (!playing || reducedMotion) return undefined
    const timer = window.setTimeout(() => setWalkthrough((current) => advance(current, true)), 1100)
    return () => window.clearTimeout(timer)
  }, [playing, cursor, count, reducedMotion])

  const manualMove = (from, to) => {
    setWalkthrough((current) => {
      if (![from, to].every((peg) => Number.isInteger(peg) && peg >= 0 && peg < 3)) return current
      const nextPegs = moveDisk(current.pegs, from, to)
      if (!nextPegs) return { ...current, playing: false, feedback: 'That move is not legal. Move one top disc onto an empty peg or a larger disc.' }
      const expected = route[current.cursor]
      if (!current.deviated && expected?.from === from && expected?.to === to) return advance(current)
      return {
        ...current, pegs: nextPegs, moves: current.moves + 1, selectedPeg: null,
        discMoves: countDiscMove(current, from),
        playing: false, deviated: true, feedback: '',
      }
    })
  }

  const choosePeg = (value) => setWalkthrough((current) => ({ ...current, selectedPeg: value, playing: false }))
  let pauseKey = 'start'
  if (count === 1 && cursor === 0) {
    pauseKey = 'one'
  } else if (cursor === smallerMoves) {
    pauseKey = 'before'
  } else if (cursor === smallerMoves + 1 && !completed) {
    pauseKey = 'after'
  } else if (cursor > smallerMoves + 1 && !completed) {
    pauseKey = 'second'
  } else if (completed && !deviated) {
    pauseKey = count === 1 ? 'oneComplete' : 'complete'
  }
  if (deviated) {
    pauseKey = completed ? 'exploredComplete' : 'exploring'
  }
  const [pauseTitle, pausePrompt] = copy.pause[pauseKey]

  return (
    <section className="sequence-screen sequence-steps">
      <aside className="sequence-step-controls">
        <header><span className="sequence-eyebrow">{copy.eyebrow}</span><h1>{copy.heading}</h1><p>{copy.intro}</p></header>
        <div className="disc-control"><span className="control-label">{t("DISCS")}</span><div className="segmented-control" aria-label={t("Walkthrough disc count")}>{[1, 2, 3, 4].map((value) => <button aria-pressed={count === value} className={count === value ? 'is-active' : ''} key={value} onClick={() => setWalkthrough(newWalkthrough(value))} type="button">{value}</button>)}</div></div>
        <div className="sequence-move-counter"><span>{t("MOVES")}</span><strong>{moves}</strong><small>{t(playing ? 'Playing' : completed ? 'Complete' : 'Paused')}</small></div>
        <div className="sequence-controls" role="group" aria-label={t("Walkthrough controls")}>
          <SequenceButton icon={<PlayIcon />} disabled={deviated || completed} onClick={() => setWalkthrough((current) => advance(current))} primary>{t("Next move")}</SequenceButton>
          <SequenceButton disabled={deviated || completed || reducedMotion} onClick={() => setWalkthrough((current) => ({ ...current, playing: !current.playing, selectedPeg: null, feedback: '' }))}>{t(playing ? 'Pause' : 'Play')}</SequenceButton>
          <SequenceButton icon={<ResetIcon />} onClick={() => setWalkthrough(newWalkthrough(count))}>{t(deviated ? 'Restart walkthrough' : 'Reset')}</SequenceButton>
        </div>
        <p className="sequence-control-help">{t(reducedMotion ? 'Reduced motion is on. Use Next move to advance at your pace.' : 'Play pauses before and after the largest-disc move, then at the finish. You can also move the discs yourself.')}</p>
        {teacherLens && <TeacherCue>{copy.teacher}</TeacherCue>}
      </aside>
      <div className="sequence-board-area">
        <div className={`sequence-pause-card${deviated ? ' is-exploring' : ''}`} role="status" aria-live="polite"><span>{copy.status[deviated ? 'exploring' : playing ? 'playing' : 'paused']}</span><h2>{pauseTitle}</h2><p>{feedback ? t(feedback) : pausePrompt}</p></div>
        <div className="sequence-board"><Tower count={count} pegs={pegs} onMove={manualMove} selectedPeg={selectedPeg} setSelectedPeg={choosePeg} /></div>
        <DiscCounts count={count} discMoves={discMoves} moves={moves} copy={copy} />
        <details className="sequence-counting" key={count}>
          <summary>{t('Open the move count for this walkthrough')}</summary>
          <span className="sequence-eyebrow">{t("MOVES IN THIS CONSTRUCTION")}</span>
          {count === 1 ? <div className="sequence-sum"><strong>1</strong></div> : <div className="sequence-sum"><span><b className="sequence-single">1</b> + <b className="sequence-pair">2</b>({expandedSum(count - 1)})</span><span className="sequence-equals">=</span><span>{expandedSum(count)}</span></div>}
          <p>{t(count === 1 ? 'The initial case: one disc, one move.' : `One largest-disc move + two transfers of the ${count - 1}-disc tower.`)}</p>
          <p>{copy.sumNote}</p>
          <p>{copy.connection}</p>
        </details>
        <SequenceFooter onBack={onBack} onNext={onNext} nextLabel={copy.next} />
      </div>
    </section>
  )
}

export { MinimumProofScreen, CanScreen } from './ProofReading.jsx'
