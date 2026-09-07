import { useEffect, useMemo, useRef, useState } from 'react'
import { isComplete, makePegs, moveDisk } from './game.js'
import { ArrowIcon, PlayIcon, ResetIcon } from './icons.jsx'
import { MiniTower, Tower } from './Tower.jsx'
import './sequence.css'

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
    count, pegs: makePegs(count), moves: 0, cursor: 0,
    selectedPeg: null, playing: false, deviated: false, feedback: '',
  }
}

function expandedSum(count) {
  if (count < 1) return '0'
  return Array.from({ length: count }, (_, index) => (
    <span key={index}>{index > 0 && ' + '}{index === 0 ? '1' : index === 1 ? '2' : <>2<sup>{index}</sup></>}</span>
  ))
}

function GeneralSum() {
  return <>1 + 2 + ··· + 2<sup>n − 1</sup></>
}

function TeacherCue({ children }) {
  return <aside className="sequence-teacher-cue" aria-label="Teacher lens"><strong>TEACHER LENS</strong><p>{children}</p></aside>
}

function SequenceButton({ children, onClick, disabled, primary, icon }) {
  return <button className={`sequence-button${primary ? ' is-primary' : ''}`} disabled={disabled} onClick={onClick} type="button">{icon}{children}</button>
}

function SequenceFooter({ onBack, onNext, nextLabel, restart }) {
  return (
    <footer className="sequence-footer">
      <SequenceButton icon={<ArrowIcon direction="left" />} onClick={onBack}>Back</SequenceButton>
      <SequenceButton icon={restart ? <ResetIcon /> : <ArrowIcon />} onClick={onNext} primary>{nextLabel}</SequenceButton>
    </footer>
  )
}

export function StepsScreen({ teacherLens, onBack, onNext, onProgress, initialProgress }) {
  const [walkthrough, setWalkthrough] = useState(() => newWalkthrough(
    [1, 2, 3, 4].includes(initialProgress?.disc_count) ? initialProgress.disc_count : 4,
  ))
  const [reducedMotion, setReducedMotion] = useState(false)
  const progressCallback = useRef(onProgress)
  const { count, pegs, moves, cursor, selectedPeg, playing, deviated, feedback } = walkthrough
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
        playing: false, deviated: true, feedback: '',
      }
    })
  }

  const choosePeg = (value) => setWalkthrough((current) => ({ ...current, selectedPeg: value, playing: false }))
  let pauseTitle = 'First, move the smaller tower'
  let pausePrompt = 'Predict where the smaller tower must go before the largest disc can move directly to C.'
  if (count === 1 && cursor === 0) {
    pauseTitle = 'Start with one disc'
    pausePrompt = 'One legal move transfers the disc from A to C. No smaller tower is needed.'
  } else if (cursor === smallerMoves) {
    pauseTitle = 'Pause before the largest disc'
    pausePrompt = 'The smaller tower is on B. Why must C be empty before the largest disc moves there?'
  } else if (cursor === smallerMoves + 1 && !completed) {
    pauseTitle = 'Pause after the largest disc'
    pausePrompt = 'The largest disc is on C. Which smaller task appears again, and which peg is temporary now?'
  } else if (cursor > smallerMoves + 1 && !completed) {
    pauseTitle = 'Transfer the smaller tower again'
    pausePrompt = 'The smaller tower moves from B to C, using A as its temporary peg.'
  } else if (completed && !deviated) {
    pauseTitle = 'The construction is complete'
    pausePrompt = count === 1
      ? 'One disc reaches its target in one move. This initial case starts the construction.'
      : 'Point to the one largest-disc move and the two smaller transfers. How does the sum count them?'
  }
  if (deviated) {
    pauseTitle = completed ? 'Your route is complete' : 'You are exploring a different route'
    pausePrompt = 'The sum below counts the walkthrough, not this route. Select Restart walkthrough to return to that construction.'
  }

  return (
    <section className="sequence-screen sequence-steps">
      <aside className="sequence-step-controls">
        <header><span className="sequence-eyebrow">STEPS · BUILD THE PATTERN</span><h1>Pause. Predict.<br /> Explain.</h1><p>Explore one to four discs. Follow a construction from A to C and watch the smaller task appear twice.</p></header>
        <div className="disc-control"><span className="control-label">DISCS</span><div className="segmented-control" aria-label="Walkthrough disc count">{[1, 2, 3, 4].map((value) => <button aria-pressed={count === value} className={count === value ? 'is-active' : ''} key={value} onClick={() => setWalkthrough(newWalkthrough(value))} type="button">{value}</button>)}</div></div>
        <div className="sequence-move-counter"><span>MOVES</span><strong>{moves}</strong><small>{playing ? 'Playing' : completed ? 'Complete' : 'Paused'}</small></div>
        <div className="sequence-controls" role="group" aria-label="Walkthrough controls">
          <SequenceButton icon={<PlayIcon />} disabled={deviated || completed} onClick={() => setWalkthrough((current) => advance(current))} primary>Next move</SequenceButton>
          <SequenceButton disabled={deviated || completed || reducedMotion} onClick={() => setWalkthrough((current) => ({ ...current, playing: !current.playing, selectedPeg: null, feedback: '' }))}>{playing ? 'Pause' : 'Play'}</SequenceButton>
          <SequenceButton icon={<ResetIcon />} onClick={() => setWalkthrough(newWalkthrough(count))}>{deviated ? 'Restart walkthrough' : 'Reset'}</SequenceButton>
        </div>
        <p className="sequence-control-help">{reducedMotion ? 'Reduced motion is on. Use Next move to advance at your pace.' : 'Play pauses before and after the largest-disc move, then at the finish. You can also move the discs yourself.'}</p>
        {teacherLens && <TeacherCue>With four discs, pause after moves 7 and 8. Ask students to explain the changing peg roles before continuing. Then ask the observing teachers: which answer would show that a student understands the repeated smaller task?</TeacherCue>}
      </aside>
      <div className="sequence-board-area">
        <div className={`sequence-pause-card${deviated ? ' is-exploring' : ''}`} role="status" aria-live="polite"><span>{deviated ? 'YOUR EXPLORATION' : playing ? 'WATCH THE SMALLER TASK' : 'PAUSE & EXPLAIN'}</span><h2>{pauseTitle}</h2><p>{feedback || pausePrompt}</p></div>
        <div className="sequence-board"><Tower count={count} pegs={pegs} onMove={manualMove} selectedPeg={selectedPeg} setSelectedPeg={choosePeg} /></div>
        <div className="sequence-counting" aria-label="Moves in the construction">
          <span className="sequence-eyebrow">MOVES IN THIS CONSTRUCTION</span>
          {count === 1 ? <div className="sequence-sum"><strong>1</strong></div> : <div className="sequence-sum"><span><b className="sequence-single">1</b> + <b className="sequence-pair">2</b>({expandedSum(count - 1)})</span><span className="sequence-equals">=</span><span>{expandedSum(count)}</span></div>}
          <p>{count === 1 ? 'The initial case: one disc, one move.' : <>One largest-disc move + two transfers of the {count - 1}-disc tower.</>}</p>
        </div>
        <SequenceFooter onBack={onBack} onNext={onNext} nextLabel="PROVE: rule out fewer" />
      </div>
    </section>
  )
}

