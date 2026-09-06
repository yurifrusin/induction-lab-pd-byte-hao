import {
  ArrowIcon,
  CheckIcon,
  CopyIcon,
  EyeIcon,
  MessageIcon,
  PlayIcon,
  ResetIcon,
  RiseIcon,
  TargetIcon,
  UndoIcon,
} from './icons.jsx'
import { MiniTower, Tower } from './Tower.jsx'

const STAGES = [
  { id: 'play', label: 'PLAY' },
  { id: 'notice', label: 'NOTICE' },
  { id: 'prove', label: 'PROVE' },
  { id: 'debrief', label: 'DEBRIEF' },
]

export function AppHeader({
  activeStage,
  classroom,
  onLeaveClass,
  onOpenClassroom,
  onStageChange,
  onTeacherLensChange,
  teacherLens,
}) {
  const activeIndex = STAGES.findIndex(({ id }) => id === activeStage)

  return (
    <header className="app-header">
      <button className="brand" onClick={() => onStageChange('play')} type="button">
        <span className="brand-mark" aria-hidden="true">
          <i />
          <i />
          <i />
          <i />
        </span>
        <span>Induction Lab</span>
      </button>

      <nav className="stage-nav" aria-label="Five-minute experience">
        {STAGES.map(({ id, label }, index) => (
          <button
            aria-current={activeStage === id ? 'step' : undefined}
            className={`${activeStage === id ? 'is-active' : ''} ${index < activeIndex ? 'is-complete' : ''}`}
            key={id}
            onClick={() => onStageChange(id)}
            type="button"
          >
            <span className="nav-label">{label}</span>
            <span className="nav-node" aria-hidden="true" />
          </button>
        ))}
      </nav>

      {classroom ? (
        <div className="class-status">
          <span className={`sync-dot sync-${classroom.syncState}`} aria-hidden="true" />
          <div><small>{classroom.code}</small><strong>{classroom.displayName}</strong></div>
          <button onClick={onLeaveClass} type="button">Leave</button>
        </div>
      ) : (
        <div className="header-actions">
          {onOpenClassroom && <button className="classroom-link" onClick={onOpenClassroom} type="button">Classroom</button>}
          <label className="lens-toggle">
            <span>Teacher lens</span>
            <input
              checked={teacherLens}
              onChange={(event) => onTeacherLensChange(event.target.checked)}
              type="checkbox"
            />
            <span className="toggle-track" aria-hidden="true"><span /></span>
          </label>
        </div>
      )}
    </header>
  )
}

function LensNote({ time, children }) {
  return (
    <aside className="lens-note" aria-label="Facilitator cue">
      <span className="lens-time">FACILITATOR · {time}</span>
      <p>{children}</p>
    </aside>
  )
}

function RailButton({ children, icon, onClick, disabled = false, primary = false }) {
  return (
    <button
      className={`rail-button ${primary ? 'is-primary' : ''}`}
      disabled={disabled}
      onClick={onClick}
      type="button"
    >
      {icon}
      <span>{children}</span>
    </button>
  )
}

