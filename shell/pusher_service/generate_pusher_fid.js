/**
 * This is redux middleware.
 */
import { get } from 'lodash'
import { createFid, isRegisteredPusherAction } from './pusher_fids_cache'
import { fetchRoutine } from 'fetch_routine'

export const findPusherAction = action => (
  get(action, 'payload.notifiableParams.action') || get(action, 'payload.pusherAction') || undefined
)

const generatePusherFid = store => next => action => {
  const { type, payload = {} } = action
  const pusherAction = findPusherAction(action)

  if (type !== fetchRoutine.TRIGGER || !isRegisteredPusherAction(pusherAction)) return next(action)

  const notifiableParams = get(payload, 'notifiableParams')
  const nextAction = (type === fetchRoutine.TRIGGER)
    ? {
      ...action,
      payload: {
        ...payload,
        notifiableParams: {
          ...notifiableParams, // order matters! we want to override fid here
          fid: createFid({ pusherAction })
        }
      }
    }
    : action
  next(nextAction)
}

export default generatePusherFid
