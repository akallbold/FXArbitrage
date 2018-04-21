import { put, call, takeEvery } from 'redux-saga/effects'

import { EVENT_NEW_NOTIFICATION, PUSHER_NOTIFICATION_RECEIVED } from './constants'
import * as sagas from './pusher_sagas'
import * as actions from './pusher_actions'
import newNotificationFormatter from './new_notification_event_formatter'

const poApi = () => {}
const apiCall = () => {}

const pusherData = {
  section: {
    name: 'campaign_manager_etc',
    action: 'destroy_current_users_planet',
    property: { type: 'Brand', id: '1' }
  },
  payload: { service_provider: 'Snapchat' },
  params: { fid: 'abc123' }
}

const pusherDataWithCacheKey = {
  ...pusherData,
  payload: {
    ...pusherData.payload,
    cache_key: '1dxklmjfkljdsa'
  }
}

describe('pusherReceived', () => {
  describe('without cacheKey', () => {
    const formatted = newNotificationFormatter(pusherData)
    const { structuredData, fid } = formatted

    it('handles new_notification events', () => {
      const action = actions.pusherNewNotificationReceived(pusherData, EVENT_NEW_NOTIFICATION)
      const generator = sagas.pusherReceived(action)
      const expectedValue1 = put(actions.storePushData(structuredData, fid))
      expect(generator.next().value).toEqual(expectedValue1)
      expect(generator.next().value).toEqual(undefined)
    })
  })

  describe('with cacheKey', () => {
    const formatted = newNotificationFormatter(pusherDataWithCacheKey)

    it('handles new_notification events', () => {
      const action = actions.pusherNewNotificationReceived(pusherDataWithCacheKey, EVENT_NEW_NOTIFICATION)
      const pusherReceivedGen = sagas.pusherReceived(action)

      const authParamsCall = pusherReceivedGen.next(sagas.applyAuthParams)
      const expectedAuthParamsCall = call(sagas.applyAuthParams)

      const getCachedDataCall = pusherReceivedGen.next(null)
      const expectedGetCachedDataCall = call(sagas.getCachedData, {
        ...formatted,
        apiCall: {
          ...formatted.apiCall,
          authParams: null
        }
      })

      expect(authParamsCall.value).toEqual(expectedAuthParamsCall)
      expect(JSON.stringify(getCachedDataCall.value)).toEqual(JSON.stringify(expectedGetCachedDataCall))
    })

    it('is noop without eventKey', () => {
      const action = actions.pusherNewNotificationReceived(pusherData, null)
      const generator = sagas.pusherReceived(action)

      expect(generator.next().value).toEqual(undefined)
    })
  })
})

describe('getCachedData', function () {
  it('makes an api call to fetch the data', () => {
    const formatted = newNotificationFormatter(pusherDataWithCacheKey)
    const generator = sagas.getCachedData(formatted)
    const expectedValue1 = call(() => (poApi(formatted.apiCall)))
    const expectedValue2 = put(actions.storePushData(formatted.structuredData, formatted.fid))

    expect(JSON.stringify(generator.next().value)).toEqual(JSON.stringify(expectedValue1))
    expect(JSON.stringify(generator.next().value)).toBe(JSON.stringify(expectedValue2))
  })
})

describe('pusherWorker', () => {
  it('takes every pusher notification receieved action', () => {
    const generator = sagas.pusherWorker(call(() => (poApi(apiCall))))
    const expectedValue = takeEvery(PUSHER_NOTIFICATION_RECEIVED, sagas.pusherReceived)

    // Order of yields matters in tests.
    expect(generator.next().value).toEqual(expectedValue)
  })
})
