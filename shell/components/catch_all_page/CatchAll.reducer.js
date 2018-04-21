import { static as Immutable } from 'seamless-immutable'
import { get } from 'lodash'
import { SET_ERROR_PAGE, UNSET_ERROR_PAGE } from './CatchAll.actions.js'

export const initialState = Immutable({
  errorType: null,
  data: null
})

export const errorPage = (state = initialState, action) => {
  switch (action.type) {
    case SET_ERROR_PAGE:
      return Immutable({
        errorType: get(action, 'payload.errorType'),
        data: get(action, 'payload.data')
      })
    case UNSET_ERROR_PAGE: return initialState
    default: return state
  }
}

export default errorPage
