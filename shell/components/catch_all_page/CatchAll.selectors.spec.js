import { static as Immutable } from 'seamless-immutable'
import {
  errorPageTypeSelector,
  errorPageDataSelector,
  getErrorPageType,
  getErrorPageData
} from './CatchAll.selectors'

const state = Immutable({
  errorPage: {
    errorType: 'Page404',
    data: { stuff: 'here' }
  }
})

describe('Catch All Selectors', () => {
  it('errorPageTypeSelector should return errorType', () => {
    expect(errorPageTypeSelector(state)).toEqual('Page404')
  })

  it('errorPageDataSelector should return data', () => {
    expect(errorPageDataSelector(state)).toEqual({ stuff: 'here' })
  })

  it('getErrorPageType should return data', () => {
    expect(getErrorPageType(state)).toEqual('Page404')
  })

  it('getErrorPageData should return data', () => {
    expect(getErrorPageData(state)).toEqual({ stuff: 'here' })
  })
})
