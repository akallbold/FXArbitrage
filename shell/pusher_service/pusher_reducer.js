import { static as Immutable } from 'seamless-immutable'
import { set } from 'lodash'
import { PUSHER_DATA_RECEIVED, CLEAR_PUSHER_DATA, PUSHER_CONNECTION_ESTABLISHED } from './constants'

export const updatedState = (state, payload) => (
  Immutable.merge(state, payload, { deep: true })
)

export const clearState = (state, payload) => {
  const pusherDataObj = set({}, payload, null)
  return Immutable.merge(state, pusherDataObj, { deep: true })
}

export default function reducer (state = Immutable({ connected: false }), action) {
  const { type, payload } = action

  switch (type) {
    case PUSHER_CONNECTION_ESTABLISHED:
      return { ...state, connected: true }
    case PUSHER_DATA_RECEIVED:
      return updatedState(state, payload)
    case CLEAR_PUSHER_DATA:
      return clearState(state, payload)
    default:
      return state
  }
}
