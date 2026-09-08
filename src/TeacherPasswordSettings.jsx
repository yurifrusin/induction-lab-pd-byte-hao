import { useRef, useState } from 'react'
import { t, useLanguage } from './Language.jsx'
import { supabase } from './supabase.js'
import { authErrorMessage, saveTeacherPassword } from './teacherAuth.js'

export function TeacherPasswordSettings({ email, onClose }) {
  useLanguage()
  const [password, setPassword] = useState('')
  const [confirmation, setConfirmation] = useState('')
  const [busy, setBusy] = useState(false)
  const [saved, setSaved] = useState(false)
  const [error, setError] = useState('')
  const pending = useRef(false)
  const submit = async (event) => {
    event.preventDefault()
    if (pending.current) return
    pending.current = true
    setBusy(true)
    setError('')
    try {
      await saveTeacherPassword({ auth: supabase.auth, password, confirmation })
      setSaved(true)
      setPassword('')
      setConfirmation('')
    } catch (updateError) {
      setError(authErrorMessage(updateError))
    } finally {
      pending.current = false
      setBusy(false)
    }
  }

  return (
    <section className="teacher-password-panel" aria-labelledby="teacher-password-title">
      <h2 id="teacher-password-title">{t('Set or change login password')}</h2>
      <p>{email}</p>
      {saved ? (
        <>
          <p role="status">{t('Password saved. Next time, sign in with this email and password. Your classes stay with this account.')}</p>
          <button className="classroom-primary" onClick={onClose} type="button">{t('Done')}</button>
        </>
      ) : (
        <form className="teacher-password-form" onSubmit={submit}>
          <p>{t('Set a password for your existing account. Future password sign-ins do not send an email.')}</p>
          <label><span>{t('New password')}</span><input autoComplete="new-password" minLength={12} required type="password" value={password} onChange={event => setPassword(event.target.value)} /></label>
          <label><span>{t('Confirm new password')}</span><input autoComplete="new-password" minLength={12} required type="password" value={confirmation} onChange={event => setConfirmation(event.target.value)} /></label>
          <small>{t('Use at least 12 characters for your password.')}</small>
          {error && <p className="classroom-error" role="alert">{t(error)}</p>}
          <div className="teacher-auth-actions">
            <button className="classroom-primary" disabled={busy} type="submit">{t(busy ? 'Saving…' : 'Save password')}</button>
            <button className="classroom-secondary" disabled={busy} onClick={onClose} type="button">{t('Cancel')}</button>
          </div>
        </form>
      )}
    </section>
  )
}
