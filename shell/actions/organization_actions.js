import formatPayload from './payload_formatter'
import {
  SET_CURRENT_ORGANIZATION,
  SET_CURRENT_ORGANIZATION_INITIAL
} from './constants.js'

export const setCurrentBrand = (brand, override = true) => {
  const type = override ? SET_CURRENT_ORGANIZATION : SET_CURRENT_ORGANIZATION_INITIAL
  return ({
    type,
    payload: formatPayload({
      data: brand,
      loading: false
    })
  })
}

export default 'yurmom'