export function PlayScreen({
  completed,
  count,
  demonstrating,
  hintMove,
  message,
  moveCount,
  minimumRevealed,
  onAdvanceDemonstration,
  onCountChange,
  onMove,
  onNext,
  onReset,
  onRevealMinimum,
  onShowHint,
  onStartDemonstration,
  onUndo,
  pegs,
  selectedPeg,
  setSelectedPeg,
  target,
  teacherLens,
}) {
  return (
    <section className="screen play-screen">
      <aside className="control-rail">
        <div>
          <h1>Move the tower.<br />Then prove your best.</h1>
          <p className="lead">Move the tower from A to C in as few moves as possible. Move one disc at a time. Never place a larger disc on a smaller one.</p>
        </div>

        <div className="disc-control">
          <span className="control-label">DISCS</span>
          <div className="segmented-control" aria-label="Number of discs">
            {[2, 3, 4, 5].map((value) => (
              <button
                aria-pressed={count === value}
                className={count === value ? 'is-active' : ''}
                key={value}
                onClick={() => onCountChange(value)}
                type="button"
              >
                {value}
              </button>
            ))}
          </div>
        </div>

        <div className="move-stats" aria-label="Move count and minimum">
          <div><span>MOVES</span><strong>{moveCount}</strong></div>
          <div><span>MINIMUM</span><strong>{minimumRevealed ? target : '?'}</strong></div>
        </div>

        <div className="rail-question">
          <span className="question-mark" aria-hidden="true">?</span>
          <p>What must happen before the largest disc can move?</p>
        </div>

        <div className="rail-actions">
          <RailButton disabled={moveCount === 0} icon={<UndoIcon />} onClick={onUndo}>Undo</RailButton>
          <RailButton icon={<ResetIcon />} onClick={onReset}>Reset</RailButton>
          {demonstrating ? (
            <RailButton disabled={completed} icon={<PlayIcon />} onClick={onAdvanceDemonstration} primary>Next demonstration move</RailButton>
          ) : (
            <RailButton icon={<EyeIcon />} onClick={onShowHint} primary>Hint for this position</RailButton>
          )}
        </div>

        {teacherLens && (
          <>
            <div className="facilitator-controls" role="group" aria-label="Facilitator controls">
              <p>{count === 2 ? 'First volunteer: a non-Science teacher, two discs.' : count === 3 ? 'Second volunteer: a mathematics teacher, three discs.' : 'Try another tower size.'} Aim for the fewest moves.</p>
              {completed && moveCount > target && <p>A shorter route is possible. Show it after this attempt.</p>}
              <RailButton disabled={minimumRevealed} icon={<EyeIcon />} onClick={onRevealMinimum}>Reveal minimum</RailButton>
              <RailButton icon={<PlayIcon />} onClick={onStartDemonstration}>Show shortest route from start</RailButton>
            </div>
            <LensNote time="PLAY">
              Start with two discs, then select three for the second volunteer. Keep the minimum hidden during each attempt. If needed, demonstrate the shortest route. Ask the observing teachers: where would you pause, and what would you ask students to explain?
            </LensNote>
          </>
        )}
      </aside>

      <div className="play-canvas">
        <Tower
          count={count}
          hintMove={hintMove}
          onMove={onMove}
          pegs={pegs}
          selectedPeg={selectedPeg}
          setSelectedPeg={setSelectedPeg}
        />

        <div className="play-equation" aria-label="Unknown moves plus one plus unknown moves">
          <span>?</span><b>+</b><span>1</span><b>+</b><span>?</span>
        </div>

        <div className={`game-message ${completed ? 'is-complete' : ''}`}>
          <p>{message}</p>
          {completed && (
            <button onClick={onNext} type="button">
              {count === 2 ? 'Next volunteer: three discs' : 'Set the audience task'} <ArrowIcon size={18} />
            </button>
          )}
        </div>
      </div>
    </section>
  )
}

export function NoticeScreen({
  answer,
  count,
  moveCount,
  onAnswer,
  onBack,
  onNext,
  teacherLens,
}) {
  const correct = answer === 'possible'
  const sevenMoveRoute = count === 3 && moveCount === 7

  return (
    <section className="screen notice-screen">
      <aside className="control-rail notice-rail">
        <div>
          <h1>{sevenMoveRoute ? 'Could six moves work?' : 'Could fewer moves work?'}</h1>
          <p className="lead">{sevenMoveRoute ? 'We found a seven-move route for three discs. Could six moves or fewer work?' : 'Finding a route shows it can be done. Does it show that fewer moves are impossible?'} Think of a reason beyond “I tried it”. Keep your reasoning for now.</p>
        </div>

        <div className="notice-summary">
          <div><strong>{moveCount ?? '?'}</strong><span>{moveCount === null ? 'complete a route first' : `moves found with ${count} discs`}</span></div>
          <span className="not-equals" aria-hidden="true">≠</span>
          <div><strong>?</strong><span>minimum proved</span></div>
        </div>

        {teacherLens && (
          <LensNote time="THINK · 20 SECONDS">
            Give teachers 20 seconds to think, then park the answer. Switch to the teacher role: “A student says, ‘I tried lots of times, so this is the minimum.’ What would you ask next?” Model a pause before the largest disc moves, then revisit their reasoning.
          </LensNote>
        )}

        <div className="bottom-rail-actions">
          <RailButton icon={<ArrowIcon direction="left" />} onClick={onBack}>Back to play</RailButton>
        </div>
      </aside>

      <div className="notice-canvas">
        <div className="notice-tower">
          <MiniTower count={moveCount === null ? 3 : count - 1} stage={moveCount === null ? 'start' : 'rebuild'} />
          <span className="found-stamp"><CheckIcon /> {moveCount === null ? 'THINK FIRST' : 'ROUTE FOUND'}</span>
        </div>

        <div className="notice-question-block">
          <h2>What does a completed route establish?</h2>
          <div className="answer-list" role="group" aria-label="What has been proved">
            <button
              aria-pressed={answer === 'possible'}
              className={answer === 'possible' ? 'is-selected is-correct' : ''}
              onClick={() => onAnswer('possible')}
              type="button"
            >
              <span className="radio-dot" />
              <span><strong>It can be done in that many moves.</strong><small>This establishes what is possible.</small></span>
            </button>
            <button
              aria-pressed={answer === 'minimum'}
              className={answer === 'minimum' ? 'is-selected is-wrong' : ''}
              onClick={() => onAnswer('minimum')}
              type="button"
            >
              <span className="radio-dot" />
              <span><strong>It cannot be done faster.</strong><small>This would require a lower bound.</small></span>
            </button>
          </div>

          {answer === 'minimum' && (
            <p className="answer-feedback is-wrong">Not yet. One route cannot rule out every shorter route.</p>
          )}

          {correct && (
            <div className="answer-feedback is-correct">
              <p><strong>Exactly.</strong> Now look for a cost that every legal solution must pay.</p>
              <button onClick={onNext} type="button">Find the unavoidable move <ArrowIcon /></button>
            </div>
          )}
        </div>
      </div>
    </section>
  )
}

