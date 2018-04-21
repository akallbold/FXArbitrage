import { static as Immutable } from 'seamless-immutable'
import {
  requestState,
  successState,
  failureState,
  fulfillState
} from './fetch-subreducers'
import fetchRoutine from './fetch-routine'
import { CLEAR_ERROR, CLEAR_DATA } from './fetch-actions'

/**
 * The `entities` reducer.
 * @param  {Immutable Map} state    The `entities` slice of state tree.
 * @param  {Object}        payload  The current action payload.
 * @return {Immutable Map}          The updated copy of the `entities` slice of the state tree.
 */
export default (state = Immutable({}), action) => {
  switch (action.type) {
    case fetchRoutine.REQUEST:
      return requestState(state, action.payload)
    case fetchRoutine.SUCCESS:
      return successState(state, action.payload)
    case fetchRoutine.FAILURE:
      return failureState(state, action.payload)
    case fetchRoutine.FULFILL:
      return fulfillState(state, action.payload)
    case CLEAR_ERROR:
      return clearErrorState(state, action.payload)
    case CLEAR_DATA:
      return clearDataState(state, action.payload)
    default:
      return state
  }
}
