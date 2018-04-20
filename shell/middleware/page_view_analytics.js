import tracker from 'analytics'
import { getCurPathname } from 'selectors/platform_selectors'

/**
 * IT'S IMPORTANT that the redirect middleware come before this middleware!
 */
const pageViewAnalytics = store => next => (action) => {
  const { type } = action
  if (type === 'ROUTER_LOCATION_CHANGED') {
    const state = store.getState()
    const curPathname = getCurPathname(state)
    const payload = action.payload || {}
    const { pathname, search } = payload
    if (pathname !== curPathname) tracker.trackPage({ url: `${pathname}${search}` })
  }
  // pass along the original action so all the things can happen
  next(action)
}

export default pageViewAnalytics
