import formatPayload from './payload_formatter'

import {
  SET_ACTIVE_PLATFORMS,
  SET_CURRENT_PLATFORM,
  SET_CURRENT_PLATFORM_INITIAL
} from './constants.js'

export const setActivePlatforms = activeChannels => ({
  type: SET_ACTIVE_PLATFORMS,
  payload: formatPayload({ data: activeChannels, loading: false })
})

export const setCurrentPlatform = channel => ({
  type: SET_CURRENT_PLATFORM,
  payload: formatPayload({ data: channel })
})

export const setCurrentPlatformInitial = channel => ({
  type: SET_CURRENT_PLATFORM_INITIAL,
  payload: formatPayload({ data: channel })
})