function ProofStage({ label, math, number, stage }) {
  return (
    <div className="proof-stage">
      <div className="stage-title"><span>{number}</span><p>{label}</p></div>
      <MiniTower count={4} stage={stage} />
      <strong className="stage-math">{math}</strong>
    </div>
  )
}

export function ProveScreen({ answer, onAnswer, onBack, onNext, teacherLens }) {
  const correct = answer === 'all'

  return (
    <section className="screen prove-screen">
      <aside className="proof-rail">
        <div>
          <h1>Why the largest disc matters</h1>
          <p className="lead">Let n &gt; 1 be the number of discs. M(n) is the minimum number of moves to transfer the tower between two pegs.</p>
        </div>

        <div className="can-must-rail">
          <div className="logic-item logic-can">
            <span className="logic-icon"><CheckIcon /></span>
            <div><strong>CAN</strong><p>Transfer the smaller tower to B, move the largest disc to C, then rebuild on C. Two shortest smaller transfers give 2M(n − 1) + 1 moves.</p></div>
          </div>
          <span className="versus">vs.</span>
          <div className={`logic-item logic-must ${correct ? 'is-complete' : ''}`}>
            <span className="logic-icon">{correct && <CheckIcon />}</span>
            <div><strong>MUST</strong><p>Show every legal solution must pay a cost. This creates a lower bound.</p></div>
          </div>
        </div>

        <fieldset className="sentence-choice">
          <legend>Before the largest disc moves, <span>______</span> smaller discs must be together on the other peg.</legend>
          {['some', 'all'].map((choice) => (
            <label className={`${answer === choice ? 'is-selected' : ''} ${answer === 'some' && choice === 'some' ? 'is-wrong' : ''}`} key={choice}>
              <input
                checked={answer === choice}
                name="necessary-discs"
                onChange={() => onAnswer(choice)}
                type="radio"
              />
              <span className="radio-dot" />
              {choice}
            </label>
          ))}
        </fieldset>

        {answer === 'some' && <p className="compact-feedback">Some is not enough—the largest disc stays trapped.</p>}
        {correct && (
          <div className="lower-bound-result">
            <p>Before the largest disc's first move: at least M(n − 1) moves. After its last move to C: at least M(n − 1) more. The largest disc moves at least once.</p>
            <strong>M(n) ≥ 2M(n − 1) + 1</strong>
          </div>
        )}

        {teacherLens && (
          <LensNote time="EXPLAIN THE GENERAL CASE">
            A route with smaller-transfer counts a and b takes a + 1 + b moves. It need not be shortest. For the lower bound, use the first and last moves of the largest disc, so the argument also covers routes that move it more than once. Ask teachers which student explanation would show understanding.
          </LensNote>
        )}

        <div className="proof-rail-actions">
          <RailButton icon={<ArrowIcon direction="left" />} onClick={onBack}>Back</RailButton>
          <RailButton disabled={!correct} icon={<ArrowIcon />} onClick={onNext} primary>Reveal the equality</RailButton>
        </div>
      </aside>

      <div className="proof-canvas">
        <h2>A route for n &gt; 1 discs</h2>
        <p className="proof-caption">A: start · B: temporary peg · C: target. Clear C before moving the largest disc there.</p>
        <div className="proof-stages">
          <ProofStage label="move n − 1 smaller to B" math="M(n − 1)" number="1" stage="clear" />
          <ArrowIcon className="stage-arrow" size={36} />
          <ProofStage label="move largest" math="1" number="2" stage="largest" />
          <ArrowIcon className="stage-arrow" size={36} />
          <ProofStage label="move n − 1 smaller to C" math="M(n − 1)" number="3" stage="rebuild" />
        </div>
        <div className="proof-sum" aria-label="M of n minus one, plus one, plus M of n minus one">
          <span>M(n − 1)</span><b>+</b><span>1</span><b>+</b><span>M(n − 1)</span>
        </div>
      </div>
    </section>
  )
}

