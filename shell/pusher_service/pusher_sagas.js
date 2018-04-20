import { set, get } from 'lodash'
import { select, put, call, takeEvery } from 'redux-saga/effects'
import Raven from 'raven-js'
import { poApi } from 'api'
import { curBrandSelector, curChannelSelector } from 'selectors/platform_selectors'
import newNotificationFormatter from './new_notification_event_formatter'
import { storePushData } from './pusher_actions'
import {
  PUSHER_NOTIFICATION_RECEIVED,
  EVENT_NEW_NOTIFICATION
} from './constants'

/**
 * Fetches cached data by cache key
 * @param structuredData the formatted pusher data.
 * @param apiCall the axios config object
 * @param pointer an array representing the path to put the cached data
 *        on the data object before storing. @see lodash.set
 */
export const getCachedData = function * getCachedData ({ structuredData, apiCall, pointer, fid }) {
  try {
    const response = yield call(() => (poApi(apiCall)))
    const data = get(response, 'data', {})
    const pushData = set(structuredData, [...pointer, 'data'], data)
    yield put(storePushData(pushData, fid))
  } catch (error) {
    Raven.captureException(error, { logger: 'pusher_saga#getCachedData' })
  }
}

export const applyAuthParams = function * applyAuthParams () {
  const brandId = yield select(curBrandSelector)
  const channel = yield select(curChannelSelector)

  // Snapchat authParams
  if (brandId && channel === 'snapchat') {
    return `,organization_id=${brandId}`
  }

  return null
}

export const pusherReceived = function * pusherReceived ({ pusherData, eventKey }) {
  // This event is used for 90% of pusher on HYFN8
  if (eventKey === EVENT_NEW_NOTIFICATION) {
    const formatted = newNotificationFormatter(pusherData)
    if (formatted.apiCall) {
      const authParams = yield call(applyAuthParams)
      const config = set(formatted, 'apiCall.authParams', authParams)
      yield call(getCachedData, config)
      return
    }

    const { structuredData, fid } = formatted
    yield put(storePushData(structuredData, fid))
  }
  // handle other pusher event types here
}

export function * pusherWorker () {
  yield takeEvery(PUSHER_NOTIFICATION_RECEIVED, pusherReceived)
}
