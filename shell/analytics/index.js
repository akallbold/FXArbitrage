import {
  EVENT_CATEGORIES as _EVENT_CATEGORIES,
  create as _create
} from './tracker'

export const EVENT_CATEGORIES = _EVENT_CATEGORIES
export const create = _create

export const initTracker = ({
  target,
  trackerApi,
  title,
  options
}) => {
  const tracker = create({
    target,
    trackerApi,
    title,
    options
  })

  trackerSingleton.trackPage = tracker.trackPage
  trackerSingleton.trackEvent = tracker.trackEvent
  trackerSingleton.trackException = tracker.trackException
}

const trackerSingleton = {}
export default trackerSingleton
