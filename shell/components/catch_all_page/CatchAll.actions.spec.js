import {
  SET_ERROR_PAGE,
  UNSET_ERROR_PAGE,
  setErrorPage,
  unsetErrorPage
} from './CatchAll.actions'

describe('Catch All Action Creators', () => {
  it('setErrorPage should have SET_ERROR_PAGE type', () => {
    expect(setErrorPage().type).toEqual(SET_ERROR_PAGE)
  })

  it('unsetErrorPage should have UNSET_ERROR_PAGE type', () => {
    expect(unsetErrorPage().type).toEqual(UNSET_ERROR_PAGE)
  })
})
