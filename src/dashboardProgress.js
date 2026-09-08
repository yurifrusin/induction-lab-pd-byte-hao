// A slower response must not replace a more recent classroom snapshot.
export function createLatestLoader(read, apply, fail) {
  let revision = 0
  return {
    async load() {
      const current = ++revision
      try {
        const result = await read()
        if (current === revision) apply(result)
      } catch (error) {
        if (current === revision) fail(error)
      }
    },
    invalidate() { revision += 1 },
  }
}

export function summarizeAnswers(participants) {
  const count = (field, correct, wrong) => ({
    correct: participants.filter(row => row[field] === correct).length,
    incorrect: participants.filter(row => row[field] === wrong).length,
    unanswered: participants.filter(row => ![correct, wrong].includes(row[field])).length,
  })
  return {
    notice: count('notice_answer', 'possible', 'minimum'),
    shortest: count('prove_answer', 'all', 'some'),
  }
}
