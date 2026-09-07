import { t, useLanguage, LanguageSwitcher } from './Language.jsx'
import {
  ArrowIcon,
  CheckIcon,
  EyeIcon,
  PlayIcon,
  ResetIcon,
  UndoIcon,
} from './icons.jsx'
import { MiniTower, Tower } from './Tower.jsx'
import { STAGES } from './flow.js'

export function AppHeader({
  activeStage,
  classroom,
  stageLocks = {},
  onLeaveClass,
  onOpenClassroom,
  onStageChange,
  onTeacherLensChange,
  teacherLens,
}) {
  useLanguage()
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
        <span>{t("Induction Lab")}</span>
      </button>

      <nav className="stage-nav" aria-label={t("Activity sequence")}>
        {STAGES.map(({ id, label }, index) => (
          <button
            aria-current={activeStage === id ? 'step' : undefined}
            className={`${activeStage === id ? 'is-active' : ''} ${index < activeIndex ? 'is-complete' : ''}`}
            key={id}
            disabled={Boolean(stageLocks[id])}
            title={t(stageLocks[id] || label)}
            onClick={() => onStageChange(id)}
            type="button"
          >
            <span className="nav-label">{t(label)}</span>
            <span className="nav-node" aria-hidden="true" />
          </button>
        ))}
      </nav>

      {classroom ? (
        <div className="class-status">
          <LanguageSwitcher />
          <span className={`sync-dot sync-${classroom.syncState}`} aria-hidden="true" />
          <div><small>{classroom.code}</small><strong>{classroom.displayName}</strong></div>
          <button onClick={onLeaveClass} type="button">{t("Leave")}</button>
        </div>
      ) : (
        <div className="header-actions">
          <LanguageSwitcher />
          {onOpenClassroom && <button className="classroom-link" onClick={onOpenClassroom} type="button">{t("Classroom")}</button>}
          <label className="lens-toggle">
            <span>{t("Teacher lens")}</span>
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
  useLanguage()
  return (
    <aside className="lens-note" aria-label={t("Facilitator cue")}>
      <span className="lens-time">{t("FACILITATOR · ")}{t(time)}</span>
      <p>{children}</p>
    </aside>
  )
}

function RailButton({ children, icon, onClick, disabled = false, primary = false }) {
  useLanguage()
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
  studentMode,
  target,
  teacherLens,
}) {
  useLanguage()
  return (
    <section className="screen play-screen">
      <aside className="control-rail">
        <div>
          <h1>{t("Move the tower.")}<br />{t("Then prove your best.")}</h1>
          <p className="lead">{t("Move the tower from A to C in as few moves as possible. Move one disc at a time. Never place a larger disc on a smaller one.")}</p>
        </div>

        <div className="disc-control">
          <span className="control-label">{t("DISCS")}</span>
          <div className="segmented-control" aria-label={t("Number of discs")}>
            {(studentMode ? [2, 3] : [2, 3, 4, 5]).map((value) => (
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

        <div className={`move-stats ${teacherLens ? '' : 'moves-only'}`} aria-label={t(teacherLens ? 'Move count and minimum' : 'Move count')}>
          <div><span>{t("MOVES")}</span><strong>{moveCount}</strong></div>
          {teacherLens && <div><span>{t("MINIMUM")}</span><strong>{t(minimumRevealed ? target : '?')}</strong></div>}
        </div>

        <div className="rail-question">
          <span className="question-mark" aria-hidden="true">?</span>
          <p>{t("What must happen before the largest disc can move?")}</p>
        </div>

        <div className="rail-actions">
          <RailButton disabled={moveCount === 0} icon={<UndoIcon />} onClick={onUndo}>{t("Undo")}</RailButton>
          <RailButton icon={<ResetIcon />} onClick={onReset}>{t("Reset")}</RailButton>
          {demonstrating ? (
            <RailButton disabled={completed} icon={<PlayIcon />} onClick={onAdvanceDemonstration} primary>{t("Next demonstration move")}</RailButton>
          ) : !studentMode && (
            <RailButton icon={<EyeIcon />} onClick={onShowHint} primary>{t("Hint for this position")}</RailButton>
          )}
        </div>

        {teacherLens && (
          <>
            <div className="facilitator-controls" role="group" aria-label={t("Facilitator controls")}>
              <p>{t(count === 2 ? 'First volunteer: a non-Science teacher, two discs.' : count === 3 ? 'Second volunteer: a mathematics teacher, three discs.' : 'Try another tower size.')}{t(" Aim for the fewest moves.")}</p>
              {completed && moveCount > target && <p>{t("A shorter route is possible. Show it after this attempt.")}</p>}
              <RailButton disabled={minimumRevealed} icon={<EyeIcon />} onClick={onRevealMinimum}>{t("Reveal minimum")}</RailButton>
              <RailButton icon={<PlayIcon />} onClick={onStartDemonstration}>{t("Show shortest route from start")}</RailButton>
            </div>
            <LensNote time={t("PLAY")}>{t("Start with two discs, then select three for the second volunteer. Keep the minimum hidden during each attempt. If needed, demonstrate the shortest route. Ask the observing teachers: where would you pause, and what would you ask students to explain?")}</LensNote>
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

        {!studentMode && (
          <div className="play-equation" aria-label={t("Unknown moves plus one plus unknown moves")}>
            <span>?</span><b>+</b><span>1</span><b>+</b><span>?</span>
          </div>
        )}

        <div className={`game-message ${completed ? 'is-complete' : ''}`}>
          <p>{t(message)}</p>
          {completed && (
            <button onClick={onNext} type="button">
              {t(count === 2 ? 'Next volunteer: three discs' : 'Set the audience task')} <ArrowIcon size={18} />
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
  nextUnlocked = true,
  gateMessage = '',
}) {
  useLanguage()
  const correct = answer === 'possible'
  const sevenMoveRoute = count === 3 && moveCount === 7

  return (
    <section className="screen notice-screen">
      <aside className="control-rail notice-rail">
        <div>
          <h1>{t(sevenMoveRoute ? 'Could six moves work?' : 'Could fewer moves work?')}</h1>
          <p className="lead">{t(sevenMoveRoute ? 'We found a seven-move route for three discs. Could six moves or fewer work?' : 'Finding a route shows it can be done. Does it show that fewer moves are impossible?')}{t(" Think of a reason beyond “I tried it”. Keep your reasoning for now.")}</p>
        </div>

        <div className="notice-summary">
          <div><strong>{moveCount ?? '?'}</strong><span>{t(moveCount === null ? 'complete a route first' : `moves found with ${count} discs`)}</span></div>
          <span className="not-equals" aria-hidden="true">≠</span>
          <div><strong>?</strong><span>{t("minimum proved")}</span></div>
        </div>

        {teacherLens && (
          <LensNote time={t("THINK · 20 SECONDS")}>{t("Give teachers 20 seconds to think, then park the answer. Switch to the teacher role: “A student says, ‘I tried lots of times, so this is the minimum.’ What would you ask next?” Model a pause before the largest disc moves, then revisit their reasoning.")}</LensNote>
        )}

        <div className="bottom-rail-actions">
          <RailButton icon={<ArrowIcon direction="left" />} onClick={onBack}>{t("Back to play")}</RailButton>
        </div>
      </aside>

      <div className="notice-canvas">
        <div className="notice-tower">
          <MiniTower count={moveCount === null ? 3 : count - 1} stage={moveCount === null ? 'start' : 'rebuild'} />
          <span className="found-stamp"><CheckIcon /> {t(moveCount === null ? 'THINK FIRST' : 'ROUTE FOUND')}</span>
        </div>

        <div className="notice-question-block">
          <h2>{t("What does a completed route establish?")}</h2>
          <div className="answer-list" role="group" aria-label={t("What has been proved")}>
            <button
              aria-pressed={answer === 'possible'}
              className={answer === 'possible' ? 'is-selected is-correct' : ''}
              onClick={() => onAnswer('possible')}
              type="button"
            >
              <span className="radio-dot" />
              <span><strong>{t("It can be done in that many moves.")}</strong><small>{t("This establishes what is possible.")}</small></span>
            </button>
            <button
              aria-pressed={answer === 'minimum'}
              className={answer === 'minimum' ? 'is-selected is-wrong' : ''}
              onClick={() => onAnswer('minimum')}
              type="button"
            >
              <span className="radio-dot" />
              <span><strong>{t("It cannot be done faster.")}</strong><small>{t("This would require a lower bound.")}</small></span>
            </button>
          </div>

          {answer === 'minimum' && (
            <p className="answer-feedback is-wrong">{t("Not yet. One route cannot rule out every shorter route.")}</p>
          )}

          {correct && (
            <div className="answer-feedback is-correct">
              <p><strong>{t("Exactly.")}</strong>{t(" Now look for a cost that every legal solution must pay.")}</p>
              {gateMessage && <p className="gate-message" role="status">{t(gateMessage)}</p>}
              <button disabled={!nextUnlocked} onClick={onNext} type="button">{t(nextUnlocked ? 'Open SHORTEST?' : 'Waiting for teacher')} <ArrowIcon /></button>
            </div>
          )}
        </div>
      </div>
    </section>
  )
}

function ProofStage({ label, math, number, stage }) {
  useLanguage()
  return (
    <div className="proof-stage">
      <div className="stage-title"><span>{number}</span><p>{t(label)}</p></div>
      <MiniTower count={4} stage={stage} />
      <strong className="stage-math">{math}</strong>
    </div>
  )
}

export function ProveScreen({ answer, onAnswer, onBack, onNext, teacherLens, nextUnlocked = true, gateMessage = '' }) {
  useLanguage()
  const correct = answer === 'all'

  return (
    <section className="screen prove-screen">
      <aside className="proof-rail">
        <div>
          <h1>{t("Could fewer moves work?")}</h1>
          <p className="lead">{t("Let n > 1 be the number of discs. M(n) is the minimum number of moves to transfer the tower between two pegs.")}</p>
        </div>

        <div className="can-must-rail">
          <div className={`logic-item logic-must ${correct ? 'is-complete' : ''}`}>
            <span className="logic-icon">{correct && <CheckIcon />}</span>
            <div><strong>{t("MUST")}</strong><p>{t("Show every legal solution must pay a cost. This creates a lower bound.")}</p></div>
          </div>
        </div>

        <fieldset className="sentence-choice">
          <legend>{t("Before the largest disc moves, ")}<span>______</span>{t(" smaller discs must be together on the other peg.")}</legend>
          {['some', 'all'].map((choice) => (
            <label className={`${answer === choice ? 'is-selected' : ''} ${answer === 'some' && choice === 'some' ? 'is-wrong' : ''}`} key={choice}>
              <input
                checked={answer === choice}
                name="necessary-discs"
                onChange={() => onAnswer(choice)}
                type="radio"
              />
              <span className="radio-dot" />
              {t(choice)}
            </label>
          ))}
        </fieldset>

        {answer === 'some' && <p className="compact-feedback">{t("Some is not enough—the largest disc stays trapped.")}</p>}
        {correct && (
          <div className="lower-bound-result">
            <p>{t("Before the largest disc's first move: at least M(n − 1) moves. After its last move to C: at least M(n − 1) more. The largest disc moves at least once.")}</p>
            <strong>M(n) ≥ 1 + 2M(n − 1)</strong>
          </div>
        )}

        {teacherLens && (
          <LensNote time={t("EXPLAIN THE GENERAL CASE")}>{t("A route with smaller-transfer counts a and b takes a + 1 + b moves. It need not be shortest. For the lower bound, use the first and last moves of the largest disc, so the argument also covers routes that move it more than once. Ask teachers which student explanation would show understanding.")}</LensNote>
        )}

        {correct && gateMessage && <p className="gate-message" role="status">{t(gateMessage)}</p>}
        <div className="proof-rail-actions">
          <RailButton icon={<ArrowIcon direction="left" />} onClick={onBack}>{t("Back")}</RailButton>
          <RailButton disabled={!correct || !nextUnlocked} icon={<ArrowIcon />} onClick={onNext} primary>{t(correct && !nextUnlocked ? 'Waiting for teacher' : 'Explore the steps')}</RailButton>
        </div>
      </aside>

      <div className="proof-canvas">
        <h2>{t("A route for n > 1 discs")}</h2>
        <p className="proof-caption">{t("A: start · B: temporary peg · C: target. Clear C before moving the largest disc there.")}</p>
        <div className="proof-stages">
          <ProofStage label={t("move n − 1 smaller to B")} math="M(n − 1)" number="1" stage="clear" />
          <ArrowIcon className="stage-arrow" size={36} />
          <ProofStage label={t("move largest")} math="1" number="2" stage="largest" />
          <ArrowIcon className="stage-arrow" size={36} />
          <ProofStage label={t("move n − 1 smaller to C")} math="M(n − 1)" number="3" stage="rebuild" />
        </div>
        <div className="proof-sum" aria-label={t("M of n minus one, plus one, plus M of n minus one")}>
          <span>M(n − 1)</span><b>+</b><span>1</span><b>+</b><span>M(n − 1)</span>
        </div>
      </div>
    </section>
  )
}
