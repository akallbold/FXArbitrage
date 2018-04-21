import UrlPattern from 'url-pattern'
import { get, some } from 'lodash'
import routes from 'routes'
import {
  setErrorPage,
  unsetErrorPage,
  TYPE_404,
  getErrorPageType
} from 'components/catch_all_page'

/**
 * Takes a route and produces a url pattern object.
 * @param  {String} route A string for the route pattern, this should come from the configured rlr
 *                        routes object.
 * @return {Object}       A UrlPattern object from the `url-pattern` package.
 */
export const makePattern = (route) => {
  const pattern = new UrlPattern(route)
  pattern.route = route
  return pattern
}

/**
 * Factory for the iterator that recursively runs through nested routes and creates a flattened
 * reverse order list url pattern objects.
 * @param  {String} prepend     A string to prepend to the router key. When calling this function
 *                              manually this should almost always be an empty string.
 * @return {Function}           A function to be used as reduce iterator.
 */
export const patternIterator = (prepend = '') => (patternsList, [prop, value]) => {
  let list = patternsList
  if (typeof value === 'object') {
    // eslint-disable-next-line no-use-before-define
    list = [...makePatterns(`${prepend}${prop}`, value, patternsList)]
  }
  return [
    ...list,
    ...(prop.length > 1 && prop.charAt(0) === '/' ? [makePattern(`${prepend}${prop}`)] : [])
  ]
}

/**
 * Starts the recursive process of creating the flattened list of url patterns.
 * @param  {String} prepend     A string to prepend to the router key. When calling this function
 *                              manually this should almost always be an empty string.
 * @param  {Object} routesObj   The configured routes for redux-little-router
 * @param  {Array}  start       Starting value for the reduce.
 * @return {Array/Collection}   A list of url pattern objects, flattened route nesting.
 */
export const makePatterns = (prepend = '', routesObj, start) => (
  Object.entries(routesObj).reduce(patternIterator(prepend), start)
)

/**
 * Uses url-pattern's match method to check current pathname against all routes.
 * @param  {Array/Collection} patterns  A collection of url patterns to check.
 * @param  {String}           pathname  The pathname to check against url patterns.
 * @return {Boolean}                    true if matched, else false
 */
export const hasMatch = (patterns, pathname) => {
  const queryIndex = pathname.indexOf('?')
  const trimmedPathname = queryIndex > 0 ? pathname.substring(0, queryIndex) : pathname
  return trimmedPathname === '/'
    ? true
    : some(patterns, pattern => pattern.match(trimmedPathname))
}

export const patterns = makePatterns('', routes, [])
// leaving this log on purpose. Useful for debugging.
// console.log('patterns: ', patterns.map(pattern => pattern.route))

/**
 * Redux middleware for when the url doesnt match any routes should dispatch an action to display
 * the 404 page instead of allowing the router changed action through. Should also dispatch an
 * action to unset the error page if the url does match a route.
 */
const catchall = store => next => (action) => {
  const { type, payload } = action
  if (type === 'ROUTER_LOCATION_CHANGED') {
    const matched = hasMatch(patterns, get(payload, 'pathname'))
    // if no match dispatch 404 page action and return
    if (!matched) return next(setErrorPage({ errorType: TYPE_404 }))
    // if error page is set and url was matched above, unset the error page
    const errorType = getErrorPageType(store.getState())
    if (errorType) next(unsetErrorPage())
    // let the url change request through and return
    return next(action)
  }

  return next(action)
}

export default catchall
