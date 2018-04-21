import { createSelector } from 'reselect'
import { get } from 'lodash'

export const errorPageTypeSelector = state => get(state, 'errorPage.errorType')
export const errorPageDataSelector = state => get(state, 'errorPage.data')

export const getErrorPageType = createSelector(errorPageTypeSelector, pageType => pageType)
export const getErrorPageData = createSelector(errorPageDataSelector, pageData => pageData)
