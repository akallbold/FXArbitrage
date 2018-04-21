import { closeBrandSwitcher } from 'components/brand_switcher/brand_switcher_actions.js'

const closeMenus = (/* store */) => next => (action) => {
  const { type } = action
  if (type === 'ROUTER_LOCATION_CHANGED') {
    // import and use any needed action creators as seen below to dispatch actions for
    // closing menus on route change
    next(closeBrandSwitcher())
  }
  // pass along the original action so all the things can happen
  next(action)
}

export default closeMenus
