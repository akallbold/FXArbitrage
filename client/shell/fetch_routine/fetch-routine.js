import { createRoutine } from 'redux-saga-routines'

export const createRoutineWithBatch = (typePrefix) => {
  const routine = createRoutine(typePrefix)
  routine.TRIGGER_BATCH = `${typePrefix}_TRIGGER_BATCH`
  routine.TRIGGER_BATCH_COMPLETE = `${typePrefix}_TRIGGER_BATCH_COMPLETE`
  // NOTE: These action creators are not the same as the action creators that fetch-saga-routine
  // uses which are created using `redux-actions`. The action creators made with `redux-actions`
  // have features this doesn't support.
  routine.triggerBatch = payload => ({ type: routine.TRIGGER_BATCH, payload })
  routine.triggerBatchComplete = payload => ({ type: routine.TRIGGER_BATCH_COMPLETE, payload })
  return routine
}

export default createRoutineWithBatch('FETCH')