function Inference({ kind }) {
  const lowerBound = kind === 'lower'
  return (
    <div className="sequence-inference" aria-label="From the smaller case to the next case">
      <div className="sequence-inference-box is-if"><strong>IF</strong><p>{lowerBound ? <>For every transfer of <b>n − 1 discs</b>, at least <b>S(n − 1)</b> moves are needed.</> : <>For every pair of distinct pegs, an <b>n − 1-disc</b> transfer using <b>S(n − 1)</b> moves exists.</>}</p></div>
      <div className="sequence-inference-arrow" aria-hidden="true">⟹</div>
      <div className="sequence-inference-box is-then"><strong>THEN</strong><p>{lowerBound ? <>For every transfer of <b>n discs</b>, at least <b>1 + 2S(n − 1) = S(n)</b> moves are needed.</> : <>For every pair of distinct pegs, an <b>n-disc</b> transfer using <b>1 + 2S(n − 1) = S(n)</b> moves exists.</>}</p></div>
    </div>
  )
}

export function MinimumProofScreen({ teacherLens, onBack, onNext }) {
  return (
    <section className="sequence-screen sequence-proof-screen">
      <header className="sequence-heading"><span className="sequence-eyebrow">PROVE · THE LOWER BOUND</span><h1>Why no shorter route works</h1><p>For every legal transfer of n discs between distinct pegs, prove that at least this many moves are needed:</p><div className="sequence-definition">S(n) = <GeneralSum /></div></header>
      <div className="sequence-base"><span>INITIAL CASE</span><p><strong>S(1) = 1.</strong> One disc requires at least one move.</p></div>
      <div className="sequence-proof-intro"><h2>The inference for n &gt; 1</h2><p>Let n be an integer greater than 1. Use the smaller-case statement to justify the next case.</p></div>
      <Inference kind="lower" />
      <div className="sequence-costs" aria-label="Three unavoidable costs">
        <article><span className="sequence-cost-number">01</span><h3>Before the first largest-disc move</h3><p>The smaller tower must be transferred off the largest disc and onto the remaining peg.</p><strong>At least S(n − 1)</strong></article>
        <article><span className="sequence-cost-number">02</span><h3>The largest disc itself</h3><p>It starts away from the target and must reach it. It must move at least once.</p><strong>At least 1</strong></article>
        <article><span className="sequence-cost-number">03</span><h3>After its final move onto the target</h3><p>The smaller tower is on the other peg. It must now be transferred onto the largest disc.</p><strong>At least S(n − 1)</strong></article>
      </div>
      <div className="sequence-proof-result"><span>ADD THE NON-OVERLAPPING COSTS</span><div className="sequence-sum">S(n − 1) + 1 + S(n − 1) = S(n)</div><p>These costs occur in separate parts of the route. Extra moves only add to them. The initial case and this inference establish the lower bound for every integer n ≥ 1.</p></div>
      <div className="sequence-check"><strong>WHERE WAS THE ASSUMPTION USED?</strong><p>Explain why each smaller-tower transfer costs at least S(n − 1), even when the route includes detours.</p></div>
      {teacherLens && <TeacherCue>Ask students to connect the two S(n − 1) terms to the two smaller transfers. Using the largest disc’s first move and final move onto the target keeps the argument valid even for routes that move that disc more than once. A correct formula alone does not show this understanding.</TeacherCue>}
      <SequenceFooter onBack={onBack} onNext={onNext} nextLabel="Why believe CAN?" />
    </section>
  )
}

