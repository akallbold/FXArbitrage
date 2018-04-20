// not using `Date.now()` for a shorter id and so 2 windows instantiating this code in the same millisecond dont have duplicate ids
export const PUSHER_WINDOW_SESSION_ID = process.env.NODE_ENV !== 'test' ? Math.random().toString(36).substr(2, 9) : '420'
if (window && window.location.search.includes('showmewindowid')) console.log('PUSHER_WINDOW_SESSION_ID: ', PUSHER_WINDOW_SESSION_ID)
const registeredPusherActions = new Set()
const fids = new Map()

export const registerPusherAction = pusherAction => registeredPusherActions.add(pusherAction)
export const isRegisteredPusherAction = pusherAction => registeredPusherActions.has(pusherAction)

export const createFid = ({ pusherAction, prefix = '' }) => {
  if (!pusherAction) {
    return process.env.NODE_ENV === 'development'
      ? console.error(new Error('pusher_fids :: createFid :: pusherAction is required to create a unique fid.'))
      : undefined
  }

  const nextFid = `${prefix ? `${prefix}.` : ''}${process.env.NODE_ENV !== 'test' ? Date.now() : 'uid-here'}.${PUSHER_WINDOW_SESSION_ID}`
  fids.set(pusherAction, nextFid)
  return nextFid
}

export const getFid = pusherAction => fids.get(pusherAction)

export const removeFid = pusherAction => fids.delete(pusherAction)

export const isLatestFid = ({ pusherAction, fid }) => (
  fids.has(pusherAction) && fids.get(pusherAction) === fid
)

export const clearFids = () => fids.clear()
