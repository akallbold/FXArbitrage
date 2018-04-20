import { static as Immutable } from 'seamless-immutable'
import fetchRoutine from './fetch-routine'
import { clearError, clearData } from './fetch-actions'
import fetchReducer from './fetch-reducer'
import {
  requestState,
  successState,
  failureState,
  fulfillState,
  clearErrorState,
  clearDataState
} from './fetch-subreducers'

const {
  trigger,
  request,
  success,
  failure,
  fulfill
} = fetchRoutine

const callType = 'test.thing as thing'
const payload = { callType }

const immutableMap = Immutable({})

describe('Fetch Routine Reducer', () => {
  it('should always return Immutable as (default) state', () => {
    const triggerRes = fetchReducer(undefined, trigger(payload))
    const requestRes = fetchReducer(undefined, request(payload))
    const successRes = fetchReducer(undefined, success(payload))
    const failureRes = fetchReducer(undefined, failure(payload))
    const fulfillRes = fetchReducer(undefined, fulfill(payload))

    // If you find this test failed, look at the line number to figure out which one.
    expect(Immutable.isImmutable(triggerRes)).toBe(true)
    expect(Immutable.isImmutable(requestRes)).toBe(true)
    expect(Immutable.isImmutable(successRes)).toBe(true)
    expect(Immutable.isImmutable(failureRes)).toBe(true)
    expect(Immutable.isImmutable(fulfillRes)).toBe(true)
  })

  it('should not handle `TRIGGER`', () => {
    const result = fetchReducer(undefined, trigger(payload))
    expect(result).toEqual({})
  })

  it('should handle `REQUEST` with `requestState` sub-reducer function', () => {
    const result = fetchReducer(undefined, request(payload))
    expect(result).toEqual(requestState(immutableMap, payload))
  })

  it('should handle `SUCCESS` with `successState` sub-reducer function', () => {
    const result = fetchReducer(undefined, success(payload))
    expect(result).toEqual(successState(immutableMap, payload))
  })

  it('should handle `FAILURE` with `failureState` sub-reducer function', () => {
    const result = fetchReducer(undefined, failure(payload))
    expect(result).toEqual(failureState(immutableMap, payload))
  })

  it('should handle `FULFILL` with `fulfillState` sub-reducer function', () => {
    const result = fetchReducer(undefined, fulfill(payload))
    expect(result).toEqual(fulfillState(immutableMap, payload))
  })

  it('should handle `CLEAR_ERROR` with `clearErrorState` sub-reducer function', () => {
    const result = fetchReducer(undefined, clearError({ entity: 'testing' }))
    expect(result).toEqual(clearErrorState(immutableMap, { entity: 'testing' }))
  })

  it('should handle `CLEAR_DATA` with `clearDataState` sub-reducer function', () => {
    const result = fetchReducer(undefined, clearData({ entity: 'testing' }))
    expect(result).toEqual(clearDataState(immutableMap, { entity: 'testing' }))
  })
})
