import { useCallback, useEffect, useMemo, useRef, useState } from 'react'
import App from './App.jsx'
import { isSupabaseConfigured, supabase } from './supabase.js'
import { classroomAccess, createProgressSync } from './classroomProgress.js'

const STORAGE_KEY = 'induction-class:v1'
const STAGE_LABELS = {
  play: 'Playing',
  notice: 'Noticing',
  prove: 'Shortest?',
  steps: 'Steps',
  debrief: 'Prove',
  can: 'Why believe CAN?',
}

const SESSION_COLUMNS = 'id, join_code, title, is_active, created_at, expires_at, workflow_version, shortest_released_at, steps_released_at'

function readStoredParticipant() {
  try {
    const value = window.localStorage.getItem(STORAGE_KEY)
    return value ? JSON.parse(value) : null
  } catch {
    return null
  }
}

function storeParticipant(participant) {
  try {
    window.localStorage.setItem(STORAGE_KEY, JSON.stringify({
      participantId: participant.participantId,
      sessionId: participant.sessionId,
      sessionTitle: participant.sessionTitle,
      displayName: participant.displayName,
      joinCode: participant.joinCode,
    }))
  } catch {
    // Progress still syncs if local storage is blocked; only automatic resume is lost.
  }
}

function clearStoredParticipant() {
  try {
    window.localStorage.removeItem(STORAGE_KEY)
  } catch {
    // Nothing else is required when storage is unavailable.
  }
}

function initialRoute() {
  const params = new URLSearchParams(window.location.search)
  if (params.has('teacher')) return { mode: 'teacher' }
  if (params.has('join')) return { mode: 'join', code: params.get('join') ?? '' }
  if (params.has('classroom')) return { mode: 'chooser' }
  return { mode: 'solo' }
}

function routeUrl(mode, code = '') {
  const base = `${window.location.origin}${window.location.pathname}`
  if (mode === 'teacher') return `${base}?teacher=1`
  if (mode === 'join') return `${base}?join=${encodeURIComponent(code)}`
  if (mode === 'chooser') return `${base}?classroom=1`
  return base
}

function friendlyError(error) {
  const message = error?.message ?? 'Something went wrong. Please try again.'
  if (/guided_sequence|class_gate|get_induction_class_state|workflow_version|released_at/i.test(message)) {
    return 'The guided classroom update needs to be applied in Supabase. Ask the project owner to run the guided sequence migration.'
  }
  if (/anonymous sign-ins are disabled/i.test(message)) {
    return 'Anonymous student access is not enabled in Supabase yet.'
  }
  if (/join_induction_class|schema cache|could not find the function/i.test(message)) {
    return 'The classroom database setup has not been applied yet.'
  }
  if (/class_sessions|participants|relation .* does not exist/i.test(message)) {
    return 'The classroom database setup has not been applied yet.'
  }
  return message
}

function BrandHeader({ onBack }) {
  return (
    <header className="classroom-header">
      <button className="brand" onClick={onBack} type="button">
        <span className="brand-mark" aria-hidden="true"><i /><i /><i /><i /></span>
        <span>Induction Lab</span>
      </button>
      <span className="classroom-kicker">LIVE CLASSROOM</span>
    </header>
  )
}

