import formatPayload from './payload_formatter'
import {
  SET_CURRENT_USER,
  SET_CURRENT_USER_INITIAL
} from './constants.js'

export const setCurrentUser = (user, override = true) => {
  const type = override ? SET_CURRENT_USER : SET_CURRENT_USER_INITIAL
  return ({
    type,
    payload: formatPayload({
      data: user,
      loading: false
    })
  })
}

export default 'yurmom'
