import test from 'node:test'
import assert from 'node:assert/strict'
import { accessibleStage, stageLockReason } from './flow.js'

const classroom = (shortest, steps) => ({ workflowVersion: 2, gateStatus: 'ready', releases: { shortest, steps } })

test('NOTICE needs both a correct answer and a class release', () => {
  for (const [answer, release, unlocked] of [[null, false, false], ['minimum', true, false], ['possible', false, false], ['possible', true, true]]) {
    assert.equal(stageLockReason('prove', classroom(release, false), answer, null) === '', unlocked)
  }
})

test('later pages require both classroom gates and both answers', () => {
  for (const stage of ['steps', 'debrief', 'can']) {
    assert.notEqual(stageLockReason(stage, classroom(true, false), 'possible', 'all'), '')
    assert.notEqual(stageLockReason(stage, classroom(true, true), 'possible', 'some'), '')
    assert.notEqual(stageLockReason(stage, classroom(false, true), 'possible', 'all'), '')
    assert.equal(stageLockReason(stage, classroom(true, true), 'possible', 'all'), '')
  }
})

test('offline, loading and legacy classes do not silently unlock', () => {
  for (const gateStatus of ['loading', 'error', 'ended']) {
    assert.notEqual(stageLockReason('can', { ...classroom(true, true), gateStatus }, 'possible', 'all'), '')
  }
  assert.notEqual(stageLockReason('prove', { ...classroom(true, true), workflowVersion: 1 }, 'possible', 'all'), '')
})

test('restored navigation cannot bypass a missing gate', () => {
  assert.equal(accessibleStage('can', classroom(false, false), 'possible', 'all'), 'notice')
  assert.equal(accessibleStage('can', classroom(true, false), 'possible', 'all'), 'prove')
  assert.equal(accessibleStage('can', classroom(true, true), 'possible', 'all'), 'can')
  assert.equal(accessibleStage('unknown', classroom(true, true), 'possible', 'all'), 'play')
})

test('standalone presenters can navigate without classroom approvals', () => {
  for (const stage of ['play', 'notice', 'prove', 'steps', 'debrief', 'can']) {
    assert.equal(stageLockReason(stage, null, null, null), '')
  }
})
