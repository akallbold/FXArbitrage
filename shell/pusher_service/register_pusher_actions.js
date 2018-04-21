/**
 * This file is a temporary solution to register lists of pusher actions that we want to generate
 * dynamic FIDs for. Ultimatly these would be manage by each sub-app individually. There are
 * various ways to do that but for now, this is the fastest approach.
 *
 * This is part of the fix for this ticket:
 * https://hyfnla.atlassian.net/browse/HR-1271
 *
 * Dynamic unique fids are used to ensure 2 things:
 * 1. We do not respond to pusher notifications from other windows or users.
 * 2. We only display results for the last request that went out, not the last request that
 * comes in from pusher.
 */

import { registerPusherAction } from './pusher_fids_cache'

export const TWITTER_PUSHER_ACTIONS = [ 'getCampaignsMetrics', 'getAdsetsMetrics', 'getAdsMetrics' ]
export const FACEBOOK_PUSHER_ACTIONS = [ 'getCampaignsMetrics', 'getAdsetsMetrics', 'getAdsMetrics' ]
export const SNAPCHAT_PUSHER_ACTIONS = [ 'getCampaignsMetrics', 'getAdsetsMetrics', 'getAdsMetrics' ]
export const PINTEREST_PUSHER_ACTIONS = [ 'getCampaignsMetrics', 'getAdsetsMetrics', 'getAdsMetrics' ]

const PUSHER_ACTIONS_WHITELIST = { TWITTER_PUSHER_ACTIONS, FACEBOOK_PUSHER_ACTIONS, SNAPCHAT_PUSHER_ACTIONS, PINTEREST_PUSHER_ACTIONS }

Object.keys(PUSHER_ACTIONS_WHITELIST).forEach(listKey => PUSHER_ACTIONS_WHITELIST[listKey].forEach(pusherAction => registerPusherAction(pusherAction)))