function ClassroomChooser({ onBack, onJoin, onTeacher }) {
  const [code, setCode] = useState('')

  const submitCode = (event) => {
    event.preventDefault()
    const normalized = code.toUpperCase().replace(/[^A-Z2-9]/g, '').slice(0, 6)
    if (normalized.length === 6) onJoin(normalized)
  }

  return (
    <div className="classroom-page">
      <BrandHeader onBack={onBack} />
      <main className="classroom-welcome">
        <section className="classroom-intro">
          <span className="eyebrow">ONE PUZZLE · MANY PATHS</span>
          <h1>See mathematical thinking unfold.</h1>
          <p>Students remain pseudonymous. Teachers see milestones, not keystrokes or personal data.</p>
        </section>

        <section className="classroom-choice-grid" aria-label="Choose classroom role">
          <form className="classroom-card student-card" onSubmit={submitCode}>
            <span className="card-number">01</span>
            <div>
              <span className="card-label">STUDENT</span>
              <h2>Join a class</h2>
              <p>Enter the six-character code displayed by your teacher.</p>
            </div>
            <label>
              <span>Class code</span>
              <input
                autoComplete="off"
                inputMode="text"
                maxLength={6}
                onChange={(event) => setCode(event.target.value.toUpperCase().replace(/[^A-Z2-9]/g, ''))}
                placeholder="ABC234"
                value={code}
              />
            </label>
            <button className="classroom-primary" disabled={code.length !== 6} type="submit">Continue as student</button>
          </form>

          <article className="classroom-card teacher-card">
            <span className="card-number">02</span>
            <div>
              <span className="card-label">TEACHER</span>
              <h2>Open the live board</h2>
              <p>Create class codes and watch each learner move from play to proof.</p>
            </div>
            <button className="classroom-secondary" onClick={onTeacher} type="button">Teacher dashboard</button>
          </article>
        </section>
      </main>
    </div>
  )
}

function StudentJoin({ initialCode, onBack, onJoined }) {
  const stored = useMemo(() => readStoredParticipant(), [])
  const [code, setCode] = useState(() => (initialCode || stored?.joinCode || '').toUpperCase())
  const [displayName, setDisplayName] = useState(() => stored?.displayName ?? '')
  const [busy, setBusy] = useState(false)
  const [error, setError] = useState('')

  const join = async (event) => {
    event.preventDefault()
    if (!supabase) return
    setBusy(true)
    setError('')

    try {
      const { data: sessionData } = await supabase.auth.getSession()
      if (!sessionData.session) {
        const { error: authError } = await supabase.auth.signInAnonymously()
        if (authError) throw authError
      }

      const { data, error: joinError } = await supabase.rpc('join_induction_class', {
        p_join_code: code,
        p_display_name: displayName.trim(),
      })
      if (joinError) throw joinError

      const joined = data?.[0]
      if (!joined) throw new Error('The class could not be joined.')

      const participant = {
        participantId: joined.participant_id,
        sessionId: joined.class_session_id,
        sessionTitle: joined.session_title,
        displayName: joined.participant_name,
        joinCode: code,
      }
      storeParticipant(participant)
      onJoined(participant)
    } catch (joinError) {
      setError(friendlyError(joinError))
    } finally {
      setBusy(false)
    }
  }

  return (
    <div className="classroom-page">
      <BrandHeader onBack={onBack} />
      <main className="join-layout">
        <section className="join-copy">
          <span className="eyebrow">STUDENT ENTRY</span>
          <h1>Bring your strategy.<br />Leave your name behind.</h1>
          <p>Choose an alias or seat number. The teacher sees your mathematical progress, not personal information.</p>
          <div className="privacy-note"><span aria-hidden="true">◎</span> No email, password or account required</div>
        </section>

        <form className="join-form" onSubmit={join}>
          <div className="join-step"><span>1</span><p>Enter the class code</p></div>
          <label>
            <span>Six-character code</span>
            <input
              autoComplete="off"
              maxLength={6}
              onChange={(event) => setCode(event.target.value.toUpperCase().replace(/[^A-Z2-9]/g, ''))}
              required
              value={code}
            />
          </label>
          <div className="join-step"><span>2</span><p>Choose how you appear</p></div>
          <label>
            <span>Alias or seat number</span>
            <input
              autoComplete="off"
              maxLength={32}
              onChange={(event) => setDisplayName(event.target.value)}
              placeholder="e.g. Table 4"
              required
              value={displayName}
            />
          </label>
          {error && <p className="classroom-error" role="alert">{error}</p>}
          {!isSupabaseConfigured && <p className="classroom-error" role="alert">Classroom mode is not configured in this build.</p>}
          <button
            className="classroom-primary"
            disabled={busy || code.length !== 6 || !displayName.trim() || !isSupabaseConfigured}
            type="submit"
          >
            {busy ? 'Joining…' : 'Enter the induction lab'}
          </button>
        </form>
      </main>
    </div>
  )
}

