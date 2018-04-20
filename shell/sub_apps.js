/**
 * Load the sub app modules from window and export them
 * if they are set. This prevents errors when one app is unavailable.
 */
import * as snapChatFrontEndApp from 'h8-snapchat'
import * as twitterFrontEndApp from 'h8-twitter'
import * as facebookFrontEndApp from 'h8-facebook'
import * as pinterestFrontEndApp from 'h8-pinterest'

const subAppRootMap = {}
const subAppReducerMap = {}
const subAppRoutesMap = {}
const subAppSagasMap = {}
const subAppApiConfigsMap = {}

/** Snap Chat frontend **/
if (snapChatFrontEndApp) {
  subAppRootMap.SnapChat = snapChatFrontEndApp.SnapChatRoot
  subAppReducerMap.snapChat = snapChatFrontEndApp.SnapChatRootReducer
  subAppRoutesMap.snapChat = snapChatFrontEndApp.SnapChatRoutes
  subAppSagasMap.snapChat = snapChatFrontEndApp.SnapChatSagas
  subAppApiConfigsMap.sc = snapChatFrontEndApp.SnapChatApiConfigs
}

if (twitterFrontEndApp) {
  subAppRootMap.Twitter = twitterFrontEndApp.TwitterRoot
  subAppReducerMap.twitter = twitterFrontEndApp.TwitterRootReducer
  subAppRoutesMap.twitter = twitterFrontEndApp.TwitterRoutes
  subAppSagasMap.twitter = twitterFrontEndApp.TwitterSagas
  subAppApiConfigsMap.tw = twitterFrontEndApp.TwitterApiConfigs
}

if (facebookFrontEndApp) {
  subAppRootMap.Facebook = facebookFrontEndApp.FacebookRoot
  subAppReducerMap.facebook = facebookFrontEndApp.FacebookRootReducer
  subAppRoutesMap.facebook = facebookFrontEndApp.FacebookRoutes
  subAppSagasMap.facebook = facebookFrontEndApp.FacebookSagas
  subAppApiConfigsMap.fb = facebookFrontEndApp.FacebookApiConfigs
}

if (pinterestFrontEndApp) {
  subAppRootMap.Pinterest = pinterestFrontEndApp.PinterestRoot
  subAppReducerMap.pinterest = pinterestFrontEndApp.PinterestRootReducer
  subAppRoutesMap.pinterest = pinterestFrontEndApp.PinterestRoutes
  subAppSagasMap.pinterest = pinterestFrontEndApp.PinterestSagas
  subAppApiConfigsMap.pt = pinterestFrontEndApp.PinterestApiConfigs
}

export const subAppRoots = subAppRootMap
export const subAppReducers = subAppReducerMap
export const subAppRoutes = subAppRoutesMap
export const subAppSagas = subAppSagasMap
export const subAppApiConfigs = subAppApiConfigsMap