export function CanScreen({ teacherLens, onBack, onRestart }) {
  return (
    <section className="sequence-screen sequence-proof-screen sequence-can-screen">
      <header className="sequence-heading"><span className="sequence-eyebrow">THE CONSTRUCTION · CLOSE THE ARGUMENT</span><h1>Why believe “CAN”?</h1><p>A lower bound rules out fewer moves. We still need a route that achieves the sum for every integer n ≥ 1.</p><div className="sequence-definition">S(n) = <GeneralSum /></div></header>
      <div className="sequence-base"><span>INITIAL CASE</span><p><strong>S(1) = 1.</strong> Transfer one disc directly to its target in one move.</p></div>
      <div className="sequence-proof-intro"><h2>Build the next case from the smaller case</h2><p>Let n be an integer greater than 1. The peg names change; the rules and the smaller task stay the same.</p></div>
      <Inference kind="construction" />
      <div className="sequence-construction" aria-label="Construct the next case with two smaller transfers">
        <article><MiniTower stage="clear" count={3} /><h3>1. Transfer the smaller tower</h3><p>Use the smaller-case route from A to B, with C as the temporary peg.</p><strong>S(n − 1) moves</strong></article>
        <article><MiniTower stage="largest" count={3} /><h3>2. Move the largest disc</h3><p>C is empty, so the move from A to C is legal.</p><strong>1 move</strong></article>
        <article><MiniTower stage="rebuild" count={3} /><h3>3. Use the smaller case again</h3><p>Transfer the smaller tower from B to C, using A. The largest disc supports each smaller disc.</p><strong>S(n − 1) moves</strong></article>
      </div>
      <p className="sequence-diagram-note">The pictures show four discs; the same construction uses a smaller tower of n − 1 discs.</p>
      <div className="sequence-proof-result"><span>COUNT THE CONSTRUCTED ROUTE</span><div className="sequence-sum"><span>1 + 2S(n − 1)</span><span className="sequence-equals">=</span><span><GeneralSum /></span></div><p>The initial case and this construction provide a legal route using S(n) moves for every integer n ≥ 1.</p></div>
      <div className="sequence-final-result"><strong>NOW THE MINIMUM IS ESTABLISHED</strong><p>No route uses fewer moves, and a route using this many moves exists.</p><div className="sequence-sum"><GeneralSum /></div></div>
      <div className="sequence-check"><strong>EXPLAIN THE INFERENCE</strong><p>Where did we use the smaller-case assumption twice? Why does the one-disc case start the argument?</p></div>
      {teacherLens && <TeacherCue>Invite teachers to name a pause point, a question, and the student explanation they would listen for. For example: “How does the route you already know for the smaller tower let you construct the next case?” Link the answer to IF → THEN, rather than asking students to copy a proof template.</TeacherCue>}
      <SequenceFooter onBack={onBack} onNext={onRestart} nextLabel="Restart experience" restart />
    </section>
  )
}