function StudentActivity({ participant, onLeave }) {
  const [syncState, setSyncState] = useState('connected')
  const [classState, setClassState] = useState(null)
  const [gateStatus, setGateStatus] = useState('loading')
  const [initialProgress, setInitialProgress] = useState(null)
  const [error, setError] = useState('')
  const [reload, setReload] = useState(0)
  const syncRef = useRef(null)

  useEffect(() => {
    const sync = createProgressSync({
      onState: setSyncState,
      write: async (payload) => {
        const { data, error: saveError } = await supabase
          .from('participants')
          .update(payload)
          .eq('id', participant.participantId)
          .select('id')
          .single()
        if (saveError) throw saveError
        if (!data) throw new Error('Progress could not be saved for this participant.')
      },
    })
    syncRef.current = sync
    const retry = () => sync.retry()
    window.addEventListener('online', retry)
    return () => {
      sync.dispose()
      syncRef.current = null
      window.removeEventListener('online', retry)
    }
  }, [participant.participantId])

  useEffect(() => {
    let active = true
    let fetching = false
    const loadState = async () => {
      if (fetching) return
      if (!navigator.onLine) {
        if (active) setGateStatus('error')
        return
      }
      fetching = true
      try {
        const { data, error: loadError } = await supabase.rpc('get_induction_class_state', {
          p_participant_id: participant.participantId,
        })
        if (loadError) throw loadError
        if (!data?.progress) throw new Error('The classroom state could not be loaded.')
        if (!active) return
        setClassState(data)
        setInitialProgress((current) => current ?? data.progress)
        setGateStatus(data.is_active ? 'ready' : 'ended')
        setError('')
      } catch (loadError) {
        if (!active) return
        setGateStatus('error')
        setError(friendlyError(loadError))
      } finally {
        fetching = false
      }
    }
    const onFocus = () => { if (document.visibilityState === 'visible') loadState() }
    const onOffline = () => { if (active) setGateStatus('error') }
    loadState()
    const interval = window.setInterval(() => {
      if (document.visibilityState === 'visible') loadState()
    }, 2500)
    window.addEventListener('online', loadState)
    window.addEventListener('offline', onOffline)
    window.addEventListener('focus', loadState)
    document.addEventListener('visibilitychange', onFocus)
    return () => {
      active = false
      window.clearInterval(interval)
      window.removeEventListener('online', loadState)
      window.removeEventListener('offline', onOffline)
      window.removeEventListener('focus', loadState)
      document.removeEventListener('visibilitychange', onFocus)
    }
  }, [participant.participantId, reload])

  const syncProgress = useCallback((progress) => {
    syncRef.current?.submit(progress)
  }, [])

  const leave = () => {
    clearStoredParticipant()
    onLeave()
  }

  if (!initialProgress) {
    return (
      <div className="classroom-page">
        <BrandHeader onBack={leave} />
        <main className="classroom-loading">
          <p>{gateStatus === 'error' ? 'Classroom approval could not be checked.' : 'Opening your classroom progress…'}</p>
          {error && <p className="classroom-error" role="alert">{error}</p>}
          {gateStatus === 'error' && <button className="classroom-secondary" onClick={() => setReload((value) => value + 1)} type="button">Retry connection</button>}
        </main>
      </div>
    )
  }

  return (
    <App
      classroom={{
        code: participant.joinCode,
        displayName: participant.displayName,
        sessionTitle: participant.sessionTitle,
        syncState: gateStatus === 'error' ? 'error' : syncState,
        ...classroomAccess(classState, gateStatus),
        initialProgress,
        initialProgressKey: participant.participantId,
      }}
      onLeaveClass={leave}
      onProgress={syncProgress}
    />
  )
}

