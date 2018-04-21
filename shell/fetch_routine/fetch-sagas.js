import { call, put, all, takeEvery, select } from 'redux-saga/effects'
import { get } from 'lodash'
import { oneLine } from 'common-tags'
import { camelizeKeys } from 'humps'
import api from 'api'
import fetchRoutine from './fetch-routine'
import { parseCallType, isBatchComplete, prepPayloadForApi, ent } from './fetch-utils'
import preFetchers from './pre-fetch'

const callTypeError = action => `fetchSubroutines requires 'callType' on action payload.
-------------
action:
${JSON.stringify(action, null, '  ')}
-------------
`

export const fetchSubroutine = function * fetchSubroutine (action) {
  const { callType, fetchRoutinePayload } = action.payload || {}
  const withFetchRoutinePayload = fetchRoutinePayload ? { fetchRoutinePayload } : {}

  if (!callType) throw new Error(callTypeError(action))

  // Blocking calls to be made before the fetcher does it's thing.
  // Eg. Allows us to ensure the user is loaded or pusher is connected.
  yield call(preFetchers(callType))

  try {
    // Dispatch the `FETCH_REQUEST` action: this tells our app the request has started.
    yield put(fetchRoutine.request({ callType, ...withFetchRoutinePayload }))

    // Perform request for data and extract from response
    const response = yield call(api, prepPayloadForApi(action.payload))

    // Parse the response key from the call type
    const parsedCallType = parseCallType(callType)
    // Use the response key from call type is present or use default `'response'` as the key
    const responseKey = parsedCallType.responseKey || 'response'
    // Use the response key or fall back to just using `data`
    const data = get(response, ['data', responseKey]) || get(response, 'data')

    // Dispatch `FETCH_SUCCESS` action: tells our app it worked!
    yield put(fetchRoutine.success({
      data: camelizeKeys(data), callType, ...withFetchRoutinePayload
    }))
  } catch (error) {
    if (error.name !== 'ServerError') throw error

    if (process.env.NODE_ENV === 'development') {
      console.groupCollapsed('%c Server Error!', 'color: red; font-weight: bold;')
      Object.keys(error).forEach(prop => console.log(`${prop}: `, error[prop]))
      console.error(error)
      console.groupEnd()
    }

    // Dispatch `FETCH_FAILURE` action: tells our app about the error.
    yield put(fetchRoutine.failure({ error, callType, ...withFetchRoutinePayload }))
  } finally {
    // Dispatch `FETCH_FULFILL` action: tells our app we are done trying, success or failure.
    yield put(fetchRoutine.fulfill({ callType, ...withFetchRoutinePayload }))

    // If this is a batch item, is `batchauto`, and the batch is done, move batch data to
    // target entity
    const { batch, entity } = parseCallType(callType)
    if (batch && batch === 'batchauto') {
      const batchName = ent`${entity}${batch}`
      const batchEntityData = yield select(state => get(state, `entities.${batchName}`))
      if (isBatchComplete(batchEntityData)) {
        yield put(fetchRoutine.success({ data: batchEntityData, callType }))
      }
    }
  }
}

/**
 * An intermediate step to run multiple fetch subroutines.
 * @param {Object}  action    The FETCH_TRIGGER_BATCH action that the watcher caught.
 * @yield {Array}             An array of `call` side effects.
 */
export const batchFetchSubroutine = function * batchFetchSubroutine (action) {
  const { payload = {} } = action
  const { callType, options } = payload
  const { batch } = parseCallType(callType) || {}

  if (!batch) {
    throw new Error(oneLine`callType: '${callType}' requires batch keyword
    when using TRIGGER_BATCH.`)
  }

  // One array to yield them all!
  yield all(
    Object.keys(options).map((batchItemKey) => {
      const fetchRoutinePayload = { batchItemKey }
      return call(fetchSubroutine, {
        payload: { callType, fetchRoutinePayload, ...options[batchItemKey] }
      })
    })
  )
}

export const batchCompleteFetchSubroutine = function * batchCompleteFetchSubroutine (action) {
  const callType = get(action, 'payload.callType')
  const { batch, entity } = parseCallType(callType) || {}

  if (!batch) {
    throw new Error(oneLine`callType: '${callType}' requires batch keyword
    when using TRIGGER_BATCH.`)
  }

  const batchName = ent`${entity}${batch}`
  const batchEntityData = yield select(state => get(state, `entities.${batchName}`))
  if (isBatchComplete(batchEntityData)) {
    yield put(fetchRoutine.success({ data: batchEntityData, callType }))
  }
}

/**
 * Watches for the `FETCH_TRIGGER` action.
 */
export const fetchWatcher = function * fetchWatcher () {
  yield takeEvery(fetchRoutine.TRIGGER, fetchSubroutine)
}

/**
 * Watches for the `FETCH_TRIGGER_BATCH` and `FETCH_TRIGGER_BATCH_COMPLETE` action.
 */
export const fetchBatchWatcher = function * fetchBatchWatcher () {
  yield [
    takeEvery(fetchRoutine.TRIGGER_BATCH, batchFetchSubroutine),
    takeEvery(fetchRoutine.TRIGGER_BATCH_COMPLETE, batchCompleteFetchSubroutine)
  ]
}
