import { static as Immutable } from 'seamless-immutable'
import { mapValues } from 'lodash'
import {
  OPEN_MODAL,
  CLOSE_MODALS
} from 'actions/modals'

const modalsReducer = (state = Immutable({}), action) => {
  const { type, payload } = action

  switch (type) {
    case OPEN_MODAL:
      return Immutable.merge(
        state,
        [mapValues(state, () => false), { [payload.id]: true }],
        { deep: true }
      )
    case CLOSE_MODALS:
      return Immutable(mapValues(state, () => false))
    default:
      return state
  }
}

export default modalsReducer
