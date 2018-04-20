import { OPEN_BRAND_SWITCHER, CLOSE_BRAND_SWITCHER } from './brand_switcher_actions.js'

export const brandSwitcher = (state = { isOpen: false }, action) => {
  switch (action.type) {
    case OPEN_BRAND_SWITCHER: return { isOpen: true }
    case CLOSE_BRAND_SWITCHER: return { isOpen: false }
    default: return state
  }
}

export default brandSwitcher