function Takeaway({ children, icon, title, tone }) {
  return (
    <div className="takeaway">
      <span className={`takeaway-icon tone-${tone}`}>{icon}</span>
      <div><h3>{title}</h3><p>{children}</p></div>
    </div>
  )
}

export function DebriefScreen({ copied, onCopy, onRestart }) {
  return (
    <section className="screen debrief-screen">
      <aside className="teacher-takeaways">
        <span className="takeaway-label">TEACHER TAKEAWAYS</span>
        <Takeaway icon={<TargetIcon />} title="Pause before the largest move" tone="amber">
          Pause the demonstration. Ask students to predict where the smaller tower must go and explain why the target peg must be empty.
        </Takeaway>
        <Takeaway icon={<RiseIcon />} title="Ask why fewer moves cannot work" tone="green">
          If a student says “I tried it”, ask for the moves that cannot be avoided. Listen for two smaller transfers and at least one largest-disc move.
        </Takeaway>
        <Takeaway icon={<MessageIcon />} title="LLM design move" tone="blue">
          Ask for manipulable state, live feedback and a reveal that follows the mathematics.
        </Takeaway>
      </aside>

      <div className="debrief-main">
        <div className="debrief-heading">
          <h1>The proof was hiding in the play.</h1>
          <p>A shortest route moves the largest disc once, directly to the target. The two smaller transfers explain why.</p>
        </div>

        <div className="debrief-stages" aria-label="Three-stage recursive decomposition">
          <ProofStage label="move n − 1 smaller" math="M(n − 1)" number="1" stage="clear" />
          <ArrowIcon className="stage-arrow" size={30} />
          <ProofStage label="move largest" math="1" number="2" stage="largest" />
          <ArrowIcon className="stage-arrow" size={30} />
          <ProofStage label="move n − 1 smaller" math="M(n − 1)" number="3" stage="rebuild" />
        </div>

        <div className="logic-resolution">
          <div className="logic-box can-box"><span>CAN</span><strong>M(n) ≤ 2M(n − 1) + 1</strong></div>
          <div className="logic-box must-box"><span>MUST</span><strong>M(n) ≥ 2M(n − 1) + 1</strong></div>
          <div className="therefore">
            <span>Therefore, for n &gt; 1</span><strong>M(n) = 2M(n − 1) + 1</strong>
            <p>M(1) = 1. For three discs: M(3) = 3 + 1 + 3 = 7. These unavoidable moves explain why six cannot work.</p>
            <p>Bridge to induction: if M(n − 1) = 2<sup>n − 1</sup> − 1, the recurrence gives M(n) = 2(2<sup>n − 1</sup> − 1) + 1 = 2<sup>n</sup> − 1. Ask students where the smaller-case result was used.</p>
          </div>
        </div>

        <div className="run-line" aria-label="Five-minute facilitation timing">
          {[
            ['0:00', 'PLAY'],
            ['2:00', 'NOTICE'],
            ['3:00', 'PROVE'],
            ['4:30', 'DEBRIEF'],
          ].map(([time, label], index) => (
            <div className={index === 3 ? 'is-active' : ''} key={label}>
              <span>{time}</span><strong>{label}</strong><i aria-hidden="true" />
            </div>
          ))}
        </div>

        <div className="debrief-footer">
          <p>Teacher verifies the mathematics <span>•</span> Review classroom data settings <span>•</span> Accessible alternatives</p>
          <div>
            <button onClick={onRestart} type="button"><ResetIcon /> Restart</button>
            <button className="copy-button" onClick={onCopy} type="button"><CopyIcon /> {copied ? 'Copied' : 'Copy the build brief'}</button>
          </div>
        </div>
      </div>
    </section>
  )
}
