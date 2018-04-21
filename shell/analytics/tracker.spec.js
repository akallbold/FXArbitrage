import trackerSingleton, {
  initTracker,
  EVENT_CATEGORIES as EVENT_CATEGORIES_FROM_MODULE
} from './' // the index file for analytics
import {
  EVENT_CATEGORIES,
  tracker
} from './tracker'

describe('tracker module API', () => {
  it('should be able to initialize tracker and updates tracker single default export', () => {
    const trackerApi = jest.fn()
    initTracker({ trackerApi })
    expect(trackerSingleton).toEqual({
      trackPage: expect.any(Function),
      trackEvent: expect.any(Function),
      trackException: expect.any(Function)
    })
  })

  it('should have `EVENT_CATEGORIES` constant exported', () => {
    expect(EVENT_CATEGORIES_FROM_MODULE).toEqual(EVENT_CATEGORIES)
  })
})

describe('tracker', () => {
  it('should throw when no `trackerApi` is given', () => {
    expect(() => tracker()).toThrow()
  })

  it('should return an api with expected methods', () => {
    const trackerApi = jest.fn()
    expect(tracker({ trackerApi })).toEqual({
      trackPage: expect.any(Function),
      trackEvent: expect.any(Function),
      trackException: expect.any(Function)
    })
  })

  // trackPage , trackEvent, trackException
  it('should trackPage and use tracker target', () => {
    const trackerApi = jest.fn()
    const { trackPage } = tracker({ target: 'pickleRick', trackerApi })
    trackPage({ url: '/some/cool-thing' })
    expect(trackerApi).toHaveBeenCalledTimes(2)
    expect(trackerApi).toHaveBeenCalledWith('pickleRick.set', 'page', '/some/cool-thing')
    expect(trackerApi).toHaveBeenCalledWith('pickleRick.send', 'pageview')
  })

  it('should trackEvent', () => {
    const trackerApi = jest.fn()
    const { trackEvent } = tracker({ trackerApi })
    trackEvent({
      eventCategory: 'Navigation',
      eventAction: 'click',
      eventLabel: 'About Us',
      eventValue: 42
    })
    expect(trackerApi).toHaveBeenCalledTimes(1)
    expect(trackerApi).toHaveBeenCalledWith('send', {
      hitType: 'event',
      eventCategory: 'Navigation',
      eventAction: 'click',
      eventLabel: 'About Us',
      eventValue: 42
    })
  })

  it('should trackException', () => {
    const trackerApi = jest.fn()
    const { trackException } = tracker({ trackerApi })
    trackException({
      message: 'An error happened!',
      isFatal: true
    })
    expect(trackerApi).toHaveBeenCalledTimes(1)
    expect(trackerApi).toHaveBeenCalledWith('send', {
      hitType: 'exception',
      exDescription: 'An error happened!',
      exFatal: true
    })
  })
})
