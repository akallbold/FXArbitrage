import { PUSHER_DATA_RECEIVED, CLEAR_PUSHER_DATA, PUSHER_CONNECTION_ESTABLISHED } from './constants'
import pusherReducer from './pusher_reducer'

describe('pusher reducer', () => {
  describe('PUSHER_DATA_RECEIVED', () => {
    const initial = {}

    it('should handle PUSHER_DATA_RECEIVED', () => {
      const payload = { a: 'b' }
      expect(
        pusherReducer(
          initial, { type: PUSHER_DATA_RECEIVED, payload: payload }
        )
      ).toEqual({ a: 'b' })
    })
  })

  describe('CLEAR_PUSHER_DATA', () => {
    const initial = {
      manageController: {
        backfillSync: {
          campaign: {
            _3: {
              data: 'some_data'
            }
          }
        }
      }
    }

    it('should handle CLEAR_PUSHER_DATA', () => {
      const path = 'manageController.backfillSync'
      expect(
        pusherReducer(
          initial, { type: CLEAR_PUSHER_DATA, payload: path }
        )
      ).toEqual({
        manageController: {
          backfillSync: null
        }
      })
    })
  })

  describe('PUSHER_CONNECTION_ESTABLISHED', () => {
    it('is connected false by default', () => {
      const state = pusherReducer(undefined, {})
      expect(state.connected).toBe(false)
    })

    it('is connected true after action', () => {
      const state = pusherReducer(undefined, { type: PUSHER_CONNECTION_ESTABLISHED })
      expect(state.connected).toBe(true)
    })
  })
})