function TeacherSignIn({ authSession, onBack }) {
  const [email, setEmail] = useState('')
  const [sent, setSent] = useState(false)
  const [busy, setBusy] = useState(false)
  const [error, setError] = useState('')

  const sendLink = async (event) => {
    event.preventDefault()
    if (!supabase) return
    setBusy(true)
    setError('')
    try {
      if (authSession?.user?.is_anonymous) await supabase.auth.signOut()
      const { error: signInError } = await supabase.auth.signInWithOtp({
        email: email.trim(),
        options: { emailRedirectTo: routeUrl('teacher') },
      })
      if (signInError) throw signInError
      setSent(true)
    } catch (signInError) {
      setError(friendlyError(signInError))
    } finally {
      setBusy(false)
    }
  }

  return (
    <div className="classroom-page">
      <BrandHeader onBack={onBack} />
      <main className="teacher-signin-layout">
        <section>
          <span className="eyebrow">TEACHER ACCESS</span>
          <h1>Your live view of the room.</h1>
          <p>A secure email link keeps student progress visible only to the teacher who created the class.</p>
        </section>
        <form className="teacher-signin-card" onSubmit={sendLink}>
          {sent ? (
            <div className="email-sent">
              <span aria-hidden="true">✓</span>
              <h2>Check your email</h2>
              <p>Open the Supabase sign-in link on this device to continue.</p>
              <button className="classroom-secondary" onClick={() => setSent(false)} type="button">Use another email</button>
            </div>
          ) : (
            <>
              <span className="card-label">PASSWORDLESS SIGN-IN</span>
              <h2>Send me a secure link</h2>
              <label>
                <span>Email address</span>
                <input
                  autoComplete="email"
                  onChange={(event) => setEmail(event.target.value)}
                  placeholder="teacher@example.edu.au"
                  required
                  type="email"
                  value={email}
                />
              </label>
              {error && <p className="classroom-error" role="alert">{error}</p>}
              {!isSupabaseConfigured && <p className="classroom-error" role="alert">Classroom mode is not configured in this build.</p>}
              <button className="classroom-primary" disabled={busy || !isSupabaseConfigured} type="submit">
                {busy ? 'Sending…' : 'Email sign-in link'}
              </button>
            </>
          )}
        </form>
      </main>
    </div>
  )
}

function randomJoinCode() {
  const alphabet = 'ABCDEFGHJKLMNPQRSTUVWXYZ23456789'
  const values = crypto.getRandomValues(new Uint8Array(6))
  return Array.from(values, (value) => alphabet[value % alphabet.length]).join('')
}

function formatTime(value) {
  return new Intl.DateTimeFormat(undefined, { hour: 'numeric', minute: '2-digit' }).format(new Date(value))
}

function ParticipantRow({ participant }) {
  return (
    <tr>
      <td><strong>{participant.display_name}</strong><small>Joined {formatTime(participant.joined_at)}</small></td>
      <td><span className={`stage-pill stage-${participant.stage}`}>{STAGE_LABELS[participant.stage] ?? participant.stage}</span></td>
      <td>{participant.move_count}<small>{participant.disc_count} discs</small></td>
      <td>{participant.hint_count}</td>
      <td>
        <span className={participant.notice_answer === 'possible' ? 'answer-good' : 'answer-pending'}>
          {participant.notice_answer === 'possible' ? 'Correct ✓' : participant.notice_answer === 'minimum' ? 'Needs prompt' : '—'}
        </span>
      </td>
      <td>
        <span className={participant.prove_answer === 'all' ? 'answer-good' : 'answer-pending'}>
          {participant.prove_answer === 'all' ? 'Correct ✓' : participant.prove_answer === 'some' ? 'Needs prompt' : '—'}
        </span>
      </td>
    </tr>
  )
}

