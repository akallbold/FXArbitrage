import { takeEvery, put, select } from 'redux-saga/effects'
import { merge, mergeWith, pickBy } from 'lodash'
import { push } from 'redux-little-router'
import { PUSH_PERSIST } from './push_persist_actions'

export const mergeForPush = (next, prev) => (
  mergeWith({}, next, prev, (objValue, srcValue, key) => {
    if (key === 'query' && objValue && srcValue) {
      return pickBy(merge(srcValue, objValue))
    } else if (key === 'query' && (srcValue === null || objValue === null)) {
      return null
    }
    return objValue || srcValue
  })
)

export const pushPersist = function * pushPersist (action) {
  const { payload } = action
  const { pathname, query } = yield select(state => state.router)
  const nextRouterState = mergeForPush(payload, { pathname, query })
  yield put(push(nextRouterState))
}

export default function * pushPersistWatcher () {
  yield takeEvery(PUSH_PERSIST, pushPersist)
}
