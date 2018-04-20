import { set, mapKeys, camelCase, has, get } from 'lodash'

/**
 * Gets the correct url to retrieve cached data.
 */
export const cachedDataURL = (cacheKey = null, channel) => {
  const selectedChannel = channel || 'facebook'
  const base = {
    facebook: `${process.env.FB_API_HOST}/api/v2/notifications/`,
    snapchat: `${process.env.SC_API_HOST}/api/v1/notification_data/`,
    pinterest: `${process.env.PT_API_HOST}/api/v2/pt_ads/notifications/`,
    twitter: `${process.env.TW_API_HOST}/api/v2/tw_ads/notifications/`
  }
  return `${base[selectedChannel.toLowerCase()]}${cacheKey}`
}

/**
 * @return Array of transformers, only one currently but he api transformResponse
 * takes an array.
 */
function getTransformer (serviceProvider = 'facebook') {
  if (!serviceProvider) return [resp => get(resp, 'response', resp)]

  const base = {
    facebook: resp => (get(resp, 'response')),
    snapchat: resp => (resp),
    pinterest: resp => (get(resp, 'response')),
    twitter: resp => (get(resp, 'response'))
  }
  return [base[serviceProvider.toLowerCase()]]
}

/**
 * builds the axios config for the api call to get cached data.
 * @param cacheKey the cache_key form the pusher payload.
 * @param serviceProvider the channel of the api host to call.
 * @return Axios config object.
 */
const apiCall = (cacheKey, serviceProvider) => ({
  method: 'GET',
  url: cachedDataURL(cacheKey, serviceProvider),
  transformResponse: getTransformer(serviceProvider)
})

// helper for numeric keys
function safeKey (key) {
  if (isNaN(key)) return camelCase(key)
  return `_${camelCase(key)}`
}

/**
 * TODO: Hacky!? if service provider is not in pusher notification
 * derive it from action. We should update the backend
 * notifications to be consistant. Otherwise cached data cannot be fetched
 * because it needs to know which service to call.
 *
 * Needed for snapchat only for now.
 */
export const deriveServiceProviderFromAction = (action) => {
  if (!action) return undefined

  if (action.match(/^sc_/)) return 'snapchat'
  if (action.match(/^pt_/)) return 'pinterest'
  if (action.match(/^tw_/)) return 'twitter'
  if (action.match(/^fb_/)) return 'facebook'

  return undefined
}

/**
 * Formats pusher data from 'new_notification' events
 * before putting them in the store.
 *
 * Data Structure:
 *
 * serviceProvider: {    // the channel eg. snapchat.
 *   name: {             // a name that comes from the pusher notification.
 *     action: {         // main way notifications are identified.
 *       property: {     // brand, campaign, adset, ad... (optional)
 *         propertyId: { // the id of the thing above. (optional)
 *           data: {}    // the meat and potatoes.
 *         }
 *       }
 *     }
 *   }
 * }
 */
const newNotificationFormatter = ({ params = {}, payload = {}, section = {} }) => {
  const formatter = {}
  const pointer = []
  const path = [
    'serviceProvider',
    'name',
    'action',
    'type',
    'id'
  ]

  const { name, action, property } = section
  const flatData = mapKeys({
    name,
    action,
    ...property,
    ...payload,
    ...params
  }, (value, key) => (camelCase(key)))

  path.forEach((p) => {
    if (has(flatData, p)) {
      set(formatter, pointer, safeKey(flatData[p]))
      pointer.push(safeKey(flatData[p]))
    }
  })

  const fid = get(params, 'fid')

  const { cacheKey = null } = flatData
  let { data = null, errors = null } = flatData

  const serviceProvider = get(flatData, 'serviceProvider') ||
    deriveServiceProviderFromAction(get(flatData, 'action'))

  // Set data to notification payload if we do not have to make an extra cache fetch
  // AND if data did not come in on a `data` key.
  if (cacheKey === null && data === null) data = mapKeys(payload, (value, key) => camelCase(key))

  const structuredData = set(
    formatter,
    pointer,
    { cacheKey, fid, serviceProvider, data, errors }
  )

  return {
    structuredData,
    apiCall: cacheKey ? apiCall(cacheKey, serviceProvider) : null,
    pointer,
    fid
  }
}

export default newNotificationFormatter