function TeacherDashboard({ authSession, onBack }) {
  const [sessions, setSessions] = useState([])
  const [selectedId, setSelectedId] = useState(null)
  const [participants, setParticipants] = useState([])
  const [title, setTitle] = useState('Year 12 Induction')
  const [busy, setBusy] = useState(false)
  const [copied, setCopied] = useState(false)
  const [error, setError] = useState('')
  const [gateBusy, setGateBusy] = useState('')

  const selectedSession = sessions.find((session) => session.id === selectedId) ?? null

  const loadSessions = useCallback(async () => {
    const { data, error: loadError } = await supabase
      .from('class_sessions')
      .select(SESSION_COLUMNS)
      .order('created_at', { ascending: false })
      .limit(12)
    if (loadError) {
      setError(friendlyError(loadError))
      return
    }
    setSessions(data ?? [])
    setSelectedId((current) => current ?? data?.find((session) => session.is_active)?.id ?? data?.[0]?.id ?? null)
  }, [])

  useEffect(() => {
    loadSessions()
    const interval = window.setInterval(loadSessions, 5000)
    window.addEventListener('focus', loadSessions)
    return () => {
      window.clearInterval(interval)
      window.removeEventListener('focus', loadSessions)
    }
  }, [loadSessions])

  useEffect(() => {
    if (!selectedId) {
      setParticipants([])
      return undefined
    }

    let active = true
    const loadParticipants = async () => {
      const { data, error: loadError } = await supabase
        .from('participants')
        .select('id, display_name, stage, disc_count, move_count, hint_count, completed, notice_answer, prove_answer, joined_at, updated_at')
        .eq('session_id', selectedId)
        .order('display_name')
      if (active && !loadError) setParticipants(data ?? [])
      if (active && loadError) setError(friendlyError(loadError))
    }

    loadParticipants()
    const interval = window.setInterval(loadParticipants, 5000)
    const channel = supabase
      .channel(`induction-session-${selectedId}`)
      .on('postgres_changes', {
        event: '*',
        schema: 'public',
        table: 'participants',
        filter: `session_id=eq.${selectedId}`,
      }, loadParticipants)
      .subscribe()

    return () => {
      active = false
      window.clearInterval(interval)
      supabase.removeChannel(channel)
    }
  }, [selectedId])

  const createSession = async (event) => {
    event.preventDefault()
    setBusy(true)
    setError('')
    try {
      let created = null
      for (let attempt = 0; attempt < 5 && !created; attempt += 1) {
        const { data, error: createError } = await supabase
          .from('class_sessions')
          .insert({
            join_code: randomJoinCode(),
            teacher_id: authSession.user.id,
            title: title.trim(),
            workflow_version: 2,
          })
          .select(SESSION_COLUMNS)
          .single()
        if (!createError) created = data
        else if (createError.code !== '23505') throw createError
      }
      if (!created) throw new Error('A unique class code could not be created. Please try again.')
      setSessions((current) => [created, ...current])
      setSelectedId(created.id)
      setParticipants([])
    } catch (createError) {
      setError(friendlyError(createError))
    } finally {
      setBusy(false)
    }
  }

  const copyJoinLink = async () => {
    if (!selectedSession) return
    await navigator.clipboard.writeText(routeUrl('join', selectedSession.join_code))
    setCopied(true)
    window.setTimeout(() => setCopied(false), 1800)
  }

  const endSession = async () => {
    if (!selectedSession) return
    const { error: updateError } = await supabase
      .from('class_sessions')
      .update({ is_active: false })
      .eq('id', selectedSession.id)
    if (updateError) {
      setError(friendlyError(updateError))
      return
    }
    setSessions((current) => current.map((session) => (
      session.id === selectedSession.id ? { ...session, is_active: false } : session
    )))
  }

  const signOut = async () => {
    await supabase.auth.signOut()
    onBack()
  }

  const changeClassGate = async (gate) => {
    if (!selectedSession || gateBusy) return
    setGateBusy(gate)
    setError('')
    try {
      const { error: gateError } = gate === 'enable'
        ? await supabase.rpc('enable_induction_guided_sequence', { p_session_id: selectedSession.id })
        : await supabase.rpc('release_induction_class_gate', { p_session_id: selectedSession.id, p_gate: gate })
      if (gateError) throw gateError
      await loadSessions()
    } catch (gateError) {
      setError(friendlyError(gateError))
    } finally {
      setGateBusy('')
    }
  }

  const completedCount = participants.filter((participant) => ['debrief', 'can'].includes(participant.stage)).length
  const classIsActive = selectedSession?.is_active && new Date(selectedSession.expires_at).getTime() > Date.now()
  const noticeCorrectCount = participants.filter((participant) => participant.notice_answer === 'possible').length
  const shortestCorrectCount = participants.filter((participant) => participant.prove_answer === 'all').length

  return (
    <div className="teacher-dashboard">
      <header className="dashboard-header">
        <button className="brand" onClick={onBack} type="button">
          <span className="brand-mark" aria-hidden="true"><i /><i /><i /><i /></span>
          <span>Induction Lab</span>
        </button>
        <div><span>{authSession.user.email}</span><button onClick={signOut} type="button">Sign out</button></div>
      </header>

      <div className="dashboard-layout">
        <aside className="session-sidebar">
          <span className="eyebrow">YOUR CLASSES</span>
          <form className="new-session-form" onSubmit={createSession}>
            <label><span>Class title</span><input maxLength={80} onChange={(event) => setTitle(event.target.value)} value={title} /></label>
            <button className="classroom-primary" disabled={busy || !title.trim()} type="submit">{busy ? 'Creating…' : '+ New live class'}</button>
          </form>
          <div className="session-list">
            {sessions.map((session) => (
              <button
                className={selectedId === session.id ? 'is-selected' : ''}
                key={session.id}
                onClick={() => setSelectedId(session.id)}
                type="button"
              >
                <span>{session.title}</span>
                <strong>{session.join_code}</strong>
                <small>{session.is_active ? 'Live' : 'Ended'} · {formatTime(session.created_at)}</small>
              </button>
            ))}
          </div>
        </aside>

        <main className="dashboard-main">
          {error && <p className="dashboard-error" role="alert">{error}</p>}
          {!selectedSession ? (
            <section className="dashboard-empty">
              <span aria-hidden="true">＋</span>
              <h1>Create your first live class.</h1>
              <p>Students will join using a short code—no accounts required.</p>
            </section>
          ) : (
            <>
              <section className="session-hero">
                <div>
                  <span className="eyebrow">{selectedSession.is_active ? 'LIVE SESSION' : 'SESSION ENDED'}</span>
                  <h1>{selectedSession.title}</h1>
                  <p>Created {formatTime(selectedSession.created_at)} · Expires {formatTime(selectedSession.expires_at)}</p>
                </div>
                <div className="join-code-panel">
                  <span>STUDENT CODE</span>
                  <strong>{selectedSession.join_code}</strong>
                  <button onClick={copyJoinLink} type="button">{copied ? 'Link copied ✓' : 'Copy student link'}</button>
                </div>
              </section>

              <section className="dashboard-stats" aria-label="Class progress summary">
                <div><strong>{participants.length}</strong><span>joined</span></div>
                <div><strong>{participants.filter((participant) => participant.completed).length}</strong><span>towers solved</span></div>
                <div><strong>{completedCount}</strong><span>reached PROVE</span></div>
                <div><strong>{participants.reduce((sum, participant) => sum + participant.hint_count, 0)}</strong><span>hints used</span></div>
              </section>

              <section className="class-gates progress-panel" aria-label="Class progression approvals">
                <div className="progress-heading">
                  <div>
                    <h2>Guide the class together</h2>
                    <p>Your approval applies to the class. Each learner must also answer the preceding question correctly.</p>
                  </div>
                </div>
                {selectedSession.workflow_version !== 2 ? (
                  <div className="class-gate-actions">
                    <p>This class uses the earlier sequence. Enable the two approval points; learners beyond NOTICE return to NOTICE, with their saved answers kept.</p>
                    <button className="classroom-primary" disabled={!classIsActive || Boolean(gateBusy)} onClick={() => changeClassGate('enable')} type="button">
                      {gateBusy === 'enable' ? 'Enabling…' : 'Use guided sequence'}
                    </button>
                  </div>
                ) : (
                  <div className="class-gate-actions">
                    <article>
                      <h3>NOTICE → SHORTEST?</h3>
                      <p>{noticeCorrectCount} / {participants.length} have answered NOTICE correctly.</p>
                      <button
                        className="classroom-primary"
                        disabled={!classIsActive || Boolean(gateBusy) || Boolean(selectedSession.shortest_released_at)}
                        onClick={() => changeClassGate('shortest')}
                        type="button"
                      >
                        {selectedSession.shortest_released_at ? 'SHORTEST? approved ✓' : gateBusy === 'shortest' ? 'Approving…' : 'Approve class: SHORTEST?'}
                      </button>
                    </article>
                    <article>
                      <h3>SHORTEST? → STEPS</h3>
                      <p>{shortestCorrectCount} / {participants.length} have answered SHORTEST? correctly.</p>
                      <button
                        className="classroom-primary"
                        disabled={!classIsActive || Boolean(gateBusy) || !selectedSession.shortest_released_at || Boolean(selectedSession.steps_released_at)}
                        onClick={() => changeClassGate('steps')}
                        type="button"
                      >
                        {selectedSession.steps_released_at ? 'STEPS approved ✓' : gateBusy === 'steps' ? 'Approving…' : 'Approve class: STEPS'}
                      </button>
                    </article>
                    <p className="gate-followup">After STEPS, learners can continue to PROVE and WHY BELIEVE CAN? without another class approval.</p>
                  </div>
                )}
              </section>

              <section className="progress-panel">
                <div className="progress-heading">
                  <div><h2>Learner progress</h2><p>Updates appear live as each browser moves through the activity.</p></div>
                  {selectedSession.is_active && <button onClick={endSession} type="button">End class</button>}
                </div>
                {participants.length ? (
                  <div className="progress-table-wrap">
                    <table>
                      <thead><tr><th>Learner</th><th>Stage</th><th>Moves</th><th>Hints</th><th>NOTICE</th><th>SHORTEST?</th></tr></thead>
                      <tbody>{participants.map((participant) => <ParticipantRow key={participant.id} participant={participant} />)}</tbody>
                    </table>
                  </div>
                ) : (
                  <div className="waiting-room"><span className="pulse-dot" /><p>Waiting for students to join <strong>{selectedSession.join_code}</strong></p></div>
                )}
              </section>
            </>
          )}
        </main>
      </div>
    </div>
  )
}

