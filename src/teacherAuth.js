const EMAIL_COOLDOWN_MS = 60_000
const EMAIL_STORAGE_KEY = 'induction-teacher-email-cooldown:v1'

export function authErrorMessage(error) {
  const code = error?.code
  const message = error?.message ?? ''
  if (code === 'invalid_credentials') return 'The email or password is incorrect. If you have not set a password yet, use an email link once, then set a password in your teacher dashboard.'
  if (code === 'email_not_confirmed') return 'Verify your email address before signing in with a password.'
  if (code === 'reauthentication_needed' || code === 'session_not_found' || code === 'teacher_session_required') return 'Sign in to your teacher account again before setting a password.'
  if (code === 'same_password') return 'Choose a different password from your current one.'
  if (code === 'password_mismatch') return 'The two passwords do not match.'
  if (code === 'password_too_short') return 'Use at least 12 characters for your password.'
  if (code === 'email_cooldown') return 'Please wait before requesting another email.'
  if (code === 'over_email_send_rate_limit' || /email.*rate.*limit/i.test(message)) {
    return 'The email service has reached its sending limit. Repeated requests will not restore it. The project administrator needs to check the email service and its quota.'
  }
  if (code === 'email_address_not_authorized') {
    return 'The current email service cannot send to this address. The project administrator needs to configure a custom email service.'
  }
  if (code === 'over_request_rate_limit' || error?.status === 429) {
    return 'Too many sign-in requests. Wait before trying again; this page will not retry automatically.'
  }
  return message || 'Sign-in failed. Please try again.'
}

export async function saveTeacherPassword({ auth, password, confirmation }) {
  if (password !== confirmation) throw Object.assign(new Error(), { code: 'password_mismatch' })
  if (password.length < 12) throw Object.assign(new Error(), { code: 'password_too_short' })
  const { data, error } = await auth.getUser()
  if (error) throw error
  if (!data?.user?.email || data.user.is_anonymous) throw Object.assign(new Error(), { code: 'teacher_session_required' })
  const result = await auth.updateUser({ password })
  if (result.error) throw result.error
  return result
}

// This is a UX guard. Supabase remains responsible for enforcing its rate limits.
export function createEmailLinkSender({ send, storage, withLock, now = Date.now }) {
  let pending = false
  let until = 0
  const readDeadline = () => {
    try {
      const saved = Number(storage?.getItem(EMAIL_STORAGE_KEY))
      if (Number.isFinite(saved)) until = Math.max(until, saved)
    } catch { /* The in-memory guard still works without browser storage. */ }
    return until
  }
  const secondsRemaining = () => Math.max(0, Math.ceil((readDeadline() - now()) / 1000))
  const cooldownError = () => Object.assign(new Error('Please wait before requesting another email.'), { code: 'email_cooldown' })
  const request = async (email) => {
    if (pending || secondsRemaining()) throw cooldownError()
    pending = true
    const perform = async () => {
      if (secondsRemaining()) throw cooldownError()
      until = now() + EMAIL_COOLDOWN_MS
      try { storage?.setItem(EMAIL_STORAGE_KEY, String(until)) } catch { /* Keep the in-memory deadline. */ }
      const result = await send(email.trim())
      if (result?.error) throw result.error
      return result
    }
    try {
      return withLock ? await withLock(perform, cooldownError) : await perform()
    } finally {
      pending = false
    }
  }
  return { request, secondsRemaining }
}
