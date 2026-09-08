export const STAGES = [
  { id: 'play', label: 'PLAY' },
  { id: 'notice', label: 'NOTICE' },
  { id: 'prove', label: 'SHORTEST?' },
  { id: 'steps', label: 'STEPS' },
  { id: 'debrief', label: 'PROVE' },
]

export function stageLockReason(stage, classroom, noticeAnswer, proveAnswer) {
  if (stage === 'can') stage = 'debrief'
  if (!classroom || stage === 'play' || stage === 'notice') return ''
  if (!STAGES.some(({ id }) => id === stage)) return 'This page is unavailable.'
  if (noticeAnswer !== 'possible') return 'Answer the NOTICE question correctly first.'
  if (classroom.gateStatus !== 'ready') return 'Waiting to confirm classroom approval. Check your connection.'
  if (classroom.workflowVersion !== 2) return 'Your teacher needs to start the guided sequence for this class.'
  if (!classroom.releases?.shortest) return 'Your answer is correct. Waiting for your teacher to open SHORTEST? for the class.'
  if (stage === 'prove') return ''
  if (proveAnswer !== 'all') return 'Answer the SHORTEST? question correctly first.'
  if (!classroom.releases?.steps) return 'Your answer is correct. Waiting for your teacher to open STEPS for the class.'
  return ''
}

export function accessibleStage(requested, classroom, noticeAnswer, proveAnswer) {
  if (requested === 'can') requested = 'debrief'
  const stage = STAGES.some(({ id }) => id === requested) ? requested : 'play'
  if (!stageLockReason(stage, classroom, noticeAnswer, proveAnswer)) return stage
  return stageLockReason('prove', classroom, noticeAnswer, proveAnswer) ? 'notice' : 'prove'
}