function TeacherPortal({ onBack }) {
  const [authSession, setAuthSession] = useState(null)
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    if (!supabase) {
      setLoading(false)
      return undefined
    }
    supabase.auth.getSession().then(({ data }) => {
      setAuthSession(data.session)
      setLoading(false)
    })
    const { data: listener } = supabase.auth.onAuthStateChange((_event, session) => {
      setAuthSession(session)
      setLoading(false)
    })
    return () => listener.subscription.unsubscribe()
  }, [])

  if (loading) return <div className="classroom-loading">Opening classroom…</div>
  if (!authSession || authSession.user?.is_anonymous) {
    return <TeacherSignIn authSession={authSession} onBack={onBack} />
  }
  return <TeacherDashboard authSession={authSession} onBack={onBack} />
}

export default function ClassroomRoot() {
  const [route, setRoute] = useState(initialRoute)
  const [participant, setParticipant] = useState(null)

  useEffect(() => {
    const handlePopState = () => {
      setRoute(initialRoute())
      setParticipant(null)
    }
    window.addEventListener('popstate', handlePopState)
    return () => window.removeEventListener('popstate', handlePopState)
  }, [])

  const navigate = useCallback((mode, code = '', replace = false) => {
    const nextRoute = { mode, code }
    window.history[replace ? 'replaceState' : 'pushState']({}, '', routeUrl(mode, code))
    setRoute(nextRoute)
    if (mode !== 'activity') setParticipant(null)
  }, [])

  if (participant) {
    return <StudentActivity participant={participant} onLeave={() => navigate('chooser')} />
  }
  if (route.mode === 'teacher') return <TeacherPortal onBack={() => navigate('chooser')} />
  if (route.mode === 'join') {
    return <StudentJoin initialCode={route.code} onBack={() => navigate('chooser')} onJoined={setParticipant} />
  }
  if (route.mode === 'chooser') {
    return <ClassroomChooser onBack={() => navigate('solo')} onJoin={(code) => navigate('join', code)} onTeacher={() => navigate('teacher')} />
  }
  return <App onOpenClassroom={() => navigate('chooser')} />
}

