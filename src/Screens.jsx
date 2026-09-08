import { t, useLanguage, LanguageSwitcher } from './Language.jsx'
import {
  ArrowIcon,
  EyeIcon,
  PlayIcon,
  ResetIcon,
  UndoIcon,
} from './icons.jsx'
import { MiniTower, Tower } from './Tower.jsx'
import { STAGES } from './flow.js'
import { shortestCopy } from './shortestCopy.js'
import { LowerBoundLadder } from './ProofReading.jsx'
import { ExistenceProof } from './ExistenceProof.jsx'
import { existenceCopy } from './existenceCopy.js'
import './shortest.css'

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
          <p className="lead">{t("Move the tower from A to C in as few moves as possible. Move one top disc at a time. Never place a larger disc on a smaller one.")}</p>
          <p className="lead"><strong>{t('Moves can go both ways between all three pegs: A ↔ B, B ↔ C and A ↔ C. There is no required direction of travel.')}</strong></p>
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
              <p>{t('Everyone starts with two discs, then tries three. Keep the minimum hidden while they explore.')}</p>
              {completed && moveCount > target && <p>{t("A shorter route is possible. Show it after this attempt.")}</p>}
              <RailButton disabled={minimumRevealed} icon={<EyeIcon />} onClick={onRevealMinimum}>{t("Reveal minimum")}</RailButton>
              <RailButton icon={<PlayIcon />} onClick={onStartDemonstration}>{t("Show shortest route from start")}</RailButton>
            </div>
            <LensNote time={t("PLAY")}>{t('Invite everyone to join with a nickname. After a short attempt, check the dashboard together. Ask teachers what they would ask a student who reports a move count without explaining it.')}</LensNote>
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
              {t(count === 2 ? 'Try three discs' : 'Think about your attempt')} <ArrowIcon size={18} />
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
  nextUnlocked = true,
  gateMessage = '',
}) {
  useLanguage()
  const correct = answer === 'possible'

  return (
    <section className="screen notice-screen notice-checkpoint">
      <header>
        <h1>{t('Think about your attempt')}</h1>
        {moveCount != null && <p className="notice-attempt"><strong>{moveCount}</strong><span>{t(`moves found with ${count} discs`)}</span></p>}
      </header>
        <div className="notice-question-block">
          <h2>{t('Suppose you finish a legal route. What can you conclude?')}</h2>
          <div className="answer-list" role="group" aria-label={t("What has been proved")}>
            <button
              aria-pressed={answer === 'possible'}
              className={answer === 'possible' ? 'is-selected is-correct' : ''}
              onClick={() => onAnswer('possible')}
              type="button"
            >
              <span className="radio-dot" />
              <span><strong>{t('A route with that number of moves exists.')}</strong></span>
            </button>
            <button
              aria-pressed={answer === 'minimum'}
              className={answer === 'minimum' ? 'is-selected is-wrong' : ''}
              onClick={() => onAnswer('minimum')}
              type="button"
            >
              <span className="radio-dot" />
              <span><strong>{t('No route uses fewer moves.')}</strong></span>
            </button>
          </div>

          {answer === 'minimum' && (
            <p className="answer-feedback is-wrong" role="status">{t('Try again.')}</p>
          )}

          {correct && (
            <div className="answer-feedback is-correct">
              <p role="status"><strong>{t('Correct.')}</strong></p>
              {gateMessage && <p className="gate-message" role="status">{t(gateMessage)}</p>}
              <button disabled={!nextUnlocked} onClick={onNext} type="button">{t(nextUnlocked ? 'Open SHORTEST?' : 'Waiting for teacher')} <ArrowIcon /></button>
            </div>
          )}
        </div>
        <div className="notice-back">
          <RailButton icon={<ArrowIcon direction="left" />} onClick={onBack}>{t("Back to play")}</RailButton>
        </div>
    </section>
  )
}

function ProofStage({ label, math, number, stage }) {
  useLanguage()
  return (
    <div className="proof-stage">
      <div className="stage-title"><span>{number}</span><p>{t(label)}</p></div>
      <MiniTower count={5} stage={stage} />
      <strong className="stage-math">{math}</strong>
    </div>
  )
}

export function ProveScreen({ answer, onAnswer, onBack, onNext, teacherLens, nextUnlocked = true, gateMessage = '' }) {
  const locale = useLanguage()
  const copy = shortestCopy[locale]
  const correct = answer === 'all'

  return (
    <section className="shortest-screen">
      <header className="shortest-heading">
        <h1>{copy.title}</h1>
        <p>{copy.intro}</p>
      </header>
        <fieldset className="sentence-choice shortest-choice">
          <legend>{copy.question}</legend>
          {['some', 'all'].map((choice) => (
            <label className={`${answer === choice ? 'is-selected' : ''} ${answer === 'some' && choice === 'some' ? 'is-wrong' : ''}`} key={choice}>
              <input
                checked={answer === choice}
                name="necessary-discs"
                onChange={() => onAnswer(choice)}
                type="radio"
              />
              <span className="radio-dot" />
              {copy.choices[choice]}
            </label>
          ))}
        </fieldset>

        <p className="shortest-think">{copy.think}</p>
        {answer === 'some' && <p className="compact-feedback" role="status">{copy.retry}</p>}
        <details className="shortest-reasoning">
          <summary>{copy.reveal}</summary>
          {copy.reasons.map((reason, index) => <p key={index}>{reason}</p>)}
          <p>{copy.diagramNote}</p>
          <div className="shortest-diagrams">
            {['clear', 'largest', 'rebuild'].map((stage, index) => <div key={stage}>
              <ProofStage label={copy.captions[index]} number={index + 1} stage={stage} />
              <div className="shortest-peg-labels" aria-hidden="true"><span>A</span><span>B</span><span>C</span></div>
            </div>)}
          </div>
          <p>{copy.constructionNote}</p>
        </details>
        <LowerBoundLadder compact />
        <ExistenceProof />
        {teacherLens && (
          <LensNote time={copy.teacherLabel}>{copy.teacher} {existenceCopy[locale].teacher}</LensNote>
        )}

        {correct && gateMessage && <p className="gate-message" role="status">{t(gateMessage)}</p>}
        <footer className="shortest-actions">
          <RailButton icon={<ArrowIcon direction="left" />} onClick={onBack}>{copy.back}</RailButton>
          <RailButton disabled={!correct || !nextUnlocked} icon={<ArrowIcon />} onClick={onNext} primary>{correct && !nextUnlocked ? copy.waiting : copy.next}</RailButton>
        </footer>
    </section>
  )
}
