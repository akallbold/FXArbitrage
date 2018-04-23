import { static as Immutable } from 'seamless-immutable'
import { get } from 'lodash'
import apiConfigs from 'api/configs'
import { parseCallType, getConfig, ent } from './fetch-utils'

export const PUT_MERGE = 'merge'

export const initialEntityState = Immutable({
  data: null,
  loading: false,
  error: null
})

/**
 * Immutably updated the `entities` state for the `FETCH_REQUEST` action.
 * @param  {Immutable Map} state    The `entities` slice of state tree.
 * @param  {Object}        payload  The current action payload.
 * @return {Immutable Map}          The updated copy of the `entities` slice of the state tree.
 */
export const requestState = (state, payload) => {
  const { callType, fetchRoutinePayload = {} } = payload
  const { batchItemKey } = fetchRoutinePayload
  const { entity } = parseCallType(callType)
  const newState = { loading: true }
  const newEntityState = batchItemKey ? { [batchItemKey]: newState } : newState
  return mergeEntity(state, entity, newEntityState, !!batchItemKey)
}

/**
 * Immutably updated the `entities` state for the `FETCH_SUCCESS` action.
 * @param  {Immutable Map} state    The `entities` slice of state tree.
 * @param  {Object}        payload  The current action payload.
 * @param  {Object}        configs  An object with name-spaced factory functions matching callType
 *                                  definitions.
 * @return {Immutable Map}          The updated copy of the `entities` slice of the state tree.
 */
export const successState = (state, payload, configs = apiConfigs) => {
  const { data, callType, fetchRoutinePayload = {} } = payload
  const { batchItemKey } = fetchRoutinePayload
  const { putType, entity } = parseCallType(callType)
  // We don't want to use custom merge when updating batch items.
  const mergedData = putType === PUT_MERGE && !batchItemKey
    ? applyCustomMerge(state, payload, configs) : null
  const newState = {
    data: mergedData || data,
    error: null
  }
  const newEntityState = batchItemKey ? { [batchItemKey]: newState } : newState
  return mergeEntity(state, entity, newEntityState, !!batchItemKey)
}

/**
 * Immutably updated the `entities` state for the `FETCH_FAILURE` action.
 * @param  {Immutable Map} state    The `entities` slice of state tree.
 * @param  {Object}        payload  The current action payload.
 * @return {Immutable Map}          The updated copy of the `entities` slice of the state tree.
 */
export const failureState = (state, payload) => {
  const { error, callType, fetchRoutinePayload = {} } = payload
  const { batchItemKey } = fetchRoutinePayload
  const { entity } = parseCallType(callType)
  const newState = { error }
  const newEntityState = batchItemKey ? { [batchItemKey]: newState } : newState
  return mergeEntity(state, entity, newEntityState, !!batchItemKey)
}

/**
 * Immutably updated the `entities` state for the `FULFILL_REQUEST` action.
 * @param  {Immutable Map} state    The `entities` slice of state tree.
 * @param  {Object}        payload  The current action payload.
 * @return {Immutable Map}          The updated copy of the `entities` slice of the state tree.
 */
export const fulfillState = (state, payload) => {
  const { callType, fetchRoutinePayload = {} } = payload
  const { batchItemKey } = fetchRoutinePayload
  const { entity } = parseCallType(callType)
  const newState = { loading: false }
  const newEntityState = batchItemKey ? { [batchItemKey]: newState } : newState
  return mergeEntity(state, entity, newEntityState, !!batchItemKey)
}
