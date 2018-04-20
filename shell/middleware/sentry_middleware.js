import { get } from 'lodash'
import Raven from 'raven-js'
import { ACL_GET_USER } from 'api/configs/acl'

const sentry = (/* store */) => next => (action) => {
  const { type } = action
  const callType = get(action, 'payload.callType')
  if (type === 'FETCH_SUCCESS' && callType === ACL_GET_USER) {
    const user = get(action, 'payload.data')
    if (user) Raven.setUserContext({ email: user.email, id: user.id })
  }
  next(action)
}

export default sentry
