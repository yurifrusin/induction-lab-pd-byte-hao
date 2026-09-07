import assert from 'node:assert/strict'
import { test } from 'node:test'
import { classroomAccess, createProgressSync } from './classroomProgress.js'

const tick = () => new Promise((resolve) => setTimeout(resolve, 10))

test('class approval stays closed during loading, errors and ended sessions', () => {
  const approved = { workflow_version: 2, is_active: true, shortest_released_at: 'now', steps_released_at: 'now' }
  for (const status of ['loading', 'error', 'ended']) {
    assert.deepEqual(classroomAccess(approved, status).releases, { shortest: false, steps: false })
  }
  assert.deepEqual(classroomAccess(approved, 'ready').releases, { shortest: true, steps: true })
  assert.deepEqual(classroomAccess({ ...approved, is_active: false }, 'ready').releases, { shortest: false, steps: false })
  assert.equal(classroomAccess({ ...approved, shortest_released_at: null }, 'ready').releases.steps, false)
})

test('progress writes are serial and keep the newest waiting update', async () => {
  const calls = []
  const completions = []
  const sync = createProgressSync({
    delay: 0,
    write: (payload) => new Promise((resolve) => { calls.push(payload); completions.push(resolve) }),
    onState: () => {},
  })
  sync.submit({ stage: 'notice' })
  await tick()
  sync.submit({ stage: 'prove' })
  sync.submit({ stage: 'steps' })
  await tick()
  assert.deepEqual(calls, [{ stage: 'notice' }])
  completions.shift()()
  await tick()
  assert.deepEqual(calls, [{ stage: 'notice' }, { stage: 'steps' }])
  completions.shift()()
  await tick()
  sync.submit({ stage: 'steps' })
  await tick()
  assert.equal(calls.length, 2)
  sync.dispose()
})

test('a failed unchanged payload retries instead of being marked as saved', async () => {
  let attempts = 0
  const states = []
  const sync = createProgressSync({
    delay: 0,
    retryDelay: 10000,
    write: async () => { attempts += 1; if (attempts === 1) throw new Error('Offline') },
    onState: (state) => states.push(state),
  })
  sync.submit({ stage: 'notice', notice_answer: 'possible' })
  await tick()
  assert.equal(states.at(-1), 'error')
  sync.retry()
  await tick()
  assert.equal(attempts, 2)
  assert.equal(states.at(-1), 'connected')
  sync.dispose()
})
