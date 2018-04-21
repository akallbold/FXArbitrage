import { PUSHER_NOTIFICATION_RECEIVED, PUSHER_DATA_RECEIVED } from './constants'

// handles event new_notification
export const pusherNewNotificationReceived = (pusherData, eventKey) => ({
  type: PUSHER_NOTIFICATION_RECEIVED,
  pusherData,
  eventKey
})

export const storePushData = (payload, fid) => ({
  type: PUSHER_DATA_RECEIVED,
  payload,
  fid
})
