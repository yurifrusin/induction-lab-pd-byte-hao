// Keep one write in flight so a slow, older update cannot replace newer progress.
export function createProgressSync({ write, onState, delay = 300, retryDelay = 2000 }) {
  let pending = null
  let lastSaved = ''
  let running = false
  let disposed = false
  let timer = null

  const schedule = (milliseconds) => {
    clearTimeout(timer)
    timer = setTimeout(flush, milliseconds)
  }

  const flush = async () => {
    if (disposed || running || !pending) return
    running = true
    try {
      while (pending && !disposed) {
        const payload = pending
        pending = null
        const serialized = JSON.stringify(payload)
        if (serialized === lastSaved) continue
        try {
          await write(payload)
          if (disposed) return
          lastSaved = serialized
        } catch {
          if (disposed) return
          pending = pending ?? payload
          onState('error')
          schedule(retryDelay)
          return
        }
      }
      if (!disposed) onState('connected')
    } finally {
      running = false
    }
  }

  return {
    submit(progress) {
      if (disposed) return
      if (!running && !pending && JSON.stringify(progress) === lastSaved) return
      pending = progress
      onState('syncing')
      schedule(delay)
    },
    retry() {
      if (disposed || !pending) return
      onState('syncing')
      schedule(0)
    },
    dispose() {
      disposed = true
      clearTimeout(timer)
      pending = null
    },
  }
}

export function classroomAccess(state, status) {
  const active = status === 'ready' && state?.is_active === true
  return {
    gateStatus: status,
    workflowVersion: state?.workflow_version ?? null,
    releases: {
      shortest: active && Boolean(state?.shortest_released_at),
      steps: active && Boolean(state?.shortest_released_at) && Boolean(state?.steps_released_at),
    },
  }
}
