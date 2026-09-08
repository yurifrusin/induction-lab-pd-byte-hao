import assert from 'node:assert/strict'
import { test } from 'node:test'
import { authErrorMessage, createEmailLinkSender, saveTeacherPassword } from './teacherAuth.js'

test('rapid submissions produce only one email request, even before the first completes', async () => {
  let calls = 0
  let complete
  const sender = createEmailLinkSender({ send: () => { calls++; return new Promise(resolve => { complete = resolve }) }, now: () => 100 })
  const first = sender.request('teacher@example.com')
  await assert.rejects(sender.request('teacher@example.com'), { code: 'email_cooldown' })
  complete({})
  await first
  assert.equal(calls, 1)
})

test('refreshing the form or using another tab preserves the cooldown', async () => {
  const saved = new Map()
  const storage = { getItem: key => saved.get(key), setItem: (key, value) => saved.set(key, value) }
  let time = 100
  let calls = 0
  const options = { storage, now: () => time, send: async () => { calls++; return {} } }
  await createEmailLinkSender(options).request('teacher@example.com')
  const restored = createEmailLinkSender(options)
  await assert.rejects(restored.request('teacher@example.com'), { code: 'email_cooldown' })
  time += 60_000
  await restored.request('teacher@example.com')
  assert.equal(calls, 2)
})

test('a provider quota error is preserved and never automatically retried', async () => {
  let calls = 0
  const error = { code: 'over_email_send_rate_limit', status: 429 }
  const sender = createEmailLinkSender({ send: async () => { calls++; return { error } }, now: () => 100 })
  await assert.rejects(sender.request('teacher@example.com'), value => value === error)
  await assert.rejects(sender.request('teacher@example.com'), { code: 'email_cooldown' })
  assert.equal(calls, 1)
  assert.match(authErrorMessage(error), /email service/)
  assert.doesNotMatch(authErrorMessage(error), /60 seconds/)
})

test('storage failures do not disable duplicate protection', async () => {
  const storage = { getItem() { throw new Error('blocked') }, setItem() { throw new Error('blocked') } }
  let calls = 0
  const sender = createEmailLinkSender({ storage, send: async () => { calls++; return {} }, now: () => 100 })
  await sender.request('teacher@example.com')
  await assert.rejects(sender.request('teacher@example.com'), { code: 'email_cooldown' })
  assert.equal(calls, 1)
})

test('an occupied cross-tab lock sends no email', async () => {
  let calls = 0
  const sender = createEmailLinkSender({ send: async () => { calls++ }, withLock: async (_, error) => { throw error() } })
  await assert.rejects(sender.request('teacher@example.com'), { code: 'email_cooldown' })
  assert.equal(calls, 0)
})

test('password setup updates the current teacher, without creating a new account or sending OTP', async () => {
  const updates = []
  const user = { id: 'existing-teacher', email: 'teacher@example.com', is_anonymous: false }
  const auth = { getUser: async () => ({ data: { user } }), updateUser: async payload => { updates.push(payload); return { data: { user } } } }
  const result = await saveTeacherPassword({ auth, password: 'test-password-123', confirmation: 'test-password-123' })
  assert.equal(result.data.user.id, user.id)
  assert.deepEqual(updates, [{ password: 'test-password-123' }])
})

test('password validation failures never call the auth service', async () => {
  const auth = { getUser() { assert.fail('No request expected') } }
  await assert.rejects(saveTeacherPassword({ auth, password: 'short', confirmation: 'short' }), { code: 'password_too_short' })
  await assert.rejects(saveTeacherPassword({ auth, password: 'test-password-123', confirmation: 'different-password' }), { code: 'password_mismatch' })
})

test('anonymous users cannot set a teacher password', async () => {
  const auth = { getUser: async () => ({ data: { user: { is_anonymous: true } } }), updateUser() { assert.fail('No password update expected') } }
  await assert.rejects(saveTeacherPassword({ auth, password: 'test-password-123', confirmation: 'test-password-123' }), { code: 'teacher_session_required' })
})

test('a rejected password change is reported as a failure', async () => {
  const error = { code: 'reauthentication_needed' }
  const auth = { getUser: async () => ({ data: { user: { email: 'teacher@example.com', is_anonymous: false } } }), updateUser: async () => ({ error }) }
  await assert.rejects(saveTeacherPassword({ auth, password: 'test-password-123', confirmation: 'test-password-123' }), value => value === error)
  assert.match(authErrorMessage(error), /again/)
})
