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
 * Merge the target entity with the `entities` slice of the state tree.
 * NOTE: Do not confuse this with merging the `'data'` in the target entity.
 * @param  {Immutable Map} state           The `entities` slice of state tree.
 * @param  {String}        entity          The entity key from the `callType`.
 * @param  {Object}        newEntityState  The new data to merge with the current entity.
 * @param  {Boolean}       isBatch         Tells us if this is for a batch key.
 * @return {Immutable Map}                 The updated copy of the `entities` slice of the
 *                                         state tree.
 */
export const mergeEntity = (state, entity, newEntityState = {}, isBatch = false) => {
  const entityKey = ent`${entity}${isBatch}`
  // Get the entity data at the entity key or create anew.
  // NOTE: If it's nil and it's for a batch then we create an empty object instead of using
  // `initialEntityState` directly, i.e. `{ data, loading, error }`. The empty object will be
  // populated with batchItemKeys that will include the initial state.
  const curEntityState = get(state, entityKey, isBatch ? Immutable({ }) : initialEntityState)
  const entityState = Immutable.merge(curEntityState, newEntityState)
  const nextEntity = { [entityKey]: entityState }
  return Immutable.merge(state, nextEntity, { deep: true })
}

/**
 * Looks up and invokes merge function on from config.
 * NOTE: Because the `batch` keyword in the callType is ignored here, custom merge should not be
 * used when handling successes of batch items. Only on single APi calls or batch complete success.
 * @param  {Immutable Map} state    The state as is on `store.entities[entity].data`
 * @param  {Object}        payload  The current action payload.
 * @param  {Object}        configs  An object with name-spaced factory functions matching callType
 *                                  definitions.
 * @return {Immutable}              An Immutable data structure.
 */
export const applyCustomMerge = (state, payload, configs) => {
  const { data, callType } = payload
  const { entity, func } = parseCallType(callType)
  const { merge } = getConfig(configs, callType)
  // NOTE: Custom merge functions must be able to handle a current state of `undefined` or `null`.
  // See that we are using `get` to obtain the current state.
  const result = merge(get(state, [entity, 'data']), Immutable(data))
  if (!Immutable.isImmutable(result)) {
    throw new TypeError(`The data returned from your custom merge function should be Immutable.
    Check the merge function used in '${func}' for callType '${callType}'`)
  }
  return result
}

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

export const clearErrorState = (state, payload) => {
  const { entity } = payload
  const newEntityState = { error: null }
  const nextState = mergeEntity(state, entity, newEntityState)
  return nextState
}

export const clearDataState = (state, payload) => {
  const { entity } = payload
  return mergeEntity(state, entity, { data: null })
}
