import { t, useLanguage } from './Language.jsx'
import { useEffect, useState } from 'react'
import { findNextShortestMove, isComplete, makePegs, moveDisk, optimalMoves } from './game.js'
import { AppHeader, ExistenceScreen, NoticeScreen, PlayScreen, ProveScreen } from './Screens.jsx'
import { AppendixProofScreen, MinimumProofScreen, StepsScreen } from './SequenceScreens.jsx'
import { accessibleStage, stageLockReason, storedStage, STAGES } from './flow.js'
import { CombinedProofScreen } from './CombinedProof.jsx'

export default function App({ classroom = null, onLeaveClass = null, onOpenClassroom = null, onProgress = null }) {
  useLanguage()
  const initialProgress = classroom?.initialProgress
  const initialPlayCount = classroom && initialProgress?.disc_count === 2 ? 2 : classroom ? 3 : 2
  const [stage, setStage] = useState(() => {
    let requested = new URLSearchParams(window.location.search).get('stage') ?? initialProgress?.stage ?? 'play'
    if (classroom && requested === 'notice') {
      try {
        if (window.sessionStorage.getItem(`induction-existence:${classroom.initialProgressKey}`) === 'open') requested = 'existence'
      } catch { /* Classroom progress still opens without browser storage. */ }
    }
    if (classroom && requested === 'debrief') {
      try {
        const savedAppendix = window.sessionStorage.getItem(`induction-appendix:${classroom.initialProgressKey}`)
        if (savedAppendix === 'open') requested = 'appendix'
        if (savedAppendix === 'appendix2') requested = 'appendix2'
      } catch { /* Classroom progress still opens without browser storage. */ }
    }
    return accessibleStage(requested, classroom, initialProgress?.notice_answer, initialProgress?.prove_answer)
  })
  const [teacherLens, setTeacherLens] = useState(false)
  const [discCount, setDiscCount] = useState(initialPlayCount)
  const [pegs, setPegs] = useState(() => makePegs(initialPlayCount))
  const [history, setHistory] = useState([])
  const [selectedPeg, setSelectedPeg] = useState(null)
  const [hintMove, setHintMove] = useState(null)
  const [message, setMessage] = useState('Drag the top disc to a peg, or tap a disc and then tap its destination.')
  const [noticeAnswer, setNoticeAnswer] = useState(initialProgress?.notice_answer ?? null)
  const [proveAnswer, setProveAnswer] = useState(initialProgress?.prove_answer ?? null)
  const [stepsProgress, setStepsProgress] = useState(() => ({
    disc_count: ['steps', 'debrief', 'can'].includes(initialProgress?.stage) && [1, 2, 3, 4].includes(initialProgress?.disc_count) ? initialProgress.disc_count : 4,
    move_count: 0, hint_count: 0, completed: false,
  }))
  const [hintCount, setHintCount] = useState(0)
  const [minimumRevealed, setMinimumRevealed] = useState(false)
  const [demonstrating, setDemonstrating] = useState(false)
  const [expandStepsOnReturn, setExpandStepsOnReturn] = useState(false)

  const moveCount = history.length
  const target = optimalMoves(discCount)
  const completed = isComplete(pegs, discCount)
  const presenterMode = !classroom && teacherLens
  const showMinimum = presenterMode && minimumRevealed
  const activeStage = accessibleStage(stage, classroom, noticeAnswer, proveAnswer)
  const stageLocks = Object.fromEntries(STAGES.map(({ id }) => [id, stageLockReason(id, classroom, noticeAnswer, proveAnswer)]))
  const trackingSteps = ['steps', 'debrief', 'appendix', 'appendix2'].includes(activeStage)

  useEffect(() => {
    const url = new URL(window.location.href)
    if (activeStage === 'existence' && url.searchParams.get('highlight') === 'existence-proof') {
      document.getElementById('existence-proof-entry')?.scrollIntoView({ block: 'start' })
      url.searchParams.delete('highlight')
      window.history.replaceState(null, '', `${url.pathname}${url.search}${url.hash}`)
    } else {
      window.scrollTo(0, 0)
    }
  }, [activeStage])

  useEffect(() => {
    if (!classroom) return
    try {
      const key = `induction-existence:${classroom.initialProgressKey}`
      if (activeStage === 'existence') window.sessionStorage.setItem(key, 'open')
      else window.sessionStorage.removeItem(key)
    } catch { /* The page remains usable without browser storage. */ }
  }, [activeStage, classroom?.initialProgressKey])

  useEffect(() => {
    if (!classroom) return
    try {
      const key = `induction-appendix:${classroom.initialProgressKey}`
      if (activeStage === 'appendix') window.sessionStorage.setItem(key, 'open')
      else if (activeStage === 'appendix2') window.sessionStorage.setItem(key, 'appendix2')
      else window.sessionStorage.removeItem(key)
    } catch { /* Classroom progress still opens without browser storage. */ }
  }, [activeStage, classroom?.initialProgressKey])

  useEffect(() => {
    if (!onProgress || (classroom && classroom.gateStatus !== 'ready')) return
    onProgress({
      stage: storedStage(activeStage),
      ...(trackingSteps ? stepsProgress : { disc_count: discCount, move_count: moveCount, hint_count: hintCount, completed }),
      notice_answer: noticeAnswer,
      prove_answer: proveAnswer,
    })
  }, [activeStage, classroom?.gateStatus, completed, discCount, hintCount, moveCount, noticeAnswer, onProgress, proveAnswer, stepsProgress, trackingSteps])

  const resetGame = (nextCount = discCount) => {
    setDiscCount(nextCount)
    setPegs(makePegs(nextCount))
    setHistory([])
    setSelectedPeg(null)
    setHintMove(null)
    setHintCount(0)
    setMinimumRevealed(false)
    setDemonstrating(false)
    setMessage('Drag the top disc to a peg, or tap a disc and then tap its destination.')
  }

  const changeStage = (nextStage) => {
    if (stageLockReason(nextStage, classroom, noticeAnswer, proveAnswer)) return
    setExpandStepsOnReturn(activeStage === 'debrief' && nextStage === 'steps')
    setStage(nextStage)
    setSelectedPeg(null)
    setHintMove(null)
  }

  const attemptMove = (from, to, demonstrationMove = false) => {
    const next = moveDisk(pegs, from, to)
    setHintMove(null)
    setSelectedPeg(null)

    if (!next) {
      setMessage('That move is not legal: a larger disc cannot sit on a smaller one.')
      return
    }

    if (!demonstrationMove) setDemonstrating(false)

    const nextHistory = [...history, pegs.map((peg) => [...peg])]
    setHistory(nextHistory)
    setPegs(next)

    if (isComplete(next, discCount)) {
      const result = nextHistory.length === target ? 'optimal' : 'complete'
      setMessage(
        showMinimum && result === 'optimal'
          ? `Solved in ${nextHistory.length} moves, matching the minimum. Why can no shorter route work?`
          : `Solved in ${nextHistory.length} moves. Could fewer moves work? Explain your reasoning.`,
      )
    } else {
      setMessage(`Legal move. ${nextHistory.length} move${nextHistory.length === 1 ? '' : 's'} so far.`)
    }
  }

  const undo = () => {
    if (!history.length) return
    const previous = history[history.length - 1]
    setPegs(previous)
    setHistory(history.slice(0, -1))
    setSelectedPeg(null)
    setHintMove(null)
    setDemonstrating(false)
    setMessage('Last move undone.')
  }

  const showHint = () => {
    const hint = findNextShortestMove(pegs, discCount)
    if (!hint) {
      setMessage('The tower is already complete.')
      return
    }
    setHintCount((current) => current + 1)
    setHintMove(hint)
    setMessage(`Try moving the top disc from peg ${'ABC'[hint.from]} to peg ${'ABC'[hint.to]}.`)
  }

  const startDemonstration = () => {
    resetGame()
    setMinimumRevealed(true)
    setDemonstrating(true)
    setMessage('Shortest route from the starting position. Advance one move at a time and pause before the largest disc moves.')
  }

  const advanceDemonstration = () => {
    const nextMove = findNextShortestMove(pegs, discCount)
    if (!nextMove) return
    const movedDisc = pegs[nextMove.from].at(-1)
    attemptMove(nextMove.from, nextMove.to, true)
    const nextPegs = moveDisk(pegs, nextMove.from, nextMove.to)
    const followingMove = findNextShortestMove(nextPegs, discCount)
    if (followingMove && nextPegs[followingMove.from].at(-1) === discCount) {
      setMessage('Pause before moving the largest disc. Where is the smaller tower, and why must the target peg be empty?')
    } else if (movedDisc === discCount) {
      setMessage('The largest disc is on the target peg. Which smaller problem must now be solved again?')
    }
  }

  const restartExperience = () => {
    resetGame(classroom ? 3 : 2)
    setNoticeAnswer(null)
    setProveAnswer(null)
    setStepsProgress({ disc_count: 4, move_count: 0, hint_count: 0, completed: false })
    setTeacherLens(false)
    setStage('play')
  }

  const changeTeacherLens = (enabled) => {
    setTeacherLens(enabled)
    if (!enabled) {
      setMinimumRevealed(false)
      setDemonstrating(false)
      setMessage(completed
        ? `Solved in ${moveCount} moves. Could fewer moves work? Explain your reasoning.`
        : 'Drag the top disc to a peg, or tap a disc and then tap its destination.')
    }
  }

  return (
    <div className={`app stage-${activeStage}`}>
      <a className="skip-link" href="#main-content">{t("Skip to activity")}</a>
      <AppHeader
        activeStage={activeStage}
        classroom={classroom}
        stageLocks={stageLocks}
        onLeaveClass={onLeaveClass}
        onOpenClassroom={onOpenClassroom}
        onStageChange={changeStage}
        onTeacherLensChange={changeTeacherLens}
        teacherLens={teacherLens}
      />

      <main id="main-content">
        {activeStage === 'play' && (
          <PlayScreen
            completed={completed}
            count={discCount}
            demonstrating={demonstrating}
            hintMove={hintMove}
            message={message}
            moveCount={moveCount}
            minimumRevealed={showMinimum}
            onAdvanceDemonstration={advanceDemonstration}
            onCountChange={(count) => resetGame(count)}
            onMove={attemptMove}
            onNext={() => discCount === 2 ? resetGame(3) : changeStage('notice')}
            onReset={() => resetGame()}
            onRevealMinimum={() => setMinimumRevealed(true)}
            onShowHint={showHint}
            onStartDemonstration={startDemonstration}
            onUndo={undo}
            pegs={pegs}
            selectedPeg={selectedPeg}
            setSelectedPeg={setSelectedPeg}
            studentMode={Boolean(classroom)}
            target={target}
            teacherLens={presenterMode}
          />
        )}

        {activeStage === 'notice' && (
          <NoticeScreen
            answer={noticeAnswer}
            count={discCount}
            moveCount={completed ? moveCount : null}
            onAnswer={setNoticeAnswer}
            onBack={() => changeStage('play')}
            onNext={() => changeStage('existence')}
            teacherLens={presenterMode}
            nextUnlocked={!stageLocks.existence}
            gateMessage={stageLocks.existence}
          />
        )}

        {activeStage === 'existence' && (
          <ExistenceScreen onBack={() => changeStage('notice')} onNext={() => changeStage('prove')} teacherLens={presenterMode} />
        )}

        {activeStage === 'prove' && (
          <ProveScreen
            answer={proveAnswer}
            onAnswer={setProveAnswer}
            onBack={() => changeStage('existence')}
            onNext={() => changeStage('steps')}
            onOpenAppendix={() => changeStage('appendix')}
            teacherLens={presenterMode}
            nextUnlocked={!stageLocks.steps}
            gateMessage={stageLocks.steps}
          />
        )}

        {activeStage === 'steps' && (
          <StepsScreen teacherLens={presenterMode} onBack={() => changeStage('prove')} onNext={() => changeStage('debrief')} onProgress={setStepsProgress} initialProgress={stepsProgress} expandOnReturn={expandStepsOnReturn} />
        )}

        {activeStage === 'debrief' && (
          <MinimumProofScreen teacherLens={presenterMode} onBack={() => changeStage('steps')} onNext={() => changeStage('appendix')} onOpenExistence={() => changeStage('existence')} />
        )}

        {activeStage === 'appendix' && (
          <AppendixProofScreen onBack={() => changeStage('debrief')} onNext={() => changeStage('appendix2')} onOpenQuestion={() => changeStage('prove')} />
        )}

        {activeStage === 'appendix2' && (
          <CombinedProofScreen onBack={() => changeStage('appendix')} onRestart={restartExperience} />
        )}
      </main>
      <p className="sr-only" aria-live="polite">{t(message)}</p>
    </div>
  )
}
