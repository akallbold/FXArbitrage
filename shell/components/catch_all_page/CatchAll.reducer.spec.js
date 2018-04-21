import { static as Immutable } from 'seamless-immutable'
import errorPage, { initialState } from './CatchAll.reducer.js'
import {
  setErrorPage,
  unsetErrorPage
} from './CatchAll.actions'
import { TYPE_404 } from './CatchAll.pages'

describe('Catch All errorPage reducer', () => {
  it('should handle SET_ERROR_PAGE action type', () => {
    const newState = errorPage(
      initialState,
      setErrorPage({ errorType: TYPE_404, data: { stuff: 'here' } })
    )
    expect(newState).toEqual(Immutable({
      errorType: TYPE_404,
      data: { stuff: 'here' }
    }))
  })

  it('should handle UNSET_ERROR_PAGE action type', () => {
    const newState = errorPage(
      Immutable({
        errorType: TYPE_404,
        data: { stuff: 'here' }
      }),
      unsetErrorPage()
    )
    expect(newState).toEqual(initialState)
  })

  it('should return state as-is for other action types', () => {
    const newState = errorPage(initialState, { type: 'SOME_ACTION' })
    expect(newState).toEqual(initialState)
  })
})
