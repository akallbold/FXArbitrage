import { currentUserSelector } from 'selectors/user_selectors'
import { get } from 'lodash'
import { call, all, select } from 'redux-saga/effects'
import { delay } from 'redux-saga'

export function * waitForPusher (callType) {
  // Skip check if callType doesn't match.
  const pattern = /^fb\./
  if (!pattern.test(callType)) return

  const pusherConnected = yield select(state => get(state, 'pusherData.connected'))
  if (!pusherConnected) {
    yield delay(200, true)
    yield call(waitForPusher, callType)
  }
}

export function * waitForUser (callType = '') {
  // Skip check if callType doesn't match.
  const pattern = /^fb\./
  if (!pattern.test(callType)) return

  const user = yield select(currentUserSelector)
  if (!user) {
    yield delay(500, true)
    yield call(waitForUser, callType)
  }
}

export default (callType) => {
  return function * () {
    yield all([
      call(waitForPusher, callType),
      call(waitForUser, callType)
    ])
  }
}
