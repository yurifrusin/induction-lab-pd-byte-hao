import { useEffect, useState } from 'react'
import { findNextShortestMove, isComplete, makePegs, moveDisk, optimalMoves } from './game.js'
import { AppHeader, DebriefScreen, NoticeScreen, PlayScreen, ProveScreen } from './Screens.jsx'

const BUILD_BRIEF = `Design an accessible Tower of Hanoi simulator for Year 12 Specialist Mathematics.

Learning sequence:
1. Put the problem before the method: let students play before naming induction.
2. Enforce legal moves, track attempts and give optional next-move feedback.
3. After a solution, ask what has actually been proved: possibility is not minimality.
4. For n > 1, construct a route using two transfers of n - 1 discs and one move of the largest disc.
5. Distinguish CAN (a constructive upper bound) from MUST (a strategy-independent lower bound).
6. Keep the strengthened proposition visible: n discs can be moved in 2^n - 1 moves, and every legal transfer requires at least 2^n - 1 moves.

Safeguards:
- The teacher verifies every mathematical statement and tests edge cases.
- Collect no student names, prompts or personal data.
- Provide click, keyboard and touch alternatives, clear feedback and reduced-motion support.
- Use the LLM as a design collaborator, not an automated assessor.`

export default function App({ classroom = null, onLeaveClass = null, onOpenClassroom = null, onProgress = null }) {
  const [stage, setStage] = useState('play')
  const [teacherLens, setTeacherLens] = useState(false)
  const [discCount, setDiscCount] = useState(classroom ? 3 : 2)
  const [pegs, setPegs] = useState(() => makePegs(classroom ? 3 : 2))
  const [history, setHistory] = useState([])
  const [selectedPeg, setSelectedPeg] = useState(null)
  const [hintMove, setHintMove] = useState(null)
  const [message, setMessage] = useState('Select the top disc, then choose a destination peg.')
  const [noticeAnswer, setNoticeAnswer] = useState(null)
  const [proveAnswer, setProveAnswer] = useState(null)
  const [copied, setCopied] = useState(false)
  const [hintCount, setHintCount] = useState(0)
  const [minimumRevealed, setMinimumRevealed] = useState(false)
  const [demonstrating, setDemonstrating] = useState(false)

  const moveCount = history.length
  const target = optimalMoves(discCount)
  const completed = isComplete(pegs, discCount)

  useEffect(() => {
    if (!onProgress) return
    onProgress({
      stage,
      disc_count: discCount,
      move_count: moveCount,
      hint_count: hintCount,
      completed,
      notice_answer: noticeAnswer,
      prove_answer: proveAnswer,
    })
  }, [completed, discCount, hintCount, moveCount, noticeAnswer, onProgress, proveAnswer, stage])

  const resetGame = (nextCount = discCount) => {
    setDiscCount(nextCount)
    setPegs(makePegs(nextCount))
    setHistory([])
    setSelectedPeg(null)
    setHintMove(null)
    setNoticeAnswer(null)
    setProveAnswer(null)
    setHintCount(0)
    setMinimumRevealed(false)
    setDemonstrating(false)
    setMessage('Select the top disc, then choose a destination peg.')
  }

  const changeStage = (nextStage) => {
    setStage(nextStage)
    setSelectedPeg(null)
    setHintMove(null)
    if (nextStage === 'debrief' && !classroom) setTeacherLens(true)
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
        minimumRevealed && result === 'optimal'
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

  const copyBuildBrief = async () => {
    try {
      await navigator.clipboard.writeText(BUILD_BRIEF)
      setCopied(true)
      window.setTimeout(() => setCopied(false), 2200)
    } catch {
      setCopied(false)
      setMessage('Copy was blocked by the browser. The build brief is available in the facilitator notes.')
    }
  }

  const restartExperience = () => {
    resetGame(classroom ? 3 : 2)
    setTeacherLens(false)
    setStage('play')
  }

  return (
    <div className={`app stage-${stage}`}>
      <a className="skip-link" href="#main-content">Skip to activity</a>
      <AppHeader
        activeStage={stage}
        classroom={classroom}
        onLeaveClass={onLeaveClass}
        onOpenClassroom={onOpenClassroom}
        onStageChange={changeStage}
        onTeacherLensChange={setTeacherLens}
        teacherLens={teacherLens}
      />

      <main id="main-content">
        {stage === 'play' && (
          <PlayScreen
            completed={completed}
            count={discCount}
            demonstrating={demonstrating}
            hintMove={hintMove}
            message={message}
            moveCount={moveCount}
            minimumRevealed={minimumRevealed}
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
            target={target}
            teacherLens={teacherLens}
          />
        )}

        {stage === 'notice' && (
          <NoticeScreen
            answer={noticeAnswer}
            count={discCount}
            moveCount={completed ? moveCount : null}
            onAnswer={setNoticeAnswer}
            onBack={() => changeStage('play')}
            onNext={() => changeStage('prove')}
            teacherLens={teacherLens}
          />
        )}

        {stage === 'prove' && (
          <ProveScreen
            answer={proveAnswer}
            onAnswer={setProveAnswer}
            onBack={() => changeStage('notice')}
            onNext={() => changeStage('debrief')}
            teacherLens={teacherLens}
          />
        )}

        {stage === 'debrief' && (
          <DebriefScreen
            copied={copied}
            onCopy={copyBuildBrief}
            onRestart={restartExperience}
          />
        )}
      </main>
      <p className="sr-only" aria-live="polite">{message}</p>
      {copied && <div className="toast" role="status">Build brief copied</div>}
    </div>
  )
}
