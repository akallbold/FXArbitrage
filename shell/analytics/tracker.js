/**
 * Field Reference: https://developers.google.com/analytics/devguides/collection/analyticsjs/field-reference
 */
export const trackNothingFactory = (thing, logger) => (...args) => {
  if (!logger) return
  console.log('\n----- tracking -----')
  console.log(`${thing}: `, args)
}

export const trackPageFactory = (target, trackerApi) => ({ url }) => {
  trackerApi(`${target}set`, 'page', url)
  trackerApi(`${target}send`, 'pageview')
}

export const LINK_INBOUND = 'Inbound Link'
export const LINK_OUTBOUND = 'Outbound Link'
export const EVENT_CATEGORIES = {
  LINK_INBOUND,
  LINK_OUTBOUND
}

export const trackEventFactory = (target, trackerApi) => ({ eventCategory, eventAction = 'click', eventLabel = 'no label', eventValue }) => {
  const fieldsObj = {
    eventCategory,
    eventAction,
    eventLabel
  }
  if (eventValue) fieldsObj.eventValue = eventValue
  trackerApi(`${target}send`, {
    hitType: 'event',
    ...fieldsObj
  })
}

export const trackExceptionFactory = (target, trackerApi) => ({ message, isFatal = false }) => (
  trackerApi(`${target}send`, {
    hitType: 'exception',
    exDescription: message,
    exFatal: isFatal
  })
)

export const tracker = ({ target, trackerApi }) => {
  if (typeof trackerApi !== 'function') throw new TypeError('`trackerApi` must be a function.')
  const targetDot = target ? `${target}.` : ''

  return {
    trackPage: trackPageFactory(targetDot, trackerApi),
    trackEvent: trackEventFactory(targetDot, trackerApi),
    trackException: trackExceptionFactory(targetDot, trackerApi)
  }
}

// creates a version of the tracker that simply logs the arguments and the tracking method for development.
export const trackerNothing = ({ trackerApi, options = {} }) => {
  const { logger } = options

  return {
    trackPage: trackNothingFactory('trackPage', logger),
    trackEvent: trackNothingFactory('trackEvent', logger),
    trackException: trackNothingFactory('trackException', logger)
  }
}

export const create = ({
  target,
  trackerApi,
  options = {}
}) => (
  options.enabled
    ? tracker({ target, trackerApi })
    : trackerNothing({ trackerApi: 'The Google', options })
)
