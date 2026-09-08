import test from 'node:test'
import assert from 'node:assert/strict'
import { createLatestLoader, summarizeAnswers } from './dashboardProgress.js'

test('SHORTEST counts its saved answer, independently of stage and NOTICE', () => {
  const rows = [
    { stage: 'notice', notice_answer: 'possible', prove_answer: null },
    { stage: 'prove', notice_answer: 'possible', prove_answer: 'some' },
    { stage: 'steps', notice_answer: 'possible', prove_answer: 'all' },
    { stage: 'debrief', notice_answer: 'possible', prove_answer: 'all' },
  ]
  assert.deepEqual(summarizeAnswers(rows), {
    notice: { correct: 4, incorrect: 0, unanswered: 0 },
    shortest: { correct: 2, incorrect: 1, unanswered: 1 },
  })
  assert.deepEqual(summarizeAnswers([]).shortest, { correct: 0, incorrect: 0, unanswered: 0 })
})

test('a slow older response cannot roll back the count', async () => {
  const pending = [], values = []
  const loader = createLatestLoader(() => new Promise(resolve => pending.push(resolve)), value => values.push(value), assert.fail)
  const first = loader.load(), second = loader.load()
  pending[1](5)
  await second
  pending[0](2)
  await first
  assert.deepEqual(values, [5])
})

test('switching classrooms discards the previous classroom response', async () => {
  let finish
  const values = []
  const loader = createLatestLoader(() => new Promise(resolve => { finish = resolve }), value => values.push(value), assert.fail)
  const request = loader.load()
  loader.invalidate()
  finish(20)
  await request
  assert.deepEqual(values, [])
})

test('latest read failure is surfaced, while stale failures are ignored', async () => {
  const pending = [], errors = []
  const loader = createLatestLoader(() => new Promise((resolve, reject) => pending.push({ resolve, reject })), () => {}, error => errors.push(error.message))
  const old = loader.load(), current = loader.load()
  pending[0].reject(new Error('stale'))
  await old
  pending[1].reject(new Error('offline'))
  await current
  assert.deepEqual(errors, ['offline'])
})
